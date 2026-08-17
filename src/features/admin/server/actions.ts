"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { createBookingEventWithMeet } from "@/lib/google/calendar";
import {
  notifyBookingConfirmed,
  notifyPaymentRejected,
  notifyExpertInvite,
  notifyNominationStatusChanged,
} from "@/features/notifications/server/send";
import { uploadExpertPhoto } from "@/features/experts/server/photo";
import { uploadNgoLogo } from "@/features/ngo/server/logo";
import { uploadFeaturedLogo } from "@/features/marketing/server/logo";
import { TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from "@/lib/timezones";
import { parseLines } from "@/lib/text";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    throw new Error("Not authorized");
  }
  return user;
}

async function logAdminAction(
  admin: ReturnType<typeof createAdminClient>,
  {
    adminId,
    action,
    targetTable,
    targetId,
    details,
  }: {
    adminId: string;
    action: string;
    targetTable: string;
    targetId?: string | null;
    details?: Record<string, unknown>;
  },
) {
  await admin.from("admin_audit_log").insert({
    admin_id: adminId,
    action,
    target_table: targetTable,
    target_id: targetId ?? null,
    details: details ? JSON.parse(JSON.stringify(details)) : null,
  });
}

async function setExpertStatus(formData: FormData, status: "approved" | "rejected" | "suspended") {
  const adminUser = await requireAdmin();
  const expertId = String(formData.get("expert_id") ?? "");
  if (!expertId) throw new Error("Missing expert_id");

  const admin = createAdminClient();
  const { error } = await admin.from("experts").update({ status }).eq("id", expertId);
  if (error) throw error;

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: `expert_status_${status}`,
    targetTable: "experts",
    targetId: expertId,
  });

  revalidatePath("/admin/experts");
}

export async function approveExpert(formData: FormData) {
  await setExpertStatus(formData, "approved");
}

export async function rejectExpert(formData: FormData) {
  await setExpertStatus(formData, "rejected");
}

export async function suspendExpert(formData: FormData) {
  await setExpertStatus(formData, "suspended");
}

export async function approveExpertsBulk(formData: FormData) {
  const adminUser = await requireAdmin();
  const expertIds = formData.getAll("expert_ids").map(String).filter(Boolean);
  if (expertIds.length === 0) return;

  const admin = createAdminClient();
  const { error } = await admin.from("experts").update({ status: "approved" }).in("id", expertIds);
  if (error) throw error;

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "expert_status_approved_bulk",
    targetTable: "experts",
    details: { expert_ids: expertIds },
  });

  revalidatePath("/admin/experts");
}

export type UpdateExpertState = { error?: string };

