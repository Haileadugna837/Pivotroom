import { approveExpert, rejectExpert } from "@/features/admin/server/actions";

type PendingExpert = {
  id: string;
  headline: string | null;
  bio: string | null;
  price_per_15_min: number | null;
  currency: string;
  categories: { name: string } | null;
  created_at: string;
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
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium">{e.profile?.full_name ?? "(no name)"}</p>
              <p className="text-black/50 dark:text-white/50">{e.profile?.email}</p>
              {e.categories?.name && (
                <span className="mt-1 inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
                  {e.categories.name}
                </span>
              )}
              {e.headline && <p className="mt-2 font-medium">{e.headline}</p>}
              {e.bio && (
                <p className="mt-1 whitespace-pre-wrap text-black/70 dark:text-white/70">{e.bio}</p>
              )}
              <p className="mt-2 text-black/50 dark:text-white/50">
                {e.price_per_15_min != null
                  ? `${e.currency} ${e.price_per_15_min} / 15 min`
                  : "No rate set"}
              </p>
              <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                Applied {new Date(e.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
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
