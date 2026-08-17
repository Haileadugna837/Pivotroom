"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadExpertPhoto } from "./photo";
import { markInviteCompleted } from "./invites";
import { TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from "@/lib/timezones";
import { parseLines } from "@/lib/text";
import { EXPERTISE_LIMITS, validatePrimaryExpertise, validateSecondaryExpertise, parseJsonArray } from "./expertise";
import { getIndustryCount, type ExperienceLevel } from "./industries";
import { captureServerEvent } from "@/lib/posthog/server";

export type SubmitApplicationState = { error?: string };

type IndustrySelectionInput = { industryId: string; experienceLevel?: ExperienceLevel | null };
type BookableTopicInput = { title: string; description: string; expertiseTopicId: string; industryId?: string | null };
type SuggestionInput = {
  suggestionType: "expertise" | "industry";
  name: string;
  contextCategoryId?: string | null;
  contextIndustryGroupId?: string | null;
};

// Full 9-step onboarding submission: basic profile fields (same shape as the
// pre-existing apply flow) plus the guided primary/secondary expertise,
// industries, and bookable topics selections — all written together so a
// first-time application either lands completely or not at all from the
// applicant's point of view (each write is still sequential, matching the
// non-transactional pattern already used throughout this codebase).
export async function submitExpertApplication(
  _prevState: SubmitApplicationState,
  formData: FormData,
): Promise<SubmitApplicationState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const headline = String(formData.get("headline") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  if (!headline) return { error: "Add a headline." };
  if (!bio) return { error: "Add a short bio." };

  const primaryCategoryId = String(formData.get("primary_category_id") ?? "").trim();
  const primaryExpertiseIds = formData.getAll("primary_expertise_ids").map(String).filter(Boolean);
  const primaryError = validatePrimaryExpertise(primaryCategoryId, primaryExpertiseIds);
  if (primaryError) return { error: primaryError };

  const secondaryCategoryId = String(formData.get("secondary_category_id") ?? "").trim() || null;
  const secondaryExpertiseIds = formData.getAll("secondary_expertise_ids").map(String).filter(Boolean);
  const secondaryError = validateSecondaryExpertise(primaryCategoryId, secondaryCategoryId, secondaryExpertiseIds);
  if (secondaryError) return { error: secondaryError };

  const industries = parseJsonArray<IndustrySelectionInput>(formData.get("industries_json")).filter(
    (i) => i.industryId,
  );
  if (industries.length > EXPERTISE_LIMITS.industryMax) {
    return { error: `Select at most ${EXPERTISE_LIMITS.industryMax} industries.` };
  }
  const industryTaxonomySize = await getIndustryCount();
  if (industryTaxonomySize > 0 && industries.length === 0) {
    return { error: "Select at least one industry you have meaningful experience in." };
  }

  const bookableTopics = parseJsonArray<BookableTopicInput>(formData.get("bookable_topics_json")).filter(
    (t) => t.title.trim() && t.description.trim() && t.expertiseTopicId,
  );
  if (
    bookableTopics.length < EXPERTISE_LIMITS.bookableTopicsMin ||
    bookableTopics.length > EXPERTISE_LIMITS.bookableTopicsMax
  ) {
    return {
      error: `Add ${EXPERTISE_LIMITS.bookableTopicsMin} to ${EXPERTISE_LIMITS.bookableTopicsMax} bookable topics.`,
    };
  }

  const suggestions = parseJsonArray<SuggestionInput>(formData.get("suggestions_json")).filter((s) => s.name.trim());

  const pricePer15Min = Number(formData.get("price_per_15_min"));
  const payoutAccountName = String(formData.get("payout_account_name") ?? "").trim() || null;
  const payoutAccountNumber = String(formData.get("payout_account_number") ?? "").trim() || null;
  const timezoneInput = String(formData.get("timezone") ?? "");
  const timezone = TIMEZONE_OPTIONS.some((t) => t.value === timezoneInput) ? timezoneInput : DEFAULT_TIMEZONE;
  const expectations = parseLines(String(formData.get("expectations") ?? ""), 6);
  const exampleQuestions = parseLines(String(formData.get("example_questions") ?? ""), 6);

  const record: {
    id: string;
    headline: string;
    bio: string;
    price_per_15_min: number | null;
    currency: string;
    payout_account_name: string | null;
    payout_account_number: string | null;
    timezone: string;
    expectations: string[] | null;
    example_questions: string[] | null;
    primary_category_id: string;
    secondary_category_id: string | null;
    photo_url?: string;
  } = {
    id: user.id,
    headline,
    bio,
    price_per_15_min: Number.isFinite(pricePer15Min) ? pricePer15Min : null,
    currency: "ETB",
    payout_account_name: payoutAccountName,
    payout_account_number: payoutAccountNumber,
    timezone,
    expectations: expectations.length > 0 ? expectations : null,
    example_questions: exampleQuestions.length > 0 ? exampleQuestions : null,
    primary_category_id: primaryCategoryId,
    secondary_category_id: secondaryCategoryId,
  };

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      record.photo_url = await uploadExpertPhoto(supabase.storage, user.id, photo);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Photo upload failed." };
    }
  }

  const { error: expertError } = await supabase.from("experts").upsert(record);
  if (expertError) return { error: `Failed to save profile: ${expertError.message}` };

  const { error: deleteCategoriesError } = await supabase
    .from("expert_categories")
    .delete()
    .eq("expert_id", user.id);
  if (deleteCategoriesError) return { error: `Failed to save expertise: ${deleteCategoriesError.message}` };

  const categoryRows = [
    ...primaryExpertiseIds.map((id) => ({ expert_id: user.id, category_id: id, expertise_type: "primary" as const })),
    ...secondaryExpertiseIds.map((id) => ({
      expert_id: user.id,
      category_id: id,
      expertise_type: "secondary" as const,
    })),
  ];
  const { error: categoriesError } = await supabase.from("expert_categories").insert(categoryRows);
  if (categoriesError) return { error: `Failed to save expertise: ${categoriesError.message}` };

  const { error: deleteIndustriesError } = await supabase
    .from("expert_industries")
    .delete()
    .eq("expert_id", user.id);
  if (deleteIndustriesError) return { error: `Failed to save industries: ${deleteIndustriesError.message}` };

  if (industries.length > 0) {
    const { error: industriesError } = await supabase.from("expert_industries").insert(
      industries.map((i) => ({
        expert_id: user.id,
        industry_id: i.industryId,
        experience_level: i.experienceLevel ?? null,
      })),
    );
    if (industriesError) return { error: `Failed to save industries: ${industriesError.message}` };
  }

  const { error: deleteTopicsError } = await supabase
    .from("expert_bookable_topics")
    .delete()
    .eq("expert_id", user.id);
  if (deleteTopicsError) return { error: `Failed to save bookable topics: ${deleteTopicsError.message}` };

  const { error: topicsError } = await supabase.from("expert_bookable_topics").insert(
    bookableTopics.map((t, index) => ({
      expert_id: user.id,
      title: t.title.trim(),
      description: t.description.trim(),
      expertise_topic_id: t.expertiseTopicId,
      industry_id: t.industryId || null,
      sort_order: index,
    })),
  );
  if (topicsError) return { error: `Failed to save bookable topics: ${topicsError.message}` };

  if (suggestions.length > 0) {
    // Best-effort — a suggestion insert failing shouldn't block the whole
    // application from going through, it's a "nice to have" side channel.
    await supabase.from("taxonomy_suggestions").insert(
      suggestions.map((s) => ({
        expert_id: user.id,
        suggestion_type: s.suggestionType,
        name: s.name.trim(),
        context_category_id: s.contextCategoryId || null,
        context_industry_group_id: s.contextIndustryGroupId || null,
      })),
    );
  }

  const inviteToken = String(formData.get("invite_token") ?? "");
  if (inviteToken) {
    await markInviteCompleted(inviteToken);
  }

  await captureServerEvent(user.id, "expert_application_submitted");

  redirect("/dashboard?applied=1");
}
