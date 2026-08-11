import "server-only";
import { sendEmail } from "./client";
import { ADMIN_EMAILS } from "@/lib/admin";

export async function notifyAdminPaymentSubmitted(bookingId: string) {
  await sendEmail({
    to: ADMIN_EMAILS,
    subject: "New payment proof submitted",
    html: `<p>A client submitted payment proof for booking <code>${bookingId}</code>. Review it in the admin dashboard.</p>`,
  });
}

export async function notifyBookingConfirmed({
  clientEmail,
  expertEmail,
  startTime,
  meetLink,
}: {
  clientEmail: string | null;
  expertEmail: string | null;
  startTime: string;
  meetLink: string | null;
}) {
  const when = new Date(startTime).toLocaleString();
  const meetLine = meetLink
    ? `<p>Join here: <a href="${meetLink}">${meetLink}</a></p>`
    : "<p>Your meeting link will be shared separately.</p>";
  const html = `<p>Your Pivotroom.africa session is confirmed for ${when}.</p>${meetLine}`;

  const recipients = [clientEmail, expertEmail].filter((e): e is string => Boolean(e));
  if (recipients.length === 0) return;

  await sendEmail({ to: recipients, subject: "Your session is confirmed", html });
}

export async function notifyPaymentRejected({
  clientEmail,
  reason,
}: {
  clientEmail: string | null;
  reason: string | null;
}) {
  if (!clientEmail) return;

  await sendEmail({
    to: clientEmail,
    subject: "Payment could not be verified",
    html: `<p>We couldn't verify your payment for your Pivotroom.africa booking.</p>${
      reason ? `<p>Reason: ${reason}</p>` : ""
    }<p>Please check your payment details and resubmit, or contact support.</p>`,
  });
}
