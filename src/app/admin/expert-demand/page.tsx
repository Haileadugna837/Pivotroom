import Link from "next/link";
import type { Metadata } from "next";
import { getFinderSessionsForAdmin, getFinderSummaryStats } from "@/features/finder/server/admin-queries";
import { FINDER_IDENTITIES, identityLabel } from "@/features/finder/config";

export const metadata: Metadata = {
  title: "Expert Demand",
};

const RESULT_OPTIONS = [
  { value: "", label: "Any result" },
  { value: "experts_found", label: "Expert found" },
  { value: "no_match", label: "No expert found" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Any status" },
  { value: "started", label: "Started" },
  { value: "in_progress", label: "In progress" },
  { value: "search_completed", label: "Search completed" },
  { value: "results_viewed", label: "Results viewed" },
  { value: "no_expert_found", label: "No expert found" },
  { value: "contact_submitted", label: "Contact submitted" },
];

const ABANDONED_AFTER_MS = 30 * 60 * 1000;

function displayStatus(status: string, lastActivityAt: string) {
  if ((status === "started" || status === "in_progress") && Date.now() - new Date(lastActivityAt).getTime() > ABANDONED_AFTER_MS) {
    return "Abandoned";
  }
  const labels: Record<string, string> = {
    started: "Started",
    in_progress: "In progress",
    search_completed: "Search completed",
    results_viewed: "Results viewed",
    no_expert_found: "No expert found",
    contact_submitted: "New lead",
  };
  return labels[status] ?? status;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-black/50 dark:text-white/50">{label}</p>
    </div>
  );
}

export default async function ExpertDemandPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;
  const filters = {
    dateFrom: params.from,
    dateTo: params.to,
    identity: params.identity,
    problem: params.problem,
    categoryId: params.category,
    resultStatus: params.result,
    status: params.status,
    source: params.source,
    q: params.q,
  };

  const [{ rows, total, pageSize }, stats] = await Promise.all([
    getFinderSessionsForAdmin(filters, page),
    getFinderSummaryStats(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const filterQuery = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => entry[0] !== "page" && Boolean(entry[1])),
  ).toString();

  function pageHref(targetPage: number) {
    const qs = new URLSearchParams(filterQuery);
    qs.set("page", String(targetPage));
    return `/admin/expert-demand?${qs.toString()}`;
  }

  const exportAllHref = "/api/admin/expert-demand/export";
  const exportFilteredHref = `/api/admin/expert-demand/export${filterQuery ? `?${filterQuery}` : ""}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Expert Demand</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            Everything visitors have told the &quot;Find the right expert&quot; homepage tool.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={exportFilteredHref}
            className="rounded-md border border-black/10 px-3 py-1.5 text-sm dark:border-white/15"
          >
            Export Filtered
          </Link>
          <Link href={exportAllHref} className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background">
            Export All (Excel)
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Finder Sessions" value={stats.totalSessions} />
        <StatCard label="Completed Searches" value={stats.completedSearches} />
        <StatCard label="Matching Expert Found" value={stats.expertsFound} />
        <StatCard label="No Expert Found" value={stats.noExpertFound} />
        <StatCard label="Contact Requests" value={stats.contactRequests} />
        <StatCard label="Anonymous Demand" value={stats.anonymousDemand} />
        <StatCard label="Conversion to Contact" value={`${stats.conversionToContact}%`} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
            Most Requested Problems
          </p>
          {stats.topProblems.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">No data yet.</p>
          ) : (
            <ul className="flex flex-col gap-1.5 text-sm">
              {stats.topProblems.map((p) => (
                <li key={p.label} className="flex justify-between">
                  <span>{p.label}</span>
                  <span className="text-black/50 dark:text-white/50">{p.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
            Most Requested Categories
          </p>
          {stats.topCategories.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">No data yet.</p>
          ) : (
            <ul className="flex flex-col gap-1.5 text-sm">
              {stats.topCategories.map((c) => (
                <li key={c.label} className="flex justify-between">
                  <span>{c.label}</span>
                  <span className="text-black/50 dark:text-white/50">{c.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <form
        method="GET"
        className="mb-6 flex flex-wrap items-end gap-2 rounded-lg border border-black/10 p-4 dark:border-white/15"
      >
        <label className="text-xs">
          From
          <input
            type="date"
            name="from"
            defaultValue={params.from ?? ""}
            className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15"
          />
        </label>
        <label className="text-xs">
          To
          <input
            type="date"
            name="to"
            defaultValue={params.to ?? ""}
            className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15"
          />
        </label>
        <label className="text-xs">
          Identity
          <select
            name="identity"
            defaultValue={params.identity ?? ""}
            className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15"
          >
            <option value="">Any</option>
            {FINDER_IDENTITIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Result
          <select
            name="result"
            defaultValue={params.result ?? ""}
            className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15"
          >
            {RESULT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Status
          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Search name / phone
          <input
            type="text"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Keyword"
            className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15"
          />
        </label>
        <button type="submit" className="rounded-md bg-foreground px-4 py-1.5 text-sm text-background">
          Filter
        </button>
        {filterQuery && (
          <Link href="/admin/expert-demand" className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No finder sessions match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-black/40 dark:border-white/15 dark:text-white/40">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Visitor</th>
                <th className="py-2 pr-3">Who They Are</th>
                <th className="py-2 pr-3">Need</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Result</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-black/5 dark:border-white/10">
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </td>
                  <td className="py-2 pr-3">{row.name ? row.name : "Anonymous"}</td>
                  <td className="py-2 pr-3">{identityLabel(row.identity) ?? "—"}</td>
                  <td className="py-2 pr-3">{row.problem ? row.problem.replace(/_/g, " ") : "—"}</td>
                  <td className="py-2 pr-3">{(row.categories as { name: string } | null)?.name ?? "—"}</td>
                  <td className="py-2 pr-3">
                    {row.match_status === "experts_found"
                      ? `${row.match_count ?? 0} Experts Found`
                      : row.match_status === "no_match"
                        ? "No Match"
                        : "—"}
                  </td>
                  <td className="py-2 pr-3">{row.name ?? "—"}</td>
                  <td className="py-2 pr-3">{row.phone ?? "—"}</td>
                  <td className="py-2 pr-3">{displayStatus(row.status, row.last_activity_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={`rounded-md border border-black/10 px-3 py-1.5 dark:border-white/15 ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
          >
            Previous
          </Link>
          <span className="text-black/50 dark:text-white/50">
            Page {page} of {totalPages}
          </span>
          <Link
            href={pageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={`rounded-md border border-black/10 px-3 py-1.5 dark:border-white/15 ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
