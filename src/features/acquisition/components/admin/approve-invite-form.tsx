"use client";

import { useActionState } from "react";
import { approveApplicationAndInvite, type ApproveApplicationState } from "@/features/acquisition/server/admin-actions";

const initialState: ApproveApplicationState = {};

export function ApproveInviteForm({ applicationId, hasEmail }: { applicationId: string; hasEmail: boolean }) {
  const [state, formAction, pending] = useActionState(approveApplicationAndInvite, initialState);

  if (!hasEmail) {
    return (
      <p className="text-sm text-pivot-muted">
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
        className="w-fit rounded-md bg-pivot-ink px-4 py-1.5 text-sm text-pivot-paper disabled:opacity-50"
      >
        {pending ? "Sending…" : "Approve & Send Invite"}
      </button>
      {state.success && <p className="text-sm text-pivot-olive">{state.success}</p>}
      {state.error && <p className="text-sm text-pivot-danger">{state.error}</p>}
    </form>
  );
}
