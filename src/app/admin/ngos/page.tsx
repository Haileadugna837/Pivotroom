import { getNgosForAdmin } from "@/features/admin/server/queries";
import { NgosManager } from "@/features/admin/components/ngos-manager";

export default async function AdminNgosPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">NGOs</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const ngos = await getNgosForAdmin();

  return (
    <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold text-pivot-ink">NGOs</h1>
      <p className="mb-6 text-sm text-pivot-muted">
        Experts can donate a share of their earnings to any NGO listed here. Add the NGOs experts are
        allowed to choose from.
      </p>
      <NgosManager ngos={ngos} />
    </div>
  );
}
