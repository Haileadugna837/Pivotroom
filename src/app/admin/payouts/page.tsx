import { getPayoutsForAdmin, type PayoutTab } from "@/features/admin/server/queries";
import { PayoutsList } from "@/features/admin/components/payouts-list";

const VALID_TABS: PayoutTab[] = ["all", "unpaid", "paid"];

export default async function AdminPayoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-4xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">Payouts</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const { tab } = await searchParams;
  const activeTab: PayoutTab = VALID_TABS.includes(tab as PayoutTab) ? (tab as PayoutTab) : "unpaid";

  const payouts = await getPayoutsForAdmin(activeTab);

  return (
    <div className="mx-auto max-w-4xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold text-pivot-ink">Payouts</h1>
      <PayoutsList payouts={payouts} activeTab={activeTab} />
    </div>
  );
}
