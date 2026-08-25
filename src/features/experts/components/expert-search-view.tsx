"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExpertCard } from "@/features/experts/components/expert-card";
import { matchesExpertQuery, type SearchableExpert } from "@/features/experts/lib/search-match";

type ExpertSearchViewProps = {
  experts: SearchableExpert[];
  wishlistedIds: string[];
  donatingIds: string[];
  isSignedIn: boolean;
  initialQuery?: string;
};

export function ExpertSearchView({
  experts,
  wishlistedIds,
  donatingIds,
  isSignedIn,
  initialQuery = "",
}: ExpertSearchViewProps) {
  const wishlistedSet = useMemo(() => new Set(wishlistedIds), [wishlistedIds]);
  const donatingSet = useMemo(() => new Set(donatingIds), [donatingIds]);
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return experts;
    return experts.filter((e) => matchesExpertQuery(e, words));
  }, [experts, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/experts"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-pivot-ink hover:bg-pivot-paper-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M12 4l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div className="relative flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pivot-muted"
          >
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.7" />
            <path d="M18 18l-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, headline, or category"
            autoFocus
            className="w-full rounded-full border border-pivot-line bg-pivot-paper py-2.5 pl-9 pr-4 text-sm text-pivot-ink outline-none focus:border-pivot-ink/30"
          />
        </div>
      </div>

      <p className="mb-4 text-sm text-pivot-muted">
        {results.length} {results.length === 1 ? "expert" : "experts"} found
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-pivot-ink-2">No experts match your search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((expert) => (
            <ExpertCard
              key={expert.id}
              expertId={expert.id}
              href={`/experts/${expert.id}`}
              headline={expert.headline}
              bio={expert.bio}
              pricePer15Min={expert.price_per_15_min}
              currency={expert.currency}
              fullName={expert.profile?.full_name ?? null}
              photoUrl={expert.photo_url}
              wishlisted={wishlistedSet.has(expert.id)}
              isSignedIn={isSignedIn}
              donatesToNgo={donatingSet.has(expert.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
