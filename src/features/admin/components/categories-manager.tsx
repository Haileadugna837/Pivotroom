import { createCategory, deleteCategory } from "@/features/admin/server/actions";

type Category = { id: string; name: string; parent_id: string | null };

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const topLevel = categories.filter((c) => !c.parent_id);
  const childrenByParent = new Map<string, Category[]>();
  categories
    .filter((c) => c.parent_id)
    .forEach((c) => {
      const list = childrenByParent.get(c.parent_id!) ?? [];
      list.push(c);
      childrenByParent.set(c.parent_id!, list);
    });

  return (
    <div className="flex flex-col gap-6">
      <form action={createCategory} className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          Name
          <input
            name="name"
            required
            className="mt-1 block rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <label className="text-sm">
          Parent category (optional)
          <select
            name="parent_id"
            className="mt-1 block rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          >
            <option value="">None (top-level)</option>
            {topLevel.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Add
        </button>
      </form>

      {topLevel.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No categories yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {topLevel.map((parent) => (
            <li key={parent.id} className="rounded-lg border border-black/10 p-3 dark:border-white/15">
              <div className="flex items-center justify-between">
                <span className="font-medium">{parent.name}</span>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={parent.id} />
                  <button className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                    Remove
                  </button>
                </form>
              </div>
              {(childrenByParent.get(parent.id) ?? []).length > 0 && (
                <ul className="mt-2 flex flex-col gap-1 pl-4">
                  {childrenByParent.get(parent.id)!.map((child) => (
                    <li key={child.id} className="flex items-center justify-between text-sm">
                      <span>{child.name}</span>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={child.id} />
                        <button className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                          Remove
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
