# payments-verification

Status: not built

Manual payment flow: client submits transaction ID, name, and date after paying out-of-band. Admin reviews and marks verified/rejected. After the session happens, admin manually pays the expert (tracked as a status, not automated).

- `components/` — payment proof submission form, admin verification queue
- `server/` — CRUD for payment proof records, status transitions (pending → verified/rejected), expert payout status tracking

Depends on: Supabase schema (`payment_proofs`, `expert_payouts` tables) — not yet created. No external payment provider.
