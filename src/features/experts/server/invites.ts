import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getInviteByToken(token: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("expert_invites")
    .select("id, email, status, token")
    .eq("token", token)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function markInviteUsed(token: string) {
  const admin = createAdminClient();
  await admin
    .from("expert_invites")
    .update({ status: "used", used_at: new Date().toISOString() })
    .eq("token", token)
    .eq("status", "pending");
}

export async function markInviteCompleted(token: string) {
  const admin = createAdminClient();
  await admin
    .from("expert_invites")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("token", token);
}
