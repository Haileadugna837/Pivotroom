"use client";

import { useActionState } from "react";
import { updateEmail, updatePassword, type SettingsActionState } from "@/features/auth/server/actions";

const initialState: SettingsActionState = {};

function StatusMessage({ state }: { state: SettingsActionState }) {
  if (state.error) return <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>;
  if (state.success) return <p className="text-sm text-green-700 dark:text-green-500">{state.success}</p>;
  return null;
}

export function AccountSettingsForms({
  currentEmail,
  hasPasswordIdentity,
}: {
  currentEmail: string;
  hasPasswordIdentity: boolean;
}) {
  const [emailState, emailAction, emailPending] = useActionState(updateEmail, initialState);
  const [passwordState, passwordAction, passwordPending] = useActionState(updatePassword, initialState);

  return (
    <div className="mt-8 flex flex-col gap-8 border-t border-black/10 pt-6 dark:border-white/15">
      <div>
        <h2 className="mb-3 text-sm font-medium">Change email</h2>
        <form action={emailAction} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            required
            defaultValue={currentEmail}
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
          <StatusMessage state={emailState} />
          <button
            type="submit"
            disabled={emailPending}
            className="w-fit rounded-md border border-black/10 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-white/15"
          >
            {emailPending ? "Saving…" : "Update email"}
          </button>
        </form>
      </div>

      {hasPasswordIdentity && (
        <div>
          <h2 className="mb-3 text-sm font-medium">Change password</h2>
          <form action={passwordAction} className="flex flex-col gap-3">
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="New password"
              className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
            />
            <input
              type="password"
              name="confirm_password"
              required
              minLength={6}
              placeholder="Confirm new password"
              className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
            />
            <StatusMessage state={passwordState} />
            <button
              type="submit"
              disabled={passwordPending}
              className="w-fit rounded-md border border-black/10 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-white/15"
            >
              {passwordPending ? "Saving…" : "Update password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