export async function updateExpertAsAdmin(
  _prevState: UpdateExpertState,
  formData: FormData,
): Promise<UpdateExpertState> {
  await requireAdmin();
  const expertId = String(formData.get("expert_id") ?? "");
  if (!expertId) throw new Error("Missing expert_id");

  const headline = String(formData.get("headline") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const categoryIds = formData.getAll("category_ids").map(String).filter(Boolean);
  if (categoryIds.length === 0) {
    return { error: "Select at least one category." };
  }
  const pricePer15Min = Number(formData.get("price_per_15_min"));
  const payoutAccountName = String(formData.get("payout_account_name") ?? "").trim() || null;
  const payoutAccountNumber = String(formData.get("payout_account_number") ?? "").trim() || null;
  const timezoneInput = String(formData.get("timezone") ?? "");
  const timezone = TIMEZONE_OPTIONS.some((t) => t.value === timezoneInput)
    ? timezoneInput
    : DEFAULT_TIMEZONE;
  const expectations = parseLines(String(formData.get("expectations") ?? ""), 6);
  const exampleQuestions = parseLines(String(formData.get("example_questions") ?? ""), 6);

  const admin = createAdminClient();

  const update: {
    headline: string;
    bio: string;
    price_per_15_min: number | null;
    payout_account_name: string | null;
    payout_account_number: string | null;
    timezone: string;
    expectations: string[] | null;
    example_questions: string[] | null;
    photo_url?: string;
  } = {
    headline,
    bio,
    price_per_15_min: Number.isFinite(pricePer15Min) ? pricePer15Min : null,
    payout_account_name: payoutAccountName,
    payout_account_number: payoutAccountNumber,
    timezone,
    expectations: expectations.length > 0 ? expectations : null,
    example_questions: exampleQuestions.length > 0 ? exampleQuestions : null,
  };

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      // Uses the admin (service-role) storage client, which bypasses the
      // owner-only storage RLS policy — admin can upload on behalf of any
      // expert, not just their own path.
      update.photo_url = await uploadExpertPhoto(admin.storage, expertId, photo);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Photo upload failed." };
    }
  }

  const { error } = await admin.from("experts").update(update).eq("id", expertId);
  if (error) {
    return { error: `Failed to save profile: ${error.message}` };
  }

  const { error: deleteError } = await admin.from("expert_categories").delete().eq("expert_id", expertId);
  if (deleteError) {
    return { error: `Failed to save categories: ${deleteError.message}` };
  }
  const { error: categoriesError } = await admin
    .from("expert_categories")
    .insert(categoryIds.map((categoryId) => ({ expert_id: expertId, category_id: categoryId })));
  if (categoriesError) {
    return { error: `Failed to save categories: ${categoriesError.message}` };
  }

  revalidatePath("/admin/experts");
  revalidatePath(`/admin/experts/${expertId}`);
  return {};
}

type VerifyPaymentParams = {
  proofId: string;
  bookingId: string;
  expertId: string;
  clientId: string;
  startTime: string;
  endTime: string;
  price: string | number | null;
};

async function verifyOnePayment(
  admin: ReturnType<typeof createAdminClient>,
  adminUserId: string,
  { proofId, bookingId, expertId, clientId, startTime, endTime, price }: VerifyPaymentParams,
) {
  if (!proofId || !bookingId || !expertId) throw new Error("Missing verification details");

  const { error: proofError } = await admin
    .from("payment_proofs")
    .update({ status: "verified", reviewed_by: adminUserId, reviewed_at: new Date().toISOString() })
    .eq("id", proofId);
  if (proofError) throw proofError;

  // Try to generate a Google Meet link if the expert has connected their calendar.
  // Booking still gets confirmed either way — meet_link stays null otherwise.
  let meetLink: string | null = null;
  let calendarEventId: string | null = null;

  const { data: tokenRow } = await admin
    .from("expert_google_tokens")
    .select("refresh_token")
    .eq("expert_id", expertId)
    .maybeSingle();

  const { data: expertProfile } = await admin
    .from("profiles")
    .select("email")
    .eq("id", expertId)
    .maybeSingle();
  const { data: clientProfile } = await admin
    .from("profiles")
    .select("email")
    .eq("id", clientId)
    .maybeSingle();

  if (tokenRow?.refresh_token) {
    const attendeeEmails = [expertProfile?.email, clientProfile?.email].filter(
      (e): e is string => Boolean(e),
    );

    try {
      const result = await createBookingEventWithMeet({
        refreshToken: tokenRow.refresh_token,
        summary: "Pivotroom.africa session",
        startTime,
        endTime,
        attendeeEmails,
      });
      meetLink = result.meetLink;
      calendarEventId = result.eventId;
    } catch {
      // Calendar event creation failed (e.g. revoked access) — booking is
      // still confirmed; admin can share a meeting link manually.
    }
  }

  const { error: bookingError } = await admin
    .from("bookings")
    .update({
      status: "confirmed",
      meet_link: meetLink,
      calendar_event_id: calendarEventId,
    })
    .eq("id", bookingId);
  if (bookingError) throw bookingError;

  const { error: payoutError } = await admin.from("expert_payouts").insert({
    booking_id: bookingId,
    amount: price ? Number(price) : null,
  });
  if (payoutError) throw payoutError;

  await notifyBookingConfirmed({
    clientEmail: clientProfile?.email ?? null,
    expertEmail: expertProfile?.email ?? null,
    startTime,
    meetLink,
  });

  await logAdminAction(admin, {
    adminId: adminUserId,
    action: "payment_verified",
    targetTable: "payment_proofs",
    targetId: proofId,
    details: { booking_id: bookingId },
  });
}

