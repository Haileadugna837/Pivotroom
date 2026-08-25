import { getCategoriesForAdmin } from "@/features/admin/server/queries";
import { CategoriesManager } from "@/features/admin/components/categories-manager";

export default async function AdminCategoriesPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">Categories</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const categories = await getCategoriesForAdmin();

  return (
    <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold text-pivot-ink">Categories</h1>
      <CategoriesManager categories={categories} />
    </div>
  );
}
