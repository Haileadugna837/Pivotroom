"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { submitExpertApplication, type SubmitApplicationState } from "@/features/experts/server/onboarding-actions";
import { PhotoUploadField } from "@/features/experts/components/photo-upload-field";
import { CategoryCardPicker } from "@/features/experts/components/category-card-picker";
import { ExpertiseChipPicker } from "@/features/experts/components/expertise-chip-picker";
import { IndustryPicker, type IndustrySelection } from "@/features/experts/components/industry-picker";
import { BookableTopicsEditor, type BookableTopicDraft } from "@/features/experts/components/bookable-topics-editor";
import { TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from "@/lib/timezones";
import type { ExpertiseCategoryGroup } from "@/features/experts/server/expertise";
import type { IndustryGroupWithIndustries } from "@/features/experts/server/industries";

type Suggestion = {
  suggestionType: "expertise" | "industry";
  name: string;
  contextCategoryId: string | null;
  contextIndustryGroupId: string | null;
};

const TOTAL_STEPS = 9;
const initialState: SubmitApplicationState = {};

const STEP_META: Record<number, { title: string; help: string }> = {
  1: { title: "Basic information", help: "Your headline is the first thing clients see." },
  2: { title: "Professional background", help: "Tell clients about your experience." },
  3: {
    title: "What are you mainly known for?",
    help: "Choose the area where you have the strongest professional experience. This will be your primary area of expertise.",
  },
  4: {
    title: "What can people specifically come to you for?",
    help: "Choose the topics where you have substantial real-world experience.",
  },
  5: {
    title: "Do you have significant expertise in another area?",
    help: "Only add a second category if you have substantial professional experience in it.",
  },
  6: {
    title: "Which industries do you have meaningful experience in?",
    help: "Select industries where you have worked, operated a business, advised organizations, invested, or developed substantial professional experience.",
  },
  7: {
    title: "What can someone book you to discuss?",
    help: "Create specific consultation topics clients can book.",
  },
  8: { title: "Pricing & payout", help: "Set your rate and where we send your payout." },
  9: { title: "Review your profile", help: "Check everything before submitting for review." },
};

export function ExpertOnboardingWizard({
  categoryTree,
  industryGroups,
  inviteToken,
}: {
  categoryTree: ExpertiseCategoryGroup[];
  industryGroups: IndustryGroupWithIndustries[];
  inviteToken: string;
}) {
  const [step, setStep] = useState(1);
  const [state, formAction, pending] = useActionState(submitExpertApplication, initialState);
  const [stepError, setStepError] = useState<string | null>(null);

  const headlineRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);

  const [primaryCategoryId, setPrimaryCategoryId] = useState<string | null>(null);
  const [primaryExpertiseIds, setPrimaryExpertiseIds] = useState<string[]>([]);
  const [wantsSecondary, setWantsSecondary] = useState<boolean | null>(null);
  const [secondaryCategoryId, setSecondaryCategoryId] = useState<string | null>(null);
  const [secondaryExpertiseIds, setSecondaryExpertiseIds] = useState<string[]>([]);
  const [industries, setIndustries] = useState<IndustrySelection[]>([]);
  const [bookableTopics, setBookableTopics] = useState<BookableTopicDraft[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const primaryCategory = categoryTree.find((c) => c.id === primaryCategoryId) ?? null;
  const secondaryCategory = categoryTree.find((c) => c.id === secondaryCategoryId) ?? null;
  const allIndustries = useMemo(() => industryGroups.flatMap((g) => g.industries), [industryGroups]);
  const expertiseOptionsForTopics = useMemo(() => {
    const primaryOptions = primaryCategory?.subcategories.filter((s) => primaryExpertiseIds.includes(s.id)) ?? [];
    const secondaryOptions =
      secondaryCategory?.subcategories.filter((s) => secondaryExpertiseIds.includes(s.id)) ?? [];
    return [...primaryOptions, ...secondaryOptions];
  }, [primaryCategory, primaryExpertiseIds, secondaryCategory, secondaryExpertiseIds]);

  function addSuggestion(
    type: "expertise" | "industry",
    name: string,
    contextCategoryId: string | null = null,
    contextIndustryGroupId: string | null = null,
  ) {
    setSuggestions((prev) => [...prev, { suggestionType: type, name, contextCategoryId, contextIndustryGroupId }]);
  }

  function next() {
    setStepError(null);
    if (step === 1 && !headlineRef.current?.value.trim()) return setStepError("Add a headline.");
    if (step === 2 && !bioRef.current?.value.trim()) return setStepError("Add a short bio.");
    if (step === 3 && !primaryCategoryId) return setStepError("Select your primary expertise category.");
    if (step === 4 && (primaryExpertiseIds.length < 2 || primaryExpertiseIds.length > 6)) {
      return setStepError("Select 2 to 6 specific expertise areas.");
    }
    if (
      step === 5 &&
      wantsSecondary &&
      secondaryCategoryId &&
      (secondaryExpertiseIds.length < 1 || secondaryExpertiseIds.length > 3)
    ) {
      return setStepError("Select 1 to 3 specific expertise areas for your secondary category.");
    }
    if (step === 7 && (bookableTopics.length < 1 || bookableTopics.length > 6)) {
      return setStepError("Add at least 1 bookable topic (up to 6).");
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
          Step {step} of {TOTAL_STEPS}
        </p>
        <div className="h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">{STEP_META[step].title}</h2>
        <p className="mt-1 text-sm text-black/50 dark:text-white/50">{STEP_META[step].help}</p>
      </div>

      {/* Every step stays mounted (hidden via CSS, not unmounted) so the
          uncontrolled photo file input and text fields keep their values
          when navigating between steps — this is all one <form>, submitted
          once on the final step. */}
      <div className={step === 1 ? "flex flex-col gap-3" : "hidden"}>
        <PhotoUploadField />
        <input
          ref={headlineRef}
          name="headline"
          defaultValue=""
          placeholder="Headline (e.g. Senior Product Manager)"
          className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
      </div>

      <div className={step === 2 ? "" : "hidden"}>
        <textarea
          ref={bioRef}
          name="bio"
          defaultValue=""
          rows={5}
          placeholder="Short bio"
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
      </div>

      <div className={step === 3 ? "" : "hidden"}>
        <CategoryCardPicker
          categories={categoryTree}
          selectedId={primaryCategoryId}
          onSelect={(id) => {
            if (id !== primaryCategoryId) setPrimaryExpertiseIds([]);
            setPrimaryCategoryId(id);
          }}
        />
      </div>

      <div className={step === 4 ? "" : "hidden"}>
        {primaryCategory && (
          <ExpertiseChipPicker
            options={primaryCategory.subcategories}
            selectedIds={primaryExpertiseIds}
            onChange={setPrimaryExpertiseIds}
            min={2}
            max={6}
            onSuggest={(name) => addSuggestion("expertise", name, primaryCategoryId)}
          />
        )}
      </div>

      <div className={step === 5 ? "flex flex-col gap-4" : "hidden"}>
        {wantsSecondary === null && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWantsSecondary(true)}
              className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/15"
            >
              Add secondary expertise
            </button>
            <button
              type="button"
              onClick={() => {
                setWantsSecondary(false);
                setSecondaryCategoryId(null);
                setSecondaryExpertiseIds([]);
              }}
              className="rounded-md border border-black/10 px-4 py-2 text-sm dark:border-white/15"
            >
              Skip for now
            </button>
          </div>
        )}
        {wantsSecondary && (
          <>
            <CategoryCardPicker
              categories={categoryTree}
              selectedId={secondaryCategoryId}
              excludeId={primaryCategoryId}
              onSelect={(id) => {
                if (id !== secondaryCategoryId) setSecondaryExpertiseIds([]);
                setSecondaryCategoryId(id);
              }}
            />
            {secondaryCategory && (
              <ExpertiseChipPicker
                options={secondaryCategory.subcategories}
                selectedIds={secondaryExpertiseIds}
                onChange={setSecondaryExpertiseIds}
                min={1}
                max={3}
                onSuggest={(name) => addSuggestion("expertise", name, secondaryCategoryId)}
              />
            )}
            <button
              type="button"
              onClick={() => {
                setWantsSecondary(false);
                setSecondaryCategoryId(null);
                setSecondaryExpertiseIds([]);
              }}
              className="w-fit text-xs text-black/50 underline dark:text-white/50"
            >
              Remove secondary expertise
            </button>
          </>
        )}
      </div>

      <div className={step === 6 ? "" : "hidden"}>
        <IndustryPicker
          groups={industryGroups}
          selections={industries}
          onChange={setIndustries}
          max={8}
          onSuggest={(name) => addSuggestion("industry", name, null, industryGroups[0]?.id ?? null)}
        />
      </div>

      <div className={step === 7 ? "" : "hidden"}>
        <BookableTopicsEditor
          topics={bookableTopics}
          onChange={setBookableTopics}
          expertiseOptions={expertiseOptionsForTopics}
          industryOptions={allIndustries}
          min={1}
          max={6}
        />
      </div>

      <div className={step === 8 ? "flex flex-col gap-3" : "hidden"}>
        <label className="text-sm">
          Price per 15 minutes (ETB)
          <input
            name="price_per_15_min"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 75"
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <label className="text-sm">
          Your timezone
          <select
            name="timezone"
            defaultValue={DEFAULT_TIMEZONE}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          What to expect (one per line, shown on your profile)
          <textarea
            name="expectations"
            rows={4}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <label className="text-sm">
          Example questions clients might ask (one per line)
          <textarea
            name="example_questions"
            rows={4}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <div className="mt-2 flex flex-col gap-2 border-t border-black/10 pt-4 dark:border-white/15">
          <p className="text-sm font-medium">Payout bank account</p>
          <input
            name="payout_account_name"
            placeholder="Account holder name"
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
          <input
            name="payout_account_number"
            placeholder="Account number"
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </div>
      </div>

      <div className={step === 9 ? "flex flex-col gap-4 text-sm" : "hidden"}>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
            Primary Expertise
          </p>
          <p>{primaryCategory?.name ?? "—"}</p>
          <p className="text-black/60 dark:text-white/60">
            {primaryCategory?.subcategories
              .filter((s) => primaryExpertiseIds.includes(s.id))
              .map((s) => s.name)
              .join(", ") || "—"}
          </p>
        </div>
        {secondaryCategoryId && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
              Secondary Expertise
            </p>
            <p>{secondaryCategory?.name}</p>
            <p className="text-black/60 dark:text-white/60">
              {secondaryCategory?.subcategories
                .filter((s) => secondaryExpertiseIds.includes(s.id))
                .map((s) => s.name)
                .join(", ")}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
            Industry Experience
          </p>
          <p className="text-black/60 dark:text-white/60">
            {industries
              .map((sel) => allIndustries.find((i) => i.id === sel.industryId)?.name)
              .filter(Boolean)
              .join(", ") || "None selected"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
            Bookable Topics
          </p>
          <ul className="list-disc pl-4 text-black/60 dark:text-white/60">
            {bookableTopics.map((t, i) => (
              <li key={i}>{t.title}</li>
            ))}
          </ul>
        </div>
      </div>

      {stepError && <p className="text-sm text-red-600 dark:text-red-400">{stepError}</p>}
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

      <input type="hidden" name="invite_token" value={inviteToken} />
      <input type="hidden" name="primary_category_id" value={primaryCategoryId ?? ""} />
      {primaryExpertiseIds.map((id) => (
        <input key={id} type="hidden" name="primary_expertise_ids" value={id} />
      ))}
      <input type="hidden" name="secondary_category_id" value={secondaryCategoryId ?? ""} />
      {secondaryExpertiseIds.map((id) => (
        <input key={id} type="hidden" name="secondary_expertise_ids" value={id} />
      ))}
      <input type="hidden" name="industries_json" value={JSON.stringify(industries)} />
      <input
        type="hidden"
        name="bookable_topics_json"
        value={JSON.stringify(
          bookableTopics.map((t) => ({
            title: t.title,
            description: t.description,
            expertiseTopicId: t.expertiseTopicId,
            industryId: t.industryId,
          })),
        )}
      />
      <input type="hidden" name="suggestions_json" value={JSON.stringify(suggestions)} />

      <div className="flex justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={back}
            className="rounded-md border border-black/10 px-4 py-2 text-sm dark:border-white/15"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={next}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {pending ? "Submitting…" : "Submit application"}
          </button>
        )}
      </div>
    </form>
  );
}
