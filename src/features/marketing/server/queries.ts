import { createClient } from "@/lib/supabase/server";

export async function getFeaturedLogos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("featured_logos")
    .select("id, name, logo_url, link_url")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}
