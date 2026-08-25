"use client";

import { useActionState } from "react";
import { updateExpertAsAdmin, type UpdateExpertState } from "@/features/admin/server/actions";
import { PhotoUploadField } from "@/features/experts/components/photo-upload-field";
import { CategoryMultiSelect } from "@/features/experts/components/category-multi-select";
import { TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from "@/lib/timezones";

type Category = { id: string; name: string; parent_id: string | null };

type ExpertEditFormProps = {
  expertId: string;
  categories: Category[];
  initialValues: {
    headline: string | null;
    bio: string | null;
    category_ids: string[];
    price_per_15_min: number | null;
    payout_account_name: string | null;
    payout_account_number: string | null;
    photo_url?: string | null;
    timezone?: string | null;
    expectations?: string[] | null;
    example_questions?: string[] | null;
  };
};

const initialState: UpdateExpertState = {};

export function ExpertEditForm({ expertId, categories, initialValues }: ExpertEditFormProps) {
  const [state, formAction, pending] = useActionState(updateExpertAsAdmin, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="expert_id" value={expertId} />

      <PhotoUploadField initialPhotoUrl={initialValues.photo_url} />

      <input
        name="headline"
        required
        defaultValue={initialValues.headline ?? ""}
        placeholder="Headline"
        className="border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
      />
      <textarea
        name="bio"
        required
        rows={4}
        defaultValue={initialValues.bio ?? ""}
        placeholder="Bio"
        className="border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
      />
      <div>
        <p className="mb-1.5 text-sm text-pivot-ink">Categories</p>
        <CategoryMultiSelect
          categories={categories}
          name="category_ids"
          initialSelectedIds={initialValues.category_ids}
        />
      </div>
      <label className="text-sm text-pivot-ink">
        Price per 15 minutes (ETB)
        <input
          name="price_per_15_min"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={initialValues.price_per_15_min ?? undefined}
          className="mt-1 w-full border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
        />
      </label>
      <label className="text-sm text-pivot-ink">
        Timezone
        <select
          name="timezone"
          required
          defaultValue={initialValues.timezone ?? DEFAULT_TIMEZONE}
          className="mt-1 w-full border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-2 flex flex-col gap-2 border-t border-pivot-line pt-4">
        <label className="text-sm text-pivot-ink">
          What to expect (one per line)
          <textarea
            name="expectations"
            rows={4}
            defaultValue={(initialValues.expectations ?? []).join("\n")}
            className="mt-1 w-full border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
          />
        </label>
        <label className="text-sm text-pivot-ink">
          Example questions (one per line)
          <textarea
            name="example_questions"
            rows={4}
            defaultValue={(initialValues.example_questions ?? []).join("\n")}
            className="mt-1 w-full border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
          />
        </label>
      </div>

      <div className="mt-2 flex flex-col gap-3 border-t border-pivot-line pt-4">
        <p className="text-sm font-medium text-pivot-ink">Payout bank account</p>
        <input
          name="payout_account_name"
          defaultValue={initialValues.payout_account_name ?? ""}
          placeholder="Account holder name"
          className="border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
        />
        <input
          name="payout_account_number"
          defaultValue={initialValues.payout_account_number ?? ""}
          placeholder="Account number"
          className="border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
        />
      </div>

      {state.error && <p className="text-sm text-pivot-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-pivot-ink px-4 py-2 text-sm font-medium text-pivot-paper disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
