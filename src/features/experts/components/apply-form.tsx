import { applyAsExpert } from "@/features/experts/server/actions";

type Category = { id: string; name: string };

export function ApplyForm({ categories }: { categories: Category[] }) {
  return (
    <form action={applyAsExpert} className="flex flex-col gap-3">
      <input
        name="headline"
        required
        placeholder="Headline (e.g. Senior Product Manager)"
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <textarea
        name="bio"
        required
        rows={4}
        placeholder="Short bio"
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <select
        name="category_id"
        required
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      >
        <option value="">Select a category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="flex gap-3">
        <input
          name="session_rate"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="Session rate (USD)"
          className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          name="session_duration_minutes"
          type="number"
          min="15"
          step="5"
          defaultValue={30}
          placeholder="Duration (min)"
          className="w-40 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Submit application
      </button>
    </form>
  );
}
