"use client";

import { useActionState } from "react";
import { submitNomination, type NominateState } from "@/features/nominations/server/actions";

const initialState: NominateState = {};

export function NominateForm() {
  const [state, formAction, pending] = useActionState(submitNomination, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="text-sm text-pivot-ink">
        Who are you nominating?
        <input
          name="nominee_name"
          required
          placeholder="Full name"
          className="mt-1 w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
        />
      </label>

      <label className="text-sm text-pivot-ink">
        Why would they be a great expert?
        <textarea
          name="reason"
          required
          rows={4}
          placeholder="What makes them worth booking a session with?"
          className="mt-1 w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
        />
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-pivot-ink">Links about them (optional, up to 3)</p>
        <input
          name="link1"
          type="url"
          placeholder="https://linkedin.com/in/..."
          className="w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
        />
        <input
          name="link2"
          type="url"
          placeholder="https://..."
          className="w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
        />
        <input
          name="link3"
          type="url"
          placeholder="https://..."
          className="w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
        />
      </div>

      {state.error && <p className="text-sm text-pivot-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-pivot-ink px-4 py-2 text-sm font-medium text-pivot-paper disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit nomination"}
      </button>
    </form>
  );
}
