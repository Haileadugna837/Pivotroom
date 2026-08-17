import {
  approveExpertiseChangeRequest,
  rejectExpertiseChangeRequest,
  approveTaxonomySuggestion,
  rejectTaxonomySuggestion,
} from "@/features/admin/server/actions";

type ChangeRequest = {
  id: string;
  change_type: string;
  submitted_at: string;
  expertName: string;
  oldCategoryName: string;
  newCategoryName: string;
};

type Suggestion = {
  id: string;
  suggestion_type: string;
  name: string;
  note: string | null;
  created_at: string;
  expertName: string;
  contextLabel: string;
};

const CHANGE_TYPE_LABEL: Record<string, string> = {
  primary_category: "Primary category",
  secondary_category: "Secondary category",
};

export function ExpertiseRequestsView({
  changeRequests,
  suggestions,
}: {
  changeRequests: ChangeRequest[];
  suggestions: Suggestion[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold">Major expertise changes</h2>
        {changeRequests.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">No pending changes.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {changeRequests.map((r) => (
              <li key={r.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/15">
                <p className="font-medium">{r.expertName}</p>
                <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                  {CHANGE_TYPE_LABEL[r.change_type] ?? r.change_type} · submitted{" "}
                  {new Date(r.submitted_at).toLocaleDateString()}
                </p>
                <p className="mt-2">
                  <span className="text-black/50 dark:text-white/50">Current: </span>
                  {r.oldCategoryName}
                  <span className="mx-2 text-black/30 dark:text-white/30">→</span>
                  <span className="text-black/50 dark:text-white/50">Requested: </span>
                  {r.newCategoryName}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={approveExpertiseChangeRequest}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectExpertiseChangeRequest} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      name="reason"
                      placeholder="Reason (optional)"
                      className="rounded-md border border-black/10 px-2 py-1.5 text-xs dark:border-white/15"
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium dark:border-white/15"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Taxonomy suggestions</h2>
        {suggestions.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">No pending suggestions.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {suggestions.map((s) => (
              <li key={s.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/15">
                <p className="font-medium">
                  {s.name}
                  <span className="ml-2 text-xs font-normal text-black/40 dark:text-white/40">
                    {s.suggestion_type === "expertise" ? "Expertise" : "Industry"} · under {s.contextLabel}
                  </span>
                </p>
                <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                  {s.expertName} · {new Date(s.created_at).toLocaleDateString()}
                </p>
                {s.note && <p className="mt-1 text-black/60 dark:text-white/60">{s.note}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={approveTaxonomySuggestion}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
                    >
                      Approve &amp; add
                    </button>
                  </form>
                  <form action={rejectTaxonomySuggestion}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium dark:border-white/15"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
