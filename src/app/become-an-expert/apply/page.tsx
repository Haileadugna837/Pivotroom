import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getInviteByToken, markInviteUsed } from "@/features/experts/server/invites";
import { getMyExpertProfile } from "@/features/experts/server/self";
import { getExpertiseCategoryTree } from "@/features/experts/server/expertise";
import { getIndustryDirectory } from "@/features/experts/server/industries";
import { ExpertOnboardingWizard } from "@/features/experts/components/onboarding/expert-onboarding-wizard";

export const metadata: Metadata = {
  title: "Apply as an expert",
  robots: { index: false, follow: false },
};

export default async function BecomeAnExpertApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite: token } = await searchParams;
  if (!token) redirect("/become-an-expert");

  const invite = await getInviteByToken(token);
  if (!invite) redirect("/become-an-expert");
  if (invite.status === "completed") redirect("/dashboard/expert/profile");

  const user = await getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/become-an-expert/apply?invite=${token}`)}`);
  }

  await markInviteUsed(token);

  const existingProfile = await getMyExpertProfile(user.id);
  if (existingProfile) redirect("/dashboard/expert/profile");

  const [categoryTree, industryGroups] = await Promise.all([getExpertiseCategoryTree(), getIndustryDirectory()]);

  return (
    <div className="bg-pivot-paper px-6 py-10">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-xl font-semibold text-pivot-ink">Apply to become an expert</h1>
        <p className="mb-6 text-sm text-pivot-muted">
          Your profile will be reviewed by an admin before it appears publicly.
        </p>
        <ExpertOnboardingWizard categoryTree={categoryTree} industryGroups={industryGroups} inviteToken={token} />
      </div>
    </div>
  );
}
