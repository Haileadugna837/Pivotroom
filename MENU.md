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
| **Expert account area** — Profile (apply/edit, incl. payout bank account), Availability, Bookings, Payments (own status, read-only) | `src/app/dashboard/expert/{profile,availability,bookings,payments}/page.tsx` | built |
| **Admin account area** — Dashboard (metrics), Experts (all/pending/approved/rejected/suspended), Bookings (all/pending/confirmed/completed/cancelled/expired), Payments, Payouts (all/unpaid/paid), Categories, Settings | `src/app/admin/layout.tsx` (sidebar), `src/app/admin/{page,experts,bookings,payments,payouts,categories,settings}` | built |
| Expert status lifecycle: pending → approved / rejected / suspended, re-approvable from rejected or suspended | `experts.status`, `src/features/admin/server/actions.ts` (`approveExpert`/`rejectExpert`/`suspendExpert`), `src/features/admin/components/experts-table.tsx` | built |
| Admin edit of any expert's profile fields (not just their own) | `src/app/admin/experts/[id]/page.tsx`, `src/features/admin/components/expert-edit-form.tsx`, `updateExpertAsAdmin` | built |
| Admin metrics dashboard (expert counts by status, clients, expert profile views, avg views/expert) | `getDashboardMetrics` in `src/features/admin/server/queries.ts`, `src/features/admin/components/metric-card.tsx` | built |
| Expert profile page view tracking | `expert_profile_views` table, insert in `getApprovedExpertById` | built |
| Category/sub-category management (2-level: parent + children) | `src/features/admin/components/categories-manager.tsx`, `createCategory`/`deleteCategory` | built |
| Expert directory, public profile page, reviews display | `src/features/experts/`, `src/app/experts/` | built |
| Expert availability windows (per-date, not weekly recurring) | `src/features/booking/components/availability-manager.tsx`, `src/features/booking/server/availability-actions.ts` | built |
| Booking creation (fixed 15/30/45/60-min durations, auto-priced, availability + conflict checked), client/expert lists, completion | `src/features/booking/`, `src/app/bookings/[id]/` | built |
| Manual payment proof submission + bank instructions | `src/features/payments-verification/`, form on `/bookings/[id]` | built |
| Admin actions: approve/reject/suspend experts (full profile visible, editable), verify/reject payments (auto-confirms booking + creates Meet link + payout + notifies), mark payouts paid, mark bookings completed | `src/features/admin/` | built |
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
- Navigation: the top header is now minimal (logo, Find an expert, Dashboard/Sign in). Everything account-related lives inside role-aware sidebars: `/dashboard/*` for clients/experts, `/admin/*` for admin, via `SidebarLayout` — static column on desktop, hamburger-triggered slide-in drawer with backdrop on mobile (`md:` breakpoint). Both layouts redirect unauthenticated/unauthorized users before rendering. Sign out is a sidebar item (bottom of the nav), not in the top header. `/experts/apply` now just redirects to `/dashboard/expert/profile`, which doubles as both the first-time application form and the ongoing profile editor (same `ApplyForm`/`applyAsExpert` upsert — pre-filled with `initialValues` when a row already exists; editing never touches `status`).
- Counterpart names on bookings: an expert can see the name of a client who booked them via a new `profiles` RLS policy (`profiles: expert read own clients`, scoped to rows with a matching booking — not a blanket grant); a client already saw the expert's name via `expert_public_profiles`. Both `BookingsList` rows and `/bookings/[id]` show the name.
- Account email changes: `supabase.auth.updateUser({ email })` triggers Supabase's own confirmation-link flow to the new address. `profiles.email` is kept in sync via a new `on_auth_user_email_updated` trigger (mirrors the existing signup trigger) so it doesn't drift from `auth.users.email`. Password change is only offered when the account has an `email` identity (`user.identities`) — hidden entirely for Google-only accounts.
- Admin visibility: `getPendingPaymentProofs` and `getUnpaidPayouts` now resolve and attach `clientProfile`/`expertProfile` (name + email) via a shared `attachNames` helper — no more raw UUIDs in the admin UI. Payouts render as a header row (name, amount, **Mark paid** button — sibling to, not nested inside, the disclosure) plus a separate `<details>` for extra info (client email, expert email, session time range). The button was originally nested inside `<summary>`, which is why "Mark paid" appeared broken — clicking an interactive control inside `<summary>` races against the browser's native open/close toggle. Don't reintroduce that nesting.
- Sign-in redirect: both Google OAuth (`redirectTo` in `GoogleButton`) and email/password (`LoginForm`) now land on `/dashboard` instead of `/`; `/auth/callback`'s default `next` is `/dashboard` too.
- Google button now shows the official multicolor "G" mark (inline SVG, no external asset).
- Session completion is now time-gated, not just status-gated: the RLS policy `bookings: expert mark completed` requires `end_time <= now()` in its `USING` clause (in addition to `status = 'confirmed'`), and the admin path (service role, bypasses RLS) enforces the same via explicit `.eq("status","confirmed").lte("end_time", nowIso)` on the update. `/bookings/[id]` only renders the button once `end_time` has passed; before that it shows when the button will become available.
- Categories now support one level of nesting (`categories.parent_id`, self-referencing, `on delete set null`). `experts.category_id`'s FK was changed to `on delete set null` too, so deleting a category never fails or cascades — it just clears the field on any expert using it. Admin manages categories at `/admin/categories`; the expert profile form groups the `<select>` by parent via `<optgroup>`, indenting children with "— ".
- New `/admin/bookings`: all bookings in a table (When / Client / Expert / Price / Status), filterable via tabs backed by `?tab=` search param (server-rendered, no client JS) — `getAllBookingsForAdmin(tab)` in `src/features/admin/server/queries.ts`. "Expired" is a derived bucket, not a stored status: `status in ('pending_payment','payment_submitted') and end_time < now()` — i.e. a booking that was never confirmed and whose scheduled time has already passed. "Pending" is the same status set but with `end_time >= now()`. "Cancelled" folds in `rejected` alongside `cancelled` since there's no separate tab for it.
- Expert lifecycle replaced the old `is_approved` boolean with `experts.status` ('pending' | 'approved' | 'rejected' | 'suspended', DB check constraint). **Rejecting no longer deletes the row** (it used to) — rejected/suspended experts stay in the table so admin can review and re-approve them from `/admin/experts?tab=rejected` or `?tab=suspended` (both show an "Approve" button, same action as the pending tab). All public/booking-facing queries now filter `status = 'approved'` instead of `is_approved = true`.
- Payout bank account: experts add `payout_account_name`/`payout_account_number` on their profile form (`/dashboard/expert/profile`), covered by their existing self-update RLS policy. Admin sees these on `/admin/payouts` inside each row's "Details" disclosure — that's literally where admin gets the account to send money to. Admin can also edit these directly per-expert via `/admin/experts/[id]`.
- Payouts got their own `all`/`unpaid`/`paid` tabs (`?tab=`, defaults to `unpaid`) — `getPayoutsForAdmin(tab)`. Paid rows show a "Paid on {date}" badge instead of the "Mark paid" button.
- Expert-facing read-only payments view at `/dashboard/expert/payments`: for each of their bookings, shows the client name, price, payment-proof status (pending/verified/rejected), and payout status (unpaid/paid + paid date). No "mark paid" control for experts — explicitly decided to keep payout confirmation admin-only so it stays a trustworthy record of who's actually been paid, not a self-report. Needed a new RLS policy (`payment_proofs: expert read own bookings`) since experts previously had no read access to payment_proofs at all.
- Admin dashboard metrics (`/admin`, now the sidebar's first item) are deliberately simple, computed via `count(*, {head:true})` queries, no analytics service: total experts + per-status breakdown, "clients" (defined as `profiles count - experts count`, i.e. registered users who never applied to be an expert — not a maintained `role` column, since that field isn't actually used anywhere else), total expert-profile-page views (`expert_profile_views`, one row inserted per `/experts/[id]` render, fire-and-forget via the admin client so anonymous visitors don't need any RLS grant), and views ÷ approved-expert-count for the average. This is expert-profile-page traffic specifically, not site-wide analytics — labeled that way on the cards to avoid overclaiming.

## Deployment

- **Live at**: https://pivotroom.vercel.app (Vercel project "pivotroom", org "modern-ethiopia"). Production tracks the `main` branch — pushing to `main` auto-deploys.
- All secrets from `.env.local` are set as Vercel environment variables (Production + Preview): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL=https://pivotroom.vercel.app`.
- Google Cloud OAuth client "Pivotroom web" has three authorized redirect URIs registered: the Supabase auth callback, `http://localhost:3000/api/integrations/google/callback` (local dev), and `https://pivotroom.vercel.app/api/integrations/google/callback` (production — required for the expert Calendar-connect flow; login itself only needs the Supabase callback).
- Supabase Auth → URL Configuration has **Site URL** set to `https://pivotroom.vercel.app` and `https://pivotroom.vercel.app/**` added to **Redirect URLs** — without this, OAuth redirects fall back to the default (`localhost:3000`) and fail on any real device.
- Lesson learned during setup: manually typing env var **names** into Vercel's UI is error-prone (invisible typos look identical to the correct name); paste them instead. Redeploy is required after adding/changing env vars — they don't apply retroactively to an already-built deployment.

## Database (project `dleyuziqoppoypbjxlqt`, region eu-west-2)

Tables: `profiles` (auto-created on signup via trigger), `categories` (now with
`parent_id` for one level of sub-categories, `on delete set null`), `experts`
(`status` lifecycle, `price_per_15_min`, `currency`, `payout_account_name`,
`payout_account_number` — no more `is_approved`/`session_rate`/`session_duration_minutes`),
`expert_availability` (per-date windows), `expert_google_tokens` (service-role
write, expert can read own row), `expert_profile_views` (service-role only, no
RLS policies at all), `bookings`, `payment_proofs`, `expert_payouts`, `reviews`.
All have RLS enabled. View `expert_public_profiles` exposes only name/avatar
for approved experts (intentionally security-definer — flagged ERROR by the
linter but scoped to 3 non-sensitive columns, filtered to `status = 'approved'`;
accepted tradeoff, do not "fix" by loosening `profiles` RLS).
`experts.category_id`'s FK is `on delete set null`, so deleting a category
never fails or cascades.

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
- **Still investigating** (separate from the payout button bug, which is fixed): booking-confirmed emails didn't arrive for a real admin verification. `sendEmail` only `console.error`s on Resend failures — never surfaced to the UI — so check Vercel logs for a `[notifications]` line to see the real reason before assuming a code bug. Leading theory: Resend's shared `onboarding@resend.dev` sender can typically only deliver to the Resend account owner's own verified address, not arbitrary client/expert emails — which would make this expected until a real domain is verified, not a bug to fix in code.
- No UI to prevent booking overlap with an existing top-level category being deleted while an expert form is open (rare race, not worth guarding against yet).
- `/admin/bookings` timestamps use the same server-local (UTC) interpretation caveat noted above for booking creation.
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
