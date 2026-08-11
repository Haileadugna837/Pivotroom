import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type ExpertTab = "all" | "pending" | "approved" | "rejected" | "suspended";

export async function getExpertsForAdmin(tab: ExpertTab) {
  const admin = createAdminClient();
  let query = admin
    .from("experts")
    .select(
      "id, headline, bio, price_per_15_min, currency, status, payout_account_name, payout_account_number, categories(name), created_at",
    )
    .order("created_at", { ascending: true });

  if (tab !== "all") {
    query = query.eq("status", tab);
  }

  const { data: experts, error } = await query;
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

export async function getExpertByIdForAdmin(id: string) {
  const admin = createAdminClient();
  const { data: expert, error } = await admin
    .from("experts")
    .select(
      "id, headline, bio, category_id, price_per_15_min, currency, status, payout_account_name, payout_account_number",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!expert) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, email")
    .eq("id", id)
    .maybeSingle();

  return { ...expert, profile: profile ?? null };
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

export type PayoutTab = "all" | "unpaid" | "paid";

export async function getPayoutsForAdmin(tab: PayoutTab) {
  const admin = createAdminClient();
  let query = admin
    .from("expert_payouts")
    .select(
      "id, booking_id, amount, status, paid_at, created_at, bookings(id, client_id, expert_id, start_time, end_time, currency)",
    )
    .order("created_at", { ascending: true });

  if (tab !== "all") {
    query = query.eq("status", tab);
  }

  const { data: payouts, error } = await query;
  if (error) throw error;

  const withNames = await attachNames(payouts);

  const expertIds = Array.from(
    new Set(withNames.map((p) => p.bookings?.expert_id).filter((id): id is string => Boolean(id))),
  );
  const { data: experts } = await admin
    .from("experts")
    .select("id, payout_account_name, payout_account_number")
    .in("id", expertIds.length > 0 ? expertIds : [""]);
  const payoutInfoByExpertId = new Map((experts ?? []).map((e) => [e.id, e]));

  return withNames.map((p) => ({
    ...p,
    expertPayoutInfo: p.bookings ? (payoutInfoByExpertId.get(p.bookings.expert_id) ?? null) : null,
  }));
}

export async function getDashboardMetrics() {
  const admin = createAdminClient();

  const [
    { count: totalExperts },
    { count: approvedExperts },
    { count: pendingExperts },
    { count: rejectedExperts },
    { count: suspendedExperts },
    { count: totalProfiles },
    { count: totalViews },
  ] = await Promise.all([
    admin.from("experts").select("id", { count: "exact", head: true }),
    admin.from("experts").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("experts").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("experts").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("experts").select("id", { count: "exact", head: true }).eq("status", "suspended"),
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("expert_profile_views").select("id", { count: "exact", head: true }),
  ]);

  const experts = totalExperts ?? 0;
  const profiles = totalProfiles ?? 0;
  const views = totalViews ?? 0;
  const approved = approvedExperts ?? 0;

  return {
    totalExperts: experts,
    approvedExperts: approved,
    pendingExperts: pendingExperts ?? 0,
    rejectedExperts: rejectedExperts ?? 0,
    suspendedExperts: suspendedExperts ?? 0,
    totalClients: Math.max(profiles - experts, 0),
    totalProfileViews: views,
    avgViewsPerExpert: approved > 0 ? views / approved : 0,
  };
}
