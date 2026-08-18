import Link from "next/link";
import type { Metadata } from "next";
import { getApplicationsForAdmin } from "@/features/acquisition/server/admin-queries";
import { PROFESSIONAL_TYPES } from "@/features/acquisition/config";

export const metadata: Metadata = {
  title: "Founding Expert Applications",
};

const STATUS_OPTIONS = ["", "New", "Under Review", "Shortlisted", "Contacted", "Approved", "Waitlisted", "Rejected", "Onboarding", "Published"];

export default async function AcquisitionApplicationsPage({
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
    professionalType: params.type,
    q: params.q,
  };

  const { rows, total, pageSize } = await getApplicationsForAdmin(filters, page);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const filterQuery = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => entry[0] !== "page" && Boolean(entry[1])),
  ).toString();

  function pageHref(targetPage: number) {
    const qs = new URLSearchParams(filterQuery);
    qs.set("page", String(targetPage));
    return `/admin/acquisition/applications?${qs.toString()}`;
  }

  const exportAllHref = "/api/admin/acquisition/applications/export";
  const exportFilteredHref = `/api/admin/acquisition/applications/export${filterQuery ? `?${filterQuery}` : ""}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Founding Expert Applications</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">Everyone who applied to become a Founding Expert.</p>
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
          Professional type
          <select name="type" defaultValue={params.type ?? ""} className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15">
            <option value="">Any</option>
            {PROFESSIONAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Search name / email / company
          <input type="text" name="q" defaultValue={params.q ?? ""} placeholder="Keyword" className="mt-1 block rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15" />
        </label>
        <button type="submit" className="rounded-md bg-foreground px-4 py-1.5 text-sm text-background">
          Filter
        </button>
        {filterQuery && (
          <Link href="/admin/acquisition/applications" className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No applications match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-black/40 dark:border-white/15 dark:text-white/40">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Expertise</th>
                <th className="py-2 pr-3">Source</th>
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
                    <Link href={`/admin/acquisition/applications/${row.id}`} className="font-medium hover:underline">
                      {row.name}
                    </Link>
                  </td>
                  <td className="py-2 pr-3">{row.professional_type}</td>
                  <td className="py-2 pr-3">
                    {[row.current_role, row.current_company].filter(Boolean).join(" @ ") || "—"}
                  </td>
                  <td className="py-2 pr-3">{row.expertise_topics.slice(0, 2).join(", ") || "—"}</td>
                  <td className="py-2 pr-3">{row.utm_source ?? row.source_page ?? "Direct"}</td>
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
