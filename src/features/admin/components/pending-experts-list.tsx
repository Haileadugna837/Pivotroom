import { approveExpert, rejectExpert } from "@/features/admin/server/actions";

type PendingExpert = {
  id: string;
  headline: string | null;
  session_rate: number | null;
  currency: string;
  profile: { full_name: string | null; email: string } | null;
};

export function PendingExpertsList({ experts }: { experts: PendingExpert[] }) {
  if (!experts.length) {
    return <p className="text-sm text-black/50 dark:text-white/50">No pending applications.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {experts.map((e) => (
        <li key={e.id} className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{e.profile?.full_name ?? e.profile?.email ?? e.id}</p>
              <p className="text-black/60 dark:text-white/60">{e.headline}</p>
              <p className="text-black/50 dark:text-white/50">
                {e.session_rate != null ? `${e.currency} ${e.session_rate}` : "No rate set"}
              </p>
            </div>
            <div className="flex gap-2">
              <form action={approveExpert}>
                <input type="hidden" name="expert_id" value={e.id} />
                <button className="rounded-md bg-foreground px-3 py-1.5 text-background">
                  Approve
                </button>
              </form>
              <form action={rejectExpert}>
                <input type="hidden" name="expert_id" value={e.id} />
                <button className="rounded-md border border-black/10 px-3 py-1.5 dark:border-white/15">
                  Reject
                </button>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
