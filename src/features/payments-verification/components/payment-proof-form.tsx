import { submitPaymentProof } from "@/features/payments-verification/server/actions";

export function PaymentProofForm({ bookingId }: { bookingId: string }) {
  return (
    <form action={submitPaymentProof} className="flex flex-col gap-3">
      <input type="hidden" name="booking_id" value={bookingId} />
      <input
        name="transaction_id"
        required
        placeholder="Transaction ID"
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <input
        name="payer_name"
        required
        placeholder="Name on payment"
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <input
        name="payment_date"
        type="date"
        required
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <button
        type="submit"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Submit payment proof
      </button>
    </form>
  );
}
