"use client";

import { useActionState, useState } from "react";
import {
  addNgoAllocation,
  deleteNgoAllocation,
  type NgoAllocationState,
} from "@/features/ngo/server/actions";

type Ngo = { id: string; name: string; logo_url: string | null };
type Allocation = {
  id: string;
  ngo_id: string;
  percentage: number;
  ngos: { name: string; logo_url: string | null } | null;
};

const initialState: NgoAllocationState = {};
const ADMIN_EMAIL = "haile12adugna@gmail.com";

const BAR_COLORS = ["bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-lime-500", "bg-green-600"];

function NgoAvatar({ name, logoUrl, size = 24 }: { name: string; logoUrl: string | null; size?: number }) {
  return logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt=""
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover"
    />
  ) : (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-pivot-paper-2 text-[10px] font-medium text-pivot-muted"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

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
        <p className="text-sm font-medium text-pivot-ink">Donate to an NGO</p>
        <p className="mt-1 text-xs text-pivot-muted">
          Give back a share of your session earnings. Experts who donate get a{" "}
          <span className="font-medium text-pivot-accent">gold verified badge</span>{" "}
          on their profile instead of blue. Don&apos;t see the NGO you support? Email{" "}
          <a href={`mailto:${ADMIN_EMAIL}`} className="underline">
            {ADMIN_EMAIL}
          </a>{" "}
          to get it added.
        </p>
      </div>

      {allocations.length > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border border-pivot-line p-3">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-pivot-paper-2">
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
              <li key={allocation.id} className="flex items-center justify-between text-sm text-pivot-ink">
                <span className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                  <NgoAvatar name={allocation.ngos?.name ?? "NGO"} logoUrl={allocation.ngos?.logo_url ?? null} size={20} />
                  <span className="font-medium">{allocation.ngos?.name ?? "NGO"}</span>
                  <span className="text-pivot-muted">{allocation.percentage}%</span>
                </span>
                <form action={deleteNgoAllocation}>
                  <input type="hidden" name="id" value={allocation.id} />
                  <button type="submit" className="text-pivot-muted hover:text-pivot-ink">
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <p className="text-xs text-pivot-muted">
            {totalPercentage}% allocated{remaining > 0 ? ` · ${remaining}% left` : ""}
          </p>
        </div>
      )}

      {remaining <= 0 ? (
        <p className="text-xs text-pivot-muted">
          You&apos;ve allocated the full 100% — remove one to change your allocations.
        </p>
      ) : availableNgos.length === 0 ? (
        <p className="text-xs text-pivot-muted">
          No more NGOs available to add — ask admin to list more.
        </p>
      ) : !selectedNgo ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-pivot-ink-2">1. Choose an NGO</p>
          <div className="flex flex-wrap gap-2">
            {availableNgos.map((ngo) => (
              <button
                key={ngo.id}
                type="button"
                onClick={() => setSelectedNgoId(ngo.id)}
                className="flex items-center gap-2 rounded-full border border-pivot-line py-2 pl-2 pr-3.5 text-sm text-pivot-ink hover:border-pivot-olive hover:text-pivot-olive"
              >
                <NgoAvatar name={ngo.name} logoUrl={ngo.logo_url} />
                {ngo.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form
          action={formAction}
          className="flex flex-col gap-3 rounded-lg border border-pivot-olive/30 bg-pivot-olive/10 p-4"
        >
          <input type="hidden" name="ngo_id" value={selectedNgo.id} />
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-pivot-olive">2. Set a percentage</p>
            <button
              type="button"
              onClick={() => setSelectedNgoId(null)}
              className="text-xs text-pivot-olive underline hover:opacity-80"
            >
              Change NGO
            </button>
          </div>
          <p className="flex items-center gap-2 text-sm font-medium text-pivot-ink">
            <NgoAvatar name={selectedNgo.name} logoUrl={selectedNgo.logo_url} />
            {selectedNgo.name}
          </p>
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
              className="w-24 rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink"
            />
            <span className="text-sm text-pivot-olive">% of earnings (up to {remaining}%)</span>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-fit rounded-md bg-pivot-olive px-4 py-2 text-sm font-medium text-pivot-white disabled:opacity-50"
          >
            {pending ? "Adding…" : `Add ${selectedNgo.name}`}
          </button>
        </form>
      )}
      {state.error && <p className="text-sm text-pivot-danger">{state.error}</p>}
    </div>
  );
}
