"use client";

import { useActionState } from "react";
import { applyAsExpert, type ApplyExpertState } from "@/features/experts/server/actions";
import { PhotoUploadField } from "@/features/experts/components/photo-upload-field";
import { TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from "@/lib/timezones";

type ApplyFormProps = {
  initialValues?: {
    headline: string | null;
    bio: string | null;
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

export function ApplyForm({ initialValues, extraSlot, inviteToken }: ApplyFormProps) {
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
        className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
      />
      <textarea
        name="bio"
        required
        rows={4}
        defaultValue={initialValues?.bio ?? ""}
        placeholder="Short bio"
        className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
      />
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
          className="mt-1 w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
        />
      </label>
      <p className="text-xs text-pivot-muted">
        Clients book in 15/30/45/60-minute sessions; the price scales automatically
        from this per-15-minute rate.
      </p>

      <label className="text-sm">
        Your timezone
        <select
          name="timezone"
          required
          defaultValue={initialValues?.timezone ?? DEFAULT_TIMEZONE}
          className="mt-1 w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-pivot-muted">
        The times you set under Availability are in this timezone — this is what keeps a booking
        at the time you actually meant, no matter where a client is booking from.
      </p>

      <div className="mt-2 flex flex-col gap-2 border-t border-pivot-line pt-4">
        <label className="text-sm">
          What to expect (one per line, shown on your profile)
          <textarea
            name="expectations"
            rows={4}
            defaultValue={(initialValues?.expectations ?? []).join("\n")}
            placeholder={"Ask three or more questions\nAdvice tailored to your situation\nFollow-up notes after the call"}
            className="mt-1 w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
          />
        </label>
        <label className="text-sm">
          Example questions clients might ask (one per line)
          <textarea
            name="example_questions"
            rows={4}
            defaultValue={(initialValues?.example_questions ?? []).join("\n")}
            placeholder={"What should I focus on first?\nHow do I get started?"}
            className="mt-1 w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
          />
        </label>
      </div>

      <div className="mt-2 flex flex-col gap-3 border-t border-pivot-line pt-4">
        <p className="text-sm font-medium text-pivot-ink">Payout bank account</p>
        <p className="text-xs text-pivot-muted">
          Where admin sends your payout after a session is completed.
        </p>
        <input
          name="payout_account_name"
          defaultValue={initialValues?.payout_account_name ?? ""}
          placeholder="Account holder name"
          className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
        />
        <input
          name="payout_account_number"
          defaultValue={initialValues?.payout_account_number ?? ""}
          placeholder="Account number"
          className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
        />
      </div>

      {state.error && <p className="text-sm text-pivot-danger">{state.error}</p>}
      </form>

      {extraSlot && (
        <div className="border-t border-pivot-line pt-4">{extraSlot}</div>
      )}

      <button
        type="submit"
        form={FORM_ID}
        disabled={pending}
        className="w-fit rounded-md bg-pivot-ink px-4 py-2 text-sm font-medium text-pivot-paper disabled:opacity-50"
      >
        {pending ? "Saving…" : isEditing ? "Save changes" : "Submit application"}
      </button>
    </div>
  );
}
