"use client";

import { useActionState } from "react";
import { updateEmail, updatePassword, type SettingsActionState } from "@/features/auth/server/actions";

const initialState: SettingsActionState = {};

function StatusMessage({ state }: { state: SettingsActionState }) {
  if (state.error) return <p className="text-sm text-pivot-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-pivot-olive">{state.success}</p>;
  return null;
}

export function AccountSettingsForms({
  currentEmail,
  hasPasswordIdentity,
  title,
}: {
  currentEmail: string;
  hasPasswordIdentity: boolean;
  /** When set, renders as a labeled section (no own top border/margin) instead
   * of the default self-contained block with its own separator — for pages
   * that already provide section spacing/labeling around this component. */
  title?: string;
}) {
  const [emailState, emailAction, emailPending] = useActionState(updateEmail, initialState);
  const [passwordState, passwordAction, passwordPending] = useActionState(updatePassword, initialState);

  const forms = (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="mb-3 text-sm font-medium text-pivot-ink">Change email</h2>
        <form action={emailAction} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            required
            defaultValue={currentEmail}
            className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
          />
          <StatusMessage state={emailState} />
          <button
            type="submit"
            disabled={emailPending}
            className="w-fit rounded-md border border-pivot-line px-4 py-2 text-sm font-medium text-pivot-ink disabled:opacity-50"
          >
            {emailPending ? "Saving…" : "Update email"}
          </button>
        </form>
      </div>

      {hasPasswordIdentity && (
        <div>
          <h2 className="mb-3 text-sm font-medium text-pivot-ink">Change password</h2>
          <form action={passwordAction} className="flex flex-col gap-3">
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="New password"
              className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
            />
            <input
              type="password"
              name="confirm_password"
              required
              minLength={6}
              placeholder="Confirm new password"
              className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
            />
            <StatusMessage state={passwordState} />
            <button
              type="submit"
              disabled={passwordPending}
              className="w-fit rounded-md border border-pivot-line px-4 py-2 text-sm font-medium text-pivot-ink disabled:opacity-50"
            >
              {passwordPending ? "Saving…" : "Update password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );

  if (title) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">{title}</h2>
        {forms}
      </div>
    );
  }

  return <div className="mt-8 border-t border-pivot-line pt-6">{forms}</div>;
}
