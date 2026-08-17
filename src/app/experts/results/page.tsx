import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
import { getFinderSessionBySessionId } from "@/features/finder/server/queries";
import { getCategoryWithExperts } from "@/features/experts/server/queries";
import { getWishlistedExpertIds } from "@/features/wishlist/server/queries";
import { getExpertIdsWithNgoDonations } from "@/features/ngo/server/queries";
import { getExpertRatingSummaries } from "@/features/reviews/server/queries";
import { ExpertCard } from "@/features/experts/components/expert-card";
import { identityLabel, problemLabel } from "@/features/finder/config";
import { markFinderResultsViewed } from "@/features/finder/server/actions";
import { parseSortValue, sortExpertsBy } from "@/features/experts/lib/sort";
import { SORT_OPTIONS } from "@/features/experts/components/sort-bar";
import { CapturePageEvent } from "@/components/capture-page-event";

export const metadata: Metadata = {
  title: "Your expert matches",
  robots: { index: false, follow: false },
};

export default async function FinderResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; sort?: string }>;
}) {
  const { s: sessionId, sort: sortParam } = await searchParams;
  if (!sessionId) redirect("/#find-expert");

  const session = await getFinderSessionBySessionId(sessionId);
  if (!session || !session.category_id) redirect("/#find-expert");

  // Fire-and-forget — the visit itself is what "viewed" means, no need to
  // block rendering on it.
  markFinderResultsViewed(sessionId).catch(() => {});

  const result = await getCategoryWithExperts(session.category_id);
  if (!result) redirect("/#find-expert");

  const { category, experts } = result;
  const subcategoryId = session.subcategory_id;
  const matchedExperts = subcategoryId
    ? experts.filter((e) => e.matchedCategoryIds.includes(subcategoryId))
    : experts;

  const sort = parseSortValue(sortParam);
  const [user, ratings] = await Promise.all([getUser(), getExpertRatingSummaries()]);
  const sortedExperts = sortExpertsBy(matchedExperts, sort, ratings);

  const [wishlistedIds, donatingIds] = await Promise.all([
    user ? getWishlistedExpertIds(user.id) : Promise.resolve(new Set<string>()),
    getExpertIdsWithNgoDonations(),
  ]);

  const identityText = identityLabel(session.identity);
  const problemText = problemLabel(session.identity, session.problem);
  const breadcrumb = [identityText, category.name, problemText].filter(Boolean).join(" · ");

  const changeAnswersParams = new URLSearchParams();
  if (session.identity) changeAnswersParams.set("identity", session.identity);
  if (session.problem) changeAnswersParams.set("problem", session.problem);
  changeAnswersParams.set("category", session.category_id);
  if (session.subcategory_id) changeAnswersParams.set("subcategory", session.subcategory_id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <CapturePageEvent
        event="finder_results_viewed"
        properties={{
          category_id: session.category_id,
          subcategory_id: session.subcategory_id,
          identity: session.identity,
          problem: session.problem,
        }}
      />
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
      >
        ← Home
      </Link>

      <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">
        {problemText ? `Experts who can help you with ${problemText.toLowerCase()}` : "Experts who can help you"}
      </h1>
      {breadcrumb && <p className="mt-1 text-sm text-black/50 dark:text-white/50">{breadcrumb}</p>}
      {identityText && problemText && (
        <p className="mt-3 max-w-xl text-sm text-black/60 dark:text-white/60">
          Best for {identityText.toLowerCase()}s looking to {problemText.toLowerCase()}.
        </p>
      )}

      <div className="mb-8 mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/15">
        <Link href={`/?${changeAnswersParams.toString()}#find-expert`} className="text-sm font-medium hover:underline">
          Change Answers
        </Link>
        <form method="GET" className="flex items-center gap-2 text-sm">
          <input type="hidden" name="s" value={sessionId} />
          <label className="flex items-center gap-2">
            Sort by
            <select
              name="sort"
              defaultValue={sort}
              className="rounded-md border border-black/10 bg-transparent px-2 py-1.5 text-sm dark:border-white/15"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-md border border-black/10 px-3 py-1.5 text-sm dark:border-white/15"
          >
            Apply
          </button>
        </form>
      </div>

      {sortedExperts.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">No experts match right now.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sortedExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expertId={expert.id}
              href={`/experts/${expert.id}`}
              headline={expert.headline}
              bio={expert.bio}
              pricePer15Min={expert.price_per_15_min}
              currency={expert.currency}
              fullName={expert.profile?.full_name ?? null}
              photoUrl={expert.photo_url}
              wishlisted={wishlistedIds.has(expert.id)}
              isSignedIn={Boolean(user)}
              donatesToNgo={donatingIds.has(expert.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
