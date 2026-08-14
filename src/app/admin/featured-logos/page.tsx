import { getFeaturedLogosForAdmin, getSiteSettingsForAdmin } from "@/features/admin/server/queries";
import { FeaturedLogosManager } from "@/features/admin/components/featured-logos-manager";

export default async function AdminFeaturedLogosPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold">Featured Logos</h1>
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-500">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const [logos, settings] = await Promise.all([getFeaturedLogosForAdmin(), getSiteSettingsForAdmin()]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Featured Logos</h1>
      <p className="mb-6 text-sm text-black/50 dark:text-white/50">
        Shown as a &quot;Featured on&quot; strip in the homepage hero, under the search bar. Add the
        press mentions or partner logos you actually have — or turn the whole section off below.
      </p>
      <FeaturedLogosManager logos={logos} enabled={settings.featured_logos_enabled} />
    </div>
  );
}
