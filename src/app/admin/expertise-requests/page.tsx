import { getPendingExpertiseChangeRequests, getPendingTaxonomySuggestions } from "@/features/admin/server/queries";
import { ExpertiseRequestsView } from "@/features/admin/components/expertise-requests-view";

export default async function AdminExpertiseRequestsPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">Expertise Requests</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const [changeRequests, suggestions] = await Promise.all([
    getPendingExpertiseChangeRequests(),
    getPendingTaxonomySuggestions(),
  ]);

  return (
    <div className="mx-auto max-w-3xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold text-pivot-ink">Expertise Requests</h1>
      <p className="mb-6 text-sm text-pivot-muted">
        Major primary/secondary expertise changes from already-approved experts, and taxonomy suggestions from the
        &quot;Can&apos;t find it?&quot; prompts — nothing here affects a public profile until you approve it.
      </p>
      <ExpertiseRequestsView changeRequests={changeRequests} suggestions={suggestions} />
    </div>
  );
}
