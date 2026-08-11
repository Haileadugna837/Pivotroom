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
| Shared sidebar layout (role-aware nav + sign out, mobile drawer) | `src/components/sidebar.tsx` (`SidebarLayout`) | built |
| Account settings: change email, change password (email/password accounts only) | `src/features/auth/components/account-settings-forms.tsx`, `updateEmail`/`updatePassword` in `src/features/auth/server/actions.ts` | built |
| Login/signup (email+password, Google OAuth), top header/nav | `src/features/auth/`, `src/app/login/`, `src/app/signup/`, `src/app/auth/callback/` | built |
| **Client account area** — My Bookings, Settings | `src/app/dashboard/layout.tsx` (sidebar), `src/app/dashboard/page.tsx`, `src/app/dashboard/settings/page.tsx` | built |
| **Expert account area** — Profile (apply/edit), Availability, Bookings | `src/app/dashboard/expert/{profile,availability,bookings}/page.tsx` | built |
| **Admin account area** — Pending Experts, Payments, Payouts, Settings | `src/app/admin/layout.tsx` (sidebar), `src/app/admin/{page,payments,payouts,settings}.tsx` | built |
| Expert directory, public profile page, reviews display | `src/features/experts/`, `src/app/experts/` | built |
| Expert availability windows (per-date, not weekly recurring) | `src/features/booking/components/availability-manager.tsx`, `src/features/booking/server/availability-actions.ts` | built |
| Booking creation (fixed 15/30/45/60-min durations, auto-priced, availability + conflict checked), client/expert lists, completion | `src/features/booking/`, `src/app/bookings/[id]/` | built |
| Manual payment proof submission + bank instructions | `src/features/payments-verification/`, form on `/bookings/[id]` | built |
| Admin actions: approve experts (full profile visible), verify/reject payments (auto-confirms booking + creates Meet link + payout + notifies), mark payouts paid, mark bookings completed | `src/features/admin/` | built |
| Post-session reviews/ratings | `src/features/reviews/` | built |
| Email notifications (Resend) | `src/features/notifications/` | built and live in production |

## Decisions locked in

