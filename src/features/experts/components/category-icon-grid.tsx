import Link from "next/link";
import { getCategoryIcon } from "@/features/experts/lib/category-visuals";

const PREVIEW_COUNT = 4;

type Subcategory = { id: string; name: string };

type CategoryDirectoryEntry = {
  id: string;
  name: string;
  tagline: string | null;
  subcategories: Subcategory[];
};

export function CategoryIconGrid({ categories }: { categories: CategoryDirectoryEntry[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const preview = category.subcategories.slice(0, PREVIEW_COUNT);
        const hasMore = category.subcategories.length > preview.length;
        const previewText = preview.map((sub) => sub.name).join(", ") + (hasMore ? ", ..." : "");
        return (
          <Link
            key={category.id}
            href={`/experts/category/${category.id}`}
            className="rounded-2xl border border-black/10 p-4 transition hover:border-black/20 hover:shadow-sm dark:border-white/15 dark:hover:border-white/25"
          >
            <span className="text-sm font-medium">{category.name}</span>
            <div className="mt-2 flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                {getCategoryIcon(category.name)}
              </div>
              {previewText && (
                <p className="text-xs leading-snug text-black/50 dark:text-white/50">{previewText}</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