export async function verifyPayment(formData: FormData) {
  const adminUser = await requireAdmin();
  const admin = createAdminClient();

  await verifyOnePayment(admin, adminUser.id, {
    proofId: String(formData.get("proof_id") ?? ""),
    bookingId: String(formData.get("booking_id") ?? ""),
    expertId: String(formData.get("expert_id") ?? ""),
    clientId: String(formData.get("client_id") ?? ""),
    startTime: String(formData.get("start_time") ?? ""),
    endTime: String(formData.get("end_time") ?? ""),
    price: formData.get("price") as string | null,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/payments");
}

export async function verifyPaymentsBulk(formData: FormData) {
  const adminUser = await requireAdmin();
  const admin = createAdminClient();

  const items = formData
    .getAll("proof_items")
    .map((raw) => {
      try {
        return JSON.parse(String(raw)) as VerifyPaymentParams;
      } catch {
        return null;
      }
    })
    .filter((item): item is VerifyPaymentParams => item != null);

  for (const item of items) {
    try {
      await verifyOnePayment(admin, adminUser.id, item);
    } catch {
      // Best-effort — one bad row (e.g. already reviewed) shouldn't stop
      // the rest of the batch from going through.
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/payments");
}

export async function rejectPayment(formData: FormData) {
  const adminUser = await requireAdmin();
  const proofId = String(formData.get("proof_id") ?? "");
  const bookingId = String(formData.get("booking_id") ?? "");
  const adminNote = String(formData.get("admin_note") ?? "").trim() || null;

  if (!proofId || !bookingId) throw new Error("Missing rejection details");

  const admin = createAdminClient();

  const { error: proofError } = await admin
    .from("payment_proofs")
    .update({
      status: "rejected",
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      admin_note: adminNote,
    })
    .eq("id", proofId);
  if (proofError) throw proofError;

  const { error: bookingError } = await admin
    .from("bookings")
    .update({ status: "rejected" })
    .eq("id", bookingId);
  if (bookingError) throw bookingError;

  const { data: booking } = await admin
    .from("bookings")
    .select("client_id")
    .eq("id", bookingId)
    .maybeSingle();
  const { data: clientProfile } = booking
    ? await admin.from("profiles").select("email").eq("id", booking.client_id).maybeSingle()
    : { data: null };

  await notifyPaymentRejected({ clientEmail: clientProfile?.email ?? null, reason: adminNote });

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "payment_rejected",
    targetTable: "payment_proofs",
    targetId: proofId,
    details: { booking_id: bookingId, admin_note: adminNote },
  });

  revalidatePath("/admin");
}

export async function markPayoutPaid(formData: FormData) {
  const adminUser = await requireAdmin();
  const payoutId = String(formData.get("payout_id") ?? "");
  if (!payoutId) throw new Error("Missing payout_id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("expert_payouts")
    .update({ status: "paid", paid_at: new Date().toISOString(), paid_by: adminUser.id })
    .eq("id", payoutId);
  if (error) throw error;

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "payout_marked_paid",
    targetTable: "expert_payouts",
    targetId: payoutId,
  });

  revalidatePath("/admin");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const parentId = String(formData.get("parent_id") ?? "") || null;
  if (!name) throw new Error("Missing category name");

  const admin = createAdminClient();
  const { error } = await admin.from("categories").insert({ name, parent_id: parentId });
  if (error) throw error;

  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing category id");

  const admin = createAdminClient();
  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/categories");
}

export type CreateNgoState = { error?: string };

export async function createNgo(
  _prevState: CreateNgoState,
  formData: FormData,
): Promise<CreateNgoState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "NGO name is required." };

  const legalLicenseUrl = String(formData.get("legal_license_url") ?? "").trim() || null;
  const payoutAccountName = String(formData.get("payout_account_name") ?? "").trim() || null;
  const payoutAccountNumber = String(formData.get("payout_account_number") ?? "").trim() || null;

  const admin = createAdminClient();
  const { data: ngo, error } = await admin
    .from("ngos")
    .insert({
      name,
      legal_license_url: legalLicenseUrl,
      payout_account_name: payoutAccountName,
      payout_account_number: payoutAccountNumber,
    })
    .select("id")
    .single();
  if (error) return { error: `Failed to save NGO: ${error.message}` };

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    try {
      const logoUrl = await uploadNgoLogo(admin.storage, ngo.id, logo);
      const { error: logoError } = await admin.from("ngos").update({ logo_url: logoUrl }).eq("id", ngo.id);
      if (logoError) return { error: `Logo upload failed: ${logoError.message}` };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Logo upload failed." };
    }
  }

  revalidatePath("/admin/ngos");
  return {};
}

