import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import {
  getPendingExperts,
  getPendingPaymentProofs,
  getUnpaidPayouts,
} from "@/features/admin/server/queries";
import { PendingExpertsList } from "@/features/admin/components/pending-experts-list";
import { PendingPaymentsList } from "@/features/admin/components/pending-payments-list";
import { UnpaidPayoutsList } from "@/features/admin/components/unpaid-payouts-list";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) redirect("/");

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-500">
          `SUPABASE_SERVICE_ROLE_KEY` is not set in `.env.local` — admin queries
          cannot run yet.
        </p>
      </div>
    );
  }

  const [experts, proofs, payouts] = await Promise.all([
    getPendingExperts(),
    getPendingPaymentProofs(),
    getUnpaidPayouts(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-xl font-semibold">Admin</h1>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
          Pending expert applications
        </h2>
        <PendingExpertsList experts={experts} />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
          Pending payment verification
        </h2>
        <PendingPaymentsList proofs={proofs} />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
          Unpaid expert payouts
        </h2>
        <UnpaidPayoutsList payouts={payouts} />
      </section>
    </div>
  );
}
