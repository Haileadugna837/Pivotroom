import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { ACQUISITION_CATEGORIES, acquisitionCategoryLabel } from "@/features/acquisition/config";
import { computeDemandGap, computeFunnelSteps, type FunnelStepResult } from "@/features/acquisition/lib/analytics";

const PAGE_SIZE = 25;
// Row sets for the Analytics page are fetched whole and aggregated in JS
// (same idiom as finder/server/admin-queries.ts's rank() helper) rather
// than via GROUP BY, since Supabase's query builder doesn't expose
// arbitrary grouping and Phase 1's expected volume (dozens-to-low-thousands
// of rows) makes this both simpler and fast enough. This cap is a safety
// net, not a real pagination story — revisit with a real aggregation
// query (or an RPC) if volume ever approaches it.
const ANALYTICS_ROW_CAP = 10000;

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

export type ExpertApplicationFilters = {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  q?: string;
};

function applyApplicationFilters<T>(query: T, filters: ExpertApplicationFilters): T {
  let q = query as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (filters.dateFrom) q = q.gte("created_at", filters.dateFrom);
  if (filters.dateTo) q = q.lte("created_at", filters.dateTo);
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.q) {
    const safe = filters.q.replace(/[,()%]/g, "");
    if (safe) q = q.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,current_company.ilike.%${safe}%`);
  }
  return q as T;
}

export async function getApplicationsForAdmin(filters: ExpertApplicationFilters, page = 1) {
  const admin = createAdminClient();
  const from = (Math.max(1, page) - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const base = admin
    .from("expert_applications")
    .select(
      "id, name, raw_phone, email, current_role, current_company, categories_requested, linkedin_url, status, source_page, utm_source, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, error, count } = await applyApplicationFilters(base, filters);
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0, page: Math.max(1, page), pageSize: PAGE_SIZE };
}

export async function getAllApplicationsForExport(filters: ExpertApplicationFilters) {
  const admin = createAdminClient();
  const base = admin
    .from("expert_applications")
    .select(
      "name, raw_phone, email, current_role, current_company, categories_requested, experience_text, problems_solved_text, why_join_text, linkedin_url, status, utm_source, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(10000);

  const { data, error } = await applyApplicationFilters(base, filters);
  if (error) throw error;
  return data ?? [];
}

export async function getApplicationByIdForAdmin(id: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.from("expert_applications").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

// Cheap head:true counts for the small /admin home summary widget —
// deliberately not the full getAcquisitionAnalytics() computation, which
// fetches whole row sets and would be overkill for four numbers.
export async function getAcquisitionSummaryForAdminHome() {
  const admin = createAdminClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: leads }, { count: applications }, { count: nominations }, { count: leadsThisWeek }] = await Promise.all([
    admin.from("acquisition_leads").select("*", { count: "exact", head: true }),
    admin.from("expert_applications").select("*", { count: "exact", head: true }),
    admin.from("nominations").select("*", { count: "exact", head: true }).eq("source", "acquisition_landing"),
    admin.from("acquisition_leads").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
  ]);

  return {
    leads: leads ?? 0,
    applications: applications ?? 0,
    nominations: nominations ?? 0,
    leadsThisWeek: leadsThisWeek ?? 0,
  };
}

export type AnalyticsDateRange = { dateFrom?: string; dateTo?: string };

function rank(values: string[], limit = 5) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function distinctSessionsForEvent(events: { session_id: string; event_type: string }[], eventType: string) {
  return new Set(events.filter((e) => e.event_type === eventType).map((e) => e.session_id)).size;
}

const USER_FUNNEL_EVENTS: { label: string; eventType: string | null }[] = [
  { label: "Homepage Visitors", eventType: null }, // filled from session count
  { label: "Clicked Get Early Access", eventType: "early_access_cta_clicked" },
  { label: "Started User Funnel", eventType: "user_funnel_started" },
  { label: "Selected Category", eventType: "user_category_selected" },
  { label: "Added Problem", eventType: "user_problem_entered" },
  { label: "Entered Contact", eventType: "user_contact_started" },
  { label: "Completed Early Access", eventType: "user_registration_completed" },
];

const EXPERT_FUNNEL_EVENTS: { label: string; eventType: string | null }[] = [
  { label: "Landing Visitors", eventType: null },
  { label: "Application Started", eventType: "expert_application_started" },
  { label: "Identity Completed", eventType: "expert_application_identity_completed" },
  { label: "Categories Completed", eventType: "expert_application_categories_completed" },
  { label: "Application Submitted", eventType: "expert_application_submitted" },
];

export async function getAcquisitionAnalytics(range: AnalyticsDateRange) {
  const admin = createAdminClient();
  const fromIso = range.dateFrom ? new Date(range.dateFrom).toISOString() : undefined;
  // End-of-day for the "to" date, so a same-day range isn't empty.
  const toIso = range.dateTo ? new Date(`${range.dateTo}T23:59:59.999Z`).toISOString() : undefined;

  function withRange<T>(query: T, column: string): T {
    let q = query as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (fromIso) q = q.gte(column, fromIso);
    if (toIso) q = q.lte(column, toIso);
    return q as T;
  }

  const [
    { data: sessions },
    { data: funnelEvents },
    { data: leads },
    { data: applications },
    { data: nominations },
    { data: expertCategoryRows },
  ] = await Promise.all([
    withRange(
      admin.from("acquisition_sessions").select("session_id, source_page, device_type, utm_source, started_at"),
      "started_at",
    ).limit(ANALYTICS_ROW_CAP),
    withRange(admin.from("acquisition_funnel_events").select("session_id, event_type, created_at"), "created_at").limit(
      ANALYTICS_ROW_CAP,
    ),
    withRange(
      admin.from("acquisition_leads").select("id, categories_requested, problem_text, utm_source, referred_by_code, created_at"),
      "created_at",
    ).limit(ANALYTICS_ROW_CAP),
    withRange(admin.from("expert_applications").select("id, utm_source, created_at"), "created_at").limit(
      ANALYTICS_ROW_CAP,
    ),
    withRange(
      admin.from("nominations").select("id, nominee_id, nominator_id, nominator_lead_id, company, topic, created_at, nominees(name, description)"),
      "created_at",
    ).limit(ANALYTICS_ROW_CAP),
    // Current supply, not date-ranged — "how many experts exist right now
    // for this category," not "how many joined in this window."
    admin
      .from("expert_categories")
      .select("category_id, experts!inner(status)")
      .eq("experts.status", "approved")
      .limit(ANALYTICS_ROW_CAP),
  ]);

  const sessionRows = sessions ?? [];
  const eventRows = funnelEvents ?? [];
  const leadRows = leads ?? [];
  const applicationRows = applications ?? [];
  const nominationRows = nominations ?? [];
  const visitorCount = sessionRows.length;

  const userFunnel: FunnelStepResult[] = computeFunnelSteps(
    USER_FUNNEL_EVENTS.map((s) => ({
      label: s.label,
      count: s.eventType ? distinctSessionsForEvent(eventRows, s.eventType) : visitorCount,
    })),
  );
  const expertFunnel: FunnelStepResult[] = computeFunnelSteps(
    EXPERT_FUNNEL_EVENTS.map((s) => ({
      label: s.label,
      count: s.eventType ? distinctSessionsForEvent(eventRows, s.eventType) : visitorCount,
    })),
  );

  const applicationsStarted = distinctSessionsForEvent(eventRows, "expert_application_started");

  const kpis = {
    visitors: visitorCount,
    leads: leadRows.length,
    applications: applicationRows.length,
    nominations: nominationRows.length,
    referrals: leadRows.filter((l) => l.referred_by_code).length,
    userConversionRate: visitorCount > 0 ? Math.round((leadRows.length / visitorCount) * 100) : 0,
    expertConversionRate:
      applicationsStarted > 0 ? Math.round((applicationRows.length / applicationsStarted) * 100) : 0,
  };

  const topCategories = rank(
    leadRows.flatMap((l) => l.categories_requested ?? []).map(acquisitionCategoryLabel),
    10,
  );

  const expertCountByCategoryId = new Map<string, number>();
  for (const row of expertCategoryRows ?? []) {
    expertCountByCategoryId.set(row.category_id, (expertCountByCategoryId.get(row.category_id) ?? 0) + 1);
  }
  const demandGap = ACQUISITION_CATEGORIES.map((c) => {
    const requests = leadRows.filter((l) => (l.categories_requested ?? []).includes(c.key)).length;
    const existingExperts = c.mappedCategoryIds.reduce((sum, id) => sum + (expertCountByCategoryId.get(id) ?? 0), 0);
    return { category: c.label, requests, existingExperts, gap: computeDemandGap(requests, existingExperts) };
  }).sort((a, b) => b.requests - a.requests);

  const recentProblems = leadRows
    .filter((l) => l.problem_text)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 10)
    .map((l) => ({ id: l.id, problem: l.problem_text as string, createdAt: l.created_at }));

  const nominatorKeys = nominationRows.map((n) => n.nominator_id ?? n.nominator_lead_id ?? `anon-${n.id}`);
  const nominatorCounts = new Map<string, number>();
  for (const key of nominatorKeys) nominatorCounts.set(key, (nominatorCounts.get(key) ?? 0) + 1);

  const nominationAnalytics = {
    total: nominationRows.length,
    uniqueNominators: nominatorCounts.size,
    repeatNominators: Array.from(nominatorCounts.values()).filter((c) => c > 1).length,
    topNominees: rank(
      nominationRows.map((n) => {
        const nominee = n.nominees as { name: string | null; description: string | null } | null;
        return nominee?.name ?? nominee?.description ?? "Unnamed";
      }),
    ),
    topCompanies: rank(nominationRows.map((n) => n.company).filter((c): c is string => Boolean(c))),
    topTopics: rank(nominationRows.map((n) => n.topic).filter((t): t is string => Boolean(t))),
  };

  const sourceKeys = Array.from(new Set(sessionRows.map((s) => s.utm_source || "Direct")));
  const trafficBySource = sourceKeys
    .map((source) => {
      const sourceVisitors = sessionRows.filter((s) => (s.utm_source || "Direct") === source).length;
      const sourceLeads = leadRows.filter((l) => (l.utm_source || "Direct") === source).length;
      const sourceApplications = applicationRows.filter((a) => (a.utm_source || "Direct") === source).length;
      return {
        source,
        visitors: sourceVisitors,
        leads: sourceLeads,
        applications: sourceApplications,
        conversionRate: sourceVisitors > 0 ? Math.round((sourceLeads / sourceVisitors) * 100) : 0,
      };
    })
    .sort((a, b) => b.visitors - a.visitors);

  const deviceBreakdown = rank(sessionRows.map((s) => s.device_type || "Unknown"), 10);

  return {
    kpis,
    userFunnel,
    expertFunnel,
    topCategories,
    demandGap,
    recentProblems,
    nominationAnalytics,
    trafficBySource,
    deviceBreakdown,
  };
}
