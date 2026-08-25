import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Purely cosmetic "Founding 100" counter — does not gate applications in
// any way, every application still requires manual admin approval.
export async function getFoundingExpertApplicationCount(): Promise<number> {
  const admin = createAdminClient();
  const { count } = await admin.from("founding_expert_applications").select("*", { count: "exact", head: true });
  return count ?? 0;
}
