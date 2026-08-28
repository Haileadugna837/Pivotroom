import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getInviteByToken } from "@/features/experts/server/invites";
import { getMyExpertProfile } from "@/features/experts/server/self";
import { getMyExpertApplication } from "@/features/acquisition/server/queries";
import { BecomeExpertView } from "@/features/acquisition/components/become-expert-view";
import { BecomeExpertApplicationStatus } from "@/features/acquisition/components/become-expert/application-status";

export const metadata: Metadata = {
  title: "Become an expert",
  description:
    "Pivotroom gives experienced founders, executives, investors and operators a way to make what they know accessible through focused one-to-one conversations.",
};

// Public, self-serve entry point — anyone can apply from here (no invite
// required). A personally emailed admin invite link (`sendExpertInvite`,
// `src/features/admin/server/actions.ts`) still works exactly as before:
// it fast-tracks the holder straight into the existing onboarding wizard at
// /become-an-expert/apply, skipping this page's own application/review step.
export default async function BecomeAnExpertPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite: token } = await searchParams;
  if (token) {
    const invite = await getInviteByToken(token);
    if (invite && invite.status !== "completed") {
      redirect(`/become-an-expert/apply?invite=${token}`);
    }
  }

  const user = await getUser();

  if (user) {
    // Already has an `experts` row (accepted by admin, or admin-invited
    // directly) — send them to their normal expert dashboard rather than
    // the public pitch/form, regardless of whether they're still locked
    // (pending) or fully approved; dashboard/layout.tsx already shows the
    // right subset of menus for either state.
    const expertProfile = await getMyExpertProfile(user.id);
    if (expertProfile) redirect("/dashboard/expert/profile");

    // No experts row yet — if they already have a live application, show
    // its status instead of the form. A Rejected application is treated
    // as if they hadn't applied, matching submitBecomeExpertApplication's
    // own re-apply allowance.
    const application = await getMyExpertApplication(user.id);
    if (application && application.status !== "Rejected") {
      return <BecomeExpertApplicationStatus status={application.status} submittedAt={application.created_at} />;
    }
  }

  return <BecomeExpertView isLoggedIn={Boolean(user)} userEmail={user?.email ?? null} />;
}
