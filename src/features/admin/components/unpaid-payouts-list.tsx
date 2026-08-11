import { markPayoutPaid } from "@/features/admin/server/actions";

type UnpaidPayout = {
  id: string;
  amount: number | null;
  bookings: { expert_id: string; start_time: string; currency: string } | null;
};

export function UnpaidPayoutsList({ payouts }: { payouts: UnpaidPayout[] }) {
  if (!payouts.length) {
    return <p className="text-sm text-black/50 dark:text-white/50">No unpaid payouts.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {payouts.map((p) => (
        <li key={p.id} className="flex items-center justify-between rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
          <div>
            <p>Expert {p.bookings?.expert_id}</p>
            <p className="text-black/60 dark:text-white/60">
              {p.bookings ? new Date(p.bookings.start_time).toLocaleString() : ""} —{" "}
              {p.amount != null ? `${p.bookings?.currency} ${p.amount}` : "no amount"}
            </p>
          </div>
          <form action={markPayoutPaid}>
            <input type="hidden" name="payout_id" value={p.id} />
            <button className="rounded-md bg-foreground px-3 py-1.5 text-background">
              Mark paid
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
