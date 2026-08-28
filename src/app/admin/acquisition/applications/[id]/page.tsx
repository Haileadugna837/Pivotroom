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

export default async function AcquisitionApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getApplicationByIdForAdmin(id);
  if (!application) notFound();

  return (
    <div className="mx-auto max-w-3xl bg-pivot-paper px-6 py-10">
      <Link href="/admin/acquisition/applications" className="text-sm text-pivot-muted hover:text-pivot-ink">
        ← Applications
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-xl font-semibold text-pivot-ink">{application.name}</h1>
        <form action={updateApplicationStatus} className="flex items-center gap-2">
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

      <section className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Personal Information</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-pivot-ink">
          <dt className="text-pivot-muted">Phone</dt>
          <dd>{application.raw_phone ?? "—"}</dd>
          <dt className="text-pivot-muted">Email</dt>
          <dd>{application.email ?? "—"}</dd>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Professional Information</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-pivot-ink">
          <dt className="text-pivot-muted">Current position</dt>
          <dd>{[application.current_role, application.current_company].filter(Boolean).join(" @ ") || "—"}</dd>
          <dt className="text-pivot-muted">Years of experience</dt>
          <dd>{application.years_experience_range ?? "—"}</dd>
          <dt className="text-pivot-muted">Preferred starting price (per hour)</dt>
          <dd>{application.preferred_price_etb != null ? `${application.preferred_price_etb} ETB/hr` : "—"}</dd>
          <dt className="text-pivot-muted">Initial availability</dt>
          <dd>{application.initial_availability ?? "—"}</dd>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Categories</h2>
        <p className="mt-2 text-sm text-pivot-ink">
          {(application.categories_requested ?? []).map(acquisitionCategoryLabel).join(", ") || "—"}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">
          What people should come to them for
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-pivot-ink-2">{application.problems_solved_text ?? "—"}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">
          Most relevant accomplishment or experience
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-pivot-ink-2">{application.experience_text}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Why they want to join</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-pivot-ink-2">{application.why_join_text ?? "—"}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Links</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-pivot-ink">
          <dt className="text-pivot-muted">LinkedIn</dt>
          <dd>{application.linkedin_url ?? "—"}</dd>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Acquisition</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-pivot-ink">
          <dt className="text-pivot-muted">Source page</dt>
          <dd>{application.source_page ?? "—"}</dd>
          <dt className="text-pivot-muted">UTM campaign</dt>
          <dd>{[application.utm_source, application.utm_medium, application.utm_campaign].filter(Boolean).join(" / ") || "—"}</dd>
        </dl>
      </section>

      <section className="mt-6 border-t border-pivot-line pt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Application</h2>
        <p className="mt-2 text-sm text-pivot-ink">Submitted {new Date(application.created_at).toLocaleString()}</p>
        {application.status === "Rejected" ? (
          <p className="mt-3 text-sm text-pivot-ink-2">
            Rejected. {application.rejection_reason ? `Reason sent: "${application.rejection_reason}"` : "No reason was given to the applicant."}
          </p>
        ) : application.status !== "Approved" ? (
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <AcceptApplicationForm applicationId={application.id} hasAccount={Boolean(application.applicant_user_id)} />
            <RejectApplicationForm applicationId={application.id} />
          </div>
        ) : null}
      </section>

      <section className="mt-8 border-t border-pivot-line pt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Internal notes</h2>
        <form action={updateApplicationNote} className="mt-2 flex flex-col gap-2">
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
      </section>
    </div>
  );
}
