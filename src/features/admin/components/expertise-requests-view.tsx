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
        <h2 className="mb-3 text-sm font-semibold text-pivot-ink">Major expertise changes</h2>
        {changeRequests.length === 0 ? (
          <p className="text-sm text-pivot-muted">No pending changes.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {changeRequests.map((r) => (
              <li key={r.id} className="rounded-lg border border-pivot-line bg-pivot-white p-3 text-sm text-pivot-ink">
                <p className="font-medium">{r.expertName}</p>
                <p className="mt-1 text-xs text-pivot-muted">
                  {CHANGE_TYPE_LABEL[r.change_type] ?? r.change_type} · submitted{" "}
                  {new Date(r.submitted_at).toLocaleDateString()}
                </p>
                <p className="mt-2">
                  <span className="text-pivot-muted">Current: </span>
                  {r.oldCategoryName}
                  <span className="mx-2 text-pivot-muted/60">→</span>
                  <span className="text-pivot-muted">Requested: </span>
                  {r.newCategoryName}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={approveExpertiseChangeRequest}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="rounded-md bg-pivot-ink px-3 py-1.5 text-xs font-medium text-pivot-paper"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectExpertiseChangeRequest} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      name="reason"
                      placeholder="Reason (optional)"
                      className="rounded-md border border-pivot-line bg-pivot-paper px-2 py-1.5 text-xs text-pivot-ink outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-pivot-line px-3 py-1.5 text-xs font-medium text-pivot-ink"
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
        <h2 className="mb-3 text-sm font-semibold text-pivot-ink">Taxonomy suggestions</h2>
        {suggestions.length === 0 ? (
          <p className="text-sm text-pivot-muted">No pending suggestions.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {suggestions.map((s) => (
              <li key={s.id} className="rounded-lg border border-pivot-line bg-pivot-white p-3 text-sm text-pivot-ink">
                <p className="font-medium">
                  {s.name}
                  <span className="ml-2 text-xs font-normal text-pivot-muted">
                    {s.suggestion_type === "expertise" ? "Expertise" : "Industry"} · under {s.contextLabel}
                  </span>
                </p>
                <p className="mt-1 text-xs text-pivot-muted">
                  {s.expertName} · {new Date(s.created_at).toLocaleDateString()}
                </p>
                {s.note && <p className="mt-1 text-pivot-ink-2">{s.note}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={approveTaxonomySuggestion}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="rounded-md bg-pivot-ink px-3 py-1.5 text-xs font-medium text-pivot-paper"
                    >
                      Approve &amp; add
                    </button>
                  </form>
                  <form action={rejectTaxonomySuggestion}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-pivot-line px-3 py-1.5 text-xs font-medium text-pivot-ink"
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
