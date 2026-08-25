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
              selectedId === c.id ? "border-pivot-ink bg-pivot-paper-2" : "border-pivot-line hover:bg-pivot-paper-2"
            }`}
          >
            <p className="text-sm font-medium text-pivot-ink">{c.name}</p>
            {c.tagline && <p className="mt-1 text-xs text-pivot-muted">{c.tagline}</p>}
          </button>
        ))}
    </div>
  );
}
