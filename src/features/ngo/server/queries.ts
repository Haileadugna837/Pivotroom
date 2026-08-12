import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAllNgos() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("ngos").select("id, name").order("name", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMyNgoAllocations(expertId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expert_ngo_allocations")
    .select("id, ngo_id, percentage, ngos(name)")
    .eq("expert_id", expertId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

// Reads via the admin client (not RLS-gated) since this is used to decorate
// public expert listings with a gold badge — it only ever needs to know
// *who* donates, not expose individual allocation rows to the client.
export async function getExpertIdsWithNgoDonations(): Promise<Set<string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("expert_ngo_allocations").select("expert_id");
  if (error) throw error;
  return new Set(data.map((row) => row.expert_id));
}

export async function expertDonatesToNgo(expertId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("expert_ngo_allocations")
    .select("id")
    .eq("expert_id", expertId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}
