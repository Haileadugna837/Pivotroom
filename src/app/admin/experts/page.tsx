import { getExpertsForAdmin, type ExpertTab } from "@/features/admin/server/queries";
import { ExpertsTable } from "@/features/admin/components/experts-table";

const VALID_TABS: ExpertTab[] = ["all", "pending", "approved", "rejected", "suspended"];

export default async function AdminExpertsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-4xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">Experts</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const { tab } = await searchParams;
  const activeTab: ExpertTab = VALID_TABS.includes(tab as ExpertTab) ? (tab as ExpertTab) : "all";

  const experts = await getExpertsForAdmin(activeTab);

  return (
    <div className="mx-auto max-w-4xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold text-pivot-ink">Experts</h1>
      <ExpertsTable experts={experts} activeTab={activeTab} />
    </div>
  );
}
