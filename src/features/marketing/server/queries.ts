import { createClient } from "@/lib/supabase/server";

// Returns [] when the section is toggled off in /admin/settings, so
// the homepage never has to know about the setting — an empty list already
// means "render nothing" for FeaturedLogosStrip.
export async function getFeaturedLogosForHome() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("featured_logos_enabled")
    .eq("id", 1)
    .maybeSingle();
  if (!settings?.featured_logos_enabled) return [];

  const { data, error } = await supabase
    .from("featured_logos")
    .select("id, name, logo_url, link_url")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}
