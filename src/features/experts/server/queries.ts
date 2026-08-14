import { cache } from "react";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getCategoryNamesByExpertId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  expertIds: string[],
) {
  const namesByExpertId = new Map<string, { name: string }[]>();
  if (expertIds.length === 0) return namesByExpertId;

  const { data: rows, error } = await supabase
    .from("expert_categories")
    .select("expert_id, categories(name)")
    .in("expert_id", expertIds);
  if (error) throw error;

  for (const row of rows) {
    if (!row.categories?.name) continue;
    const list = namesByExpertId.get(row.expert_id) ?? [];
    list.push({ name: row.categories.name });
    namesByExpertId.set(row.expert_id, list);
  }
  return namesByExpertId;
}

export async function getApprovedExperts() {
  const supabase = await createClient();

  const { data: experts, error: expertsError } = await supabase
    .from("experts")
    .select("id, headline, bio, price_per_15_min, currency, photo_url")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (expertsError) throw expertsError;
  if (!experts.length) return [];

  const expertIds = experts.map((e) => e.id);

  const [{ data: publicProfiles, error: profilesError }, categoriesByExpertId] = await Promise.all([
    supabase
      .from("expert_public_profiles")
      .select("id, full_name, avatar_url")
      .in("id", expertIds),
    getCategoryNamesByExpertId(supabase, expertIds),
  ]);

  if (profilesError) throw profilesError;

  const profileById = new Map(publicProfiles.map((p) => [p.id, p]));

  return experts.map((expert) => ({
    ...expert,
    categories: categoriesByExpertId.get(expert.id) ?? [],
    profile: profileById.get(expert.id) ?? null,
  }));
}

export async function getCategoriesWithFeaturedExperts(minExperts = 1, perCategory = 8) {
  const supabase = await createClient();

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name, parent_id, tagline")
    .order("name");
  if (catError) throw catError;
  if (!categories.length) return [];

  const { data: experts, error: expertsError } = await supabase
    .from("experts")
    .select("id, headline, bio, price_per_15_min, currency, photo_url")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (expertsError) throw expertsError;
  if (!experts.length) return [];

  const expertIds = experts.map((e) => e.id);

  const [{ data: publicProfiles, error: profilesError }, { data: expertCategoryRows, error: ecError }] =
    await Promise.all([
      supabase.from("expert_public_profiles").select("id, full_name, avatar_url").in("id", expertIds),
      supabase.from("expert_categories").select("expert_id, category_id").in("expert_id", expertIds),
    ]);
  if (profilesError) throw profilesError;
  if (ecError) throw ecError;
  const profileById = new Map(publicProfiles.map((p) => [p.id, p]));

  const topLevelById = new Map(categories.filter((c) => !c.parent_id).map((c) => [c.id, c]));
  const parentIdByChildId = new Map(
    categories.filter((c) => c.parent_id).map((c) => [c.id, c.parent_id as string]),
  );

  function resolveTopLevelId(categoryId: string) {
    if (topLevelById.has(categoryId)) return categoryId;
    return parentIdByChildId.get(categoryId) ?? null;
  }

  const expertById = new Map(experts.map((e) => [e.id, e]));
  const expertsByTopCategory = new Map<string, typeof experts>();
  for (const row of expertCategoryRows ?? []) {
    const topId = resolveTopLevelId(row.category_id);
    const expert = expertById.get(row.expert_id);
    if (!topId || !expert) continue;
    const list = expertsByTopCategory.get(topId) ?? [];
    if (!list.some((e) => e.id === expert.id)) list.push(expert);
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

export async function getCategoryDirectory() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, parent_id, tagline")
    .order("name");
  if (error) throw error;
  if (!categories.length) return [];

  const childrenByParentId = new Map<string, { id: string; name: string }[]>();
  for (const c of categories) {
    if (!c.parent_id) continue;
    const list = childrenByParentId.get(c.parent_id) ?? [];
    list.push({ id: c.id, name: c.name });
    childrenByParentId.set(c.parent_id, list);
  }

  return categories
    .filter((c) => !c.parent_id)
    .map((c) => ({
      id: c.id,
      name: c.name,
      tagline: c.tagline,
      subcategories: childrenByParentId.get(c.id) ?? [],
    }));
}

export async function getCategoryWithExperts(categoryId: string) {
  const supabase = await createClient();

  const { data: category, error: catError } = await supabase
    .from("categories")
    .select("id, name, parent_id, tagline")
    .eq("id", categoryId)
    .is("parent_id", null)
    .maybeSingle();
  if (catError) throw catError;
  if (!category) return null;

  const { data: subcategories, error: subError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("parent_id", categoryId)
    .order("name");
  if (subError) throw subError;

  const categoryIds = [categoryId, ...subcategories.map((s) => s.id)];

  const { data: matchRows, error: matchError } = await supabase
    .from("expert_categories")
    .select("expert_id, category_id")
    .in("category_id", categoryIds);
  if (matchError) throw matchError;

  const matchedCategoryIdsByExpertId = new Map<string, Set<string>>();
  for (const row of matchRows) {
    const set = matchedCategoryIdsByExpertId.get(row.expert_id) ?? new Set<string>();
    set.add(row.category_id);
    matchedCategoryIdsByExpertId.set(row.expert_id, set);
  }
  const expertIds = Array.from(matchedCategoryIdsByExpertId.keys());

  const { data: experts, error: expertsError } = await supabase
    .from("experts")
    .select("id, headline, bio, price_per_15_min, currency, photo_url")
    .eq("status", "approved")
    .in("id", expertIds.length > 0 ? expertIds : [""])
    .order("created_at", { ascending: false });
  if (expertsError) throw expertsError;

  const profileById = new Map<string, { id: string | null; full_name: string | null; avatar_url: string | null }>();
  if (experts.length) {
    const { data: publicProfiles, error: profilesError } = await supabase
      .from("expert_public_profiles")
      .select("id, full_name, avatar_url")
      .in(
        "id",
        experts.map((e) => e.id),
      );
    if (profilesError) throw profilesError;
    for (const p of publicProfiles) {
      if (p.id) profileById.set(p.id, p);
    }
  }

  return {
    category,
    subcategories,
    experts: experts.map((e) => ({
      ...e,
      profile: profileById.get(e.id) ?? null,
      matchedCategoryIds: Array.from(matchedCategoryIdsByExpertId.get(e.id) ?? []),
    })),
  };
}

export const getApprovedExpertById = cache(async (id: string) => {
  const supabase = await createClient();

  const { data: expert, error } = await supabase
    .from("experts")
    .select("id, headline, bio, price_per_15_min, currency, photo_url, expectations, example_questions")
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
