import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getMyExpertProfile } from "@/features/experts/server/self";
import { getMyPaymentsAsExpert } from "@/features/payments-verification/server/queries";
import { MyPaymentsList } from "@/features/payments-verification/components/my-payments-list";

export default async function ExpertPaymentsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const expertProfile = await getMyExpertProfile(user.id);
  if (expertProfile?.status !== "approved") redirect("/dashboard");

  const rows = await getMyPaymentsAsExpert();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Payments</h1>
      <p className="mb-6 text-sm text-black/50 dark:text-white/50">
        Payout status is set by admin after a session is completed and paid out.
      </p>
      <MyPaymentsList rows={rows} />
    </div>
  );
}
