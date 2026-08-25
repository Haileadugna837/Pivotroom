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
        className="w-full max-w-sm rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
      />

      <p className="text-xs text-pivot-muted">
        {results.length} {results.length === 1 ? "review" : "reviews"}
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-pivot-muted">No reviews found.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {results.map((r) => (
            <li key={r.id} className="rounded-lg border border-pivot-line bg-pivot-white p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-pivot-ink">
                    {r.expertName} <span className="font-normal text-pivot-muted">— reviewed by {r.clientName}</span>
                  </p>
                  <p className="mt-1 text-pivot-ink">{r.rating} ★</p>
                  {r.comment && <p className="mt-1 text-pivot-ink-2">{r.comment}</p>}
                  <p className="mt-1 text-xs text-pivot-muted">
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
                        ? "border-pivot-line text-pivot-ink"
                        : "border-pivot-line text-pivot-ink-2"
                    }`}
                  >
                    {r.hidden ? "Show publicly" : "Hide"}
                  </button>
                </form>
              </div>
              {r.hidden && (
                <p className="mt-2 text-xs text-pivot-accent">
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
