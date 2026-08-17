"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { EXPERTISE_LIMITS, validatePrimaryExpertise, validateSecondaryExpertise, parseJsonArray } from "./expertise";
import type { ExperienceLevel } from "./industries";

export type ExpertiseActionState = { error?: string; success?: string };

const EXPERTISE_PAGE_PATH = "/dashboard/expert/expertise";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function requireOwnExpert(supabase: SupabaseServerClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: expert, error } = await supabase
    .from("experts")
    .select("id, status, primary_category_id, secondary_category_id")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!expert) throw new Error("No expert profile found.");

  return { userId: user.id, expert };
}

async function applyPrimaryCategoryChange(
  supabase: SupabaseServerClient,
  expertId: string,
  categoryId: string,
  expertiseIds: string[],
) {
  await supabase.from("experts").update({ primary_category_id: categoryId }).eq("id", expertId);
  await supabase.from("expert_categories").delete().eq("expert_id", expertId).eq("expertise_type", "primary");
  await supabase
    .from("expert_categories")
    .insert(expertiseIds.map((id) => ({ expert_id: expertId, category_id: id, expertise_type: "primary" as const })));
}

async function applySecondaryCategoryChange(
  supabase: SupabaseServerClient,
  expertId: string,
  categoryId: string | null,
  expertiseIds: string[],
) {
  await supabase.from("experts").update({ secondary_category_id: categoryId }).eq("id", expertId);
  await supabase.from("expert_categories").delete().eq("expert_id", expertId).eq("expertise_type", "secondary");
  if (categoryId) {
    await supabase
      .from("expert_categories")
      .insert(expertiseIds.map((id) => ({ expert_id: expertId, category_id: id, expertise_type: "secondary" as const })));
  }
}

// Minor edit — re-picking specific expertise tags *within* the already-set
// primary category applies immediately, per the spec's minor/major split.
export async function updatePrimaryExpertiseTags(
  _prevState: ExpertiseActionState,
  formData: FormData,
): Promise<ExpertiseActionState> {
  const supabase = await createClient();
  const { userId, expert } = await requireOwnExpert(supabase);
  const expertiseIds = formData.getAll("expertise_ids").map(String).filter(Boolean);
  const error = validatePrimaryExpertise(expert.primary_category_id ?? "", expertiseIds);
  if (error) return { error };

  const { error: deleteError } = await supabase
    .from("expert_categories")
    .delete()
    .eq("expert_id", userId)
    .eq("expertise_type", "primary");
  if (deleteError) return { error: deleteError.message };

  const { error: insertError } = await supabase
    .from("expert_categories")
    .insert(expertiseIds.map((id) => ({ expert_id: userId, category_id: id, expertise_type: "primary" as const })));
  if (insertError) return { error: insertError.message };

  revalidatePath(EXPERTISE_PAGE_PATH);
  return { success: "Primary expertise updated." };
}

// Major edit — changing the primary category itself. Applies immediately
// while the expert isn't approved yet (nothing public to protect); once
// approved, it's queued for admin review and the live profile is untouched
// until then.
export async function changePrimaryCategory(
  _prevState: ExpertiseActionState,
  formData: FormData,
): Promise<ExpertiseActionState> {
  const supabase = await createClient();
  const { userId, expert } = await requireOwnExpert(supabase);
  const newCategoryId = String(formData.get("category_id") ?? "").trim();
  const newExpertiseIds = formData.getAll("expertise_ids").map(String).filter(Boolean);

  const validationError = validatePrimaryExpertise(newCategoryId, newExpertiseIds);
  if (validationError) return { error: validationError };
  if (newCategoryId === expert.secondary_category_id) {
    return { error: "Primary category must be different from your secondary category." };
  }

  // The category itself is unchanged — only the specific-expertise tags
  // under it moved, which is a minor edit regardless of approval status.
  const categoryUnchanged = newCategoryId === expert.primary_category_id;

  if (categoryUnchanged || expert.status !== "approved") {
    await applyPrimaryCategoryChange(supabase, userId, newCategoryId, newExpertiseIds);
    revalidatePath(EXPERTISE_PAGE_PATH);
    return { success: "Primary expertise updated." };
  }

  const { error } = await supabase.from("expert_profile_change_requests").insert({
    expert_id: userId,
    change_type: "primary_category",
    old_value: { category_id: expert.primary_category_id },
    new_value: { category_id: newCategoryId, expertise_ids: newExpertiseIds },
  });
  if (error) return { error: error.message };

  revalidatePath(EXPERTISE_PAGE_PATH);
  return { success: "Change submitted for review. Your current profile stays visible until admin approves it." };
}

// Major edit — adding, changing, or removing the secondary category.
export async function changeSecondaryCategory(
  _prevState: ExpertiseActionState,
  formData: FormData,
): Promise<ExpertiseActionState> {
  const supabase = await createClient();
  const { userId, expert } = await requireOwnExpert(supabase);
  const newCategoryId = String(formData.get("category_id") ?? "").trim() || null;
  const newExpertiseIds = formData.getAll("expertise_ids").map(String).filter(Boolean);

  const validationError = validateSecondaryExpertise(expert.primary_category_id ?? "", newCategoryId, newExpertiseIds);
  if (validationError) return { error: validationError };

  const categoryUnchanged = newCategoryId === expert.secondary_category_id;

  if (categoryUnchanged || expert.status !== "approved") {
    await applySecondaryCategoryChange(supabase, userId, newCategoryId, newExpertiseIds);
    revalidatePath(EXPERTISE_PAGE_PATH);
    return { success: newCategoryId ? "Secondary expertise updated." : "Secondary expertise removed." };
  }

  const { error } = await supabase.from("expert_profile_change_requests").insert({
    expert_id: userId,
    change_type: "secondary_category",
    old_value: { category_id: expert.secondary_category_id },
    new_value: { category_id: newCategoryId, expertise_ids: newExpertiseIds },
  });
  if (error) return { error: error.message };

  revalidatePath(EXPERTISE_PAGE_PATH);
  return { success: "Change submitted for review. Your current profile stays visible until admin approves it." };
}

