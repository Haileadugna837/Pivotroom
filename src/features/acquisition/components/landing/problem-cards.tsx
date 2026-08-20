"use client";

import { useState } from "react";
import { PROBLEM_CARDS, type ProblemCard } from "@/features/acquisition/config";
import { getMatchingExpertsForCategoryKey } from "@/features/acquisition/server/actions";
import type { ExpertPreviewCard } from "@/features/acquisition/server/queries";

type ResultsState =
  | { status: "idle" }
  | { status: "loading"; card: ProblemCard }
  | { status: "loaded"; card: ProblemCard; experts: ExpertPreviewCard[] };

export function AcquisitionProblemCards({
  onCardClicked,
  onJoinEarlyAccess,
}: {
  onCardClicked: (card: ProblemCard) => void;
  onJoinEarlyAccess: (card: ProblemCard) => void;
}) {
  const [results, setResults] = useState<ResultsState>({ status: "idle" });

  async function handleClick(card: ProblemCard) {
    onCardClicked(card);
    if (card.opensNomination) return;

    setResults({ status: "loading", card });
    const experts = card.categoryKey ? await getMatchingExpertsForCategoryKey(card.categoryKey) : [];
    setResults({ status: "loaded", card, experts });
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h2 className="text-center text-2xl font-semibold sm:text-3xl">What are you trying to figure out?</h2>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PROBLEM_CARDS.map((card) => {
          const active = results.status !== "idle" && results.card.key === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => handleClick(card)}
              className={`rounded-xl border px-4 py-5 text-left text-sm font-medium transition-colors ${
                active
                  ? "border-foreground bg-black/5 dark:bg-white/10"
                  : "border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              }`}
            >
              {card.label}
            </button>
          );
        })}
      </div>

      {results.status === "loading" && (
        <p className="mt-8 text-center text-sm text-black/50 dark:text-white/50">
          Looking for people who can help…
        </p>
      )}

      {results.status === "loaded" && (
        <div className="mt-8 rounded-2xl border border-black/10 p-6 text-center dark:border-white/15">
          {results.experts.length > 0 ? (
            <>
              <p className="text-sm font-medium">People who can help with this</p>
              <div className="mx-auto mt-5 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
                {results.experts.map((expert) => (
                  <div key={expert.id} className="flex flex-col items-center gap-2">
                    {expert.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={expert.photoUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/5 text-base font-semibold dark:bg-white/10">
                        {expert.name.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="truncate text-sm font-medium">{expert.name}</p>
                      {expert.headline && (
                        <p className="mt-0.5 truncate text-xs text-black/50 dark:text-white/50">{expert.headline}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-black/60 dark:text-white/60">
              We&apos;re currently recruiting experts for this. Join early and we&apos;ll notify you.
            </p>
          )}
          <button
            type="button"
            onClick={() => onJoinEarlyAccess(results.card)}
            className="mt-6 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background"
          >
            Join Early Access
          </button>
        </div>
      )}
    </section>
  );
}
