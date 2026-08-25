type Row = {
  id: string;
  clientName: string | null;
  startTime: string;
  price: number | null;
  currency: string;
  bookingStatus: string;
  paymentStatus: string | null;
  payoutStatus: string | null;
  payoutAmount: number | null;
  paidAt: string | null;
};

const PAYMENT_LABEL: Record<string, string> = {
  pending: "Payment pending admin review",
  verified: "Payment verified",
  rejected: "Payment rejected",
};

export function MyPaymentsList({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-pivot-muted">No bookings yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r) => (
        <li key={r.id} className="rounded-lg border border-pivot-line p-4 text-sm text-pivot-ink">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{r.clientName ?? "Client"}</p>
              <p className="text-pivot-ink-2">
                {new Date(r.startTime).toLocaleString()} —{" "}
                {r.price != null ? `${r.currency} ${r.price}` : "—"}
              </p>
            </div>
            <div className="text-right">
              <p>
                {r.paymentStatus
                  ? (PAYMENT_LABEL[r.paymentStatus] ?? r.paymentStatus)
                  : "No payment submitted yet"}
              </p>
              {r.payoutStatus && (
                <p className="text-pivot-ink-2">
                  Payout:{" "}
                  {r.payoutStatus === "paid"
                    ? `Paid${r.paidAt ? ` on ${new Date(r.paidAt).toLocaleDateString()}` : ""}`
                    : "Unpaid"}
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
