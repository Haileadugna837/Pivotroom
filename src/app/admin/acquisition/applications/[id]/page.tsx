import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getApplicationByIdForAdmin } from "@/features/acquisition/server/admin-queries";
import { updateApplicationNote, updateApplicationStatus } from "@/features/acquisition/server/admin-actions";
import { acquisitionCategoryLabel } from "@/features/acquisition/config";
import { AcceptApplicationForm } from "@/features/acquisition/components/admin/accept-application-form";
import { RejectApplicationForm } from "@/features/acquisition/components/admin/reject-application-form";

export const metadata: Metadata = {
  title: "Expert Application",
};

// "Rejected" is deliberately not offered here — rejecting always goes
// through the dedicated Reject form below, which notifies the applicant
// by email with an optional reason. updateApplicationStatus still
// validates "Rejected" as a legal value server-side (defense in depth).
const STATUS_OPTIONS = ["New", "Under Review", "Shortlisted", "Contacted", "Approved", "Waitlisted", "Onboarding", "Published"];

// Mirrors NomineesView's status color-coding — olive for a positive
// terminal state, danger for a negative one, accent for everything still
// in progress.
const STATUS_STYLE: Record<string, string> = {
  Approved: "bg-pivot-olive/10 text-pivot-olive",
  Published: "bg-pivot-olive/10 text-pivot-olive",
  Rejected: "bg-pivot-danger/10 text-pivot-danger",
};
function statusPillClass(status: string) {
  return STATUS_STYLE[status] ?? "bg-pivot-accent/10 text-pivot-accent";
}

const CARD = "rounded-lg border border-pivot-line bg-pivot-white p-6";

export default async function AcquisitionApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getApplicationByIdForAdmin(id);
  if (!application) notFound();

  const decisionBorderColor =
    application.status === "Approved"
      ? "border-l-pivot-olive"
      : application.status === "Rejected"
        ? "border-l-pivot-danger"
        : "border-l-pivot-accent";

  return (
    <div className="mx-auto max-w-3xl bg-pivot-paper px-6 py-10">
      <Link href="/admin/acquisition/applications" className="text-sm text-pivot-muted hover:text-pivot-ink">
        ← Applications
      </Link>

      <div className={`${CARD} mt-4 flex flex-col gap-4`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pivot-paper-2 font-serif text-xl text-pivot-ink">
              {application.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl text-pivot-ink">{application.name}</h1>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusPillClass(application.status)}`}>
                  {application.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-pivot-muted">
                Applied {new Date(application.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <form action={updateApplicationStatus} className="flex items-center gap-2 self-end">
          <input type="hidden" name="id" value={application.id} />
          <select name="status" defaultValue={application.status} className="border border-pivot-line bg-pivot-paper px-2 py-1.5 text-sm text-pivot-ink outline-none">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-md bg-pivot-ink px-3 py-1.5 text-sm text-pivot-paper">
            Update status
          </button>
        </form>
      </div>

      <div className={`${CARD} mt-5`}>
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">At a glance</h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-pivot-ink">
          <dt className="text-pivot-muted">Phone</dt>
          <dd>{application.raw_phone ?? "—"}</dd>
          <dt className="text-pivot-muted">Email</dt>
          <dd>{application.email ?? "—"}</dd>
          <dt className="text-pivot-muted">Current position</dt>
          <dd>{[application.current_role, application.current_company].filter(Boolean).join(" @ ") || "—"}</dd>
          <dt className="text-pivot-muted">Years of experience</dt>
          <dd>{application.years_experience_range ?? "—"}</dd>
          <dt className="text-pivot-muted">Preferred starting price (per hour)</dt>
          <dd>{application.preferred_price_etb != null ? `${application.preferred_price_etb} ETB/hr` : "—"}</dd>
          <dt className="text-pivot-muted">Initial availability</dt>
          <dd>{application.initial_availability ?? "—"}</dd>
          <dt className="text-pivot-muted">LinkedIn</dt>
          <dd>
            {application.linkedin_url ? (
              <a href={application.linkedin_url} target="_blank" rel="noreferrer" className="text-pivot-ink underline">
                {application.linkedin_url}
              </a>
            ) : (
              "—"
            )}
          </dd>
        </dl>
      </div>

      <div className={`${CARD} mt-5`}>
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Categories</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(application.categories_requested ?? []).length > 0 ? (
            application.categories_requested.map((key) => (
              <span key={key} className="rounded-full border border-pivot-line px-2.5 py-1 text-xs text-pivot-ink">
                {acquisitionCategoryLabel(key)}
              </span>
            ))
          ) : (
            <span className="text-sm text-pivot-muted">—</span>
          )}
        </div>
      </div>

      <div className={`${CARD} mt-5 divide-y divide-pivot-line`}>
        <div className="pb-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">
            What people should come to them for
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-pivot-ink-2">{application.problems_solved_text ?? "—"}</p>
        </div>
        <div className="py-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">
            Most relevant accomplishment or experience
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-pivot-ink-2">{application.experience_text}</p>
        </div>
        <div className="pt-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Why they want to join</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-pivot-ink-2">{application.why_join_text ?? "—"}</p>
        </div>
      </div>

      <div className={`${CARD} mt-5 border-l-4 ${decisionBorderColor}`}>
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Decision</h2>
        {application.status === "Rejected" ? (
          <p className="mt-3 text-sm text-pivot-ink-2">
            Rejected. {application.rejection_reason ? `Reason sent: "${application.rejection_reason}"` : "No reason was given to the applicant."}
          </p>
        ) : application.status === "Approved" ? (
          <p className="mt-3 text-sm text-pivot-ink-2">
            Accepted — the applicant has dashboard access and can complete their profile.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <AcceptApplicationForm applicationId={application.id} hasAccount={Boolean(application.applicant_user_id)} />
            <RejectApplicationForm applicationId={application.id} />
          </div>
        )}
      </div>

      <div className={`${CARD} mt-5`}>
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Source</h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-pivot-muted">
          <dt>Source page</dt>
          <dd>{application.source_page ?? "—"}</dd>
          <dt>UTM campaign</dt>
          <dd>{[application.utm_source, application.utm_medium, application.utm_campaign].filter(Boolean).join(" / ") || "—"}</dd>
        </dl>
      </div>

      <div className={`${CARD} mt-5`}>
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Internal notes</h2>
        <form action={updateApplicationNote} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="id" value={application.id} />
          <textarea
            name="note"
            defaultValue={application.admin_note ?? ""}
            rows={3}
            placeholder="Not visible to the applicant"
            className="w-full resize-none border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
          />
          <button type="submit" className="w-fit rounded-md bg-pivot-ink px-4 py-1.5 text-sm text-pivot-paper">
            Save note
          </button>
        </form>
      </div>
    </div>
  );
}
