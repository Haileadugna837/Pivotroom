import { markPayoutPaid } from "@/features/admin/server/actions";

type Profile = { full_name: string | null; email: string } | null;

type UnpaidPayout = {
  id: string;
  amount: number | null;
  bookings: {
    client_id: string;
    expert_id: string;
    start_time: string;
    end_time: string;
    currency: string;
  } | null;
  clientProfile: Profile;
  expertProfile: Profile;
};

export function UnpaidPayoutsList({ payouts }: { payouts: UnpaidPayout[] }) {
  if (!payouts.length) {
    return <p className="text-sm text-black/50 dark:text-white/50">No unpaid payouts.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {payouts.map((p) => (
        <li key={p.id} className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
          <details>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div>
                <p className="font-medium">
                  {p.expertProfile?.full_name ?? p.expertProfile?.email ?? "Unknown expert"}
                </p>
                <p className="text-black/60 dark:text-white/60">
                  {p.bookings ? new Date(p.bookings.start_time).toLocaleString() : ""} —{" "}
                  {p.amount != null ? `${p.bookings?.currency} ${p.amount}` : "no amount"}
                </p>
              </div>
              <form action={markPayoutPaid} onClick={(e) => e.stopPropagation()}>
                <input type="hidden" name="payout_id" value={p.id} />
                <button className="rounded-md bg-foreground px-3 py-1.5 text-background">
                  Mark paid
                </button>
              </form>
            </summary>
            <div className="mt-3 space-y-1 border-t border-black/10 pt-3 text-black/70 dark:border-white/15 dark:text-white/70">
              <p>Expert email: {p.expertProfile?.email ?? "—"}</p>
              <p>
                Client: {p.clientProfile?.full_name ?? "—"} ({p.clientProfile?.email ?? "—"})
              </p>
              {p.bookings && (
                <p>
                  Session: {new Date(p.bookings.start_time).toLocaleString()} –{" "}
                  {new Date(p.bookings.end_time).toLocaleTimeString()}
                </p>
              )}
              <p>Payout amount: {p.amount != null ? `${p.bookings?.currency} ${p.amount}` : "—"}</p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
