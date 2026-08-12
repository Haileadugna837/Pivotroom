import { createClient, getUser } from "@/lib/supabase/server";
import { AccountSettingsForms } from "@/features/auth/components/account-settings-forms";
import { ProfileHeader } from "@/components/profile-header";

export default async function AdminSettingsPage() {
  const user = await getUser();
  const supabase = await createClient();

  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
    : { data: null };

  const hasPasswordIdentity = user?.identities?.some((i) => i.provider === "email") ?? false;

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold">Admin Settings</h1>
      {user && (
        <ProfileHeader
          name={profile?.full_name ?? ""}
          email={user.email ?? ""}
          joinedAt={user.created_at}
          roleLabel="Admin"
        />
      )}
      <AccountSettingsForms currentEmail={user?.email ?? ""} hasPasswordIdentity={hasPasswordIdentity} />
    </div>
  );
}