export async function deleteNgo(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing NGO id");

  const admin = createAdminClient();
  const { error } = await admin.from("ngos").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/ngos");
}

export type AddFeaturedLogoState = { error?: string };

export async function addFeaturedLogo(
  _prevState: AddFeaturedLogoState,
  formData: FormData,
): Promise<AddFeaturedLogoState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const linkUrl = String(formData.get("link_url") ?? "").trim() || null;

  const logo = formData.get("logo");
  if (!(logo instanceof File) || logo.size === 0) {
    return { error: "A logo image is required." };
  }

  const admin = createAdminClient();
  const logoId = crypto.randomUUID();

  let logoUrl: string;
  try {
    logoUrl = await uploadFeaturedLogo(admin.storage, logoId, logo);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Logo upload failed." };
  }

  const { error } = await admin
    .from("featured_logos")
    .insert({ id: logoId, name, link_url: linkUrl, logo_url: logoUrl });
  if (error) return { error: `Failed to save logo: ${error.message}` };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return {};
}

export async function removeFeaturedLogo(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing logo id");

  const admin = createAdminClient();
  const { error } = await admin.from("featured_logos").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function setFeaturedLogosEnabled(formData: FormData) {
  await requireAdmin();
  const enabled = formData.get("enabled") === "true";

  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({ featured_logos_enabled: enabled })
    .eq("id", 1);
  if (error) throw error;

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

const ACCOUNT_STATUSES = ["active", "restricted", "suspended"] as const;
type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export async function updateUserName(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!id) throw new Error("Missing user id");

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ full_name: fullName || null }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/users");
}

export async function setUserAccountStatus(formData: FormData) {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id) throw new Error("Missing user id");
  if (!ACCOUNT_STATUSES.includes(status as AccountStatus)) throw new Error("Invalid status");
  if (id === adminUser.id) throw new Error("You can't change your own account status.");

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ account_status: status }).eq("id", id);
  if (error) throw error;

  // "Suspended" also blocks sign-in at the auth layer, not just an app-side
  // flag — anything less would let a suspended user keep using the site.
  // "Restricted" is intentionally lighter: they can still sign in.
  const { error: authError } = await admin.auth.admin.updateUserById(id, {
    ban_duration: status === "suspended" ? "876000h" : "none",
  });
  if (authError) throw authError;

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: `account_status_${status}`,
    targetTable: "profiles",
    targetId: id,
  });

  revalidatePath("/admin/users");
}

export type SendInviteState = { error?: string; success?: string };

