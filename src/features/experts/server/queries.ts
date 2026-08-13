import { cache } from "react";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getApprovedExperts() {
  const supabase = await createClient();

  const { data: experts, error: expertsError } = await supabase
    .from("experts")
    .select("id, headline, bio, price_per_15_min, currency, photo_url, categories(name)")
    .eq("status", "approved")
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

export async function getCategoriesWithFeaturedExperts(minExperts = 3, perCategory = 8) {
  const supabase = await createClient();

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name, parent_id")
    .order("name");
  if (catError) throw catError;
  if (!categories.length) return [];

  const { data: experts, error: expertsError } = await supabase
    .from("experts")
    .select("id, headline, bio, price_per_15_min, currency, photo_url, category_id")
    .eq("status", "approved")
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

  const topLevelById = new Map(categories.filter((c) => !c.parent_id).map((c) => [c.id, c]));
  const parentIdByChildId = new Map(
    categories.filter((c) => c.parent_id).map((c) => [c.id, c.parent_id as string]),
  );

  function resolveTopLevelId(categoryId: string | null) {
    if (!categoryId) return null;
    if (topLevelById.has(categoryId)) return categoryId;
    return parentIdByChildId.get(categoryId) ?? null;
  }

  const expertsByTopCategory = new Map<string, typeof experts>();
  for (const expert of experts) {
    const topId = resolveTopLevelId(expert.category_id);
    if (!topId) continue;
    const list = expertsByTopCategory.get(topId) ?? [];
    list.push(expert);
    expertsByTopCategory.set(topId, list);
  }

  return Array.from(expertsByTopCategory.entries())
    .filter(([, list]) => list.length >= minExperts)
    .map(([categoryId, list]) => ({
      category: topLevelById.get(categoryId)!,
      experts: list.slice(0, perCategory).map((e) => ({ ...e, profile: profileById.get(e.id) ?? null })),
    }))
    .sort((a, b) => b.experts.length - a.experts.length);
}

export const getApprovedExpertById = cache(async (id: string) => {
  const supabase = await createClient();

  const { data: expert, error } = await supabase
    .from("experts")
    .select(
      "id, headline, bio, price_per_15_min, currency, photo_url, categories(name), expectations, example_questions",
    )
    .eq("id", id)
    .eq("status", "approved")
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

  const { data: socialLinks, error: socialLinksError } = await supabase
    .from("expert_social_links")
    .select("id, platform, url")
    .eq("expert_id", id)
    .order("created_at", { ascending: true });

  if (socialLinksError) throw socialLinksError;

  // Fire-and-forget page view record for the admin metrics dashboard.
  // Uses the admin client since visitors (including anonymous ones) have
  // no RLS access to this table by design. Only counted for real browser
  // navigations (Sec-Fetch-Dest: document) — same fix as trackPageView()
  // in middleware.ts, see the comment there for why this matters.
  const fetchDest = (await headers()).get("sec-fetch-dest");
  if (!fetchDest || fetchDest === "document") {
    createAdminClient()
      .from("expert_profile_views")
      .insert({ expert_id: id })
      .then(
        () => {},
        () => {},
      );
  }

  return { ...expert, profile: profile ?? null, availability, socialLinks };
});
