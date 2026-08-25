"use client";

import { useState } from "react";
import { setNomineeStatus, mergeNominee } from "@/features/admin/server/actions";

type Nomination = {
  id: string;
  reason: string;
  links: string[];
  created_at: string;
  nominatorName: string;
  nominee_title: string | null;
  nominee_location: string | null;
  company: string | null;
  social_url: string | null;
  topic: string | null;
  categories_requested: string[];
  nominator_phone: string | null;
  nominator_email: string | null;
  nominator_relationship: string | null;
  intro_comfort: string | null;
};

type Nominee = {
  id: string;
  name: string | null;
  status: string;
  resolved_expert_id: string | null;
  created_at: string;
  nominations: Nomination[];
  count: number;
};

type ApprovedExpert = { id: string; profile: { full_name: string | null; email: string } | null };

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_review", label: "In review" },
  { value: "added", label: "Added as expert" },
  { value: "declined", label: "Declined" },
];

const STATUS_STYLE: Record<string, string> = {
  pending: "text-pivot-muted",
  in_review: "text-pivot-accent",
  added: "text-pivot-olive",
  declined: "text-pivot-muted",
};

export function NomineesView({
  nominees,
  approvedExperts,
}: {
  nominees: Nominee[];
  approvedExperts: ApprovedExpert[];
}) {
  if (nominees.length === 0) {
    return <p className="text-sm text-pivot-muted">No nominations yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {nominees.map((nominee) => (
        <NomineeRow
          key={nominee.id}
          nominee={nominee}
          otherNominees={nominees.filter((n) => n.id !== nominee.id)}
          approvedExperts={approvedExperts}
        />
      ))}
    </ul>
  );
}

function NomineeRow({
  nominee,
  otherNominees,
  approvedExperts,
}: {
  nominee: Nominee;
  otherNominees: Nominee[];
  approvedExperts: ApprovedExpert[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(nominee.status);

  return (
    <li className="rounded-lg border border-pivot-line bg-pivot-white p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-pivot-ink">{nominee.name ?? "Unnamed nominee"}</p>
            <span className="rounded-full bg-pivot-paper-2 px-2 py-0.5 text-xs text-pivot-ink">
              {nominee.count} {nominee.count === 1 ? "nomination" : "nominations"}
            </span>
          </div>
          <span className={`text-xs font-medium ${STATUS_STYLE[nominee.status] ?? ""}`}>
            {STATUS_OPTIONS.find((s) => s.value === nominee.status)?.label ?? nominee.status}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="text-xs text-pivot-muted underline hover:text-pivot-ink"
        >
          {expanded ? "Hide nominations" : "View nominations"}
        </button>
      </div>

      <form action={setNomineeStatus} className="mt-3 flex flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={nominee.id} />
        <select
          name="status"
          defaultValue={nominee.status}
          onChange={(e) => setPendingStatus(e.target.value)}
          className="rounded-md border border-pivot-line bg-pivot-paper px-2.5 py-1.5 text-xs text-pivot-ink outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {pendingStatus === "added" && (
          <select
            name="resolved_expert_id"
            defaultValue={nominee.resolved_expert_id ?? ""}
            className="rounded-md border border-pivot-line bg-pivot-paper px-2.5 py-1.5 text-xs text-pivot-ink outline-none"
          >
            <option value="">Link to expert account (optional)</option>
            {approvedExperts.map((e) => (
              <option key={e.id} value={e.id}>
                {e.profile?.full_name ?? e.profile?.email ?? e.id}
              </option>
            ))}
          </select>
        )}
        <button type="submit" className="rounded-md bg-pivot-ink px-3 py-1.5 text-xs font-medium text-pivot-paper">
          Update status
        </button>
      </form>

      {otherNominees.length > 0 && (
        <form action={mergeNominee} className="mt-2 flex flex-wrap items-center gap-2">
          <input type="hidden" name="source_id" value={nominee.id} />
          <select
            name="target_id"
            defaultValue=""
            required
            className="rounded-md border border-pivot-line bg-pivot-paper px-2.5 py-1.5 text-xs text-pivot-ink outline-none"
          >
            <option value="" disabled>
              Merge into…
            </option>
            {otherNominees.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} ({n.count})
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-md border border-pivot-line px-3 py-1.5 text-xs text-pivot-ink">
            Merge
          </button>
        </form>
      )}

      {expanded && (
        <ul className="mt-3 flex flex-col gap-2 border-t border-pivot-line pt-3">
          {nominee.nominations.map((n) => (
            <li key={n.id} className="text-xs text-pivot-ink">
              <p className="font-medium">
                {n.nominatorName}{" "}
                <span className="font-normal text-pivot-muted">
                  · {new Date(n.created_at).toLocaleDateString()}
                </span>
              </p>
              {(n.nominee_title || n.company || n.nominee_location) && (
                <p className="mt-0.5 text-pivot-muted">
                  {[n.nominee_title, n.company, n.nominee_location].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="mt-0.5 text-pivot-ink-2">{n.reason}</p>
              {n.topic && <p className="mt-0.5 text-pivot-ink-2">Topic: {n.topic}</p>}
              {n.categories_requested.length > 0 && (
                <p className="mt-0.5 text-pivot-ink-2">
                  Categories: {n.categories_requested.join(", ")}
                </p>
              )}
              {n.links.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {n.links.map((link) => (
                    <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="underline">
                      {link}
                    </a>
                  ))}
                </div>
              )}
              {n.social_url && (
                <a href={n.social_url} target="_blank" rel="noopener noreferrer" className="mt-1 block underline">
                  {n.social_url}
                </a>
              )}
              {(n.nominator_phone || n.nominator_email || n.nominator_relationship || n.intro_comfort) && (
                <p className="mt-1 text-pivot-muted">
                  Nominator:{" "}
                  {[n.nominator_phone, n.nominator_email, n.nominator_relationship, n.intro_comfort]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
