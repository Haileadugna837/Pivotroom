"use client";

import { useState } from "react";
import { setNomineeStatus, mergeNominee } from "@/features/admin/server/actions";

type Nomination = {
  id: string;
  reason: string;
  links: string[];
  created_at: string;
  nominatorName: string;
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
  pending: "text-black/50 dark:text-white/50",
  in_review: "text-blue-700 dark:text-blue-400",
  added: "text-emerald-700 dark:text-emerald-400",
  declined: "text-black/40 dark:text-white/40",
};

export function NomineesView({
  nominees,
  approvedExperts,
}: {
  nominees: Nominee[];
  approvedExperts: ApprovedExpert[];
}) {
  if (nominees.length === 0) {
    return <p className="text-sm text-black/50 dark:text-white/50">No nominations yet.</p>;
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
    <li className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{nominee.name ?? "Unnamed nominee"}</p>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
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
          className="text-xs text-black/50 underline hover:text-black dark:text-white/50 dark:hover:text-white"
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
          className="rounded-md border border-black/10 px-2.5 py-1.5 text-xs dark:border-white/15"
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
            className="rounded-md border border-black/10 px-2.5 py-1.5 text-xs dark:border-white/15"
          >
            <option value="">Link to expert account (optional)</option>
            {approvedExperts.map((e) => (
              <option key={e.id} value={e.id}>
                {e.profile?.full_name ?? e.profile?.email ?? e.id}
              </option>
            ))}
          </select>
        )}
        <button type="submit" className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background">
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
            className="rounded-md border border-black/10 px-2.5 py-1.5 text-xs dark:border-white/15"
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
          <button type="submit" className="rounded-md border border-black/10 px-3 py-1.5 text-xs dark:border-white/15">
            Merge
          </button>
        </form>
      )}

      {expanded && (
        <ul className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-3 dark:border-white/15">
          {nominee.nominations.map((n) => (
            <li key={n.id} className="text-xs">
              <p className="font-medium">
                {n.nominatorName}{" "}
                <span className="font-normal text-black/40 dark:text-white/40">
                  · {new Date(n.created_at).toLocaleDateString()}
                </span>
              </p>
              <p className="mt-0.5 text-black/70 dark:text-white/70">{n.reason}</p>
              {n.links.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {n.links.map((link) => (
                    <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="underline">
                      {link}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
