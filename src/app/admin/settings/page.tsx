import { createClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-xl font-semibold">Admin Settings</h1>
      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="text-black/50 dark:text-white/50">Admin email</dt>
          <dd className="mt-0.5">{user?.email}</dd>
        </div>
      </dl>
    </div>
  );
}
