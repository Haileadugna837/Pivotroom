"use client";

import { useActionState, useState } from "react";
import {
  addNgoAllocation,
  deleteNgoAllocation,
  type NgoAllocationState,
} from "@/features/ngo/server/actions";

type Ngo = { id: string; name: string };
type Allocation = { id: string; ngo_id: string; percentage: number; ngos: { name: string } | null };

const initialState: NgoAllocationState = {};
const ADMIN_EMAIL = "haile12adugna@gmail.com";

const BAR_COLORS = ["bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-lime-500", "bg-green-600"];

export function NgoDonationManager({ ngos, allocations }: { ngos: Ngo[]; allocations: Allocation[] }) {
  const [state, formAction, pending] = useActionState(addNgoAllocation, initialState);
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(null);

  const allocatedIds = new Set(allocations.map((a) => a.ngo_id));
  const availableNgos = ngos.filter((n) => !allocatedIds.has(n.id));
  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);
  const remaining = 100 - totalPercentage;
  const selectedNgo = availableNgos.find((n) => n.id === selectedNgoId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium">Donate to an NGO</p>
        <p className="mt-1 text-xs text-black/50 dark:text-white/50">
          Give back a share of your session earnings. Experts who donate get a{" "}
          <span className="font-medium text-amber-600 dark:text-amber-400">gold verified badge</span>{" "}
          on their profile instead of blue. Don&apos;t see the NGO you support? Email{" "}
          <a href={`mailto:${ADMIN_EMAIL}`} className="underline">
            {ADMIN_EMAIL}
          </a>{" "}
          to get it added.
        </p>
      </div>

      {allocations.length > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border border-black/10 p-3 dark:border-white/15">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            {allocations.map((a, i) => (
              <div
                key={a.id}
                className={BAR_COLORS[i % BAR_COLORS.length]}
                style={{ width: `${a.percentage}%` }}
                title={`${a.ngos?.name ?? "NGO"} — ${a.percentage}%`}
              />
            ))}
          </div>
          <ul className="flex flex-col gap-2">
            {allocations.map((allocation, i) => (
              <li key={allocation.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                  <span className="font-medium">{allocation.ngos?.name ?? "NGO"}</span>
                  <span className="text-black/50 dark:text-white/50">{allocation.percentage}%</span>
                </span>
                <form action={deleteNgoAllocation}>
                  <input type="hidden" name="id" value={allocation.id} />
                  <button
                    type="submit"
                    className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <p className="text-xs text-black/50 dark:text-white/50">
            {totalPercentage}% allocated{remaining > 0 ? ` · ${remaining}% left` : ""}
          </p>
        </div>
      )}

      {remaining <= 0 ? (
        <p className="text-xs text-black/50 dark:text-white/50">
          You&apos;ve allocated the full 100% — remove one to change your allocations.
        </p>
      ) : availableNgos.length === 0 ? (
        <p className="text-xs text-black/50 dark:text-white/50">
          No more NGOs available to add — ask admin to list more.
        </p>
      ) : !selectedNgo ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-black/60 dark:text-white/60">1. Choose an NGO</p>
          <div className="flex flex-wrap gap-2">
            {availableNgos.map((ngo) => (
              <button
                key={ngo.id}
                type="button"
                onClick={() => setSelectedNgoId(ngo.id)}
                className="rounded-full border border-black/10 px-3.5 py-2 text-sm hover:border-emerald-500 hover:text-emerald-600 dark:border-white/15 dark:hover:border-emerald-400 dark:hover:text-emerald-400"
              >
                {ngo.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form
          action={formAction}
          className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950"
        >
          <input type="hidden" name="ngo_id" value={selectedNgo.id} />
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">2. Set a percentage</p>
            <button
              type="button"
              onClick={() => setSelectedNgoId(null)}
              className="text-xs text-emerald-700 underline hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
            >
              Change NGO
            </button>
          </div>
          <p className="text-sm font-medium">{selectedNgo.name}</p>
          <div className="flex items-center gap-2">
            <input
              name="percentage"
              type="number"
              min="1"
              max={remaining}
              step="1"
              required
              autoFocus
              placeholder="e.g. 5"
              className="w-24 rounded-md border border-black/10 bg-background px-3 py-2 text-sm dark:border-white/15"
            />
            <span className="text-sm text-emerald-800 dark:text-emerald-300">
              % of earnings (up to {remaining}%)
            </span>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-fit rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {pending ? "Adding…" : `Add ${selectedNgo.name}`}
          </button>
        </form>
      )}
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
    </div>
  );
}
