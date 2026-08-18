import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getApplicationByIdForAdmin } from "@/features/acquisition/server/admin-queries";
import { updateApplicationNote, updateApplicationStatus } from "@/features/acquisition/server/admin-actions";
import { ApproveInviteForm } from "@/features/acquisition/components/admin/approve-invite-form";

export const metadata: Metadata = {
  title: "Founding Expert Application",
};

const STATUS_OPTIONS = ["New", "Under Review", "Shortlisted", "Contacted", "Approved", "Waitlisted", "Rejected", "Onboarding", "Published"];

export default async function AcquisitionApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getApplicationByIdForAdmin(id);
  if (!application) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/admin/acquisition/applications" className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
        ← Applications
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-xl font-semibold">{application.name}</h1>
        <form action={updateApplicationStatus} className="flex items-center gap-2">
          <input type="hidden" name="id" value={application.id} />
          <select name="status" defaultValue={application.status} className="rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/15">
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
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Personal Information</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-black/50 dark:text-white/50">Phone</dt>
          <dd>{application.raw_phone ?? "—"}</dd>
          <dt className="text-black/50 dark:text-white/50">Email</dt>
          <dd>{application.email ?? "—"}</dd>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Professional Information</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-black/50 dark:text-white/50">Type</dt>
          <dd>
            {application.professional_type}
            {application.professional_type_secondary && ` / ${application.professional_type_secondary}`}
          </dd>
          <dt className="text-black/50 dark:text-white/50">Current position</dt>
          <dd>{[application.current_role, application.current_company].filter(Boolean).join(" @ ") || "—"}</dd>
          <dt className="text-black/50 dark:text-white/50">Years of experience</dt>
          <dd>{application.years_experience ?? "—"}</dd>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Expertise</h2>
        <p className="mt-2 text-sm">{application.expertise_topics.join(", ") || "—"}</p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-black/70 dark:text-white/70">{application.experience_text}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Links</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-black/50 dark:text-white/50">LinkedIn</dt>
          <dd>{application.linkedin_url ?? "—"}</dd>
          <dt className="text-black/50 dark:text-white/50">Website</dt>
          <dd>{application.website_url ?? "—"}</dd>
          <dt className="text-black/50 dark:text-white/50">Instagram / other</dt>
          <dd>{application.instagram_url ?? "—"}</dd>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Acquisition</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-black/50 dark:text-white/50">Source page</dt>
          <dd>{application.source_page ?? "—"}</dd>
          <dt className="text-black/50 dark:text-white/50">UTM campaign</dt>
          <dd>{[application.utm_source, application.utm_medium, application.utm_campaign].filter(Boolean).join(" / ") || "—"}</dd>
        </dl>
      </section>

      <section className="mt-6 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Application</h2>
        <p className="mt-2 text-sm">
          Submitted {new Date(application.created_at).toLocaleString()}
          {application.invited_at && <> — invited {new Date(application.invited_at).toLocaleString()}</>}
        </p>
        {!application.expert_invite_id && (
          <div className="mt-3">
            <ApproveInviteForm applicationId={application.id} hasEmail={Boolean(application.email)} />
          </div>
        )}
      </section>

      <section className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Internal notes</h2>
        <form action={updateApplicationNote} className="mt-2 flex flex-col gap-2">
          <input type="hidden" name="id" value={application.id} />
          <textarea
            name="note"
            defaultValue={application.admin_note ?? ""}
            rows={3}
            placeholder="Not visible to the applicant"
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
