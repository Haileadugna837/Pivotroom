import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-xl font-semibold">Settings</h1>
      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="text-black/50 dark:text-white/50">Name</dt>
          <dd className="mt-0.5">{profile?.full_name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-black/50 dark:text-white/50">Email</dt>
          <dd className="mt-0.5">{profile?.email}</dd>
        </div>
      </dl>
    </div>
  );
}
