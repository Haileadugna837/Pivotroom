import "server-only";
import { sendEmail } from "./client";
import { ADMIN_EMAILS } from "@/lib/admin";

const NOMINEE_STATUS_LABEL: Record<string, string> = {
  pending: "Submitted",
  in_review: "In review",
  added: "Added as an expert",
  declined: "Not selected",
};

export async function notifyNominationStatusChanged({
  emails,
  nomineeName,
  status,
}: {
  emails: string[];
  nomineeName: string;
  status: string;
}) {
  if (emails.length === 0) return;

  const label = NOMINEE_STATUS_LABEL[status] ?? status;
  await sendEmail({
    to: emails,
    subject: `Update on your nomination for ${nomineeName}`,
    html: `<p>Your nomination for <strong>${nomineeName}</strong> has a new status: <strong>${label}</strong>.</p><p>See it in your <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/dashboard/nominations">Pivotroom dashboard</a>.</p>`,
  });
}

export async function notifyExpertInvite({ email, inviteUrl }: { email: string; inviteUrl: string }) {
  await sendEmail({
    to: email,
    subject: "You're invited to become an expert on Pivotroom.africa",
    html: `<p>You've been personally invited to apply as an expert on Pivotroom.africa.</p><p><a href="${inviteUrl}">Get started</a></p><p>If the button doesn't work, copy this link into your browser:</p><p>${inviteUrl}</p>`,
  });
}

export async function notifyExpertApplicationAccepted({ email, name }: { email: string; name: string }) {
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/login`;
  await sendEmail({
    to: email,
    subject: "Your Pivotroom expert application was accepted",
    html: `<p>Hi ${name},</p><p>Your application to become a Pivotroom expert has been accepted.</p><p>Log in and complete your profile to get published: <a href="${loginUrl}">${loginUrl}</a></p>`,
  });
}

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
