# notifications

Status: not built

Email notifications for booking confirmations, payment verification results, session reminders. Provider not yet chosen (candidates: Resend, SendGrid, Postmark).

- `server/` — send functions per event type (booking confirmed, payment verified/rejected, reminder)

Depends on: email provider API key — not yet requested from user.
