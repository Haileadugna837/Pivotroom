import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) redirect("/");

  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-xl font-semibold">Admin</h1>
      {!hasServiceRoleKey ? (
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-500">
          Payment verification and payout tools need `SUPABASE_SERVICE_ROLE_KEY`
          in `.env.local` before they can load data.
        </p>
      ) : (
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">
          Payment verification queue coming next.
        </p>
      )}
    </div>
  );
}
