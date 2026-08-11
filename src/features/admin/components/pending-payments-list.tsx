import { verifyPayment, rejectPayment } from "@/features/admin/server/actions";

type PendingProof = {
  id: string;
  booking_id: string;
  transaction_id: string;
  payer_name: string;
  payment_date: string;
  bookings: {
    id: string;
    start_time: string;
    end_time?: string;
    price: number | null;
    currency: string;
    client_id: string;
    expert_id: string;
  } | null;
};

export function PendingPaymentsList({ proofs }: { proofs: PendingProof[] }) {
  if (!proofs.length) {
    return <p className="text-sm text-black/50 dark:text-white/50">No pending payments.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {proofs.map((p) => {
        const booking = p.bookings;
        return (
          <li key={p.id} className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
            <p>
              Txn <span className="font-mono">{p.transaction_id}</span> — {p.payer_name} —{" "}
              {p.payment_date}
            </p>
            {booking && (
              <p className="text-black/60 dark:text-white/60">
                {new Date(booking.start_time).toLocaleString()} —{" "}
                {booking.price != null ? `${booking.currency} ${booking.price}` : "no price"}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <form action={verifyPayment}>
                <input type="hidden" name="proof_id" value={p.id} />
                <input type="hidden" name="booking_id" value={p.booking_id} />
                <input type="hidden" name="expert_id" value={booking?.expert_id ?? ""} />
                <input type="hidden" name="client_id" value={booking?.client_id ?? ""} />
                <input type="hidden" name="start_time" value={booking?.start_time ?? ""} />
                <input type="hidden" name="end_time" value={booking?.end_time ?? ""} />
                <input type="hidden" name="price" value={booking?.price ?? ""} />
                <button className="rounded-md bg-foreground px-3 py-1.5 text-background">
                  Verify &amp; confirm
                </button>
              </form>
              <form action={rejectPayment}>
                <input type="hidden" name="proof_id" value={p.id} />
                <input type="hidden" name="booking_id" value={p.booking_id} />
                <button className="rounded-md border border-black/10 px-3 py-1.5 dark:border-white/15">
                  Reject
                </button>
              </form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
