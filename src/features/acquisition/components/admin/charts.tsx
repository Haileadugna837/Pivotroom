// Hand-rolled, no charting dependency — matches the zero-chart-lib
// footprint used everywhere else in this admin (e.g. expert-demand's
// StatCard/rank-list pattern). Enough for an "executive KPI" read, not a
// database viewer.

export function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-40 shrink-0 truncate">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-black/50 dark:text-white/50">{value}</span>
    </div>
  );
}

export function FunnelStepRow({
  label,
  count,
  pctOfFirst,
  dropOffPct,
  isFirst,
}: {
  label: string;
  count: number;
  pctOfFirst: number;
  dropOffPct: number;
  isFirst: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/5 py-2 text-sm last:border-0 dark:border-white/10">
      <span>{label}</span>
      <span className="flex items-center gap-3">
        <span className="font-medium">{count}</span>
        <span className="w-12 text-right text-black/40 dark:text-white/40">{pctOfFirst}%</span>
        {!isFirst && dropOffPct > 0 && (
          <span className="w-20 text-right text-xs text-red-600 dark:text-red-400">-{dropOffPct}% drop</span>
        )}
      </span>
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-black/50 dark:text-white/50">{label}</p>
    </div>
  );
}
