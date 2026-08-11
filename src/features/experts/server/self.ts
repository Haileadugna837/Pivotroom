import { createClient } from "@/lib/supabase/server";

export async function getMyExpertProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experts")
    .select("id, is_approved")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function hasConnectedGoogleCalendar(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("expert_google_tokens")
    .select("expert_id")
    .eq("expert_id", userId)
    .maybeSingle();
  return Boolean(data);
}
