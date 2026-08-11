import { updateExpertAsAdmin } from "@/features/admin/server/actions";

type Category = { id: string; name: string; parent_id: string | null };

type ExpertEditFormProps = {
  expertId: string;
  categories: Category[];
  initialValues: {
    headline: string | null;
    bio: string | null;
    category_id: string | null;
    price_per_15_min: number | null;
    payout_account_name: string | null;
    payout_account_number: string | null;
  };
};

export function ExpertEditForm({ expertId, categories, initialValues }: ExpertEditFormProps) {
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
    <form action={updateExpertAsAdmin} className="flex flex-col gap-3">
      <input type="hidden" name="expert_id" value={expertId} />
      <input
        name="headline"
        required
        defaultValue={initialValues.headline ?? ""}
        placeholder="Headline"
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <textarea
        name="bio"
        required
        rows={4}
        defaultValue={initialValues.bio ?? ""}
        placeholder="Bio"
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <select
        name="category_id"
        required
        defaultValue={initialValues.category_id ?? ""}
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      >
        <option value="">Select a category</option>
        {topLevel.map((parent) => (
          <optgroup key={parent.id} label={parent.name}>
            <option value={parent.id}>{parent.name}</option>
            {(childrenByParent.get(parent.id) ?? []).map((child) => (
              <option key={child.id} value={child.id}>
                — {child.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <label className="text-sm">
        Price per 15 minutes (ETB)
        <input
          name="price_per_15_min"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={initialValues.price_per_15_min ?? undefined}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
      </label>
      <div className="mt-2 flex flex-col gap-3 border-t border-black/10 pt-4 dark:border-white/15">
        <p className="text-sm font-medium">Payout bank account</p>
        <input
          name="payout_account_name"
          defaultValue={initialValues.payout_account_name ?? ""}
          placeholder="Account holder name"
          className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          name="payout_account_number"
          defaultValue={initialValues.payout_account_number ?? ""}
          placeholder="Account number"
          className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
      </div>
      <button
        type="submit"
        className="w-fit rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Save changes
      </button>
    </form>
  );
}
