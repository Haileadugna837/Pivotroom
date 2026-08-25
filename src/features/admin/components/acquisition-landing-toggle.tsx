"use client";

import { setAcquisitionLandingEnabled } from "@/features/admin/server/actions";

export function AcquisitionLandingToggle({ enabled }: { enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-pivot-line p-4">
      <div>
        <p className="text-sm font-medium text-pivot-ink">Show Phase 1 acquisition landing page at &quot;/&quot;</p>
        <p className="text-xs text-pivot-muted">
          When off, &quot;/&quot; shows the classic marketplace homepage — it&apos;s always reachable at{" "}
          <a href="/classic" className="underline">
            /classic
          </a>{" "}
          either way.
        </p>
      </div>
      <form action={setAcquisitionLandingEnabled}>
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
