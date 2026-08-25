"use client";

import { useActionState } from "react";
import { sendExpertInvite, revokeExpertInvite, type SendInviteState } from "@/features/admin/server/actions";

type Invite = {
  id: string;
  email: string;
  status: string;
  created_at: string;
  used_at: string | null;
  completed_at: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Sent — not opened yet",
  used: "Opened — applying",
  completed: "Application submitted",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "text-pivot-muted",
  used: "text-pivot-accent",
  completed: "text-pivot-olive",
};

const initialState: SendInviteState = {};

export function InvitesView({ invites }: { invites: Invite[] }) {
  const [state, formAction, pending] = useActionState(sendExpertInvite, initialState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-wrap items-end gap-2">
        <label className="text-sm text-pivot-ink">
          Email to invite
          <input
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="mt-1 block w-64 rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-pivot-ink px-4 py-2 text-sm font-medium text-pivot-paper disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send invite"}
        </button>
      </form>
      {state.error && <p className="text-sm text-pivot-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-pivot-olive">{state.success}</p>}

      {invites.length === 0 ? (
        <p className="text-sm text-pivot-muted">No invites sent yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-pivot-line bg-pivot-white px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-pivot-ink">{invite.email}</p>
                <p className={`text-xs font-medium ${STATUS_STYLE[invite.status] ?? ""}`}>
                  {STATUS_LABEL[invite.status] ?? invite.status}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-pivot-muted">
                  Sent {new Date(invite.created_at).toLocaleDateString()}
                </span>
                {invite.status === "pending" && (
                  <form action={revokeExpertInvite}>
                    <input type="hidden" name="id" value={invite.id} />
                    <button className="text-xs text-pivot-muted underline hover:text-pivot-ink">
                      Revoke
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
