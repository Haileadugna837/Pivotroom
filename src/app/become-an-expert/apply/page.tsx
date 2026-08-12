import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getInviteByToken, markInviteUsed } from "@/features/experts/server/invites";
import { getMyExpertProfile } from "@/features/experts/server/self";
import { getCategories } from "@/features/experts/server/categories";
import { ApplyForm } from "@/features/experts/components/apply-form";

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

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Apply to become an expert</h1>
      <p className="mb-6 text-sm text-black/50 dark:text-white/50">
        Your profile will be reviewed by an admin before it appears publicly.
      </p>
      <ApplyForm categories={categories} inviteToken={token} />
    </div>
  );
}
