import { verifyPayment, rejectPayment, verifyPaymentsBulk } from "@/features/admin/server/actions";

const BULK_FORM_ID = "bulk-verify-payments";

type Profile = { full_name: string | null; email: string } | null;

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
  clientProfile: Profile;
  expertProfile: Profile;
};

export function PendingPaymentsList({ proofs }: { proofs: PendingProof[] }) {
  if (!proofs.length) {
    return <p className="text-sm text-pivot-muted">No pending payments.</p>;
  }

  return (
    <>
      <form id={BULK_FORM_ID} action={verifyPaymentsBulk} className="mb-3">
        <button
          type="submit"
          className="rounded-md border border-pivot-line px-3 py-1.5 text-sm text-pivot-ink"
        >
          Verify &amp; confirm selected
        </button>
      </form>
      <ul className="flex flex-col gap-3">
      {proofs.map((p) => {
        const booking = p.bookings;
        const bulkItem = JSON.stringify({
          proofId: p.id,
          bookingId: p.booking_id,
          expertId: booking?.expert_id ?? "",
          clientId: booking?.client_id ?? "",
          startTime: booking?.start_time ?? "",
          endTime: booking?.end_time ?? "",
          price: booking?.price ?? null,
        });
        return (
          <li key={p.id} className="rounded-lg border border-pivot-line bg-pivot-white p-4 text-sm">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                form={BULK_FORM_ID}
                name="proof_items"
                value={bulkItem}
                aria-label={`Select payment from ${p.clientProfile?.full_name ?? "client"}`}
                className="mt-1 h-4 w-4 shrink-0"
              />
              <div className="min-w-0 flex-1">
            <p className="font-medium text-pivot-ink">
              {p.expertProfile?.full_name ?? "Unknown expert"} ← {p.clientProfile?.full_name ?? "Unknown client"}
            </p>
            <p className="text-pivot-ink">
              Txn <span className="font-mono">{p.transaction_id}</span> — {p.payer_name} —{" "}
              {p.payment_date}
            </p>
            {booking && (
              <p className="text-pivot-ink-2">
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
                <button className="rounded-md bg-pivot-ink px-3 py-1.5 text-pivot-paper">
                  Verify &amp; confirm
                </button>
              </form>
              <form action={rejectPayment}>
                <input type="hidden" name="proof_id" value={p.id} />
                <input type="hidden" name="booking_id" value={p.booking_id} />
                <button className="rounded-md border border-pivot-line px-3 py-1.5 text-pivot-ink">
                  Reject
                </button>
              </form>
            </div>
              </div>
            </div>
          </li>
        );
      })}
      </ul>
    </>
  );
}
