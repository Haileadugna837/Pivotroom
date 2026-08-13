import Link from "next/link";
import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
import { getApprovedExperts } from "@/features/experts/server/queries";
import { getWishlistedExpertIds } from "@/features/wishlist/server/queries";
import { getExpertIdsWithNgoDonations } from "@/features/ngo/server/queries";
import { ExpertCard } from "@/features/experts/components/expert-card";
import { FeaturedExpertCard } from "@/features/experts/components/featured-expert-card";

export const metadata: Metadata = {
  title: "Find an expert",
  description: "Browse vetted African experts and book a 1:1 session.",
};

export default async function ExpertsPage() {
  const [experts, user] = await Promise.all([getApprovedExperts(), getUser()]);

  const [wishlistedIds, donatingIds] = await Promise.all([
    user ? getWishlistedExpertIds(user.id) : Promise.resolve(new Set<string>()),
    getExpertIdsWithNgoDonations(),
  ]);

  const featured = experts.slice(0, 10);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {featured.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold">
            Top Experts.{" "}
            <span className="font-normal text-black/50 dark:text-white/50">
              Access to the best experts has never been easier
            </span>
          </h2>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
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

      <h1 className="mb-6 text-xl font-semibold">Find an expert</h1>
      {experts.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          No experts are listed yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {experts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expertId={expert.id}
              href={`/experts/${expert.id}`}
              headline={expert.headline}
              bio={expert.bio}
              pricePer15Min={expert.price_per_15_min}
              currency={expert.currency}
              categoryName={expert.categories?.name ?? null}
              fullName={expert.profile?.full_name ?? null}
              photoUrl={expert.photo_url}
              wishlisted={wishlistedIds.has(expert.id)}
              isSignedIn={Boolean(user)}
              donatesToNgo={donatingIds.has(expert.id)}
            />
          ))}
        </div>
      )}

      <Link
        href="/experts/search"
        aria-label="Search experts"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M18 18l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </Link>
    </div>
  );
}
