"use client";

import { useMemo, useState } from "react";

type Category = { id: string; name: string; parent_id: string | null };

type CategoryMultiSelectProps = {
  categories: Category[];
  name: string;
  initialSelectedIds?: string[];
};

const MAX_MATCHES = 8;

export function CategoryMultiSelect({ categories, name, initialSelectedIds = [] }: CategoryMultiSelectProps) {
  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return categories
      .filter((c) => !selectedIds.includes(c.id) && c.name.toLowerCase().includes(q))
      .slice(0, MAX_MATCHES);
  }, [categories, query, selectedIds]);

  function addCategory(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setQuery("");
  }

  function removeCategory(id: string) {
    setSelectedIds((prev) => prev.filter((existing) => existing !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (matches.length > 0) addCategory(matches[0].id);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedIds.map((id) => {
            const category = categoryById.get(id);
            if (!category) return null;
            return (
              <span
                key={id}
                className="flex items-center gap-1 rounded-full bg-pivot-ink px-3 py-1 text-xs font-medium text-pivot-paper"
              >
                {category.name}
                <button
                  type="button"
                  onClick={() => removeCategory(id)}
                  aria-label={`Remove ${category.name}`}
                  className="ml-0.5 text-pivot-paper/70 hover:text-pivot-paper"
                >
                  ×
                </button>
                <input type="hidden" name={name} value={id} />
              </span>
            );
          })}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search a category, press Enter to add it"
          className="w-full border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
        />
        {matches.length > 0 && (
          <ul className="absolute inset-x-0 top-[calc(100%+4px)] z-10 max-h-56 overflow-y-auto rounded-md border border-pivot-line bg-pivot-white text-sm shadow-lg">
            {matches.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => addCategory(c.id)}
                  className="block w-full px-3 py-2 text-left text-pivot-ink hover:bg-pivot-paper-2"
                >
                  {c.name}
                  {c.parent_id && (
                    <span className="ml-1 text-xs text-pivot-muted">
                      under {categoryById.get(c.parent_id)?.name}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
