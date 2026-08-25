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
    <div className="mx-auto max-w-6xl bg-pivot-paper px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-pivot-ink">Founding Expert Applications</h1>
          <p className="mt-1 text-sm text-pivot-muted">Everyone who applied to become a Founding Expert.</p>
        </div>
        <div className="flex gap-2">
          <Link href={exportFilteredHref} className="rounded-md border border-pivot-line px-3 py-1.5 text-sm text-pivot-ink">
            Export Filtered
          </Link>
          <Link href={exportAllHref} className="rounded-md bg-pivot-ink px-3 py-1.5 text-sm text-pivot-paper">
            Export All (Excel)
          </Link>
        </div>
      </div>

      <form method="GET" className="mb-6 flex flex-wrap items-end gap-2 rounded-lg border border-pivot-line bg-pivot-white p-4">
        <label className="text-xs text-pivot-ink">
          From
          <input type="date" name="from" defaultValue={params.from ?? ""} className="mt-1 block border border-pivot-line bg-pivot-paper px-2 py-1.5 text-sm text-pivot-ink outline-none" />
        </label>
        <label className="text-xs text-pivot-ink">
          To
          <input type="date" name="to" defaultValue={params.to ?? ""} className="mt-1 block border border-pivot-line bg-pivot-paper px-2 py-1.5 text-sm text-pivot-ink outline-none" />
        </label>
        <label className="text-xs text-pivot-ink">
          Status
          <select name="status" defaultValue={params.status ?? ""} className="mt-1 block border border-pivot-line bg-pivot-paper px-2 py-1.5 text-sm text-pivot-ink outline-none">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s || "Any"}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-pivot-ink">
          Professional type
          <select name="type" defaultValue={params.type ?? ""} className="mt-1 block border border-pivot-line bg-pivot-paper px-2 py-1.5 text-sm text-pivot-ink outline-none">
            <option value="">Any</option>
            {PROFESSIONAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-pivot-ink">
          Search name / email / company
          <input type="text" name="q" defaultValue={params.q ?? ""} placeholder="Keyword" className="mt-1 block border border-pivot-line bg-pivot-paper px-2 py-1.5 text-sm text-pivot-ink outline-none" />
        </label>
        <button type="submit" className="rounded-md bg-pivot-ink px-4 py-1.5 text-sm text-pivot-paper">
          Filter
        </button>
        {filterQuery && (
          <Link href="/admin/acquisition/applications" className="text-sm text-pivot-muted hover:text-pivot-ink">
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <p className="text-sm text-pivot-muted">No applications match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-pivot-line text-left text-xs uppercase tracking-wide text-pivot-muted">
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
                <tr key={row.id} className="border-b border-pivot-line text-pivot-ink">
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
            className={`rounded-md border border-pivot-line px-3 py-1.5 text-pivot-ink ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
          >
            Previous
          </Link>
          <span className="text-pivot-muted">
            Page {page} of {totalPages}
          </span>
          <Link
            href={pageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={`rounded-md border border-pivot-line px-3 py-1.5 text-pivot-ink ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
