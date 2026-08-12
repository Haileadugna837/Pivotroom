import { getDashboardMetrics } from "@/features/admin/server/queries";
import { MetricCard } from "@/features/admin/components/metric-card";

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

  const metrics = await getDashboardMetrics();

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
    </div>
  );
}
