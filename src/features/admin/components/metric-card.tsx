export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-pivot-line bg-pivot-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-pivot-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-pivot-ink">{value}</p>
    </div>
  );
}
