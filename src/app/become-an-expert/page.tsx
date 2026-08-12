import Link from "next/link";
import type { Metadata } from "next";
import { getInviteByToken } from "@/features/experts/server/invites";

export const metadata: Metadata = {
  title: "Become an expert",
  description: "Apply to become an expert on Pivotroom.africa.",
};

export default async function BecomeAnExpertPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite: token } = await searchParams;
  const invite = token ? await getInviteByToken(token) : null;

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Become an expert</h1>
      <p className="mb-6 text-black/70 dark:text-white/70">
        Share your knowledge in focused 1:1 video sessions — you set your rate, your availability,
        and get booked straight from your public profile. Clients pay upfront, sessions run over
        Google Meet, and payouts are handled after each completed session.
      </p>

      <ul className="mb-8 flex flex-col gap-2 text-sm text-black/60 dark:text-white/60">
        <li>• Set your own price per 15 minutes — clients book 15/30/45/60-minute sessions</li>
        <li>• Choose your own availability windows</li>
        <li>• Sessions get an auto-generated Google Meet link</li>
        <li>• Optionally donate a share of your earnings to an NGO you support</li>
      </ul>

      {!token || !invite ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          Becoming an expert on Pivotroom.africa is currently invite-only. If you&apos;d like to be
          considered, use the Contact Us link in the footer below.
        </p>
      ) : invite.status === "completed" ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          You&apos;ve already submitted your application with this invite.{" "}
          <Link href="/dashboard/expert/profile" className="underline">
            View it in your dashboard
          </Link>
          .
        </p>
      ) : (
        <Link
          href={`/become-an-expert/apply?invite=${token}`}
          className="inline-block rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          Get started
        </Link>
      )}
    </div>
  );
}
