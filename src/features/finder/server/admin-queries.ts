import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type FinderAdminFilters = {
  dateFrom?: string;
  dateTo?: string;
  identity?: string;
  problem?: string;
  categoryId?: string;
  resultStatus?: string;
  status?: string;
  source?: string;
  q?: string;
};

const PAGE_SIZE = 25;

function applyFilters<T>(query: T, filters: FinderAdminFilters): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q = query as any;
  if (filters.dateFrom) q = q.gte("created_at", filters.dateFrom);
  if (filters.dateTo) q = q.lte("created_at", filters.dateTo);
  if (filters.identity) q = q.eq("identity", filters.identity);
  if (filters.problem) q = q.eq("problem", filters.problem);
  if (filters.categoryId) q = q.eq("category_id", filters.categoryId);
  if (filters.resultStatus) q = q.eq("match_status", filters.resultStatus);
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.source) q = q.eq("source_page", filters.source);
  if (filters.q) {
    const safe = filters.q.replace(/[,()%]/g, "");
    if (safe) q = q.or(`name.ilike.%${safe}%,phone.ilike.%${safe}%`);
  }
  return q as T;
}

export async function getFinderSessionsForAdmin(filters: FinderAdminFilters, page = 1) {
  const admin = createAdminClient();
  const from = (Math.max(1, page) - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const base = admin
    .from("expert_finder_sessions")
    .select(
      "id, session_id, identity, problem, category_id, categories:category_id(name), match_count, match_status, name, phone, lead_submitted, status, source_page, created_at, last_activity_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, error, count } = await applyFilters(base, filters);
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0, page: Math.max(1, page), pageSize: PAGE_SIZE };
}

export async function getAllFinderSessionsForExport(filters: FinderAdminFilters) {
  const admin = createAdminClient();
  const base = admin
    .from("expert_finder_sessions")
    .select(
      "session_id, started_at, last_activity_at, identity, problem, category_id, categories:category_id(name), subcategory_id, match_count, match_status, name, phone, lead_submitted, status, source_page, device_type",
    )
    .order("created_at", { ascending: false })
    .limit(10000);

  const { data, error } = await applyFilters(base, filters);
  if (error) throw error;
  return data ?? [];
}

function humanize(slug: string) {
  return slug.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function rank(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export async function getFinderSummaryStats() {
  const admin = createAdminClient();

  const [
    { count: totalSessions },
    { count: expertsFound },
    { count: noExpertFound },
    { count: contactRequests },
    { count: anonymousDemand },
    { data: problemRows },
    { data: categoryRows },
  ] = await Promise.all([
    admin.from("expert_finder_sessions").select("*", { count: "exact", head: true }),
    admin.from("expert_finder_sessions").select("*", { count: "exact", head: true }).eq("match_status", "experts_found"),
    admin.from("expert_finder_sessions").select("*", { count: "exact", head: true }).eq("match_status", "no_match"),
    admin.from("expert_finder_sessions").select("*", { count: "exact", head: true }).eq("lead_submitted", true),
    admin
      .from("expert_finder_sessions")
      .select("*", { count: "exact", head: true })
      .is("name", null)
      .not("identity", "is", null),
    admin.from("expert_finder_sessions").select("problem").not("problem", "is", null),
    admin.from("expert_finder_sessions").select("categories:category_id(name)").not("category_id", "is", null),
  ]);

  const completedSearches = (expertsFound ?? 0) + (noExpertFound ?? 0);
  const conversionToContact =
    totalSessions && totalSessions > 0 ? Math.round(((contactRequests ?? 0) / totalSessions) * 100) : 0;

  const topProblems = rank((problemRows ?? []).map((r) => humanize(r.problem as string)));
  const topCategories = rank(
    (categoryRows ?? [])
      .map((r) => (r.categories as { name: string } | null)?.name)
      .filter((name): name is string => Boolean(name)),
  );

  return {
    totalSessions: totalSessions ?? 0,
    completedSearches,
    expertsFound: expertsFound ?? 0,
    noExpertFound: noExpertFound ?? 0,
    contactRequests: contactRequests ?? 0,
    anonymousDemand: anonymousDemand ?? 0,
    conversionToContact,
    topProblems,
    topCategories,
  };
}
