import Link from "next/link";
import type { Metadata } from "next";
import { getLeadsForAdmin } from "@/features/acquisition/server/admin-queries";
import { ACQUISITION_CATEGORIES } from "@/features/acquisition/config";

export const metadata: Metadata = {
  title: "Leads",
};

const STATUS_OPTIONS = ["", "New", "Contacted", "Qualified", "Priority", "Invited", "Activated", "Not Interested", "Archived"];

export default async function AcquisitionLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;
  const filters = {
    dateFrom: params.from,
    dateTo: params.to,
    status: params.status,
    category: params.category,
    source: params.source,
    hasProblem: params.has_problem === "1",
    q: params.q,
  };

  const { rows, total, pageSize } = await getLeadsForAdmin(filters, page);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const filterQuery = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => entry[0] !== "page" && Boolean(entry[1])),
  ).toString();

  function pageHref(targetPage: number) {
    const qs = new URLSearchParams(filterQuery);
    qs.set("page", String(targetPage));
    return `/admin/acquisition/leads?${qs.toString()}`;
  }

  const exportAllHref = "/api/admin/acquisition/leads/export";
  const exportFilteredHref = `/api/admin/acquisition/leads/export${filterQuery ? `?${filterQuery}` : ""}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Leads</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">Everyone who joined early access.</p>
        </div>
        <div className="flex gap-2">
          <Link href={exportFilteredHref} className="rounded-md border border-black/10 px-3 py-1.5 text-sm dark:border-white/15">
            Export Filtered
          </Link>
          <Link href={exportAllHref} className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background">
            Export All (Excel)
          </Link>
        </div>
      </div>

      <form method="GET" className="mb-6 flex flex-wrap items-end gap-2 rounded-lg border border-black/10 p-4 dark:border-white/15">
        <label className="text-xs">
          From
          <input type="date" name="from" defaultValue={params.from ?? ""} className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15" />
        </label>
        <label className="text-xs">
          To
          <input type="date" name="to" defaultValue={params.to ?? ""} className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15" />
        </label>
        <label className="text-xs">
          Status
          <select name="status" defaultValue={params.status ?? ""} className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s || "Any"}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Category
          <select name="category" defaultValue={params.category ?? ""} className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15">
            <option value="">Any</option>
            {ACQUISITION_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Search name / phone / email
          <input type="text" name="q" defaultValue={params.q ?? ""} placeholder="Keyword" className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15" />
        </label>
        <label className="flex items-center gap-1.5 text-xs">
          <input type="checkbox" name="has_problem" value="1" defaultChecked={params.has_problem === "1"} />
          Has written problem
        </label>
        <button type="submit" className="rounded-md bg-foreground px-4 py-1.5 text-sm text-background">
          Filter
        </button>
        {filterQuery && (
          <Link href="/admin/acquisition/leads" className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No leads match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-black/40 dark:border-white/15 dark:text-white/40">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">Categories</th>
                <th className="py-2 pr-3">Source</th>
                <th className="py-2 pr-3">Referrals</th>
                <th className="py-2 pr-3">Nominations</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-black/5 dark:border-white/10">
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </td>
                  <td className="py-2 pr-3">
                    <Link href={`/admin/acquisition/leads/${row.id}`} className="font-medium hover:underline">
                      {row.name}
                    </Link>
                  </td>
                  <td className="py-2 pr-3">{row.raw_phone ?? "—"}</td>
                  <td className="py-2 pr-3">{row.categories_requested.join(", ") || "—"}</td>
                  <td className="py-2 pr-3">{row.utm_source ?? row.source_page ?? "Direct"}</td>
                  <td className="py-2 pr-3">{row.referralCount}</td>
                  <td className="py-2 pr-3">{row.nominationCount}</td>
                  <td className="py-2 pr-3">{row.status}</td>
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
