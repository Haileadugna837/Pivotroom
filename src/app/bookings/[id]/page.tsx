import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBookingForClient } from "@/features/booking/server/queries";
import { PaymentProofForm } from "@/features/payments-verification/components/payment-proof-form";
import { PaymentInstructions } from "@/features/payments-verification/components/payment-instructions";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  payment_submitted: "Payment submitted — pending admin verification",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Payment rejected",
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/bookings/${id}`);

  const booking = await getBookingForClient(id);
  if (!booking) notFound();

  const proof = Array.isArray(booking.payment_proofs)
    ? booking.payment_proofs[0]
    : booking.payment_proofs;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-xl font-semibold">Booking</h1>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-black/50 dark:text-white/50">When</dt>
          <dd>{new Date(booking.start_time).toLocaleString()}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-black/50 dark:text-white/50">Price</dt>
          <dd>
            {booking.price != null ? `${booking.currency} ${booking.price}` : "—"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-black/50 dark:text-white/50">Status</dt>
          <dd>{STATUS_LABEL[booking.status] ?? booking.status}</dd>
        </div>
      </dl>

      {booking.status === "confirmed" && booking.meet_link && (
        <a
          href={booking.meet_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Join Google Meet
        </a>
      )}

      {booking.status === "pending_payment" && (
        <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
          <h2 className="mb-2 text-sm font-medium">Pay for this session</h2>
          <PaymentInstructions price={booking.price} currency={booking.currency} />
          <PaymentProofForm bookingId={booking.id} />
        </div>
      )}

      {proof && booking.status !== "pending_payment" && (
        <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
          <h2 className="mb-2 text-sm font-medium">Payment proof</h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            Transaction {proof.transaction_id} — {proof.status}
          </p>
          {proof.admin_note && (
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">
              Note: {proof.admin_note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