export async function sendExpertInvite(
  _prevState: SendInviteState,
  formData: FormData,
): Promise<SendInviteState> {
  const adminUser = await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const token = crypto.randomUUID();
  const admin = createAdminClient();
  const { error } = await admin
    .from("expert_invites")
    .insert({ email, token, invited_by: adminUser.id });
  if (error) return { error: error.message };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const inviteUrl = `${siteUrl}/become-an-expert?invite=${token}`;
  await notifyExpertInvite({ email, inviteUrl });

  revalidatePath("/admin/invites");
  return { success: `Invite sent to ${email}.` };
}

export async function revokeExpertInvite(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing invite id");

  const admin = createAdminClient();
  const { error } = await admin.from("expert_invites").delete().eq("id", id).eq("status", "pending");
  if (error) throw error;

  revalidatePath("/admin/invites");
}

const NOMINEE_STATUSES = ["pending", "in_review", "added", "declined"] as const;
type NomineeStatus = (typeof NOMINEE_STATUSES)[number];

export async function setNomineeStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const resolvedExpertId = String(formData.get("resolved_expert_id") ?? "") || null;
  if (!id) throw new Error("Missing nominee id");
  if (!NOMINEE_STATUSES.includes(status as NomineeStatus)) throw new Error("Invalid status");

  const admin = createAdminClient();

  const { data: nominee } = await admin.from("nominees").select("name, status").eq("id", id).maybeSingle();
  const statusChanged = nominee != null && nominee.status !== status;

  const { error } = await admin
    .from("nominees")
    .update({ status, resolved_expert_id: status === "added" ? resolvedExpertId : null })
    .eq("id", id);
  if (error) throw error;

  if (statusChanged && nominee) {
    const { data: nominations } = await admin.from("nominations").select("nominator_id").eq("nominee_id", id);
    const nominatorIds = Array.from(new Set((nominations ?? []).map((n) => n.nominator_id)));
    if (nominatorIds.length > 0) {
      const { data: profiles } = await admin.from("profiles").select("email").in("id", nominatorIds);
      const emails = (profiles ?? []).map((p) => p.email).filter(Boolean);
      await notifyNominationStatusChanged({ emails, nomineeName: nominee.name, status });
    }
  }

  revalidatePath("/admin/nominees");
}

export async function mergeNominee(formData: FormData) {
  await requireAdmin();
  const sourceId = String(formData.get("source_id") ?? "");
  const targetId = String(formData.get("target_id") ?? "");
  if (!sourceId || !targetId) throw new Error("Pick a nominee to merge into");
  if (sourceId === targetId) throw new Error("Can't merge a nominee into itself");

  const admin = createAdminClient();
  const { error: moveError } = await admin
    .from("nominations")
    .update({ nominee_id: targetId })
    .eq("nominee_id", sourceId);
  if (moveError) throw moveError;

  const { error: deleteError } = await admin.from("nominees").delete().eq("id", sourceId);
  if (deleteError) throw deleteError;

  revalidatePath("/admin/nominees");
}

