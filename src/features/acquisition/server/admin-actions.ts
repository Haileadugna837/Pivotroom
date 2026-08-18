"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { notifyExpertInvite } from "@/features/notifications/server/send";

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
    .from("founding_expert_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "founding_expert_application_status_changed",
    targetTable: "founding_expert_applications",
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
    .from("founding_expert_applications")
    .update({ admin_note: note || null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  await logAdminAction(admin, { adminId: adminUser.id, action: "founding_expert_application_note_updated", targetTable: "founding_expert_applications", targetId: id });
  revalidatePath(`/admin/acquisition/applications/${id}`);
}

export type ApproveApplicationState = { error?: string; success?: string };

// Bridges an approved Founding Expert application into the existing,
// already-shipped expert_invites mechanism — no second onboarding
// pipeline. Requires an email on file since expert_invites.email is
// required; applications submitted with phone-only need one collected
// (e.g. by contacting the applicant) before this can be used.
export async function approveApplicationAndInvite(
  _prevState: ApproveApplicationState,
  formData: FormData,
): Promise<ApproveApplicationState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing application id" };

  const admin = createAdminClient();
  const { data: application, error: fetchError } = await admin
    .from("founding_expert_applications")
    .select("id, email, name")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !application) return { error: "Application not found." };
  if (!application.email) return { error: "This application has no email on file — collect one before sending an invite." };

  const token = crypto.randomUUID();
  const { error: inviteError } = await admin
    .from("expert_invites")
    .insert({ email: application.email, token, invited_by: adminUser.id });
  if (inviteError) return { error: inviteError.message };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const inviteUrl = `${siteUrl}/become-an-expert?invite=${token}`;
  await notifyExpertInvite({ email: application.email, inviteUrl });

  const { data: inviteRow } = await admin.from("expert_invites").select("id").eq("token", token).single();

  const { error: updateError } = await admin
    .from("founding_expert_applications")
    .update({
      status: "Onboarding",
      expert_invite_id: inviteRow?.id ?? null,
      invited_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (updateError) return { error: updateError.message };

  await logAdminAction(admin, {
    adminId: adminUser.id,
    action: "founding_expert_application_approved_and_invited",
    targetTable: "founding_expert_applications",
    targetId: id,
    details: { email: application.email },
  });

  revalidatePath("/admin/acquisition/applications");
  revalidatePath(`/admin/acquisition/applications/${id}`);
  return { success: `Invite sent to ${application.email}.` };
}
