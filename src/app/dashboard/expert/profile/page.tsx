import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getMyExpertProfileFull, getMySocialLinks } from "@/features/experts/server/self";
import { getCategories } from "@/features/experts/server/categories";
import { getAllNgos, getMyNgoAllocations } from "@/features/ngo/server/queries";
import { ApplyForm } from "@/features/experts/components/apply-form";
import { SocialLinksManager } from "@/features/experts/components/social-links-manager";
import { NgoDonationManager } from "@/features/ngo/components/ngo-donation-manager";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

export default async function ExpertProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const expertProfile = await getMyExpertProfileFull(user.id);

  if (!expertProfile) {
    return (
      <div className="mx-auto max-w-lg px-6 py-10">
        <h1 className="mb-2 text-xl font-semibold">Expert Application</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Becoming an expert on Pivotroom.africa is currently invite-only. If you&apos;ve received
          an invite link by email, use it to apply — otherwise use the Contact Us link in the
          footer if you&apos;d like to be considered.
        </p>
      </div>
    );
  }

  const [categories, socialLinks, ngos, ngoAllocations] = await Promise.all([
    getCategories(),
    getMySocialLinks(user.id),
    getAllNgos(),
    getMyNgoAllocations(user.id),
  ]);

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Expert Profile</h1>
      <p className="mb-6 text-sm text-black/50 dark:text-white/50">
        Status: {STATUS_LABEL[expertProfile.status] ?? expertProfile.status}
      </p>
      <ApplyForm
        categories={categories}
        initialValues={expertProfile}
        extraSlot={
          <div className="flex flex-col gap-6">
            <SocialLinksManager links={socialLinks} />
            <div className="border-t border-black/10 pt-6 dark:border-white/15">
              <NgoDonationManager ngos={ngos} allocations={ngoAllocations} />
            </div>
          </div>
        }
      />
    </div>
  );
}
