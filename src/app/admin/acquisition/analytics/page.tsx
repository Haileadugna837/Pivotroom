import Link from "next/link";
import type { Metadata } from "next";
import { getAcquisitionAnalytics } from "@/features/acquisition/server/admin-queries";
import { BarRow, FunnelStepRow, StatCard } from "@/features/acquisition/components/admin/charts";

export const metadata: Metadata = {
  title: "Acquisition Analytics",
};

const PRESETS: { label: string; days: number | "all" }[] = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "All time", days: "all" },
];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function AcquisitionAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const dateFrom = params.from;
  const dateTo = params.to;

  const analytics = await getAcquisitionAnalytics({ dateFrom, dateTo });
  const { kpis, userFunnel, expertFunnel, topCategories, demandGap, recentProblems, nominationAnalytics, trafficBySource, deviceBreakdown } =
    analytics;

  const today = new Date();
  function presetHref(days: number | "all") {
    if (days === "all") return "/admin/acquisition/analytics";
    const from = new Date(today);
    from.setDate(from.getDate() - days);
    return `/admin/acquisition/analytics?from=${isoDate(from)}&to=${isoDate(today)}`;
  }

  const maxCategoryCount = Math.max(1, ...topCategories.map((c) => c.count));

  return (
    <div className="mx-auto max-w-6xl bg-pivot-paper px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-pivot-ink">Acquisition Analytics</h1>
          <p className="mt-1 text-sm text-pivot-muted">Phase 1 early-access &amp; expert acquisition.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {PRESETS.map((p) => (
            <Link key={p.label} href={presetHref(p.days)} className="rounded-md border border-pivot-line px-3 py-1.5 text-pivot-ink">
              {p.label}
            </Link>
          ))}
          <form method="GET" className="flex items-center gap-2">
            <input type="date" name="from" defaultValue={dateFrom ?? ""} className="rounded-md border border-pivot-line bg-pivot-paper px-2 py-1.5 text-xs text-pivot-ink outline-none" />
            <input type="date" name="to" defaultValue={dateTo ?? ""} className="rounded-md border border-pivot-line bg-pivot-paper px-2 py-1.5 text-xs text-pivot-ink outline-none" />
            <button type="submit" className="rounded-md bg-pivot-ink px-3 py-1.5 text-xs text-pivot-paper">
              Apply
            </button>
          </form>
        </div>
      </div>

      {/* Overview */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Visitors" value={kpis.visitors} />
        <StatCard label="User Leads" value={kpis.leads} />
        <StatCard label="Expert Applications" value={kpis.applications} />
        <StatCard label="User Conversion Rate" value={`${kpis.userConversionRate}%`} />
        <StatCard label="Expert Conversion Rate" value={`${kpis.expertConversionRate}%`} />
        <StatCard label="Nominations" value={kpis.nominations} />
        <StatCard label="Referrals" value={kpis.referrals} />
      </div>

      {/* Acquisition Funnel */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-pivot-line p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-pivot-muted">User Funnel</p>
          {userFunnel.map((step, i) => (
            <FunnelStepRow key={step.label} label={step.label} count={step.count} pctOfFirst={step.pctOfFirst} dropOffPct={step.dropOffPct} isFirst={i === 0} />
          ))}
        </div>
        <div className="rounded-lg border border-pivot-line p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-pivot-muted">Expert Funnel</p>
          {expertFunnel.map((step, i) => (
            <FunnelStepRow key={step.label} label={step.label} count={step.count} pctOfFirst={step.pctOfFirst} dropOffPct={step.dropOffPct} isFirst={i === 0} />
          ))}
        </div>
      </div>

      {/* Demand */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-pivot-line p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-pivot-muted">Most Requested Categories</p>
          {topCategories.length === 0 ? (
            <p className="text-sm text-pivot-muted">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {topCategories.map((c) => (
                <BarRow key={c.label} label={c.label} value={c.count} max={maxCategoryCount} />
              ))}
            </div>
          )}
        </div>
        <div className="rounded-lg border border-pivot-line p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-pivot-muted">
            Recent Written Problems
          </p>
          {recentProblems.length === 0 ? (
            <p className="text-sm text-pivot-muted">No data yet.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {recentProblems.map((p) => (
                <li key={p.id} className="text-pivot-ink-2">
                  &ldquo;{p.problem}&rdquo;
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/acquisition/leads?has_problem=1" className="mt-3 inline-block text-xs text-pivot-ink underline">
            View all in Leads →
          </Link>
        </div>
      </div>

      {/* Demand gap */}
      <div className="mb-10 rounded-lg border border-pivot-line p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-pivot-muted">Demand vs. Expert Supply</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-pivot-line text-left text-xs uppercase tracking-wide text-pivot-muted">
                <th className="py-2 pr-3">Demand</th>
                <th className="py-2 pr-3 text-right">Requests</th>
                <th className="py-2 pr-3 text-right">Existing Experts</th>
                <th className="py-2 pr-3 text-right">Gap</th>
              </tr>
            </thead>
            <tbody>
              {demandGap.map((row) => (
                <tr key={row.category} className="border-b border-pivot-line text-pivot-ink">
                  <td className="py-2 pr-3">{row.category}</td>
                  <td className="py-2 pr-3 text-right">{row.requests}</td>
                  <td className="py-2 pr-3 text-right">{row.existingExperts}</td>
                  <td
                    className={`py-2 pr-3 text-right font-medium ${
                      row.gap === "High" ? "text-pivot-danger" : row.gap === "Medium" ? "text-pivot-accent" : "text-pivot-muted"
                    }`}
                  >
                    {row.gap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nominations */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-pivot-line p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-pivot-muted">Nominations</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-lg font-semibold text-pivot-ink">{nominationAnalytics.total}</p>
              <p className="text-xs text-pivot-muted">Total</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-pivot-ink">{nominationAnalytics.uniqueNominators}</p>
              <p className="text-xs text-pivot-muted">Unique nominators</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-pivot-ink">{nominationAnalytics.repeatNominators}</p>
              <p className="text-xs text-pivot-muted">Repeat nominators</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-pivot-line p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-pivot-muted">Most Nominated</p>
          {nominationAnalytics.topNominees.length === 0 ? (
            <p className="text-sm text-pivot-muted">No data yet.</p>
          ) : (
            <ul className="flex flex-col gap-1.5 text-sm text-pivot-ink">
              {nominationAnalytics.topNominees.map((n) => (
                <li key={n.label} className="flex justify-between">
                  <span>{n.label}</span>
                  <span className="text-pivot-muted">{n.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Traffic */}
      <div className="mb-10 rounded-lg border border-pivot-line p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-pivot-muted">Traffic &amp; Campaigns</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-pivot-line text-left text-xs uppercase tracking-wide text-pivot-muted">
                <th className="py-2 pr-3">Source</th>
                <th className="py-2 pr-3 text-right">Visitors</th>
                <th className="py-2 pr-3 text-right">Leads</th>
                <th className="py-2 pr-3 text-right">Applications</th>
                <th className="py-2 pr-3 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {trafficBySource.map((row) => (
                <tr key={row.source} className="border-b border-pivot-line text-pivot-ink">
                  <td className="py-2 pr-3">{row.source}</td>
                  <td className="py-2 pr-3 text-right">{row.visitors}</td>
                  <td className="py-2 pr-3 text-right">{row.leads}</td>
                  <td className="py-2 pr-3 text-right">{row.applications}</td>
                  <td className="py-2 pr-3 text-right">{row.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device */}
      <div className="rounded-lg border border-pivot-line p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-pivot-muted">Device</p>
        {deviceBreakdown.length === 0 ? (
          <p className="text-sm text-pivot-muted">No data yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {deviceBreakdown.map((d) => (
              <BarRow key={d.label} label={d.label} value={d.count} max={Math.max(1, ...deviceBreakdown.map((x) => x.count))} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
