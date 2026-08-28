"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { notifyExpertApplicationAccepted, notifyExpertApplicationRejected } from "@/features/notifications/server/send";
import { DEFAULT_TIMEZONE } from "@/lib/timezones";

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
  }: { adminId: string; action: string; targetTable: string; targetId?: string | null; details?: Record<string, unknown> },
) {
  await admin.from("admin_audit_log").insert({
    admin_id: adminId,
    action,
    target_table: targetTable,
    target_id: targetId ?? null,
    details: details ? JSON.parse(JSON.stringify(details)) : null,
  });
}

const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Priority", "Invited", "Activated", "Not Interested", "Archived"];

export async function updateLeadStatus(formData: FormData) {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id) throw new Error("Missing lead id");
  if (!LEAD_STATUSES.includes(status)) throw new Error("Invalid status");

  const admin = createAdminClient();
  const { error } = await admin.from("acquisition_leads").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;

  await logAdminAction(admin, { adminId: adminUser.id, action: "acquisition_lead_status_changed", targetTable: "acquisition_leads", targetId: id, details: { status } });
  revalidatePath("/admin/acquisition/leads");
  revalidatePath(`/admin/acquisition/leads/${id}`);
}

export async function updateLeadNote(formData: FormData) {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "");
  if (!id) throw new Error("Missing lead id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("acquisition_leads")
    .update({ admin_note: note || null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  await logAdminAction(admin, { adminId: adminUser.id, action: "acquisition_lead_note_updated", targetTable: "acquisition_leads", targetId: id });
  revalidatePath(`/admin/acquisition/leads/${id}`);
}

const APPLICATION_STATUSES = [
  "New",
  "Under Review",
  "Shortlisted",
  "Contacted",
  "Approved",
  "Waitlisted",
  "Rejected",
  "Onboarding",
  "Published",
];

export async function updateApplicationStatus(formData: FormData) {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id) throw new Error("Missing application id");
  if (!APPLICATION_STATUSES.includes(status)) throw new Error("Invalid status");

  const admin = createAdminClient();
  const { error } = await admin
    .from("expert_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "expert_application_status_changed",
    targetTable: "expert_applications",
    targetId: id,
    details: { status },
  });
  revalidatePath("/admin/acquisition/applications");
  revalidatePath(`/admin/acquisition/applications/${id}`);
}

export async function updateApplicationNote(formData: FormData) {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "");
  if (!id) throw new Error("Missing application id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("expert_applications")
    .update({ admin_note: note || null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  await logAdminAction(admin, { adminId: adminUser.id, action: "expert_application_note_updated", targetTable: "expert_applications", targetId: id });
  revalidatePath(`/admin/acquisition/applications/${id}`);
}

export type AcceptApplicationState = { error?: string; success?: string };

// Admin acceptance of a "Become an Expert" application. Unlike the old
// Founding Expert flow, the applicant's account already exists (created
// inline when they submitted, or reused if they were already signed in —
// see submitBecomeExpertApplication), so there's no invite-email bridge
// needed. Accepting just upserts a minimal `experts` row for them, which
// is what grants access to the existing "locked" dashboard
// (dashboard/expert/profile + expertise pages) — bookings/availability/
// payments stay locked until an admin separately approves the finished
// profile via the existing approveExpert action.
export async function acceptExpertApplication(
  _prevState: AcceptApplicationState,
  formData: FormData,
): Promise<AcceptApplicationState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing application id" };

  const admin = createAdminClient();
  const { data: application, error: fetchError } = await admin
    .from("expert_applications")
    .select("id, email, name, applicant_user_id, preferred_price_etb, status")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !application) return { error: "Application not found." };
  if (!application.applicant_user_id) {
    return { error: "This application has no linked account, so it can't be granted dashboard access." };
  }
  if (application.status === "Approved") {
    return { error: "This application has already been accepted." };
  }

  const { error: upsertError } = await admin.from("experts").upsert({
    id: application.applicant_user_id,
    currency: "ETB",
    price_per_15_min: application.preferred_price_etb ?? null,
    timezone: DEFAULT_TIMEZONE,
  });
  if (upsertError) return { error: upsertError.message };

  const { error: updateError } = await admin
    .from("expert_applications")
    .update({ status: "Approved", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) return { error: updateError.message };

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "expert_application_accepted",
    targetTable: "expert_applications",
    targetId: id,
    details: { applicant_user_id: application.applicant_user_id },
  });

  if (application.email) {
    await notifyExpertApplicationAccepted({ email: application.email, name: application.name });
  }

  revalidatePath("/admin/acquisition/applications");
  revalidatePath(`/admin/acquisition/applications/${id}`);
  return { success: "Application accepted — the applicant can now log in and complete their profile." };
}

export type RejectApplicationState = { error?: string; success?: string };

// Rejecting an application always goes through here (not the generic
// updateApplicationStatus dropdown, which no longer offers "Rejected" —
// see the applications detail page) so a rejection always notifies the
// applicant by email with an optional reason, and the reason is kept on
// the row for admin's own record.
export async function rejectExpertApplication(
  _prevState: RejectApplicationState,
  formData: FormData,
): Promise<RejectApplicationState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing application id" };
  const reason = String(formData.get("reason") ?? "").trim() || null;

  const admin = createAdminClient();
  const { data: application, error: fetchError } = await admin
    .from("expert_applications")
    .select("id, email, name, status")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !application) return { error: "Application not found." };
  if (application.status === "Rejected") {
    return { error: "This application has already been rejected." };
  }

  const { error: updateError } = await admin
    .from("expert_applications")
    .update({ status: "Rejected", rejection_reason: reason, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) return { error: updateError.message };

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "expert_application_rejected",
    targetTable: "expert_applications",
    targetId: id,
    details: reason ? { reason } : undefined,
  });

  if (application.email) {
    await notifyExpertApplicationRejected({ email: application.email, name: application.name, reason });
  }

  revalidatePath("/admin/acquisition/applications");
  revalidatePath(`/admin/acquisition/applications/${id}`);
  return {
    success:
      "The applicant has been notified by email of the outcome. They've been asked to check the email address they applied with over the next few days.",
  };
}
