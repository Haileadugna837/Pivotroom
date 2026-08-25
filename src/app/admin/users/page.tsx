import { getUsersForAdmin } from "@/features/admin/server/queries";
import { UsersView } from "@/features/admin/components/users-view";

export default async function AdminUsersPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">Users</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const users = await getUsersForAdmin();

  return (
    <div className="mx-auto max-w-3xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold text-pivot-ink">Users</h1>
      <p className="mb-6 text-sm text-pivot-muted">
        Every registered account — clients and experts. Restricted accounts can still sign in but
        can&apos;t book sessions; suspended accounts are blocked from signing in entirely.
      </p>
      <UsersView users={users} />
    </div>
  );
}
