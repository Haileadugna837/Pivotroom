import Link from "next/link";
import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
import {
  getApprovedExperts,
  getCategoriesWithFeaturedExperts,
  getCategoryDirectory,
} from "@/features/experts/server/queries";
import { getWishlistedExpertIds } from "@/features/wishlist/server/queries";
import { getExpertIdsWithNgoDonations } from "@/features/ngo/server/queries";
import { getExpertRatingSummaries } from "@/features/reviews/server/queries";
import { FeaturedExpertCard } from "@/features/experts/components/featured-expert-card";
import { CategoryIconGrid } from "@/features/experts/components/category-icon-grid";
import { CategoryExpertRow } from "@/features/experts/components/category-expert-row";
import { SortBar } from "@/features/experts/components/sort-bar";
import { HowItWorks } from "@/features/experts/components/how-it-works";
import { parseSortValue, sortExpertsBy } from "@/features/experts/lib/sort";

export const metadata: Metadata = {
  title: "Find an expert",
  description: "Browse vetted African experts by category and book a 1:1 session.",
};

export default async function ExpertsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: sortParam } = await searchParams;
  const sort = parseSortValue(sortParam);

  const [experts, categoryGroups, categoryDirectory, user, ratings] = await Promise.all([
    getApprovedExperts(),
    getCategoriesWithFeaturedExperts(1, 12),
    getCategoryDirectory(),
    getUser(),
    getExpertRatingSummaries(),
  ]);

  const [wishlistedIds, donatingIds] = await Promise.all([
    user ? getWishlistedExpertIds(user.id) : Promise.resolve(new Set<string>()),
    getExpertIdsWithNgoDonations(),
  ]);

  const topExperts = sortExpertsBy(experts, sort, ratings).slice(0, 10);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold leading-tight sm:text-3xl">
        Choose an expert.
        <br />
        Book a session.
        <br />
        Get advice on a video call.
      </h1>

      <div className="mb-10">
        <CategoryIconGrid categories={categoryDirectory} />
      </div>

      {experts.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">No experts are listed yet.</p>
      ) : (
        <>
          <SortBar />

          {topExperts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold">
                Top Experts.{" "}
                <span className="font-normal text-black/50 dark:text-white/50">
                  Access to the best experts has never been easier
                </span>
              </h2>
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                {topExperts.map((expert) => (
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

          <div className="flex flex-col gap-12">
            {categoryGroups.map((group) => (
              <CategoryExpertRow
                key={group.category.id}
                categoryId={group.category.id}
                categoryName={group.category.name}
                tagline={group.category.tagline}
                experts={sortExpertsBy(group.experts, sort, ratings)}
                wishlistedIds={wishlistedIds}
                donatingIds={donatingIds}
                isSignedIn={Boolean(user)}
                seeAllHref={`/experts/category/${group.category.id}`}
              />
            ))}
          </div>
        </>
      )}

      <HowItWorks />

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
