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
  pending: "text-black/50 dark:text-white/50",
  used: "text-blue-700 dark:text-blue-400",
  completed: "text-emerald-700 dark:text-emerald-400",
};

const initialState: SendInviteState = {};

export function InvitesView({ invites }: { invites: Invite[] }) {
  const [state, formAction, pending] = useActionState(sendExpertInvite, initialState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          Email to invite
          <input
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="mt-1 block w-64 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send invite"}
        </button>
      </form>
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p>}

      {invites.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No invites sent yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/15"
            >
              <div>
                <p className="font-medium">{invite.email}</p>
                <p className={`text-xs font-medium ${STATUS_STYLE[invite.status] ?? ""}`}>
                  {STATUS_LABEL[invite.status] ?? invite.status}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-black/40 dark:text-white/40">
                  Sent {new Date(invite.created_at).toLocaleDateString()}
                </span>
                {invite.status === "pending" && (
                  <form action={revokeExpertInvite}>
                    <input type="hidden" name="id" value={invite.id} />
                    <button className="text-xs text-black/50 underline hover:text-black dark:text-white/50 dark:hover:text-white">
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
