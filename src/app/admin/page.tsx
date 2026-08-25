import Link from "next/link";
import { getDashboardMetrics } from "@/features/admin/server/queries";
import { MetricCard } from "@/features/admin/components/metric-card";
import { getAcquisitionSummaryForAdminHome } from "@/features/acquisition/server/admin-queries";

export default async function AdminDashboardPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-4xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">Dashboard</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const [metrics, acquisition] = await Promise.all([getDashboardMetrics(), getAcquisitionSummaryForAdminHome()]);

  return (
    <div className="mx-auto max-w-4xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold text-pivot-ink">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MetricCard label="Total experts" value={metrics.totalExperts} />
        <MetricCard label="Approved experts" value={metrics.approvedExperts} />
        <MetricCard label="Pending experts" value={metrics.pendingExperts} />
        <MetricCard label="Rejected experts" value={metrics.rejectedExperts} />
        <MetricCard label="Suspended experts" value={metrics.suspendedExperts} />
        <MetricCard label="Clients" value={metrics.totalClients} />
        <MetricCard label="Total website views" value={metrics.totalWebsiteViews} />
        <MetricCard label="Avg. views per expert" value={metrics.avgViewsPerExpert.toFixed(1)} />
      </div>

      <div className="mt-8 rounded-lg border border-pivot-line p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-pivot-ink">Early Access</p>
          <Link href="/admin/acquisition/analytics" className="text-xs text-pivot-ink underline">
            View Analytics
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-pivot-ink">{acquisition.leads}</p>
            <p className="text-xs text-pivot-muted">Users</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-pivot-ink">{acquisition.applications}</p>
            <p className="text-xs text-pivot-muted">Experts</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-pivot-ink">{acquisition.nominations}</p>
            <p className="text-xs text-pivot-muted">Nominations</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-pivot-ink">+{acquisition.leadsThisWeek}</p>
            <p className="text-xs text-pivot-muted">This Week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
