import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { getBookingForClient } from "@/features/booking/server/queries";
import {
  markBookingCompletedAsExpert,
  cancelBooking,
} from "@/features/booking/server/actions";
import { markBookingCompletedAsAdmin } from "@/features/admin/server/actions";
import { PaymentProofForm } from "@/features/payments-verification/components/payment-proof-form";
import { PaymentInstructions } from "@/features/payments-verification/components/payment-instructions";
import { getReviewForBooking } from "@/features/reviews/server/queries";
import { ReviewForm } from "@/features/reviews/components/review-form";

export const metadata: Metadata = {
  title: "Booking details",
  robots: { index: false, follow: false },
};

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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const [user, booking] = await Promise.all([getUser(), getBookingForClient(id)]);
  if (!user) redirect(`/login?next=/bookings/${id}`);
  if (!booking) notFound();

  const canCancelConfirmed =
    booking.status === "confirmed" &&
    new Date(booking.start_time).getTime() > Date.now() + 2 * 60 * 60 * 1000;

  const proof = Array.isArray(booking.payment_proofs)
    ? booking.payment_proofs[0]
    : booking.payment_proofs;

  const isExpert = user.id === booking.expert_id;
  const isClient = user.id === booking.client_id;
  const isAdmin = isAdminEmail(user.email);

  const review = isClient && booking.status === "completed" ? await getReviewForBooking(id) : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-xl font-semibold">Booking</h1>
      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}
      <dl className="mt-4 space-y-2 text-sm">
        {isClient && booking.expertName && (
          <div className="flex justify-between">
            <dt className="text-black/50 dark:text-white/50">Expert</dt>
            <dd>{booking.expertName}</dd>
          </div>
        )}
        {isExpert && booking.clientName && (
          <div className="flex justify-between">
            <dt className="text-black/50 dark:text-white/50">Client</dt>
            <dd>{booking.clientName}</dd>
          </div>
        )}
        {isAdmin && (
          <>
            {booking.expertName && (
              <div className="flex justify-between">
                <dt className="text-black/50 dark:text-white/50">Expert</dt>
                <dd>{booking.expertName}</dd>
              </div>
            )}
            {booking.clientName && (
              <div className="flex justify-between">
                <dt className="text-black/50 dark:text-white/50">Client</dt>
                <dd>{booking.clientName}</dd>
              </div>
            )}
          </>
        )}
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

      {isClient && canCancelConfirmed && (
        <form action={cancelBooking} className="mt-3">
          <input type="hidden" name="booking_id" value={booking.id} />
          <button
            type="submit"
            className="text-sm text-black/50 underline hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            Cancel this booking
          </button>
        </form>
      )}
      {isClient && booking.status === "confirmed" && !canCancelConfirmed && (
        <p className="mt-3 text-xs text-black/50 dark:text-white/50">
          This session starts within 2 hours, so it can no longer be cancelled here — use Contact
          Us in the footer if something&apos;s come up.
        </p>
      )}

      {booking.status === "confirmed" &&
        (isExpert || isAdmin) &&
        (new Date(booking.end_time) <= new Date() ? (
          <form
            action={isExpert ? markBookingCompletedAsExpert : markBookingCompletedAsAdmin}
            className="mt-4"
          >
            <input type="hidden" name="booking_id" value={booking.id} />
            <button
              type="submit"
              className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/15"
            >
              Mark session completed
            </button>
          </form>
        ) : (
          <p className="mt-4 text-xs text-black/50 dark:text-white/50">
            You can mark this completed once the session ends at{" "}
            {new Date(booking.end_time).toLocaleString()}.
          </p>
        ))}

      {booking.status === "pending_payment" && (
        <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
          <h2 className="mb-2 text-sm font-medium">Pay for this session</h2>
          <PaymentInstructions price={booking.price} currency={booking.currency} />
          <PaymentProofForm bookingId={booking.id} />
          {isClient && (
            <form action={cancelBooking} className="mt-4">
              <input type="hidden" name="booking_id" value={booking.id} />
              <button
                type="submit"
                className="text-sm text-black/50 underline hover:text-black dark:text-white/50 dark:hover:text-white"
              >
                Cancel this booking
              </button>
            </form>
          )}
        </div>
      )}

      {proof && booking.status !== "pending_payment" && (
        <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
          <h2 className="mb-2 text-sm font-medium">Payment proof</h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            {/* ph-mask: PostHog session-replay text masking (className, not a
                capture-blocking mechanism) — a transaction ID rendered as
                plain text isn't covered by the default input-value masking
                that already protects the payment-proof/payout forms. */}
            Transaction <span className="ph-mask">{proof.transaction_id}</span> — {proof.status}
          </p>
          {proof.admin_note && (
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">
              Note: {proof.admin_note}
            </p>
          )}
        </div>
      )}

      {isClient && booking.status === "completed" && (
        <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
          <h2 className="mb-2 text-sm font-medium">Leave a review</h2>
          {review ? (
            <p className="text-sm text-black/60 dark:text-white/60">
              You rated this session {review.rating} ★
              {review.comment ? ` — ${review.comment}` : ""}
            </p>
          ) : (
            <ReviewForm bookingId={booking.id} expertId={booking.expert_id} />
          )}
        </div>
      )}
    </div>
  );
}
