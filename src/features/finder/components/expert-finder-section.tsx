"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import {
  FINDER_IDENTITIES,
  FINDER_PROBLEMS_BY_IDENTITY,
  type FinderOption,
} from "@/features/finder/config";
import { getDeviceType, getOrCreateFinderSessionId } from "@/features/finder/lib/device";
import {
  runExpertMatch,
  submitFinderContact,
  upsertFinderSession,
  type FinderMatchPreview,
} from "@/features/finder/server/actions";
import { formatListDisplayName } from "@/features/experts/lib/format-name";

type Category = { id: string; name: string; parent_id: string | null };

type Step = "identity" | "problem" | "category" | "matching" | "found" | "not_found" | "contact_submitted";

const OPTION_BUTTON =
  "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition hover:border-pivot-ink/30";
const OPTION_SELECTED = "border-pivot-ink bg-pivot-ink text-pivot-paper";
const OPTION_UNSELECTED = "border-pivot-line text-pivot-ink";

function OptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: FinderOption[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`${OPTION_BUTTON} ${selected === option.value ? OPTION_SELECTED : OPTION_UNSELECTED}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ExpertFinderSection({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // "Change Answers" (from the results page) links back here with the
  // session's prior selections in the URL, so the wizard opens pre-filled
  // at the category step instead of making the visitor re-answer from
  // scratch. Lazy initializers read the params once on first render —
  // no effect needed for a value that never changes after mount.
  const [identity, setIdentity] = useState<string | null>(() => searchParams.get("identity"));
  const [problem, setProblem] = useState<string | null>(() => searchParams.get("problem"));
  const [categoryId, setCategoryId] = useState<string | null>(() => searchParams.get("category"));
  const [subcategoryId, setSubcategoryId] = useState<string | null>(() => searchParams.get("subcategory"));
  const [step, setStep] = useState<Step>(() => (searchParams.get("identity") ? "category" : "identity"));
  const [matching, setMatching] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [previews, setPreviews] = useState<FinderMatchPreview[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);
  const [submittingContact, setSubmittingContact] = useState(false);

  const topLevelCategories = useMemo(() => categories.filter((c) => !c.parent_id), [categories]);
  const subcategories = useMemo(
    () => (categoryId ? categories.filter((c) => c.parent_id === categoryId) : []),
    [categories, categoryId],
  );

  const problemOptions = identity ? (FINDER_PROBLEMS_BY_IDENTITY[identity] ?? []) : [];

  function track(fields: Parameters<typeof upsertFinderSession>[0]) {
    startTransition(() => {
      upsertFinderSession(fields).catch(() => {});
    });
  }

  function handleContinueFromIdentity() {
    if (!identity) return;
    const sessionId = getOrCreateFinderSessionId();
    track({
      sessionId,
      identity,
      sourcePage: window.location.pathname,
      deviceType: getDeviceType(),
    });
    posthog.capture("finder_identity_selected", { identity });
    setStep("problem");
  }

  function handleSelectProblem(value: string) {
    setProblem(value);
    const sessionId = getOrCreateFinderSessionId();
    track({ sessionId, problem: value });
    posthog.capture("finder_problem_selected", { identity, problem: value });
    setStep("category");
  }

  async function handleFindExperts() {
    if (!categoryId) return;
    setMatching(true);
    setStep("matching");
    const sessionId = getOrCreateFinderSessionId();
    try {
      const result = await runExpertMatch({
        sessionId,
        categoryId,
        subcategoryId: subcategoryId ?? undefined,
      });
      setMatchCount(result.matchCount);
      setPreviews(result.previews);
      posthog.capture("finder_search_submitted", {
        category_id: categoryId,
        subcategory_id: subcategoryId,
        match_count: result.matchCount,
        match_status: result.matchStatus,
      });
      setStep(result.matchStatus === "experts_found" ? "found" : "not_found");
    } catch {
      setStep("not_found");
    } finally {
      setMatching(false);
    }
  }

  async function handleNotifyMe(e: React.FormEvent) {
    e.preventDefault();
    setContactError(null);
    setSubmittingContact(true);
    const sessionId = getOrCreateFinderSessionId();
    const result = await submitFinderContact(sessionId, name, phone);
    setSubmittingContact(false);
    if (result.error) {
      setContactError(result.error);
      return;
    }
    posthog.capture("finder_no_match_contact_submitted", { identity, problem, category_id: categoryId });
    setStep("contact_submitted");
  }

  function resultsHref() {
    const sessionId = getOrCreateFinderSessionId();
    const params = new URLSearchParams({ s: sessionId });
    return `/experts/results?${params.toString()}`;
  }

  return (
    <section
      id="find-expert"
      className="scroll-mt-20 rounded-3xl border border-pivot-line bg-pivot-paper-2 px-5 py-10 sm:px-10"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-pivot-ink">Find the right expert for what you need</h2>
        <p className="mt-2 text-pivot-ink-2">
          Not sure who to book? Tell us what you need help with and we&apos;ll point you to the right people.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        {step === "identity" && (
          <div>
            <p className="mb-3 text-center text-sm font-medium text-pivot-ink">Who are you?</p>
            <OptionGrid options={FINDER_IDENTITIES} selected={identity} onSelect={setIdentity} />
            <div className="mt-5 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleContinueFromIdentity}
                disabled={!identity}
                className="w-full max-w-xs rounded-full bg-pivot-ink px-6 py-3 text-sm font-medium text-pivot-paper disabled:opacity-40 sm:w-auto"
              >
                Continue
              </button>
              <Link href="/experts" className="text-sm text-pivot-muted hover:text-pivot-ink">
                Skip &amp; Browse Everyone
              </Link>
            </div>
          </div>
        )}

        {step === "problem" && (
          <div>
            <p className="mb-3 text-center text-sm font-medium text-pivot-ink">What would you like help with?</p>
            <OptionGrid options={problemOptions} selected={problem} onSelect={handleSelectProblem} />
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setStep("identity")}
                className="text-sm text-pivot-muted hover:text-pivot-ink"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {step === "category" && (
          <div>
            <p className="mb-3 text-center text-sm font-medium text-pivot-ink">
              Which area is closest to what you need?
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {topLevelCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(c.id);
                    setSubcategoryId(null);
                  }}
                  className={`${OPTION_BUTTON} text-center ${categoryId === c.id ? OPTION_SELECTED : OPTION_UNSELECTED}`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {subcategories.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-center text-xs text-pivot-muted">Optional — narrow it down</p>
                <select
                  value={subcategoryId ?? ""}
                  onChange={(e) => setSubcategoryId(e.target.value || null)}
                  className="w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
                >
                  <option value="">Any area within {topLevelCategories.find((c) => c.id === categoryId)?.name}</option>
                  {subcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-5 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleFindExperts}
                disabled={!categoryId || matching}
                className="w-full max-w-xs rounded-full bg-pivot-ink px-6 py-3 text-sm font-medium text-pivot-paper disabled:opacity-40 sm:w-auto"
              >
                Find Experts
              </button>
              <button
                type="button"
                onClick={() => setStep("problem")}
                className="text-sm text-pivot-muted hover:text-pivot-ink"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {step === "matching" && (
          <p className="py-8 text-center text-sm text-pivot-ink-2">Finding experts for you…</p>
        )}

        {step === "found" && (
          <div className="text-center">
            <p className="text-lg font-medium text-pivot-ink">
              We found {matchCount} {matchCount === 1 ? "expert" : "experts"} who can help.
            </p>
            {previews.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-4">
                {previews.map((p) => {
                  const name = formatListDisplayName(p.fullName, p.headline);
                  return (
                    <div key={p.id} className="flex w-24 flex-col items-center gap-1.5">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-pivot-paper-2 text-lg font-semibold text-pivot-muted">
                        {p.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.photoUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <p className="line-clamp-2 text-center text-xs text-pivot-ink-2">
                        {name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={() => router.push(resultsHref())}
              className="mt-6 inline-block rounded-full bg-pivot-ink px-6 py-3 text-sm font-medium text-pivot-paper"
            >
              See Your Matches →
            </button>
          </div>
        )}

        {step === "not_found" && (
          <div className="text-center">
            <p className="text-lg font-medium text-pivot-ink">We&apos;re finding the right expert for you</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-pivot-ink-2">
              We don&apos;t currently have the right expert available for this request. We&apos;ve already saved
              what you told us, so you won&apos;t need to explain it again. Leave your contact details and
              we&apos;ll reach out as soon as a suitable expert becomes available.
            </p>
            <form onSubmit={handleNotifyMe} className="mx-auto mt-5 flex max-w-xs flex-col gap-2.5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
              />
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
              />
              {contactError && <p className="text-xs text-pivot-danger">{contactError}</p>}
              <button
                type="submit"
                disabled={submittingContact}
                className="mt-1 rounded-full bg-pivot-ink px-6 py-3 text-sm font-medium text-pivot-paper disabled:opacity-50"
              >
                {submittingContact ? "Saving…" : "Notify Me"}
              </button>
            </form>
          </div>
        )}

        {step === "contact_submitted" && (
          <div className="text-center">
            <p className="text-lg font-medium text-pivot-ink">Request received</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-pivot-ink-2">
              We&apos;ve saved your request. When a suitable expert joins Pivotroom, our team will contact you
              using this number.
            </p>
            <Link
              href="/experts"
              className="mt-5 inline-block rounded-full border border-pivot-line px-6 py-3 text-sm font-medium text-pivot-ink hover:bg-pivot-paper-2"
            >
              Browse Other Experts →
            </Link>
          </div>
        )}
      </div>

      <p className="mx-auto mt-8 max-w-md text-center text-xs text-pivot-muted">
        Your selections may be saved to help us improve expert recommendations and understand what expertise
        people are looking for.
      </p>
    </section>
  );
}
