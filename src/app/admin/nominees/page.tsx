import { getNomineesForAdmin, getExpertsForAdmin } from "@/features/admin/server/queries";
import { NomineesView } from "@/features/admin/components/nominees-view";

export default async function AdminNomineesPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">Nominations</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const [nominees, approvedExperts] = await Promise.all([
    getNomineesForAdmin(),
    getExpertsForAdmin("approved"),
  ]);

  return (
    <div className="mx-auto max-w-3xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold text-pivot-ink">Nominations</h1>
      <p className="mb-6 text-sm text-pivot-muted">
        Sorted by nomination count. Merge duplicate names into one nominee to combine their counts.
      </p>
      <NomineesView nominees={nominees} approvedExperts={approvedExperts} />
    </div>
  );
}
