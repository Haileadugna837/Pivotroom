import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { signOut } from "@/features/auth/server/actions";
import { AccountSettingsForms } from "@/features/auth/components/account-settings-forms";
import { ProfileHeader } from "@/components/profile-header";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-pivot-muted">{title}</h2>
      {children}
    </section>
  );
}

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
    <div className="mx-auto max-w-lg bg-pivot-paper px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold text-pivot-ink">My Account</h1>
      <div className="flex flex-col gap-6">
        <Section title="Personal Information">
          <ProfileHeader
            name={profile?.full_name ?? ""}
            email={profile?.email ?? user.email ?? ""}
            joinedAt={user.created_at}
          />
        </Section>

        <AccountSettingsForms
          title="Security"
          currentEmail={profile?.email ?? user.email ?? ""}
          hasPasswordIdentity={hasPasswordIdentity}
        />

        <Section title="Account">
          <form action={signOut}>
            <button
              type="submit"
              className="w-fit rounded-md border border-pivot-line px-4 py-2 text-sm font-medium text-pivot-ink-2 hover:bg-pivot-paper-2"
            >
              Sign out
            </button>
          </form>
        </Section>
      </div>
    </div>
  );
}
