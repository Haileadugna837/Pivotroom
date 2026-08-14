import Link from "next/link";
import { getCategoryVisual } from "@/features/experts/lib/category-visuals";

const PREVIEW_COUNT = 4;

type CategoryDirectoryEntry = {
  id: string;
  name: string;
  tagline: string | null;
  subcategories: string[];
};

export function CategoryIconGrid({ categories }: { categories: CategoryDirectoryEntry[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const visual = getCategoryVisual(category.name);
        const preview = category.subcategories.slice(0, PREVIEW_COUNT);
        return (
          <Link
            key={category.id}
            href={`/experts/search?q=${encodeURIComponent(category.name)}`}
            className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4 transition hover:border-black/20 hover:shadow-sm dark:border-white/15 dark:hover:border-white/25"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${visual.boxClassName}`}>
              {visual.icon}
            </div>
            <div>
              <p className="font-medium leading-snug">{category.name}</p>
              {preview.length > 0 && (
                <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                  {preview.join(", ")}
                  {category.subcategories.length > preview.length ? ", ..." : ""}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
