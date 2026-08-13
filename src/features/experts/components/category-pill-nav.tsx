type Category = { id: string; name: string };

export function CategoryPillNav({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((c) => (
        <a
          key={c.id}
          href={`#category-${c.id}`}
          className="shrink-0 rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          {c.name}
        </a>
      ))}
    </div>
  );
}
