"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExpertCard } from "@/features/experts/components/expert-card";

type SearchableExpert = {
  id: string;
  headline: string | null;
  bio: string | null;
  price_per_15_min: number | null;
  currency: string;
  photo_url: string | null;
  categories: { name: string } | null;
  profile: { full_name: string | null } | null;
};

function matchesQuery(expert: SearchableExpert, words: string[]) {
  const haystack = [
    expert.profile?.full_name,
    expert.headline,
    expert.bio,
    expert.categories?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return words.every((word) => haystack.includes(word));
}

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
    return experts.filter((e) => matchesQuery(e, words));
  }, [experts, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/experts"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
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
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"
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
            className="w-full rounded-full border border-black/10 bg-transparent py-2.5 pl-9 pr-4 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/40"
          />
        </div>
      </div>

      <p className="mb-4 text-sm text-black/50 dark:text-white/50">
        {results.length} {results.length === 1 ? "expert" : "experts"} found
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">No experts match your search.</p>
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
              categoryName={expert.categories?.name ?? null}
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
