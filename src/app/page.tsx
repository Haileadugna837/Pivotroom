import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { getCategoriesWithFeaturedExperts } from "@/features/experts/server/queries";
import { getWishlistedExpertIds } from "@/features/wishlist/server/queries";
import { getExpertIdsWithNgoDonations } from "@/features/ngo/server/queries";
import { CategoryPillNav } from "@/features/experts/components/category-pill-nav";
import { CategoryExpertRow } from "@/features/experts/components/category-expert-row";
import { HowItWorks } from "@/features/experts/components/how-it-works";

export default async function Home() {
  const [user, categoryGroups] = await Promise.all([getUser(), getCategoriesWithFeaturedExperts()]);

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
          <form
            action="/experts/search"
            method="GET"
            className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full bg-white p-1.5 pl-4"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 text-black/40">
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M18 18l-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              name="q"
              placeholder="Search experts"
              className="flex-1 bg-transparent py-2 text-sm text-black outline-none placeholder:text-black/40"
            />
            <button
              type="submit"
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {categoryGroups.length > 0 ? (
        <>
          <div className="mx-auto w-full max-w-6xl px-4 pt-8">
            <CategoryPillNav categories={categoryGroups.map((g) => g.category)} />
          </div>

          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10">
            {categoryGroups.map((group) => (
              <CategoryExpertRow
                key={group.category.id}
                categoryId={group.category.id}
                categoryName={group.category.name}
                experts={group.experts}
                wishlistedIds={wishlistedIds}
                donatingIds={donatingIds}
                isSignedIn={Boolean(user)}
              />
            ))}
          </div>
        </>
      ) : (
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
