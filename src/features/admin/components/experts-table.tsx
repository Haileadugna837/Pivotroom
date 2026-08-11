import Link from "next/link";
import { approveExpert, rejectExpert, suspendExpert } from "@/features/admin/server/actions";
import type { ExpertTab } from "@/features/admin/server/queries";

type Expert = {
  id: string;
  headline: string | null;
  price_per_15_min: number | null;
  currency: string;
  status: string;
  categories: { name: string } | null;
  created_at: string;
  profile: { full_name: string | null; email: string } | null;
};

const TABS: { key: ExpertTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "suspended", label: "Suspended" },
];

function ActionsForStatus({ expertId, status }: { expertId: string; status: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/admin/experts/${expertId}`}
        className="rounded-md border border-black/10 px-3 py-1.5 text-sm dark:border-white/15"
      >
        Edit
      </Link>
      {status === "pending" && (
        <>
          <form action={approveExpert}>
            <input type="hidden" name="expert_id" value={expertId} />
            <button className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background">
              Approve
            </button>
          </form>
          <form action={rejectExpert}>
            <input type="hidden" name="expert_id" value={expertId} />
            <button className="rounded-md border border-black/10 px-3 py-1.5 text-sm dark:border-white/15">
              Reject
            </button>
          </form>
        </>
      )}
      {status === "approved" && (
        <form action={suspendExpert}>
          <input type="hidden" name="expert_id" value={expertId} />
          <button className="rounded-md border border-black/10 px-3 py-1.5 text-sm dark:border-white/15">
            Suspend
          </button>
        </form>
      )}
      {(status === "rejected" || status === "suspended") && (
        <form action={approveExpert}>
          <input type="hidden" name="expert_id" value={expertId} />
          <button className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background">
            Approve
          </button>
        </form>
      )}
    </div>
  );
}

export function ExpertsTable({ experts, activeTab }: { experts: Expert[]; activeTab: ExpertTab }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 border-b border-black/10 pb-3 dark:border-white/15">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/experts?tab=${t.key}`}
            className={`rounded-md px-3 py-1.5 text-sm ${
              activeTab === t.key
                ? "bg-foreground text-background"
                : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {experts.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No experts in this view.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {experts.map((e) => (
            <li key={e.id} className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{e.profile?.full_name ?? e.profile?.email ?? e.id}</p>
                  <p className="text-black/50 dark:text-white/50">{e.profile?.email}</p>
                  {e.categories?.name && (
                    <span className="mt-1 inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
                      {e.categories.name}
                    </span>
                  )}
                  {e.headline && <p className="mt-2">{e.headline}</p>}
                  <p className="mt-1 text-black/50 dark:text-white/50">
                    {e.price_per_15_min != null ? `${e.currency} ${e.price_per_15_min} / 15 min` : "No rate set"}
                    {" · "}
                    {e.status}
                  </p>
                </div>
                <ActionsForStatus expertId={e.id} status={e.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
