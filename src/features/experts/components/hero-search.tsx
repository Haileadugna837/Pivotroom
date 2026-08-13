"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { matchesExpertQuery, type SearchableExpert } from "@/features/experts/lib/search-match";

const MAX_RESULTS = 6;

export function HeroSearch({ experts }: { experts: SearchableExpert[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return experts.filter((e) => matchesExpertQuery(e, words)).slice(0, MAX_RESULTS);
  }, [experts, query]);

  const showDropdown = open && query.trim().length > 0;

  return (
    <div className="relative mx-auto mt-6 max-w-md">
      <form
        action="/experts/search"
        method="GET"
        className="flex items-center gap-2 rounded-full bg-white p-2 pl-5"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-black/40"
        >
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M18 18l-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search experts"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-black outline-none placeholder:text-black/40"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          Search
        </button>
      </form>

      {showDropdown && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-lg dark:border-white/15 dark:bg-neutral-900">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-black/50 dark:text-white/50">
              No experts match &quot;{query}&quot;.
            </p>
          ) : (
            <>
              {results.map((expert) => (
                <Link
                  key={expert.id}
                  href={`/experts/${expert.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {expert.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={expert.photo_url}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/10 text-xs font-semibold text-black/40 dark:bg-white/10 dark:text-white/40">
                      {(expert.profile?.full_name ?? "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-black dark:text-white">
                      {expert.profile?.full_name ?? "Expert"}
                    </p>
                    <p className="truncate text-xs text-black/50 dark:text-white/50">
                      {expert.headline ?? expert.categories?.name ?? ""}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                href={`/experts/search?q=${encodeURIComponent(query)}`}
                className="block border-t border-black/10 px-4 py-2.5 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              >
                See all results →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
