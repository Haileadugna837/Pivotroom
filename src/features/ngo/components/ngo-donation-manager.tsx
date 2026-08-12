"use client";

import { useActionState } from "react";
import {
  addNgoAllocation,
  deleteNgoAllocation,
  type NgoAllocationState,
} from "@/features/ngo/server/actions";

type Ngo = { id: string; name: string };
type Allocation = { id: string; ngo_id: string; percentage: number; ngos: { name: string } | null };

const initialState: NgoAllocationState = {};
const ADMIN_EMAIL = "haile12adugna@gmail.com";

export function NgoDonationManager({ ngos, allocations }: { ngos: Ngo[]; allocations: Allocation[] }) {
  const [state, formAction, pending] = useActionState(addNgoAllocation, initialState);

  const allocatedIds = new Set(allocations.map((a) => a.ngo_id));
  const availableNgos = ngos.filter((n) => !allocatedIds.has(n.id));
  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Donate to an NGO</p>
      <p className="text-xs text-black/50 dark:text-white/50">
        Allocate a share of your session earnings to one or more NGOs. Don&apos;t see the NGO you want?
        Email{" "}
        <a href={`mailto:${ADMIN_EMAIL}`} className="underline">
          {ADMIN_EMAIL}
        </a>{" "}
        to get it added.
      </p>

      {allocations.length > 0 && (
        <ul className="flex flex-col gap-2">
          {allocations.map((allocation) => (
            <li
              key={allocation.id}
              className="flex items-center justify-between rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
            >
              <span>
                {allocation.ngos?.name ?? "NGO"} — {allocation.percentage}%
              </span>
              <form action={deleteNgoAllocation}>
                <input type="hidden" name="id" value={allocation.id} />
                <button type="submit" className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                  Remove
                </button>
              </form>
            </li>
          ))}
          <li className="text-xs text-black/50 dark:text-white/50">Total allocated: {totalPercentage}%</li>
        </ul>
      )}

      {totalPercentage >= 100 ? (
        <p className="text-xs text-black/50 dark:text-white/50">
          You&apos;ve allocated the maximum 100% — remove one to change your allocations.
        </p>
      ) : availableNgos.length === 0 ? (
        <p className="text-xs text-black/50 dark:text-white/50">
          No more NGOs available to add — ask admin to list more.
        </p>
      ) : (
        <form action={formAction} className="flex flex-wrap items-end gap-2">
          <select
            name="ngo_id"
            required
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          >
            {availableNgos.map((ngo) => (
              <option key={ngo.id} value={ngo.id}>
                {ngo.name}
              </option>
            ))}
          </select>
          <input
            name="percentage"
            type="number"
            min="1"
            max="100"
            step="1"
            required
            placeholder="%"
            className="w-20 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {pending ? "Adding…" : "Add"}
          </button>
        </form>
      )}
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
    </div>
  );
}
