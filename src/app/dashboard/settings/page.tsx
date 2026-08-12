import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { AccountSettingsForms } from "@/features/auth/components/account-settings-forms";
import { ProfileHeader } from "@/components/profile-header";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const hasPasswordIdentity = user.identities?.some((i) => i.provider === "email") ?? false;

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold">Settings</h1>
      <ProfileHeader
        name={profile?.full_name ?? ""}
        email={profile?.email ?? user.email ?? ""}
        joinedAt={user.created_at}
      />
      <AccountSettingsForms
        currentEmail={profile?.email ?? user.email ?? ""}
        hasPasswordIdentity={hasPasswordIdentity}
      />
    </div>
  );
}
