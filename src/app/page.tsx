import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { getApprovedExperts } from "@/features/experts/server/queries";
import { getWishlistedExpertIds } from "@/features/wishlist/server/queries";
import { getExpertIdsWithNgoDonations } from "@/features/ngo/server/queries";
import { FeaturedExpertCard } from "@/features/experts/components/featured-expert-card";

export default async function Home() {
  const [experts, user] = await Promise.all([getApprovedExperts(), getUser()]);
  const featured = experts.slice(0, 10);

  const [wishlistedIds, donatingIds] = await Promise.all([
    user ? getWishlistedExpertIds(user.id) : Promise.resolve(new Set<string>()),
    getExpertIdsWithNgoDonations(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-14 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Book a session with an expert
        </h1>
        <p className="max-w-md text-black/60 dark:text-white/60">
          1:1 video calls with experts, scheduled straight to Google Calendar.
        </p>
        <Link
          href="/experts"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          Find an expert
        </Link>
      </div>

      {featured.length > 0 && (
        <div className="mx-auto w-full max-w-6xl px-4 pb-16">
          <div className="mb-1">
            <h2 className="text-xl font-semibold">
              Top Experts.{" "}
              <span className="font-normal text-black/50 dark:text-white/50">
                Access to the best experts has never been easier
              </span>
            </h2>
          </div>
          <Link
            href="/experts"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            See all <span aria-hidden="true">→</span>
          </Link>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {featured.map((expert) => (
              <FeaturedExpertCard
                key={expert.id}
                expertId={expert.id}
                href={`/experts/${expert.id}`}
                fullName={expert.profile?.full_name ?? null}
                photoUrl={expert.photo_url}
                headline={expert.headline}
                bio={expert.bio}
                pricePer15Min={expert.price_per_15_min}
                currency={expert.currency}
                wishlisted={wishlistedIds.has(expert.id)}
                isSignedIn={Boolean(user)}
                donatesToNgo={donatingIds.has(expert.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
