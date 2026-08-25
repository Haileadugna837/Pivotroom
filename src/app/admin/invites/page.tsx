import { getInvitesForAdmin } from "@/features/admin/server/queries";
import { InvitesView } from "@/features/admin/components/invites-view";

export default async function AdminInvitesPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">Expert Invites</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const invites = await getInvitesForAdmin();

  return (
    <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold text-pivot-ink">Expert Invites</h1>
      <p className="mb-6 text-sm text-pivot-muted">
        Becoming an expert is invite-only. Send an email invite and track who&apos;s opened it and
        who&apos;s applied.
      </p>
      <InvitesView invites={invites} />
    </div>
  );
}
