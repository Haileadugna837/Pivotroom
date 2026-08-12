import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyExpertProfileFull, getMySocialLinks } from "@/features/experts/server/self";
import { getCategories } from "@/features/experts/server/categories";
import { ApplyForm } from "@/features/experts/components/apply-form";
import { SocialLinksManager } from "@/features/experts/components/social-links-manager";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

export default async function ExpertProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [expertProfile, categories, socialLinks] = await Promise.all([
    getMyExpertProfileFull(user.id),
    getCategories(),
    getMySocialLinks(user.id),
  ]);

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">
        {expertProfile ? "Expert Profile" : "Apply to become an expert"}
      </h1>
      {expertProfile && (
        <p className="mb-6 text-sm text-black/50 dark:text-white/50">
          Status: {STATUS_LABEL[expertProfile.status] ?? expertProfile.status}
        </p>
      )}
      <ApplyForm categories={categories} initialValues={expertProfile} />
      {!expertProfile && (
        <p className="mt-4 text-xs text-black/50 dark:text-white/50">
          Your profile will be reviewed by an admin before it appears publicly.
        </p>
      )}

      {expertProfile && (
        <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
          <SocialLinksManager links={socialLinks} />
        </div>
      )}
    </div>
  );
}
