# admin

Status: not built

Admin panel: verify payment proofs, mark expert payouts as paid, manage experts/categories. Access gated by hardcoded email allowlist (see `src/lib/admin.ts`).

- `components/` — admin dashboard, verification queue, payout tracker
- `server/` — admin-only queries/mutations, guarded by `isAdmin(email)`

Depends on: `payments-verification` feature, admin email allowlist (pending user input).
