// Hand-rolled, no charting dependency — matches the zero-chart-lib
// footprint used everywhere else in this admin (e.g. expert-demand's
// StatCard/rank-list pattern). Enough for an "executive KPI" read, not a
// database viewer.

export function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-40 shrink-0 truncate text-pivot-ink">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-pivot-paper-2">
        <div className="h-full rounded-full bg-pivot-ink" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-pivot-muted">{value}</span>
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
    <div className="flex items-center justify-between gap-3 border-b border-pivot-line py-2 text-sm last:border-0">
      <span className="text-pivot-ink">{label}</span>
      <span className="flex items-center gap-3">
        <span className="font-medium text-pivot-ink">{count}</span>
        <span className="w-12 text-right text-pivot-muted">{pctOfFirst}%</span>
        {!isFirst && dropOffPct > 0 && (
          <span className="w-20 text-right text-xs text-pivot-danger">-{dropOffPct}% drop</span>
        )}
      </span>
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-pivot-line bg-pivot-white p-4">
      <p className="text-2xl font-semibold text-pivot-ink">{value}</p>
      <p className="mt-1 text-xs text-pivot-muted">{label}</p>
    </div>
  );
}
