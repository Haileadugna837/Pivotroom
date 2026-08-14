"use client";

import { useActionState } from "react";
import { applyAsExpert, type ApplyExpertState } from "@/features/experts/server/actions";
import { PhotoUploadField } from "@/features/experts/components/photo-upload-field";
import { CategoryMultiSelect } from "@/features/experts/components/category-multi-select";
import { TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from "@/lib/timezones";

type Category = { id: string; name: string; parent_id: string | null };

type ApplyFormProps = {
  categories: Category[];
  initialValues?: {
    headline: string | null;
    bio: string | null;
    category_ids: string[];
    price_per_15_min: number | null;
    payout_account_name?: string | null;
    payout_account_number?: string | null;
    photo_url?: string | null;
    timezone?: string | null;
    expectations?: string[] | null;
    example_questions?: string[] | null;
  } | null;
  extraSlot?: React.ReactNode;
  inviteToken?: string;
};

const initialState: ApplyExpertState = {};
const FORM_ID = "apply-expert-form";

export function ApplyForm({ categories, initialValues, extraSlot, inviteToken }: ApplyFormProps) {
  const isEditing = Boolean(initialValues);
  const [state, formAction, pending] = useActionState(applyAsExpert, initialState);

  return (
    <div className="flex flex-col gap-3">
      <form id={FORM_ID} action={formAction} className="flex flex-col gap-3">
      {inviteToken && <input type="hidden" name="invite_token" value={inviteToken} />}
      <PhotoUploadField initialPhotoUrl={initialValues?.photo_url} />

      <input
        name="headline"
        required
        defaultValue={initialValues?.headline ?? ""}
        placeholder="Headline (e.g. Senior Product Manager)"
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <textarea
        name="bio"
        required
        rows={4}
        defaultValue={initialValues?.bio ?? ""}
        placeholder="Short bio"
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <div>
        <p className="mb-1.5 text-sm">Categories</p>
        <CategoryMultiSelect
          categories={categories}
          name="category_ids"
          initialSelectedIds={initialValues?.category_ids ?? []}
        />
      </div>
      <label className="text-sm">
        Price per 15 minutes (ETB)
        <input
          name="price_per_15_min"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={initialValues?.price_per_15_min ?? undefined}
          placeholder="e.g. 75"
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
      </label>
      <p className="text-xs text-black/50 dark:text-white/50">
        Clients book in 15/30/45/60-minute sessions; the price scales automatically
        from this per-15-minute rate.
      </p>

      <label className="text-sm">
        Your timezone
        <select
          name="timezone"
          required
          defaultValue={initialValues?.timezone ?? DEFAULT_TIMEZONE}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-black/50 dark:text-white/50">
        The times you set under Availability are in this timezone — this is what keeps a booking
        at the time you actually meant, no matter where a client is booking from.
      </p>

      <div className="mt-2 flex flex-col gap-2 border-t border-black/10 pt-4 dark:border-white/15">
        <label className="text-sm">
          What to expect (one per line, shown on your profile)
          <textarea
            name="expectations"
            rows={4}
            defaultValue={(initialValues?.expectations ?? []).join("\n")}
            placeholder={"Ask three or more questions\nAdvice tailored to your situation\nFollow-up notes after the call"}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <label className="text-sm">
          Example questions clients might ask (one per line)
          <textarea
            name="example_questions"
            rows={4}
            defaultValue={(initialValues?.example_questions ?? []).join("\n")}
            placeholder={"What should I focus on first?\nHow do I get started?"}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
      </div>

      <div className="mt-2 flex flex-col gap-3 border-t border-black/10 pt-4 dark:border-white/15">
        <p className="text-sm font-medium">Payout bank account</p>
        <p className="text-xs text-black/50 dark:text-white/50">
          Where admin sends your payout after a session is completed.
        </p>
        <input
          name="payout_account_name"
          defaultValue={initialValues?.payout_account_name ?? ""}
          placeholder="Account holder name"
          className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          name="payout_account_number"
          defaultValue={initialValues?.payout_account_number ?? ""}
          placeholder="Account number"
          className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
      </div>

      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      </form>

      {extraSlot && (
        <div className="border-t border-black/10 pt-4 dark:border-white/15">{extraSlot}</div>
      )}

      <button
        type="submit"
        form={FORM_ID}
        disabled={pending}
        className="w-fit rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {pending ? "Saving…" : isEditing ? "Save changes" : "Submit application"}
      </button>
    </div>
  );
}
