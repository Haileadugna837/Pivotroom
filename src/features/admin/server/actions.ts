"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { createBookingEventWithMeet } from "@/lib/google/calendar";
import { notifyBookingConfirmed, notifyPaymentRejected } from "@/features/notifications/server/send";
import { uploadExpertPhoto } from "@/features/experts/server/photo";

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

async function setExpertStatus(formData: FormData, status: "approved" | "rejected" | "suspended") {
  await requireAdmin();
  const expertId = String(formData.get("expert_id") ?? "");
  if (!expertId) throw new Error("Missing expert_id");

  const admin = createAdminClient();
  const { error } = await admin.from("experts").update({ status }).eq("id", expertId);
  if (error) throw error;

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
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const pricePer15Min = Number(formData.get("price_per_15_min"));
  const payoutAccountName = String(formData.get("payout_account_name") ?? "").trim() || null;
  const payoutAccountNumber = String(formData.get("payout_account_number") ?? "").trim() || null;

  const admin = createAdminClient();

  const update: {
    headline: string;
    bio: string;
    category_id: string | null;
    price_per_15_min: number | null;
    payout_account_name: string | null;
    payout_account_number: string | null;
    photo_url?: string;
  } = {
    headline,
    bio,
    category_id: categoryId,
    price_per_15_min: Number.isFinite(pricePer15Min) ? pricePer15Min : null,
    payout_account_name: payoutAccountName,
    payout_account_number: payoutAccountNumber,
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

  revalidatePath("/admin/experts");
  revalidatePath(`/admin/experts/${expertId}`);
  return {};
}

export async function verifyPayment(formData: FormData) {
  const adminUser = await requireAdmin();
  const proofId = String(formData.get("proof_id") ?? "");
  const bookingId = String(formData.get("booking_id") ?? "");
  const expertId = String(formData.get("expert_id") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");
  const price = formData.get("price");

  if (!proofId || !bookingId || !expertId) throw new Error("Missing verification details");

  const admin = createAdminClient();

  const { error: proofError } = await admin
    .from("payment_proofs")
    .update({ status: "verified", reviewed_by: adminUser.id, reviewed_at: new Date().toISOString() })
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

  revalidatePath("/admin");
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
