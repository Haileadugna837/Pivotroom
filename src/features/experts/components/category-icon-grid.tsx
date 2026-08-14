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
    <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const preview = category.subcategories.slice(0, PREVIEW_COUNT);
        const hasMore = category.subcategories.length > preview.length;
        return (
          <div key={category.id}>
            <Link href={`/experts/category/${category.id}`} className="text-sm font-medium hover:underline">
              {category.name}
            </Link>
            <div className="mt-2 flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                {getCategoryIcon(category.name)}
              </div>
              {preview.length > 0 && (
                <p className="text-xs leading-snug text-black/50 dark:text-white/50">
                  {preview.map((sub, i) => (
                    <span key={sub.id}>
                      <Link
                        href={`/experts/category/${category.id}?sub=${sub.id}`}
                        className="hover:text-black hover:underline dark:hover:text-white"
                      >
                        {sub.name}
                      </Link>
                      {i < preview.length - 1 ? ", " : hasMore ? ", ..." : ""}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
