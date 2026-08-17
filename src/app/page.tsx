import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { getCategoriesWithFeaturedExperts } from "@/features/experts/server/queries";
import { getWishlistedExpertIds } from "@/features/wishlist/server/queries";
import { getExpertIdsWithNgoDonations } from "@/features/ngo/server/queries";
import { getFeaturedLogosForHome } from "@/features/marketing/server/queries";
import { CategoryExpertRow } from "@/features/experts/components/category-expert-row";
import { HowItWorks } from "@/features/experts/components/how-it-works";
import { FeaturedLogosStrip } from "@/features/marketing/components/featured-logos-strip";
import { ExpertFinderSection } from "@/features/finder/components/expert-finder-section";
import { getCategories } from "@/features/experts/server/categories";

export default async function Home() {
  const [user, categoryGroups, featuredLogos, finderCategories] = await Promise.all([
    getUser(),
    getCategoriesWithFeaturedExperts(),
    getFeaturedLogosForHome(),
    getCategories(),
  ]);

  const [wishlistedIds, donatingIds] = await Promise.all([
    user ? getWishlistedExpertIds(user.id) : Promise.resolve(new Set<string>()),
    getExpertIdsWithNgoDonations(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 px-6 py-16 text-center text-white sm:py-24">
          <h1 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Book 1:1 sessions with African experts over video call
          </h1>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Find the right expert, book a time, and get real advice on a call.
          </p>
          <Link
            href="/experts"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
          >
            Find an expert
          </Link>
          <FeaturedLogosStrip logos={featuredLogos} />
        </div>
      </div>

      {categoryGroups.length > 0 ? (
        <>
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10">
            {categoryGroups.slice(0, 2).map((group) => (
              <CategoryExpertRow
                key={group.category.id}
                categoryId={group.category.id}
                categoryName={group.category.name}
                tagline={group.category.tagline}
                experts={group.experts}
                wishlistedIds={wishlistedIds}
                donatingIds={donatingIds}
                isSignedIn={Boolean(user)}
              />
            ))}
          </div>

          <div className="mx-auto w-full max-w-4xl px-4">
            <ExpertFinderSection categories={finderCategories} />
          </div>

          {categoryGroups.length > 2 && (
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10">
              {categoryGroups.slice(2).map((group) => (
                <CategoryExpertRow
                  key={group.category.id}
                  categoryId={group.category.id}
                  categoryName={group.category.name}
                  tagline={group.category.tagline}
                  experts={group.experts}
                  wishlistedIds={wishlistedIds}
                  donatingIds={donatingIds}
                  isSignedIn={Boolean(user)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
            <p className="text-black/60 dark:text-white/60">
              New experts are joining every week — browse the full directory to see who&apos;s available now.
            </p>
            <Link
              href="/experts"
              className="mt-4 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
            >
              Browse all experts
            </Link>
          </div>

          <div className="mx-auto w-full max-w-4xl px-4 pb-10">
            <ExpertFinderSection categories={finderCategories} />
          </div>
        </>
      )}

      <HowItWorks />

      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold">Give everyone access to real expertise</h2>
        <p className="mt-3 text-black/60 dark:text-white/60">
          Pivotroom.africa connects clients directly with African experts for honest, 1:1 advice over
          video — no waitlists, no gatekeeping.
        </p>
      </div>

      <div className="border-t border-black/10 bg-black/[0.03] px-4 py-14 text-center dark:border-white/15 dark:bg-white/5">
        <h2 className="text-xl font-semibold">Ready to book your first session?</h2>
        <Link
          href="/experts"
          className="mt-4 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          Find an expert
        </Link>
      </div>
    </div>
  );
}
