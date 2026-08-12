import { createClient } from "@/lib/supabase/server";

export async function getMyNominations(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nominations")
    .select("id, reason, links, created_at, nominees(id, name, status)")
    .eq("nominator_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
