import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getPendingExperts() {
  const admin = createAdminClient();
  const { data: experts, error } = await admin
    .from("experts")
    .select("id, headline, bio, session_rate, currency, category_id, created_at")
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
  return proofs;
}

export async function getUnpaidPayouts() {
  const admin = createAdminClient();
  const { data: payouts, error } = await admin
    .from("expert_payouts")
    .select("id, booking_id, amount, status, created_at, bookings(id, expert_id, start_time, currency)")
    .eq("status", "unpaid")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return payouts;
}
