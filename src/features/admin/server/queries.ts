import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type ExpertTab = "all" | "pending" | "approved" | "rejected" | "suspended";

export async function getInvitesForAdmin() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("expert_invites")
    .select("id, email, status, created_at, used_at, completed_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getExpertsForAdmin(tab: ExpertTab) {
  const admin = createAdminClient();
  let query = admin
    .from("experts")
    .select(
      "id, headline, bio, price_per_15_min, currency, status, payout_account_name, payout_account_number, photo_url, created_at",
    )
    .order("created_at", { ascending: true });

  if (tab !== "all") {
    query = query.eq("status", tab);
  }

  const { data: experts, error } = await query;
  if (error) throw error;
  if (!experts.length) return [];

  const expertIds = experts.map((e) => e.id);

  const [{ data: profiles }, { data: categoryRows, error: categoriesError }] = await Promise.all([
    admin.from("profiles").select("id, full_name, email").in("id", expertIds),
    admin.from("expert_categories").select("expert_id, categories(name)").in("expert_id", expertIds),
  ]);
  if (categoriesError) throw categoriesError;

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const categoryNamesByExpertId = new Map<string, string[]>();
  for (const row of categoryRows ?? []) {
    if (!row.categories?.name) continue;
    const list = categoryNamesByExpertId.get(row.expert_id) ?? [];
    list.push(row.categories.name);
    categoryNamesByExpertId.set(row.expert_id, list);
  }

  return experts.map((e) => ({
    ...e,
    profile: profileById.get(e.id) ?? null,
    categoryNames: categoryNamesByExpertId.get(e.id) ?? [],
  }));
}

export async function getExpertByIdForAdmin(id: string) {
  const admin = createAdminClient();
  const { data: expert, error } = await admin
    .from("experts")
    .select(
      "id, headline, bio, price_per_15_min, currency, status, payout_account_name, payout_account_number, photo_url, timezone, expectations, example_questions",
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

  const { data: categoryRows, error: categoriesError } = await admin
    .from("expert_categories")
    .select("category_id")
    .eq("expert_id", id);
  if (categoriesError) throw categoriesError;

  return { ...expert, profile: profile ?? null, category_ids: categoryRows.map((c) => c.category_id) };
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

export async function getFeaturedLogosForAdmin() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("featured_logos")
    .select("id, name, logo_url, link_url, created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getSiteSettingsForAdmin() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("featured_logos_enabled")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function getNgosForAdmin() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("ngos")
    .select("id, name, logo_url, legal_license_url, payout_account_name, payout_account_number")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getUsersForAdmin() {
  const admin = createAdminClient();
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, email, full_name, account_status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!profiles.length) return [];

  const { data: experts } = await admin.from("experts").select("id, status");
  const expertStatusById = new Map((experts ?? []).map((e) => [e.id, e.status]));

  return profiles.map((p) => ({
    ...p,
    expertStatus: expertStatusById.get(p.id) ?? null,
  }));
}

export async function getNomineesForAdmin() {
  const admin = createAdminClient();
  const { data: nominees, error } = await admin
    .from("nominees")
    .select("id, name, status, resolved_expert_id, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!nominees.length) return [];

  const { data: nominations, error: nomError } = await admin
    .from("nominations")
    .select("id, nominee_id, nominator_id, reason, links, created_at");
  if (nomError) throw nomError;

  const nominatorIds = Array.from(new Set(nominations.map((n) => n.nominator_id)));
  const { data: profiles } = await admin.from("profiles").select("id, full_name, email").in("id", nominatorIds);
  const nominatorById = new Map((profiles ?? []).map((p) => [p.id, p.full_name || p.email]));

  const nominationsByNomineeId = new Map<string, typeof nominations>();
  for (const nom of nominations) {
    const list = nominationsByNomineeId.get(nom.nominee_id) ?? [];
    list.push(nom);
    nominationsByNomineeId.set(nom.nominee_id, list);
  }

  return nominees
    .map((nominee) => {
      const list = nominationsByNomineeId.get(nominee.id) ?? [];
      return {
        ...nominee,
        nominations: list
          .map((n) => ({ ...n, nominatorName: nominatorById.get(n.nominator_id) ?? "Unknown" }))
          .sort((a, b) => b.created_at.localeCompare(a.created_at)),
        count: list.length,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export async function getReviewsForAdmin() {
  const admin = createAdminClient();
  const { data: reviews, error } = await admin
    .from("reviews")
    .select("id, rating, comment, hidden, created_at, client_id, expert_id")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!reviews.length) return [];

  const profileIds = Array.from(new Set(reviews.flatMap((r) => [r.client_id, r.expert_id])));
  const { data: profiles } = await admin.from("profiles").select("id, full_name").in("id", profileIds);
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  return reviews.map((r) => ({
    ...r,
    clientName: nameById.get(r.client_id) ?? "Unknown",
    expertName: nameById.get(r.expert_id) ?? "Unknown",
  }));
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

export async function getAuditLogForAdmin(limit = 100) {
  const admin = createAdminClient();
  const { data: entries, error } = await admin
    .from("admin_audit_log")
    .select("id, admin_id, action, target_table, target_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  if (!entries.length) return [];

  const adminIds = Array.from(new Set(entries.map((e) => e.admin_id).filter((id): id is string => Boolean(id))));
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .in("id", adminIds.length > 0 ? adminIds : [""]);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return entries.map((e) => ({
    ...e,
    adminProfile: e.admin_id ? (profileById.get(e.admin_id) ?? null) : null,
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
    { count: expertProfileViews },
    { count: totalWebsiteViews },
  ] = await Promise.all([
    admin.from("experts").select("id", { count: "exact", head: true }),
    admin.from("experts").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("experts").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("experts").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("experts").select("id", { count: "exact", head: true }).eq("status", "suspended"),
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("expert_profile_views").select("id", { count: "exact", head: true }),
    admin.from("page_views").select("id", { count: "exact", head: true }),
  ]);

  const experts = totalExperts ?? 0;
  const profiles = totalProfiles ?? 0;
  const expertViews = expertProfileViews ?? 0;
  const websiteViews = totalWebsiteViews ?? 0;
  const approved = approvedExperts ?? 0;

  return {
    totalExperts: experts,
    approvedExperts: approved,
    pendingExperts: pendingExperts ?? 0,
    rejectedExperts: rejectedExperts ?? 0,
    suspendedExperts: suspendedExperts ?? 0,
    totalClients: Math.max(profiles - experts, 0),
    totalWebsiteViews: websiteViews,
    avgViewsPerExpert: approved > 0 ? expertViews / approved : 0,
  };
}
