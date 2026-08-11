import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyExpertProfileFull } from "@/features/experts/server/self";
import { getCategories } from "@/features/experts/server/categories";
import { ApplyForm } from "@/features/experts/components/apply-form";

export default async function ExpertProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [expertProfile, categories] = await Promise.all([
    getMyExpertProfileFull(user.id),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">
        {expertProfile ? "Expert Profile" : "Apply to become an expert"}
      </h1>
      {expertProfile && (
        <p className="mb-6 text-sm text-black/50 dark:text-white/50">
          Status: {expertProfile.is_approved ? "Approved" : "Pending review"}
        </p>
      )}
      <ApplyForm categories={categories} initialValues={expertProfile} />
      {!expertProfile && (
        <p className="mt-4 text-xs text-black/50 dark:text-white/50">
          Your profile will be reviewed by an admin before it appears publicly.
        </p>
      )}
    </div>
  );
}
