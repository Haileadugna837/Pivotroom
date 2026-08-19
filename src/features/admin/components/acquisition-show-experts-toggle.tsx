"use client";

import { setAcquisitionShowExpertsEnabled } from "@/features/admin/server/actions";

export function AcquisitionShowExpertsToggle({ enabled }: { enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-4 dark:border-white/15">
      <div>
        <p className="text-sm font-medium">Showcase registered experts</p>
        <p className="text-xs text-black/50 dark:text-white/50">
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
            enabled ? "bg-foreground" : "bg-black/15 dark:bg-white/15"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-background transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </form>
    </div>
  );
}
