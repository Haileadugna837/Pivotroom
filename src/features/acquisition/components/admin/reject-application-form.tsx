"use client";

import { useActionState } from "react";
import { rejectExpertApplication, type RejectApplicationState } from "@/features/acquisition/server/admin-actions";

const initialState: RejectApplicationState = {};

export function RejectApplicationForm({ applicationId }: { applicationId: string }) {
  const [state, formAction, pending] = useActionState(rejectExpertApplication, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={applicationId} />
      <label className="text-xs text-pivot-muted">
        Reason (optional, shared with the applicant)
        <input
          name="reason"
          placeholder="e.g. We're not able to move forward at this time"
          className="mt-1 w-full border border-pivot-line bg-pivot-paper px-2 py-1.5 text-sm text-pivot-ink outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md border border-pivot-danger px-4 py-1.5 text-sm text-pivot-danger disabled:opacity-50"
      >
        {pending ? "Rejecting…" : "Reject application"}
      </button>
      {state.success && <p className="text-sm text-pivot-olive">{state.success}</p>}
      {state.error && <p className="text-sm text-pivot-danger">{state.error}</p>}
    </form>
  );
}
