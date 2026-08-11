import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/features/experts/server/categories";
import { ApplyForm } from "@/features/experts/components/apply-form";

export default async function ApplyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/experts/apply");

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-xl font-semibold">Apply to become an expert</h1>
      <ApplyForm categories={categories} />
      <p className="mt-4 text-xs text-black/50 dark:text-white/50">
        Your profile will be reviewed by an admin before it appears publicly.
      </p>
    </div>
  );
}
