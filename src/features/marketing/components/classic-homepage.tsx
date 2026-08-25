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

// The pre-Phase-1-acquisition marketplace homepage, extracted verbatim so it
// can keep being edited/iterated on at /classic regardless of whether the
// new acquisition landing page is toggled on at "/" (see
// site_settings.acquisition_landing_enabled).
export async function ClassicHomepage() {
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
    <div className="flex flex-1 flex-col bg-pivot-paper">
      {/* Hero */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="overflow-hidden rounded-3xl bg-pivot-ink px-6 py-16 text-center text-pivot-paper sm:py-24">
          <h1 className="mx-auto max-w-2xl font-serif text-3xl leading-tight font-normal sm:text-4xl">
            Book 1:1 sessions with African experts over video call
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pivot-paper/70">
            Find the right expert, book a time, and get real advice on a call.
          </p>
          <Link
            href="/experts"
            className="mt-6 inline-block rounded-full bg-pivot-paper px-6 py-3 text-sm font-medium text-pivot-ink hover:bg-pivot-paper/90"
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
            <p className="text-pivot-ink-2">
              New experts are joining every week — browse the full directory to see who&apos;s available now.
            </p>
            <Link
              href="/experts"
              className="mt-4 inline-block rounded-full bg-pivot-ink px-6 py-3 text-sm font-medium text-pivot-paper"
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
        <h2 className="font-serif text-2xl font-normal text-pivot-ink">Give everyone access to real expertise</h2>
        <p className="mt-3 text-pivot-ink-2">
          Pivotroom.africa connects clients directly with African experts for honest, 1:1 advice over
          video — no waitlists, no gatekeeping.
        </p>
      </div>

      <div className="border-t border-pivot-line bg-pivot-paper-2 px-4 py-14 text-center">
        <h2 className="text-xl font-semibold text-pivot-ink">Ready to book your first session?</h2>
        <Link
          href="/experts"
          className="mt-4 inline-block rounded-full bg-pivot-ink px-6 py-3 text-sm font-medium text-pivot-paper"
        >
          Find an expert
        </Link>
      </div>
    </div>
  );
}
