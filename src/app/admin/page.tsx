import Link from "next/link";
import { getDashboardMetrics } from "@/features/admin/server/queries";
import { MetricCard } from "@/features/admin/components/metric-card";
import { getAcquisitionSummaryForAdminHome } from "@/features/acquisition/server/admin-queries";

export default async function AdminDashboardPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-500">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const [metrics, acquisition] = await Promise.all([getDashboardMetrics(), getAcquisitionSummaryForAdminHome()]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold">Dashboard</h1>
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

      <div className="mt-8 rounded-lg border border-black/10 p-4 dark:border-white/15">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Early Access</p>
          <Link href="/admin/acquisition/analytics" className="text-xs underline">
            View Analytics
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-lg font-semibold">{acquisition.leads}</p>
            <p className="text-xs text-black/50 dark:text-white/50">Users</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{acquisition.applications}</p>
            <p className="text-xs text-black/50 dark:text-white/50">Experts</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{acquisition.nominations}</p>
            <p className="text-xs text-black/50 dark:text-white/50">Nominations</p>
          </div>
          <div>
            <p className="text-lg font-semibold">+{acquisition.leadsThisWeek}</p>
            <p className="text-xs text-black/50 dark:text-white/50">This Week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
