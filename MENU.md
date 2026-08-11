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
| Expert directory, profile page, apply-as-expert | `src/features/experts/`, `src/app/experts/` | built |
| Booking creation + client/expert booking lists | `src/features/booking/`, `src/app/bookings/[id]/` | built |
| Manual payment proof submission | `src/features/payments-verification/`, form on `/bookings/[id]` | built (client side) |
| Admin: approve experts, verify/reject payments (auto-confirms booking + creates Meet link + payout), mark payouts paid | `src/features/admin/`, `src/app/admin/` | built |
| Post-session reviews/ratings | `src/features/reviews/` | not built |
| Email notifications | `src/features/notifications/` | not built (email provider not chosen) |
| Booking status "completed" transition | — | not built (no cron/manual trigger yet) |

## Decisions locked in

- Video: Google Meet link auto-generated via Calendar API `conferenceData` when admin verifies payment (no standalone Meet API).
- Payments: manual — client submits transaction ID/name/date as text on `/bookings/[id]`; admin verifies from `/admin`; verifying auto-confirms the booking, creates the Meet link (if expert connected Calendar), and opens an unpaid payout row. Admin marks payout paid manually after the session. No payment processor.
- Scheduling: client proposes a date/time on the expert's page (no live free/busy check yet — `getFreeBusy` exists in `src/lib/google/calendar.ts` but isn't wired into the booking form).
- Auth: Supabase Auth, email/password + Google OAuth (both enabled and working).
- Admin access: hardcoded email allowlist in `src/lib/admin.ts`.
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
proof) → `confirmed` (admin verifies) → `completed` (not yet automated) /
`rejected` (admin rejects proof) / `cancelled` (client cancels while pending).

## Known gaps / next candidates

- No live Google Calendar availability check on the booking form (client can
  propose any time; double-booking isn't prevented).
- No way to mark a booking `completed` after the session happens.
- No reviews feature yet.
- No email notifications (booking confirmed, payment rejected, reminders).
- No payment instructions shown to the client on `/bookings/[id]` — placeholder
  text only. Needs real payment details (bank/mobile money) from the user.

## Pending inputs

- Real payment instructions (bank account / mobile money details) to show
  clients before they pay.
- Email notification provider choice + API key (not yet requested).

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
