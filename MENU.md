# Menu

Navigation map for Pivotroom.africa (1:1 expert marketplace). Read this first when
asked to adjust something — jump straight to the listed path instead of searching
the tree.

| Area | Path | Status |
|---|---|---|
| Supabase clients (browser/server/middleware) | `src/lib/supabase/` | built |
| Google Calendar/Meet client | `src/lib/google/` | not built (needs `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`) |
| Admin email allowlist | `src/lib/admin.ts` | not built (needs admin email) |
| Login/signup (email+password, Google OAuth) | `src/features/auth/` | not built |
| Expert profiles, search/discovery | `src/features/experts/` | not built |
| Booking flow, availability (Google Calendar sync) | `src/features/booking/` | not built |
| Google Meet link generation | `src/features/video/` | not built |
| Manual payment proof + verification | `src/features/payments-verification/` | not built |
| Post-session reviews/ratings | `src/features/reviews/` | not built |
| Email notifications | `src/features/notifications/` | not built (email provider not chosen) |
| Admin dashboard (verify payments, mark payouts, manage experts) | `src/features/admin/` | not built |
| App routes (thin, delegate to features) | `src/app/` | default Next.js starter page only |

## Decisions locked in

- Video: Google Meet link auto-generated via Calendar API `conferenceData` (no standalone Meet API).
- Payments: manual — client submits transaction ID/name/date as text; admin verifies; admin pays expert manually after session. No payment processor.
- Scheduling: Google Calendar sync per expert (free tier of Calendar API).
- Auth: Supabase Auth, email/password + Google OAuth.
- Admin access: hardcoded email allowlist in `src/lib/admin.ts`.
- Brand name: Pivotroom.africa.

## Pending inputs before those areas can be built

- Admin email address(es) for the allowlist.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` from Google Cloud Console (Calendar API enabled, OAuth consent screen configured — see chat for exact steps).
- Email notification provider choice + API key (not yet requested).
