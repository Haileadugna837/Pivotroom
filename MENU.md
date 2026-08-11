# Menu

Navigation map for Pivotroom.africa (1:1 expert marketplace). Read this first when
asked to adjust something — jump straight to the listed path instead of searching
the tree.

| Area | Path | Status |
|---|---|---|
| Supabase clients (browser/server/middleware/admin) | `src/lib/supabase/` | built |
| Google Calendar/Meet client | `src/lib/google/` | credentials ready (`.env.local`), client code not built |
| Admin email allowlist | `src/lib/admin.ts` | built (`haile12adugna@gmail.com`) |
| Login/signup (email+password, Google OAuth), header/nav | `src/features/auth/`, `src/app/login/`, `src/app/signup/`, `src/app/auth/callback/` | built |
| Expert profiles, public directory listing | `src/features/experts/`, `src/app/experts/` | built (browse only; profile creation/editing not built) |
| Booking flow, availability (Google Calendar sync) | `src/features/booking/` | not built |
| Google Meet link generation | `src/features/video/` | not built |
| Manual payment proof + verification | `src/features/payments-verification/` | not built |
| Post-session reviews/ratings | `src/features/reviews/` | not built |
| Email notifications | `src/features/notifications/` | not built (email provider not chosen) |
| Admin dashboard | `src/features/admin/`, `src/app/admin/` | gated placeholder; needs `SUPABASE_SERVICE_ROLE_KEY` for real queries |
| App routes (thin, delegate to features) | `src/app/` | landing page, dashboard placeholder |

## Decisions locked in

- Video: Google Meet link auto-generated via Calendar API `conferenceData` (no standalone Meet API).
- Payments: manual — client submits transaction ID/name/date as text; admin verifies; admin pays expert manually after session. No payment processor.
- Scheduling: Google Calendar sync per expert (free tier of Calendar API).
- Auth: Supabase Auth, email/password + Google OAuth (both enabled and working).
- Admin access: hardcoded email allowlist in `src/lib/admin.ts`.
- Brand name: Pivotroom.africa.

## Database (project `dleyuziqoppoypbjxlqt`, region eu-west-2)

Tables: `profiles` (auto-created on signup via trigger), `categories` (seeded with
8 starter categories), `experts`, `expert_google_tokens` (service-role only),
`bookings`, `payment_proofs`, `expert_payouts`, `reviews`. All have RLS enabled.
View `expert_public_profiles` exposes only name/avatar for approved experts
(intentionally security-definer — flagged by the linter but scoped to 3
non-sensitive columns, filtered to `is_approved = true`).

## Pending inputs before remaining areas can be built

- `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API Keys → service_role secret)
  — required for all admin actions: verifying payment proofs, approving experts,
  marking payouts. Store in `.env.local` only, never commit.
- Email notification provider choice + API key (not yet requested).

## Credentials on hand (in `.env.local`, not committed)

- Supabase URL + anon key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (Calendar API enabled, consent screen in Testing mode, `calendar.events` scope added, OAuth client "Pivotroom web" created)

## Known sandbox limitation

Outbound requests to `*.supabase.co` are blocked by this dev container's network
egress allowlist — `npm run dev` will 500 on any Supabase-backed page here. This
is a sandbox restriction, not a code bug; verified by running the equivalent
query directly via the Supabase MCP tools. Will work normally on any real
deployment (Vercel, etc.).