export async function toggleReviewVisibility(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const expertId = String(formData.get("expert_id") ?? "");
  const hidden = formData.get("hidden") === "true";
  if (!id) throw new Error("Missing review id");

  const admin = createAdminClient();
  const { error } = await admin.from("reviews").update({ hidden: !hidden }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/reviews");
  if (expertId) revalidatePath(`/experts/${expertId}`);
}

type ChangeRequestValue = { category_id: string | null; expertise_ids?: string[] };

export async function approveExpertiseChangeRequest(formData: FormData) {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing change request id");

  const admin = createAdminClient();
  const { data: request, error } = await admin
    .from("expert_profile_change_requests")
    .select("id, expert_id, change_type, new_value, status")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!request || request.status !== "pending") return;

  const newValue = request.new_value as ChangeRequestValue;
  const expertiseIds = newValue.expertise_ids ?? [];

  if (request.change_type === "primary_category" && newValue.category_id) {
    await admin.from("experts").update({ primary_category_id: newValue.category_id }).eq("id", request.expert_id);
    await admin
      .from("expert_categories")
      .delete()
      .eq("expert_id", request.expert_id)
      .eq("expertise_type", "primary");
    if (expertiseIds.length > 0) {
      await admin.from("expert_categories").insert(
        expertiseIds.map((categoryId) => ({
          expert_id: request.expert_id,
          category_id: categoryId,
          expertise_type: "primary" as const,
        })),
      );
    }
  } else if (request.change_type === "secondary_category") {
    await admin.from("experts").update({ secondary_category_id: newValue.category_id }).eq("id", request.expert_id);
    await admin
      .from("expert_categories")
      .delete()
      .eq("expert_id", request.expert_id)
      .eq("expertise_type", "secondary");
    if (newValue.category_id && expertiseIds.length > 0) {
      await admin.from("expert_categories").insert(
        expertiseIds.map((categoryId) => ({
          expert_id: request.expert_id,
          category_id: categoryId,
          expertise_type: "secondary" as const,
        })),
      );
    }
  }

  await admin
    .from("expert_profile_change_requests")
    .update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: adminUser.id })
    .eq("id", id);

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "expertise_change_approved",
    targetTable: "expert_profile_change_requests",
    targetId: id,
  });

  revalidatePath("/admin/expertise-requests");
}

export async function rejectExpertiseChangeRequest(formData: FormData) {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (!id) throw new Error("Missing change request id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("expert_profile_change_requests")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser.id,
      rejection_reason: reason,
    })
    .eq("id", id)
    .eq("status", "pending");
  if (error) throw error;

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "expertise_change_rejected",
    targetTable: "expert_profile_change_requests",
    targetId: id,
    details: reason ? { reason } : undefined,
  });

  revalidatePath("/admin/expertise-requests");
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || crypto.randomUUID()
  );
}

export async function approveTaxonomySuggestion(formData: FormData) {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing suggestion id");

  const admin = createAdminClient();
  const { data: suggestion, error } = await admin
    .from("taxonomy_suggestions")
    .select("id, suggestion_type, name, context_category_id, context_industry_group_id, status")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!suggestion || suggestion.status !== "pending") return;

  try {
    if (suggestion.suggestion_type === "expertise" && suggestion.context_category_id) {
      const { error: insertError } = await admin
        .from("categories")
        .insert({ name: suggestion.name, parent_id: suggestion.context_category_id });
      if (insertError) throw insertError;
    } else if (suggestion.suggestion_type === "industry" && suggestion.context_industry_group_id) {
      const { error: insertError } = await admin.from("industries").insert({
        industry_group_id: suggestion.context_industry_group_id,
        name: suggestion.name,
        slug: slugify(suggestion.name),
      });
      if (insertError) throw insertError;
    }
  } catch {
    // Most likely a duplicate name (e.g. an admin approving a suggestion for
    // something that already exists under a slightly different label) —
    // leave the suggestion pending rather than crashing so admin can reject
    // it and point the expert at the existing entry instead.
    return;
  }

  await admin
    .from("taxonomy_suggestions")
    .update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: adminUser.id })
    .eq("id", id);

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "taxonomy_suggestion_approved",
    targetTable: "taxonomy_suggestions",
    targetId: id,
  });

  revalidatePath("/admin/expertise-requests");
}

export async function rejectTaxonomySuggestion(formData: FormData) {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing suggestion id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("taxonomy_suggestions")
    .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: adminUser.id })
    .eq("id", id)
    .eq("status", "pending");
  if (error) throw error;

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "taxonomy_suggestion_rejected",
    targetTable: "taxonomy_suggestions",
    targetId: id,
  });

  revalidatePath("/admin/expertise-requests");
}

export async function markBookingCompletedAsAdmin(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) throw new Error("Missing booking_id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId)
    .eq("status", "confirmed")
    .lte("end_time", new Date().toISOString());
  if (error) throw error;

  revalidatePath(`/bookings/${bookingId}`);
}
