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

export type BookingTab = "all" | "pending" | "confirmed" | "completed" | "cancelled" | "expired";

export async function getAllBookingsForAdmin(tab: BookingTab) {
  const admin = createAdminClient();
  const nowIso = new Date().toISOString();

  let query = admin
    .from("bookings")
    .select("id, client_id, expert_id, start_time, end_time, status, price, currency")
    .order("start_time", { ascending: false });

  if (tab === "pending") {
    query = query.in("status", ["pending_payment", "payment_submitted"]).gte("end_time", nowIso);
  } else if (tab === "confirmed") {
    query = query.eq("status", "confirmed");
  } else if (tab === "completed") {
    query = query.eq("status", "completed");
  } else if (tab === "cancelled") {
    query = query.in("status", ["cancelled", "rejected"]);
  } else if (tab === "expired") {
    query = query.in("status", ["pending_payment", "payment_submitted"]).lt("end_time", nowIso);
  }

  const { data: bookings, error } = await query;
  if (error) throw error;
  if (!bookings.length) return [];

  const ids = new Set<string>();
  bookings.forEach((b) => {
    ids.add(b.client_id);
    ids.add(b.expert_id);
  });
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .in("id", Array.from(ids));
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return bookings.map((b) => ({
    ...b,
    clientProfile: profileById.get(b.client_id) ?? null,
    expertProfile: profileById.get(b.expert_id) ?? null,
  }));
}

export async function getCategoriesForAdmin() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("categories")
    .select("id, name, parent_id")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
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
