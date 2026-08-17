"use client";

type CategoryOption = { id: string; name: string; tagline: string | null };

export function CategoryCardPicker({
  categories,
  selectedId,
  onSelect,
  excludeId,
}: {
  categories: CategoryOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  excludeId?: string | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {categories
        .filter((c) => c.id !== excludeId)
        .map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              selectedId === c.id
                ? "border-foreground bg-black/5 dark:bg-white/10"
                : "border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            }`}
          >
            <p className="text-sm font-medium">{c.name}</p>
            {c.tagline && <p className="mt-1 text-xs text-black/50 dark:text-white/50">{c.tagline}</p>}
          </button>
        ))}
    </div>
  );
}
