"use client";

import { setAcquisitionShowExpertsEnabled } from "@/features/admin/server/actions";

export function AcquisitionShowExpertsToggle({ enabled }: { enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-pivot-line p-4">
      <div>
        <p className="text-sm font-medium text-pivot-ink">Showcase registered experts</p>
        <p className="text-xs text-pivot-muted">
          When off, the &quot;People worth 30 minutes of your time&quot; section is hidden from the landing
          page — useful while there are only a few approved experts.
        </p>
      </div>
      <form action={setAcquisitionShowExpertsEnabled}>
        <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
        <button
          type="submit"
          role="switch"
          aria-checked={enabled}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            enabled ? "bg-pivot-ink" : "bg-pivot-paper-2"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-pivot-paper transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </form>
    </div>
  );
}
