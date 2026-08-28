import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getInviteByToken } from "@/features/experts/server/invites";
import { BecomeExpertView } from "@/features/acquisition/components/become-expert-view";

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
  return <BecomeExpertView isLoggedIn={Boolean(user)} userEmail={user?.email ?? null} />;
}
