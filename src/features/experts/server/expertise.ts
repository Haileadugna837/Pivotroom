import "server-only";
import { createClient } from "@/lib/supabase/server";

export const EXPERTISE_LIMITS = {
  primaryMin: 2,
  primaryMax: 6,
  secondaryMin: 1,
  secondaryMax: 3,
  industryMax: 8,
  industryRecommendedMax: 5,
  bookableTopicsMin: 1,
  bookableTopicsMax: 6,
} as const;

export type ExpertiseCategoryGroup = {
  id: string;
  name: string;
  tagline: string | null;
  subcategories: { id: string; name: string }[];
};

export async function getExpertiseCategoryTree(): Promise<ExpertiseCategoryGroup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, parent_id, tagline")
    .order("name");
  if (error) throw error;

  const childrenByParent = new Map<string, { id: string; name: string }[]>();
  for (const c of data) {
    if (!c.parent_id) continue;
    const list = childrenByParent.get(c.parent_id) ?? [];
    list.push({ id: c.id, name: c.name });
    childrenByParent.set(c.parent_id, list);
  }

  return data
    .filter((c) => !c.parent_id)
    .map((c) => ({ id: c.id, name: c.name, tagline: c.tagline, subcategories: childrenByParent.get(c.id) ?? [] }));
}

export type MyExpertiseSelections = {
  primaryCategoryId: string | null;
  secondaryCategoryId: string | null;
  primaryExpertiseIds: string[];
  secondaryExpertiseIds: string[];
  untypedExpertiseIds: string[];
};

export async function getMyExpertiseSelections(expertId: string): Promise<MyExpertiseSelections> {
  const supabase = await createClient();
  const [{ data: expert, error: expertError }, { data: tags, error: tagsError }] = await Promise.all([
    supabase.from("experts").select("primary_category_id, secondary_category_id").eq("id", expertId).maybeSingle(),
    supabase.from("expert_categories").select("category_id, expertise_type").eq("expert_id", expertId),
  ]);
  if (expertError) throw expertError;
  if (tagsError) throw tagsError;

  return {
    primaryCategoryId: expert?.primary_category_id ?? null,
    secondaryCategoryId: expert?.secondary_category_id ?? null,
    primaryExpertiseIds: (tags ?? []).filter((t) => t.expertise_type === "primary").map((t) => t.category_id),
    secondaryExpertiseIds: (tags ?? []).filter((t) => t.expertise_type === "secondary").map((t) => t.category_id),
    // Rows left over from the pre-classification model that couldn't be
    // confidently mapped to primary/secondary during the migration backfill
    // — surfaced separately rather than silently dropped or force-assigned.
    untypedExpertiseIds: (tags ?? []).filter((t) => !t.expertise_type).map((t) => t.category_id),
  };
}

export function validatePrimaryExpertise(categoryId: string, expertiseIds: string[]): string | null {
  if (!categoryId) return "Select your primary expertise category.";
  if (expertiseIds.length < EXPERTISE_LIMITS.primaryMin || expertiseIds.length > EXPERTISE_LIMITS.primaryMax) {
    return `Select ${EXPERTISE_LIMITS.primaryMin} to ${EXPERTISE_LIMITS.primaryMax} specific expertise areas for your primary category.`;
  }
  return null;
}

export type PendingChangeRequest = {
  id: string;
  change_type: "primary_category" | "secondary_category";
  new_value: { category_id: string | null; expertise_ids?: string[] };
  submitted_at: string;
};

export async function getPendingChangeRequests(expertId: string): Promise<PendingChangeRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expert_profile_change_requests")
    .select("id, change_type, new_value, submitted_at")
    .eq("expert_id", expertId)
    .eq("status", "pending")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PendingChangeRequest[];
}

export function parseJsonArray<T>(raw: FormDataEntryValue | null): T[] {
  try {
    const parsed = JSON.parse(String(raw ?? "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function validateSecondaryExpertise(
  primaryCategoryId: string,
  secondaryCategoryId: string | null,
  expertiseIds: string[],
): string | null {
  if (!secondaryCategoryId) return null;
  if (secondaryCategoryId === primaryCategoryId) {
    return "Secondary category must be different from your primary category.";
  }
  if (expertiseIds.length < EXPERTISE_LIMITS.secondaryMin || expertiseIds.length > EXPERTISE_LIMITS.secondaryMax) {
    return `Select ${EXPERTISE_LIMITS.secondaryMin} to ${EXPERTISE_LIMITS.secondaryMax} specific expertise areas for your secondary category.`;
  }
  return null;
}
