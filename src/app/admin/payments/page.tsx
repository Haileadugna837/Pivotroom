import { getPendingPaymentProofs } from "@/features/admin/server/queries";
import { PendingPaymentsList } from "@/features/admin/components/pending-payments-list";

export default async function AdminPaymentsPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold">Payments</h1>
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-500">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const proofs = await getPendingPaymentProofs();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold">Pending Payment Verification</h1>
      <PendingPaymentsList proofs={proofs} />
    </div>
  );
}
