import "server-only";
import { createClient } from "@/lib/supabase/server";

export type IndustryGroupWithIndustries = {
  id: string;
  name: string;
  industries: { id: string; name: string; search_keywords: string[] }[];
};

export async function getIndustryDirectory(): Promise<IndustryGroupWithIndustries[]> {
  const supabase = await createClient();
  const [{ data: groups, error: groupsError }, { data: industries, error: industriesError }] = await Promise.all([
    supabase.from("industry_groups").select("id, name, sort_order").eq("active", true).order("sort_order").order("name"),
    supabase
      .from("industries")
      .select("id, industry_group_id, name, search_keywords, sort_order")
      .eq("active", true)
      .order("sort_order")
      .order("name"),
  ]);
  if (groupsError) throw groupsError;
  if (industriesError) throw industriesError;

  const byGroup = new Map<string, { id: string; name: string; search_keywords: string[] }[]>();
  for (const i of industries) {
    const list = byGroup.get(i.industry_group_id) ?? [];
    list.push({ id: i.id, name: i.name, search_keywords: i.search_keywords });
    byGroup.set(i.industry_group_id, list);
  }

  return groups.map((g) => ({ id: g.id, name: g.name, industries: byGroup.get(g.id) ?? [] }));
}

export async function getIndustryCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("industries")
    .select("id", { count: "exact", head: true })
    .eq("active", true);
  if (error) throw error;
  return count ?? 0;
}

export type ExperienceLevel = "experienced" | "highly_experienced";
export type MyIndustrySelection = { industryId: string; experienceLevel: ExperienceLevel | null };

export async function getMyIndustrySelections(expertId: string): Promise<MyIndustrySelection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expert_industries")
    .select("industry_id, experience_level")
    .eq("expert_id", expertId);
  if (error) throw error;
  return (data ?? []).map((d) => ({
    industryId: d.industry_id,
    experienceLevel: (d.experience_level as ExperienceLevel | null) ?? null,
  }));
}
