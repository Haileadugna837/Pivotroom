import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getPendingExperts() {
  const admin = createAdminClient();
  const { data: experts, error } = await admin
    .from("experts")
    .select("id, headline, bio, price_per_15_min, currency, categories(name), created_at")
    .eq("is_approved", false)
    .order("created_at", { ascending: true });
  if (error) throw error;
  if (!experts.length) return [];

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .in(
      "id",
      experts.map((e) => e.id),
    );
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return experts.map((e) => ({ ...e, profile: profileById.get(e.id) ?? null }));
}

async function attachNames<T extends { bookings: { client_id: string; expert_id: string } | null }>(
  rows: T[],
) {
  const admin = createAdminClient();
  const ids = new Set<string>();
  rows.forEach((r) => {
    if (r.bookings) {
      ids.add(r.bookings.client_id);
      ids.add(r.bookings.expert_id);
    }
  });
  if (ids.size === 0) return rows.map((r) => ({ ...r, clientProfile: null, expertProfile: null }));

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .in("id", Array.from(ids));
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return rows.map((r) => ({
    ...r,
    clientProfile: r.bookings ? (profileById.get(r.bookings.client_id) ?? null) : null,
    expertProfile: r.bookings ? (profileById.get(r.bookings.expert_id) ?? null) : null,
  }));
}

export async function getPendingPaymentProofs() {
  const admin = createAdminClient();
  const { data: proofs, error } = await admin
    .from("payment_proofs")
    .select(
      "id, booking_id, transaction_id, payer_name, payment_date, status, created_at, bookings(id, start_time, end_time, price, currency, client_id, expert_id)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return attachNames(proofs);
}

export async function getUnpaidPayouts() {
  const admin = createAdminClient();
  const { data: payouts, error } = await admin
    .from("expert_payouts")
    .select(
      "id, booking_id, amount, status, created_at, bookings(id, client_id, expert_id, start_time, end_time, currency)",
    )
    .eq("status", "unpaid")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return attachNames(payouts);
}
