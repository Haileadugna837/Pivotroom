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
| Admin metrics dashboard (expert counts by status, clients, total website views, avg expert-profile views/expert) | `getDashboardMetrics` in `src/features/admin/server/queries.ts`, `src/features/admin/components/metric-card.tsx` | built |
| Site-wide page view tracking (all pages) | `page_views` table, insert in `src/lib/supabase/middleware.ts` | built |
| Expert profile page view tracking (used only for the avg-per-expert stat) | `expert_profile_views` table, insert in `getApprovedExpertById` | built |
| Expert profile photo upload (portrait, Supabase Storage, client-side compressed, admin can upload on any expert's behalf) | `expert-photos` storage bucket, `uploadExpertPhoto()` shared helper, portrait card grid on `/experts` and `/experts/[id]` | built |
| Expert social media links (max 3, platform + URL) + public share button | `expert_social_links` table, `src/features/experts/components/{social-links-manager,social-icons,share-button}.tsx` | built |
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
- Admin dashboard metrics (`/admin`, now the sidebar's first item) are deliberately simple, computed via `count(*, {head:true})` queries, no analytics service: total experts + per-status breakdown, "clients" (defined as `profiles count - experts count`, i.e. registered users who never applied to be an expert — not a maintained `role` column, since that field isn't actually used anywhere else), **total website views** (`page_views`, one row inserted per real page navigation across the whole site — see below), and expert-profile views ÷ approved-expert-count for the "avg views per expert" stat (that one specifically still tracks `expert_profile_views`, i.e. `/experts/[id]` traffic only, since an average only makes sense against expert-page traffic).
- Site-wide view tracking lives in `trackPageView()` inside `src/lib/supabase/middleware.ts` (runs on every request `updateSession` handles, i.e. everything the root `middleware.ts` matcher covers — already excludes `_next/static`, `_next/image`, favicon, image files). Skips non-GET requests, `/api/*`, and requests carrying the `next-router-prefetch` header (so prefetches don't inflate the count); everything else — including client-side soft navigations, which do send a real request — counts as a view. Insert is fire-and-forget via the admin (service-role) client, since this needs to work for anonymous visitors with zero RLS grants. This is a best-effort approximation, not a real analytics pipeline — good enough for a rough traffic sense, not for anything precision-dependent.
- Expert profile photos: new `expert-photos` Supabase Storage bucket (public read, so listing pages don't need signed URLs), objects stored at `{expert_id}/photo.{ext}` (upsert on re-upload, so old photos don't pile up as orphaned objects). `storage.objects` RLS restricts insert/update/delete to the path's owner folder matching `auth.uid()` for the expert's own upload path (via `applyAsExpert`, using the regular per-user client); **admin can upload on any expert's behalf too**, via `updateExpertAsAdmin` using the admin (service-role) storage client, which bypasses that RLS entirely — same shared `uploadExpertPhoto()` helper (`src/features/experts/server/photo.ts`) underneath both paths, just handed a different Supabase client. 5MB cap, jpg/png/webp only. `experts.photo_url` stores the public URL with a `?t=` cache-busting query param appended on each upload (same storage path, so without this the browser/CDN would keep serving the old cached image).
- Both `ApplyForm` and `ExpertEditForm` are now client components using `useActionState`, and both `applyAsExpert`/`updateExpertAsAdmin` return `{ error }` instead of throwing on upload/save failure — errors render inline in the form instead of crashing to Next.js's generic error page, and actually show the real underlying message (Postgres/Storage error text) rather than a swallowed one. Shared `PhotoUploadField` component (`src/features/experts/components/photo-upload-field.tsx`) gives both forms a real styled "Upload/Change photo" button (a `<label>` wrapping a visually-hidden file input, not a bare unstyled file input) plus a live client-side preview via `URL.createObjectURL` before the form is even submitted.
- **Root cause of the "click Save → This page couldn't load" crash, part 1**: Next.js Server Actions default to a **1MB** request body limit — well under our 5MB photo cap. A real photo upload's request body (the file itself, sitting in `FormData`) blew past that limit and got rejected by Next.js *before* the action's code ever ran, so none of the `{ error }` handling above could catch it — hence a hard crash instead of an inline message. The client-side "upload works" the user saw was just the local preview (`URL.createObjectURL`, no network call); the real transfer only happens on submit. Fixed via `experimental.serverActions.bodySizeLimit: "8mb"` in `next.config.ts`.
- **Part 2, the actual persistent fix**: raising Next's own limit wasn't enough because Vercel's platform itself caps serverless function request bodies at roughly 4.5MB, independent of anything configurable in `next.config.ts` — a real phone photo (often several MB) could still get rejected before ever reaching Next.js. The robust fix is `compressImage()` (`src/features/experts/components/compress-image.ts`): on file selection, draws the image onto a canvas capped at 1200px on the long edge, re-encodes as JPEG at quality 0.82 via `canvas.toBlob`, and swaps it into the `<input type="file">`'s `FileList` via a `DataTransfer` before the form is ever submitted — so the actual uploaded payload is typically well under 500KB regardless of the original photo's size, sidestepping both size limits entirely rather than chasing the ceiling. Falls back to the original file (with a client-side size warning) if `createImageBitmap`/canvas is unavailable. Also hardened `trackPageView()` in `src/lib/supabase/middleware.ts` with a try/catch as defense-in-depth, since it runs on every single request and should never be able to take down navigation even if misconfigured — wasn't the actual cause here, but too risky a blast radius to leave unguarded.
- `/experts` is a responsive 2/3/4-column grid of portrait (`aspect-[3/4]`) photo cards (`ExpertCard`) — name + a small checkmark badge (all listed experts are `status = 'approved'`, so this is unconditional, not a separate "verified" flag), price as "ETB X • 15 min", category chip overlaid top-left on the photo, headline/bio truncated to two lines. Experts without a photo fall back to a plain initial-letter placeholder tile, no broken-image icon. All images are plain `<img>` tags (not `next/image`) since Supabase Storage URLs live on their own domain and this avoids `next.config.ts` remote-pattern config for an MVP.
- `/experts/[id]` redesigned to match the reference layout: single centered column (`max-w-lg`), full-width portrait photo (not floated/small), then a consistent typography stack directly below it — name (`text-2xl font-semibold`) + checkmark inline with a `ShareButton` on the same row, headline (`text-base`) as subtitle, social icons row, star rating, category chip, bio, then price (`text-lg font-semibold`) — followed by the existing booking form and reviews sections, unchanged functionally.
- Expert social links (`expert_social_links`, max 3 enforced in `addSocialLink` by counting existing rows before insert, not a DB constraint): platform (instagram/linkedin/tiktok/x/youtube/facebook/website, DB check constraint) + URL (must start with `http(s)://`). Managed from `/dashboard/expert/profile` via `SocialLinksManager` (add form + remove buttons, same pattern as `AvailabilityManager`/`CategoriesManager` — not a popup/dialog "modal", an inline list, consistent with the rest of the app). RLS mirrors `expert_availability`: public read for approved experts' links, owner can read/insert/delete their own regardless of approval status. Displayed as clickable icon-only links on `/experts/[id]`. `ShareButton` uses `navigator.share()` (native share sheet) when available, falling back to clipboard-copy with a "Link copied!" confirmation — shares the profile URL itself, separate from the expert's own social links.

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
`payout_account_number`, `photo_url` — no more `is_approved`/`session_rate`/`session_duration_minutes`),
`expert_availability` (per-date windows), `expert_google_tokens` (service-role
write, expert can read own row), `expert_profile_views` and `page_views`
(both service-role only, no RLS policies at all), `bookings`, `payment_proofs`,
`expert_payouts`, `reviews`. All have RLS enabled. View `expert_public_profiles`
exposes only name/avatar for approved experts (intentionally security-definer —
flagged ERROR by the linter but scoped to 3 non-sensitive columns, filtered to
`status = 'approved'`; accepted tradeoff, do not "fix" by loosening `profiles` RLS).
`experts.category_id`'s FK is `on delete set null`, so deleting a category
never fails or cascades. Storage bucket `expert-photos` (public read; owner-only
write via `storage.objects` RLS keyed on the `{expert_id}/...` path prefix).

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
