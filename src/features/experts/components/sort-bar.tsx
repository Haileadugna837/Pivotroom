"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_desc", label: "Price high → low" },
  { value: "price_asc", label: "Price low → high" },
  { value: "rating_desc", label: "Highest ratings" },
  { value: "reviews_desc", label: "Most reviewed" },
] as const;

export function SortBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "recommended";

  return (
    <div className="mb-8 flex items-center justify-between border-b border-pivot-line pb-4">
      <Link href="/experts" className="text-sm text-pivot-muted hover:text-pivot-ink">
        Reset
      </Link>
      <label className="flex items-center gap-2 text-sm text-pivot-ink">
        Sort by
        <select
          value={current}
          onChange={(e) => {
            const value = e.target.value;
            router.push(value === "recommended" ? "/experts" : `/experts?sort=${value}`);
          }}
          className="rounded-md border border-pivot-line bg-transparent px-2 py-1.5 text-sm text-pivot-ink"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