- Currency: single-currency platform, **ETB** only (no per-expert currency choice). `experts.currency` and `bookings.currency` both default `'ETB'`.
- Pricing model: expert sets one rate, **price per 15 minutes**, in `experts.price_per_15_min`. Clients book in fixed durations of 15/30/45/60 minutes only (`ALLOWED_DURATIONS` in `src/features/booking/server/actions.ts`); total price = `price_per_15_min * (duration / 15)`, computed server-side from the DB row, never trusted from client input.
- Scheduling: expert declares availability as explicit **date + start time + end time windows** (table `expert_availability`), not a recurring weekly schedule. Managed via simple start/end time pickers (not a drag-select grid — that was evaluated and explicitly deferred in favor of shipping now; see Known gaps). Client booking flow: pick one of the expert's windows → pick a duration → pick a start time (client-side computed from window bounds, 15-min steps) → submit. Server re-validates the slot is (a) within a declared availability window (`isWithinAvailabilityWindow`) and (b) not conflicting with existing bookings or the expert's Google Calendar (`isSlotAvailable`) before inserting.
- Video: Google Meet link auto-generated via Calendar API `conferenceData` when admin verifies payment (no standalone Meet API).
- Payments: manual — client submits transaction ID/name/date as text on `/bookings/[id]`; admin verifies from `/admin`; verifying auto-confirms the booking, creates the Meet link (if expert connected Calendar), opens an unpaid payout row, and emails both parties. Admin marks payout paid manually after the session. No payment processor.
- Session completion: expert (RLS-gated) or admin can mark a `confirmed` booking `completed` via a button on `/bookings/[id]`. No automatic time-based transition — someone has to click it.
- Reviews: client can rate 1–5 stars + optional comment once a booking is `completed`, one review per booking (DB-enforced via unique `booking_id`). Shown with average rating on the expert's public profile page; reviewer identity is not shown (avoids exposing client profiles).
- Email: Resend, sending from the shared `onboarding@resend.dev` test address (no domain verification yet). Triggers: admin notified when payment proof submitted; client + expert notified when booking confirmed (includes Meet link if generated); client notified when payment rejected (includes admin's note if any). All sends are best-effort — failures are logged, never block the underlying action.
- Auth: Supabase Auth, email/password + Google OAuth (both enabled and working in production). Google's OAuth consent screen is still in **Testing** publishing status — only explicitly added test users (Google Cloud Console → OAuth consent screen → Test users) can use "Sign in with Google"; everyone else gets a Google-side `access_denied` screen. Decided to keep adding test users manually for now rather than start Google's verification review (needed to open Google Sign-In to the public, since `calendar.events` is a sensitive scope — requires a privacy policy page, app homepage copy, and takes days-to-weeks). Email/password signup has no such restriction and already works for anyone.
- Admin access: hardcoded email allowlist in `src/lib/admin.ts` (`ADMIN_EMAILS`, exported — also used as the notification recipient list). Admin sees the applicant's full profile (name, email, category, headline, full bio, rate, applied date) when reviewing pending experts.
- Brand name: Pivotroom.africa.
- Navigation: the top header is now minimal (logo, Find an expert, Dashboard/Sign in). Everything account-related lives inside role-aware sidebars: `/dashboard/*` for clients/experts, `/admin/*` for admin, via `SidebarLayout` — static column on desktop, hamburger-triggered slide-in drawer with backdrop on mobile (`md:` breakpoint). Both layouts redirect unauthenticated/unauthorized users before rendering. Sign out is a sidebar item (bottom of the nav), not in the top header. `/experts/apply` now just redirects to `/dashboard/expert/profile`, which doubles as both the first-time application form and the ongoing profile editor (same `ApplyForm`/`applyAsExpert` upsert — pre-filled with `initialValues` when a row already exists; editing never touches `is_approved`).
- Counterpart names on bookings: an expert can see the name of a client who booked them via a new `profiles` RLS policy (`profiles: expert read own clients`, scoped to rows with a matching booking — not a blanket grant); a client already saw the expert's name via `expert_public_profiles`. Both `BookingsList` rows and `/bookings/[id]` show the name.
- Account email changes: `supabase.auth.updateUser({ email })` triggers Supabase's own confirmation-link flow to the new address. `profiles.email` is kept in sync via a new `on_auth_user_email_updated` trigger (mirrors the existing signup trigger) so it doesn't drift from `auth.users.email`. Password change is only offered when the account has an `email` identity (`user.identities`) — hidden entirely for Google-only accounts.
- Admin visibility: `getPendingPaymentProofs` and `getUnpaidPayouts` now resolve and attach `clientProfile`/`expertProfile` (name + email) via a shared `attachNames` helper — no more raw UUIDs in the admin UI. Payouts render as `<details>` rows: summary shows expert name + amount, expanding reveals client name/email, expert email, and full session time range.

## Deployment

- **Live at**: https://pivotroom.vercel.app (Vercel project "pivotroom", org "modern-ethiopia"). Production tracks the `main` branch — pushing to `main` auto-deploys.
- All secrets from `.env.local` are set as Vercel environment variables (Production + Preview): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL=https://pivotroom.vercel.app`.
- Google Cloud OAuth client "Pivotroom web" has three authorized redirect URIs registered: the Supabase auth callback, `http://localhost:3000/api/integrations/google/callback` (local dev), and `https://pivotroom.vercel.app/api/integrations/google/callback` (production — required for the expert Calendar-connect flow; login itself only needs the Supabase callback).
- Supabase Auth → URL Configuration has **Site URL** set to `https://pivotroom.vercel.app` and `https://pivotroom.vercel.app/**` added to **Redirect URLs** — without this, OAuth redirects fall back to the default (`localhost:3000`) and fail on any real device.
- Lesson learned during setup: manually typing env var **names** into Vercel's UI is error-prone (invisible typos look identical to the correct name); paste them instead. Redeploy is required after adding/changing env vars — they don't apply retroactively to an already-built deployment.

## Database (project `dleyuziqoppoypbjxlqt`, region eu-west-2)

Tables: `profiles` (auto-created on signup via trigger), `categories` (seeded with
8 starter categories), `experts` (now: `price_per_15_min`, `currency` — no more
`session_rate`/`session_duration_minutes`), `expert_availability` (per-date
windows), `expert_google_tokens` (service-role write, expert can read own row),
`bookings`, `payment_proofs`, `expert_payouts`, `reviews`. All have RLS enabled.
View `expert_public_profiles` exposes only name/avatar for approved experts
(intentionally security-definer — flagged ERROR by the linter but scoped to 3
non-sensitive columns, filtered to `is_approved = true`; accepted tradeoff, do
not "fix" by loosening `profiles` RLS).

Booking status flow: `pending_payment` → `payment_submitted` (client submits
proof) → `confirmed` (admin verifies) → `completed` (expert/admin marks it) /
`rejected` (admin rejects proof) / `cancelled` (client cancels while pending).
Reviews are only insertable once a booking reaches `completed`.

`expert_availability` RLS: public (anon/authenticated) can read windows for
*approved* experts only; the owning expert can read/insert/delete their own
regardless of approval status.

## Known gaps / next candidates

- Availability UI uses plain start/end time inputs, not a drag-to-select time
  grid — explicitly chosen over the fancier version to ship faster. Revisit if
  the typed-input flow feels clunky in practice.
- Booking date/time is stored assuming server-local (UTC) interpretation of the
  expert's typed times — no per-user timezone handling yet. Fine while
  everyone's in the same timezone; will need real tz support to scale beyond that.
- No reminder emails before a session starts (only confirmation/rejection/admin-alert are wired).
- No UI for an expert to see who to email if Meet link generation failed (calendar not connected) — booking still confirms with `meet_link: null`.
- No domain-verified sender — emails come from `onboarding@resend.dev` until `pivotroom.africa` is verified with Resend (add DNS records when ready, then set `NOTIFICATIONS_FROM_EMAIL`).
- **Investigating**: booking-confirmed emails didn't arrive for a real admin verification. `sendEmail` only `console.error`s on Resend failures — never surfaced to the UI — so check Vercel logs for a `[notifications]` line to see the real reason before assuming a code bug. Leading theory: Resend's shared `onboarding@resend.dev` sender can typically only deliver to the Resend account owner's own verified address, not arbitrary client/expert emails — which would make this expected until a real domain is verified, not a bug to fix in code.
- Supabase Auth "leaked password protection" is disabled (advisor WARN, not ERROR) — optional hardening, toggle in Supabase dashboard → Authentication → Policies whenever convenient.

## Credentials on hand (in `.env.local`, not committed; mirrored in Vercel env vars)

- Supabase URL, anon key, and service role key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_SITE_URL` (locally `http://localhost:3000`; production value lives in Vercel as `https://pivotroom.vercel.app`)
- `RESEND_API_KEY`

## Known sandbox limitation

Outbound requests to `*.supabase.co` and `api.resend.com` are blocked by this dev
container's network egress allowlist — `npm run dev` will error on any
Supabase- or email-backed page here. This is a sandbox restriction, not a code
bug; verified by running equivalent queries directly via the Supabase MCP tools
and by a direct curl to api.resend.com (403 from the proxy, not from Resend).
The production deployment on Vercel has no such restriction and is confirmed
working end-to-end (login, dashboard, etc.).
