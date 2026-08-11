import "server-only";
import { Resend } from "resend";

const FROM_ADDRESS = process.env.NOTIFICATIONS_FROM_EMAIL ?? "Pivotroom.africa <onboarding@resend.dev>";

export function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    // Notifications aren't configured yet — skip silently rather than
    // breaking the booking/payment flow that triggered this send.
    console.warn(`[notifications] RESEND_API_KEY not set, skipping email: ${subject}`);
    return;
  }

  const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
  if (error) {
    console.error("[notifications] send failed", error);
  }
}
