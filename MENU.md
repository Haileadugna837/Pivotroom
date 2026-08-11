# Menu

Navigation map for Pivotroom.africa (1:1 expert marketplace). Read this first when
asked to adjust something — jump straight to the listed path instead of searching
the tree.

| Area | Path | Status |
|---|---|---|
| Supabase clients (browser/server/middleware/admin) | `src/lib/supabase/` | built |
| Google Calendar/Meet client (OAuth, event+Meet creation, freebusy) | `src/lib/google/` | built |
| Google Calendar connect flow (per-expert OAuth) | `src/app/api/integrations/google/` | built |
| Admin email allowlist | `src/lib/admin.ts` | built (`haile12adugna@gmail.com`) |
| Login/signup (email+password, Google OAuth), header/nav | `src/features/auth/`, `src/app/login/`, `src/app/signup/`, `src/app/auth/callback/` | built |
| Expert directory, profile page, apply-as-expert, reviews display | `src/features/experts/`, `src/app/experts/` | built |
| Booking creation (with availability check), client/expert lists, completion | `src/features/booking/`, `src/app/bookings/[id]/` | built |
| Manual payment proof submission + bank instructions | `src/features/payments-verification/`, form on `/bookings/[id]` | built |
| Admin: approve experts, verify/reject payments (auto-confirms booking + creates Meet link + payout + notifies), mark payouts paid, mark bookings completed | `src/features/admin/`, `src/app/admin/` | built |
| Post-session reviews/ratings | `src/features/reviews/` | built |
| Email notifications (Resend) | `src/features/notifications/` | built, sending disabled until `RESEND_API_KEY` is set |

## Decisions locked in

- Video: Google Meet link auto-generated via Calendar API `conferenceData` when admin verifies payment (no standalone Meet API).
- Payments: manual — client submits transaction ID/name/date as text on `/bookings/[id]`; admin verifies from `/admin`; verifying auto-confirms the booking, creates the Meet link (if expert connected Calendar), opens an unpaid payout row, and emails both parties. Admin marks payout paid manually after the session. No payment processor.
- Scheduling: client proposes a date/time on the expert's page; `createBooking` checks both existing Pivotroom bookings and (if the expert connected Google Calendar) their live free/busy via `isSlotAvailable` in `src/features/booking/server/availability.ts` — conflicts redirect back to the expert page with an error message. Past-dated slots are rejected too.
- Session completion: expert (RLS-gated) or admin can mark a `confirmed` booking `completed` via a button on `/bookings/[id]`. No automatic time-based transition — someone has to click it.
- Reviews: client can rate 1–5 stars + optional comment once a booking is `completed`, one review per booking (DB-enforced via unique `booking_id`). Shown with average rating on the expert's public profile page; reviewer identity is not shown (avoids exposing client profiles).
- Email: Resend, sending from the shared `onboarding@resend.dev` test address (no domain verification yet). Triggers: admin notified when payment proof submitted; client + expert notified when booking confirmed (includes Meet link if generated); client notified when payment rejected (includes admin's note if any). All sends are best-effort — failures are logged, never block the underlying action.
- Auth: Supabase Auth, email/password + Google OAuth (both enabled and working).
- Admin access: hardcoded email allowlist in `src/lib/admin.ts` (`ADMIN_EMAILS`, exported — also used as the notification recipient list).
- Brand name: Pivotroom.africa.

## Database (project `dleyuziqoppoypbjxlqt`, region eu-west-2)

Tables: `profiles` (auto-created on signup via trigger), `categories` (seeded with
8 starter categories), `experts`, `expert_google_tokens` (service-role write,
expert can read own row), `bookings`, `payment_proofs`, `expert_payouts`,
`reviews`. All have RLS enabled. View `expert_public_profiles` exposes only
name/avatar for approved experts (intentionally security-definer — flagged
ERROR by the linter but scoped to 3 non-sensitive columns, filtered to
`is_approved = true`; accepted tradeoff, do not "fix" by loosening `profiles` RLS).

Booking status flow: `pending_payment` → `payment_submitted` (client submits
proof) → `confirmed` (admin verifies) → `completed` (expert/admin marks it) /
`rejected` (admin rejects proof) / `cancelled` (client cancels while pending).
Reviews are only insertable once a booking reaches `completed`.

RLS policies added this round: `bookings: client submit payment` (pending_payment
→ payment_submitted), `bookings: expert mark completed` (confirmed → completed),
`expert_google_tokens: self read` (expert can check own connection status).

## Known gaps / next candidates

- No reminder emails before a session starts (only confirmation/rejection/admin-alert are wired).
- No UI for an expert to see who to email if Meet link generation failed (calendar not connected) — booking still confirms with `meet_link: null`.
- No domain-verified sender — emails come from `onboarding@resend.dev` until `pivotroom.africa` is verified with Resend (add DNS records when ready, then set `NOTIFICATIONS_FROM_EMAIL`).

## Pending inputs

- `RESEND_API_KEY` (resend.com → API Keys → Create) to actually start sending emails — code is ready, currently no-ops with a console warning.

## Credentials on hand (in `.env.local`, not committed)

- Supabase URL, anon key, and service role key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (Calendar API enabled, consent screen in Testing mode, `calendar.events` scope added, OAuth client "Pivotroom web" created)
- `NEXT_PUBLIC_SITE_URL` (currently `http://localhost:3000` — update when a real domain is live, and add its `/api/integrations/google/callback` URL to the Google OAuth client's authorized redirect URIs)

## Known sandbox limitation

Outbound requests to `*.supabase.co` are blocked by this dev container's network
egress allowlist — `npm run dev` will error on any Supabase-backed page here.
This is a sandbox restriction, not a code bug; verified by running equivalent
queries directly via the Supabase MCP tools. Works normally on any real
deployment (Vercel, etc.).
