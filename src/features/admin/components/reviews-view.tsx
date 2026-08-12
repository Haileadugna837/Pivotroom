"use client";

import { useMemo, useState } from "react";
import { toggleReviewVisibility } from "@/features/admin/server/actions";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  hidden: boolean;
  created_at: string;
  expert_id: string;
  client_id: string;
  clientName: string;
  expertName: string;
};

export function ReviewsView({ reviews }: { reviews: Review[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) => r.expertName.toLowerCase().includes(q));
  }, [reviews, query]);

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by expert name…"
        className="w-full max-w-sm rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />

      <p className="text-xs text-black/50 dark:text-white/50">
        {results.length} {results.length === 1 ? "review" : "reviews"}
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No reviews found.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {results.map((r) => (
            <li key={r.id} className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {r.expertName} <span className="font-normal text-black/50 dark:text-white/50">— reviewed by {r.clientName}</span>
                  </p>
                  <p className="mt-1">{r.rating} ★</p>
                  {r.comment && <p className="mt-1 text-black/70 dark:text-white/70">{r.comment}</p>}
                  <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <form action={toggleReviewVisibility}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="expert_id" value={r.expert_id} />
                  <input type="hidden" name="hidden" value={String(r.hidden)} />
                  <button
                    type="submit"
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                      r.hidden
                        ? "border-black/10 dark:border-white/15"
                        : "border-black/10 text-black/60 dark:border-white/15 dark:text-white/60"
                    }`}
                  >
                    {r.hidden ? "Show publicly" : "Hide"}
                  </button>
                </form>
              </div>
              {r.hidden && (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                  Hidden — not shown on this expert&apos;s public profile.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
