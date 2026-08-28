import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { getMyExpertProfileFull, getMySocialLinks } from "@/features/experts/server/self";
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
      <div className="mx-auto max-w-lg bg-pivot-paper px-6 py-10">
        <h1 className="mb-2 text-xl font-semibold text-pivot-ink">Expert Application</h1>
        <p className="mb-6 text-sm text-pivot-ink-2">
          You haven&apos;t applied to become an expert yet. Applications are reviewed before you get
          access to build a public profile.
        </p>
        <Link
          href="/become-an-expert"
          className="inline-block rounded-md bg-pivot-ink px-5 py-2.5 text-sm font-medium text-pivot-paper"
        >
          Apply to become an expert
        </Link>
      </div>
    );
  }

  const [socialLinks, ngos, ngoAllocations] = await Promise.all([
    getMySocialLinks(user.id),
    getAllNgos(),
    getMyNgoAllocations(user.id),
  ]);

  return (
    <div className="mx-auto max-w-lg bg-pivot-paper px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold text-pivot-ink">Expert Profile</h1>
      <p className="mb-1 text-sm text-pivot-muted">
        Status: {STATUS_LABEL[expertProfile.status] ?? expertProfile.status}
      </p>
      <p className="mb-6 text-sm text-pivot-muted">
        Manage your primary/secondary expertise, industries, and bookable topics under{" "}
        <Link href="/dashboard/expert/expertise" className="underline">
          Expertise
        </Link>
        .
      </p>
      <ApplyForm
        initialValues={expertProfile}
        extraSlot={
          <div className="flex flex-col gap-6">
            <SocialLinksManager links={socialLinks} />
            <div className="border-t border-pivot-line pt-6">
              <NgoDonationManager ngos={ngos} allocations={ngoAllocations} />
            </div>
          </div>
        }
      />
    </div>
  );
}
