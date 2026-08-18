"use client";

import { useActionState } from "react";
import { approveApplicationAndInvite, type ApproveApplicationState } from "@/features/acquisition/server/admin-actions";

const initialState: ApproveApplicationState = {};

export function ApproveInviteForm({ applicationId, hasEmail }: { applicationId: string; hasEmail: boolean }) {
  const [state, formAction, pending] = useActionState(approveApplicationAndInvite, initialState);

  if (!hasEmail) {
    return (
      <p className="text-sm text-black/50 dark:text-white/50">
        No email on file — collect one before an invite can be sent.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={applicationId} />
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-foreground px-4 py-1.5 text-sm text-background disabled:opacity-50"
      >
        {pending ? "Sending…" : "Approve & Send Invite"}
      </button>
      {state.success && <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p>}
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
    </form>
  );
}
