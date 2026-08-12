import { createClient } from "@/lib/supabase/server";

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