// Industries aren't in the spec's "major change" list — edits apply immediately.
export async function updateIndustries(
  _prevState: ExpertiseActionState,
  formData: FormData,
): Promise<ExpertiseActionState> {
  const supabase = await createClient();
  const { userId } = await requireOwnExpert(supabase);

  const selections = parseJsonArray<{ industryId: string; experienceLevel?: ExperienceLevel | null }>(
    formData.get("industries_json"),
  ).filter((s) => s.industryId);
  if (selections.length > EXPERTISE_LIMITS.industryMax) {
    return { error: `Select at most ${EXPERTISE_LIMITS.industryMax} industries.` };
  }

  const { error: deleteError } = await supabase.from("expert_industries").delete().eq("expert_id", userId);
  if (deleteError) return { error: deleteError.message };

  if (selections.length > 0) {
    const { error } = await supabase.from("expert_industries").insert(
      selections.map((s) => ({ expert_id: userId, industry_id: s.industryId, experience_level: s.experienceLevel ?? null })),
    );
    if (error) return { error: error.message };
  }

  revalidatePath(EXPERTISE_PAGE_PATH);
  return { success: "Industries updated." };
}

export async function createBookableTopic(
  _prevState: ExpertiseActionState,
  formData: FormData,
): Promise<ExpertiseActionState> {
  const supabase = await createClient();
  const { userId } = await requireOwnExpert(supabase);

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const expertiseTopicId = String(formData.get("expertise_topic_id") ?? "").trim();
  const industryId = String(formData.get("industry_id") ?? "").trim() || null;
  if (!title || !description || !expertiseTopicId) {
    return { error: "Fill in a title, description, and related expertise." };
  }

  const { count } = await supabase
    .from("expert_bookable_topics")
    .select("id", { count: "exact", head: true })
    .eq("expert_id", userId);
  if ((count ?? 0) >= EXPERTISE_LIMITS.bookableTopicsMax) {
    return { error: `You can have at most ${EXPERTISE_LIMITS.bookableTopicsMax} bookable topics.` };
  }

  const { error } = await supabase.from("expert_bookable_topics").insert({
    expert_id: userId,
    title,
    description,
    expertise_topic_id: expertiseTopicId,
    industry_id: industryId,
    sort_order: count ?? 0,
  });
  if (error) return { error: error.message };

  revalidatePath(EXPERTISE_PAGE_PATH);
  return { success: "Topic added." };
}

export async function updateBookableTopic(
  _prevState: ExpertiseActionState,
  formData: FormData,
): Promise<ExpertiseActionState> {
  const supabase = await createClient();
  const { userId } = await requireOwnExpert(supabase);

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!id || !title || !description) return { error: "Fill in a title and description." };

  const { error } = await supabase
    .from("expert_bookable_topics")
    .update({ title, description, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("expert_id", userId);
  if (error) return { error: error.message };

  revalidatePath(EXPERTISE_PAGE_PATH);
  return { success: "Topic updated." };
}

export async function toggleBookableTopicActive(formData: FormData) {
  const supabase = await createClient();
  const { userId } = await requireOwnExpert(supabase);
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  if (!id) return;

  await supabase.from("expert_bookable_topics").update({ active: !active }).eq("id", id).eq("expert_id", userId);
  revalidatePath(EXPERTISE_PAGE_PATH);
}

export async function deleteBookableTopic(formData: FormData) {
  const supabase = await createClient();
  const { userId } = await requireOwnExpert(supabase);
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("expert_bookable_topics").delete().eq("id", id).eq("expert_id", userId);
  revalidatePath(EXPERTISE_PAGE_PATH);
}

export async function reorderBookableTopics(formData: FormData) {
  const supabase = await createClient();
  const { userId } = await requireOwnExpert(supabase);
  const orderedIds = formData.getAll("ordered_ids").map(String).filter(Boolean);
  if (orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("expert_bookable_topics").update({ sort_order: index }).eq("id", id).eq("expert_id", userId),
    ),
  );
  revalidatePath(EXPERTISE_PAGE_PATH);
}

export type SuggestionActionState = { error?: string; success?: string };

export async function submitTaxonomySuggestion(
  _prevState: SuggestionActionState,
  formData: FormData,
): Promise<SuggestionActionState> {
  const supabase = await createClient();
  const { userId } = await requireOwnExpert(supabase);

  const suggestionType = String(formData.get("suggestion_type") ?? "");
  if (suggestionType !== "expertise" && suggestionType !== "industry") {
    return { error: "Invalid suggestion type." };
  }
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Enter a name for your suggestion." };
  const note = String(formData.get("note") ?? "").trim() || null;
  const contextCategoryId = String(formData.get("context_category_id") ?? "").trim() || null;
  const contextIndustryGroupId = String(formData.get("context_industry_group_id") ?? "").trim() || null;

  const { error } = await supabase.from("taxonomy_suggestions").insert({
    expert_id: userId,
    suggestion_type: suggestionType,
    name,
    note,
    context_category_id: contextCategoryId,
    context_industry_group_id: contextIndustryGroupId,
  });
  if (error) return { error: error.message };

  return { success: "Suggestion sent to admin for review." };
}
