import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLeadByIdForAdmin } from "@/features/acquisition/server/admin-queries";
import { updateLeadNote, updateLeadStatus } from "@/features/acquisition/server/admin-actions";
import { acquisitionCategoryLabel } from "@/features/acquisition/config";

export const metadata: Metadata = {
  title: "Lead",
};

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Priority", "Invited", "Activated", "Not Interested", "Archived"];

export default async function AcquisitionLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getLeadByIdForAdmin(id);
  if (!result) notFound();

  const { lead, sessions, nominations, referralCount } = result;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/admin/acquisition/leads" className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
        ← Leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-xl font-semibold">{lead.name}</h1>
        <form action={updateLeadStatus} className="flex items-center gap-2">
          <input type="hidden" name="id" value={lead.id} />
          <select name="status" defaultValue={lead.status} className="rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background">
            Update status
          </button>
        </form>
      </div>

      <section className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Contact</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-black/50 dark:text-white/50">Phone</dt>
          <dd>{lead.raw_phone ?? "—"}</dd>
          <dt className="text-black/50 dark:text-white/50">Email</dt>
          <dd>{lead.email ?? "—"}</dd>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Demand</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-black/50 dark:text-white/50">Categories</dt>
          <dd>{lead.categories_requested.map(acquisitionCategoryLabel).join(", ") || "—"}</dd>
          <dt className="text-black/50 dark:text-white/50">Written problem</dt>
          <dd>{lead.problem_text ?? "—"}</dd>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Acquisition</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-black/50 dark:text-white/50">Source page</dt>
          <dd>{lead.source_page ?? "—"}</dd>
          <dt className="text-black/50 dark:text-white/50">UTM campaign</dt>
          <dd>
            {[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ") || "—"}
          </dd>
          <dt className="text-black/50 dark:text-white/50">Referred by</dt>
          <dd>{lead.referred_by_code ?? "—"}</dd>
          <dt className="text-black/50 dark:text-white/50">Referral code</dt>
          <dd>
            {lead.referral_code} ({referralCount} referred)
          </dd>
        </dl>
      </section>

      {nominations.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Nominations</h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {nominations.map((n) => {
              const nominee = n.nominees as { name: string | null; description: string | null } | null;
              return (
                <li key={n.id}>
                  {nominee?.name ?? nominee?.description ?? "Unnamed"}
                  {n.company && ` — ${n.company}`}
                  {n.topic && ` (${n.topic})`}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Timeline</h2>
        <ul className="mt-2 flex flex-col gap-1 text-sm">
          <li>Joined: {new Date(lead.created_at).toLocaleString()}</li>
          {sessions.map((s) => (
            <li key={s.session_id} className="text-black/60 dark:text-white/60">
              Session started {new Date(s.started_at).toLocaleString()} via {s.source_page ?? "unknown"} ({s.device_type ?? "unknown device"}) — {s.status}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Internal notes</h2>
        <form action={updateLeadNote} className="mt-2 flex flex-col gap-2">
          <input type="hidden" name="id" value={lead.id} />
          <textarea
            name="note"
            defaultValue={lead.admin_note ?? ""}
            rows={3}
            placeholder="Not visible to the lead"
            className="w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
          <button type="submit" className="w-fit rounded-md bg-foreground px-4 py-1.5 text-sm text-background">
            Save note
          </button>
        </form>
      </section>
    </div>
  );
}
