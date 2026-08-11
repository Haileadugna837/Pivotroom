import { createClient } from "@/lib/supabase/server";

export async function getApprovedExperts() {
  const supabase = await createClient();

  const { data: experts, error: expertsError } = await supabase
    .from("experts")
    .select("id, headline, bio, session_rate, currency, session_duration_minutes, categories(name)")
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
    .select("id, headline, bio, session_rate, currency, session_duration_minutes, categories(name)")
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

  return { ...expert, profile: profile ?? null };
}
