import { createClient, getUser } from "@/lib/supabase/server";
import { AccountSettingsForms } from "@/features/auth/components/account-settings-forms";
import { ProfileHeader } from "@/components/profile-header";
import { getFeaturedLogosForAdmin, getSiteSettingsForAdmin } from "@/features/admin/server/queries";
import { FeaturedLogosManager } from "@/features/admin/components/featured-logos-manager";
import { AcquisitionLandingToggle } from "@/features/admin/components/acquisition-landing-toggle";
import { AcquisitionShowExpertsToggle } from "@/features/admin/components/acquisition-show-experts-toggle";

export default async function AdminSettingsPage() {
  const user = await getUser();
  const supabase = await createClient();

  const [{ data: profile }, logos, siteSettings] = await Promise.all([
    user
      ? supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    process.env.SUPABASE_SERVICE_ROLE_KEY ? getFeaturedLogosForAdmin() : Promise.resolve([]),
    process.env.SUPABASE_SERVICE_ROLE_KEY
      ? getSiteSettingsForAdmin()
      : Promise.resolve({ featured_logos_enabled: true, acquisition_landing_enabled: false, acquisition_show_experts_enabled: true }),
  ]);

  const hasPasswordIdentity = user?.identities?.some((i) => i.provider === "email") ?? false;

  return (
    <div className="mx-auto max-w-lg bg-pivot-paper px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold text-pivot-ink">Admin Settings</h1>
      {user && (
        <ProfileHeader
          name={profile?.full_name ?? ""}
          email={user.email ?? ""}
          joinedAt={user.created_at}
          roleLabel="Admin"
        />
      )}
      <AccountSettingsForms currentEmail={user?.email ?? ""} hasPasswordIdentity={hasPasswordIdentity} />

      <div className="mt-10 border-t border-pivot-line pt-6">
        <h2 className="mb-2 text-sm font-medium text-pivot-ink">Homepage &quot;Featured on&quot; logos</h2>
        <p className="mb-4 text-sm text-pivot-muted">
          Shown under the hero search bar on the homepage. Hidden entirely until at least one logo is
          added.
        </p>
        <FeaturedLogosManager logos={logos} enabled={siteSettings.featured_logos_enabled} />
      </div>

      <div className="mt-10 border-t border-pivot-line pt-6">
        <h2 className="mb-2 text-sm font-medium text-pivot-ink">Phase 1 acquisition landing page</h2>
        <p className="mb-4 text-sm text-pivot-muted">
          Switches the homepage between the new early-access/Founding-Expert landing page and the classic
          marketplace homepage.
        </p>
        <AcquisitionLandingToggle enabled={siteSettings.acquisition_landing_enabled} />
        <div className="mt-3">
          <AcquisitionShowExpertsToggle enabled={siteSettings.acquisition_show_experts_enabled} />
        </div>
      </div>
    </div>
  );
}
