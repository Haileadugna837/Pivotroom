"use client";

import { useActionState } from "react";
import { acceptExpertApplication, type AcceptApplicationState } from "@/features/acquisition/server/admin-actions";

const initialState: AcceptApplicationState = {};

export function AcceptApplicationForm({ applicationId, hasAccount }: { applicationId: string; hasAccount: boolean }) {
  const [state, formAction, pending] = useActionState(acceptExpertApplication, initialState);

  if (!hasAccount) {
    return (
      <p className="text-sm text-pivot-muted">
        This application has no linked account — it predates self-serve account creation and can&apos;t be granted
        dashboard access this way.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={applicationId} />
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-pivot-ink px-4 py-1.5 text-sm text-pivot-paper disabled:opacity-50"
      >
        {pending ? "Accepting…" : "Accept application"}
      </button>
      {state.success && <p className="text-sm text-pivot-olive">{state.success}</p>}
      {state.error && <p className="text-sm text-pivot-danger">{state.error}</p>}
    </form>
  );
}
