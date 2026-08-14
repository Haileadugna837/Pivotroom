import { createClient } from "@/lib/supabase/server";

export async function getWishlistedExpertIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("wishlists").select("expert_id").eq("user_id", userId);
  if (error) throw error;
  return new Set(data.map((row) => row.expert_id));
}

export async function isExpertWishlisted(userId: string, expertId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .eq("expert_id", expertId)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}

export async function getMyWishlistedExperts(userId: string) {
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("wishlists")
    .select("expert_id, experts(id, headline, bio, price_per_15_min, currency, photo_url, status)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const experts = rows.map((row) => row.experts).filter((e): e is NonNullable<typeof e> => e != null && e.status === "approved");
  if (experts.length === 0) return [];

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
