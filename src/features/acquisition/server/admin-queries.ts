import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const PAGE_SIZE = 25;

export type AcquisitionLeadFilters = {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  category?: string;
  source?: string;
  hasNomination?: boolean;
  hasProblem?: boolean;
  q?: string;
};

function applyLeadFilters<T>(query: T, filters: AcquisitionLeadFilters): T {
  let q = query as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (filters.dateFrom) q = q.gte("created_at", filters.dateFrom);
  if (filters.dateTo) q = q.lte("created_at", filters.dateTo);
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.category) q = q.contains("categories_requested", [filters.category]);
  if (filters.source) q = q.eq("utm_source", filters.source);
  if (filters.hasProblem) q = q.not("problem_text", "is", null);
  if (filters.q) {
    const safe = filters.q.replace(/[,()%]/g, "");
    if (safe) q = q.or(`name.ilike.%${safe}%,raw_phone.ilike.%${safe}%,email.ilike.%${safe}%`);
  }
  return q as T;
}

export async function getLeadsForAdmin(filters: AcquisitionLeadFilters, page = 1) {
  const admin = createAdminClient();
  const from = (Math.max(1, page) - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const base = admin
    .from("acquisition_leads")
    .select(
      "id, name, raw_phone, email, categories_requested, problem_text, status, referral_code, referred_by_code, utm_source, source_page, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, error, count } = await applyLeadFilters(base, filters);
  if (error) throw error;

  const rows = data ?? [];
  const [referralCounts, nominationCounts] = await Promise.all([
    getReferralCountsByCode(
      admin,
      rows.map((r) => r.referral_code),
    ),
    getNominationCountsByLeadId(
      admin,
      rows.map((r) => r.id),
    ),
  ]);

  return {
    rows: rows.map((r) => ({
      ...r,
      referralCount: referralCounts.get(r.referral_code) ?? 0,
      nominationCount: nominationCounts.get(r.id) ?? 0,
    })),
    total: count ?? 0,
    page: Math.max(1, page),
    pageSize: PAGE_SIZE,
  };
}

export async function getAllLeadsForExport(filters: AcquisitionLeadFilters) {
  const admin = createAdminClient();
  const base = admin
    .from("acquisition_leads")
    .select(
      "id, name, raw_phone, email, categories_requested, problem_text, status, utm_source, utm_campaign, referral_code, referred_by_code, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(10000);

  const { data, error } = await applyLeadFilters(base, filters);
  if (error) throw error;
  const rows = data ?? [];

  const [referralCounts, nominationCounts] = await Promise.all([
    getReferralCountsByCode(
      admin,
      rows.map((r) => r.referral_code),
    ),
    getNominationCountsByLeadId(
      admin,
      rows.map((r) => r.id),
    ),
  ]);

  return rows.map((r) => ({
    ...r,
    referralCount: referralCounts.get(r.referral_code) ?? 0,
    nominationCount: nominationCounts.get(r.id) ?? 0,
  }));
}

export async function getLeadByIdForAdmin(id: string) {
  const admin = createAdminClient();
  const { data: lead, error } = await admin.from("acquisition_leads").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!lead) return null;

  const [{ data: sessions }, { data: nominations }] = await Promise.all([
    admin
      .from("acquisition_sessions")
      .select("session_id, status, source_page, device_type, started_at, completed_at")
      .eq("lead_id", id)
      .order("started_at", { ascending: true }),
    admin
      .from("nominations")
      .select("id, nominee_id, company, topic, reason, created_at, nominees(name, description)")
      .eq("nominator_lead_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const { count: referralCount } = await admin
    .from("acquisition_leads")
    .select("*", { count: "exact", head: true })
    .eq("referred_by_code", lead.referral_code);

  return {
    lead,
    sessions: sessions ?? [],
    nominations: nominations ?? [],
    referralCount: referralCount ?? 0,
  };
}

async function getReferralCountsByCode(admin: ReturnType<typeof createAdminClient>, codes: string[]) {
  const uniqueCodes = Array.from(new Set(codes));
  if (uniqueCodes.length === 0) return new Map<string, number>();
  const { data } = await admin.from("acquisition_leads").select("referred_by_code").in("referred_by_code", uniqueCodes);
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.referred_by_code) continue;
    counts.set(row.referred_by_code, (counts.get(row.referred_by_code) ?? 0) + 1);
  }
  return counts;
}

async function getNominationCountsByLeadId(admin: ReturnType<typeof createAdminClient>, leadIds: string[]) {
  if (leadIds.length === 0) return new Map<string, number>();
  const { data } = await admin.from("nominations").select("nominator_lead_id").in("nominator_lead_id", leadIds);
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.nominator_lead_id) continue;
    counts.set(row.nominator_lead_id, (counts.get(row.nominator_lead_id) ?? 0) + 1);
  }
  return counts;
}

export type FoundingExpertApplicationFilters = {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  professionalType?: string;
  q?: string;
};

function applyApplicationFilters<T>(query: T, filters: FoundingExpertApplicationFilters): T {
  let q = query as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (filters.dateFrom) q = q.gte("created_at", filters.dateFrom);
  if (filters.dateTo) q = q.lte("created_at", filters.dateTo);
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.professionalType) q = q.eq("professional_type", filters.professionalType);
  if (filters.q) {
    const safe = filters.q.replace(/[,()%]/g, "");
    if (safe) q = q.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,current_company.ilike.%${safe}%`);
  }
  return q as T;
}

export async function getApplicationsForAdmin(filters: FoundingExpertApplicationFilters, page = 1) {
  const admin = createAdminClient();
  const from = (Math.max(1, page) - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const base = admin
    .from("founding_expert_applications")
    .select(
      "id, name, raw_phone, email, professional_type, current_role, current_company, expertise_topics, linkedin_url, status, source_page, utm_source, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, error, count } = await applyApplicationFilters(base, filters);
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0, page: Math.max(1, page), pageSize: PAGE_SIZE };
}

export async function getAllApplicationsForExport(filters: FoundingExpertApplicationFilters) {
  const admin = createAdminClient();
  const base = admin
    .from("founding_expert_applications")
    .select(
      "name, raw_phone, email, professional_type, current_role, current_company, expertise_topics, experience_text, linkedin_url, website_url, instagram_url, status, utm_source, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(10000);

  const { data, error } = await applyApplicationFilters(base, filters);
  if (error) throw error;
  return data ?? [];
}

export async function getApplicationByIdForAdmin(id: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.from("founding_expert_applications").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}
