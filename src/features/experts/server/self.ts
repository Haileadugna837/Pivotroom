import { createClient } from "@/lib/supabase/server";

export async function getMyExpertProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experts")
    .select("id, status")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMyExpertProfileFull(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experts")
    .select(
      "id, headline, bio, category_id, price_per_15_min, status, payout_account_name, payout_account_number, photo_url",
    )
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMySocialLinks(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expert_social_links")
    .select("id, platform, url")
    .eq("expert_id", userId)
    .order("created_at", { ascending: true });
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
