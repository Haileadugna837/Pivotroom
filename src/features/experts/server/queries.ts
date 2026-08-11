import { createClient } from "@/lib/supabase/server";

export async function getApprovedExperts() {
  const supabase = await createClient();

  const { data: experts, error: expertsError } = await supabase
    .from("experts")
    .select("id, headline, bio, price_per_15_min, currency, categories(name)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (expertsError) throw expertsError;
  if (!experts.length) return [];

  const { data: publicProfiles, error: profilesError } = await supabase
    .from("expert_public_profiles")
    .select("id, full_name, avatar_url")
    .in(
      "id",
      experts.map((e) => e.id),
    );

  if (profilesError) throw profilesError;

  const profileById = new Map(publicProfiles.map((p) => [p.id, p]));

  return experts.map((expert) => ({
    ...expert,
    profile: profileById.get(expert.id) ?? null,
  }));
}

export async function getApprovedExpertById(id: string) {
  const supabase = await createClient();

  const { data: expert, error } = await supabase
    .from("experts")
    .select("id, headline, bio, price_per_15_min, currency, categories(name)")
    .eq("id", id)
    .eq("is_approved", true)
    .maybeSingle();

  if (error) throw error;
  if (!expert) return null;

  const { data: profile } = await supabase
    .from("expert_public_profiles")
    .select("id, full_name, avatar_url")
    .eq("id", id)
    .maybeSingle();

  const today = new Date().toISOString().slice(0, 10);
  const { data: availability, error: availabilityError } = await supabase
    .from("expert_availability")
    .select("id, date, start_time, end_time")
    .eq("expert_id", id)
    .gte("date", today)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (availabilityError) throw availabilityError;

  return { ...expert, profile: profile ?? null, availability };
}
