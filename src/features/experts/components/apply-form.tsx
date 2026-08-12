"use client";

import { useActionState } from "react";
import { applyAsExpert, type ApplyExpertState } from "@/features/experts/server/actions";
import { PhotoUploadField } from "@/features/experts/components/photo-upload-field";

type Category = { id: string; name: string; parent_id: string | null };

type ApplyFormProps = {
  categories: Category[];
  initialValues?: {
    headline: string | null;
    bio: string | null;
    category_id: string | null;
    price_per_15_min: number | null;
    payout_account_name?: string | null;
    payout_account_number?: string | null;
    photo_url?: string | null;
  } | null;
  extraSlot?: React.ReactNode;
  inviteToken?: string;
};

const initialState: ApplyExpertState = {};
const FORM_ID = "apply-expert-form";

export function ApplyForm({ categories, initialValues, extraSlot, inviteToken }: ApplyFormProps) {
  const isEditing = Boolean(initialValues);
  const [state, formAction, pending] = useActionState(applyAsExpert, initialState);

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
      <select
        name="category_id"
        required
        defaultValue={initialValues?.category_id ?? ""}
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
          defaultValue={initialValues?.price_per_15_min ?? undefined}
          placeholder="e.g. 75"
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
      </label>
      <p className="text-xs text-black/50 dark:text-white/50">
        Clients book in 15/30/45/60-minute sessions; the price scales automatically
        from this per-15-minute rate.
      </p>

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
