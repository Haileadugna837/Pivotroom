import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
import { getCategoryWithExperts } from "@/features/experts/server/queries";
import { getWishlistedExpertIds } from "@/features/wishlist/server/queries";
import { getExpertIdsWithNgoDonations } from "@/features/ngo/server/queries";
import { ExpertCard } from "@/features/experts/components/expert-card";
import { getCategoryIcon } from "@/features/experts/lib/category-visuals";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getCategoryWithExperts(id);
  if (!result) return {};
  return {
    title: result.category.name,
    description: result.category.tagline ?? `Browse ${result.category.name} experts on Pivotroom.africa.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const [{ id }, { sub }] = await Promise.all([params, searchParams]);
  const result = await getCategoryWithExperts(id);
  if (!result) notFound();

  const { category, subcategories, experts } = result;
  const validSubIds = new Set(subcategories.map((s) => s.id));
  const selectedSubs = new Set(
    (sub ?? "").split(",").filter((subId) => validSubIds.has(subId)),
  );
  const visibleExperts =
    selectedSubs.size > 0
      ? experts.filter((e) => e.matchedCategoryIds.some((id) => selectedSubs.has(id)))
      : experts;

  function subcategoryHref(subId: string) {
    const next = new Set(selectedSubs);
    if (next.has(subId)) next.delete(subId);
    else next.add(subId);
    return next.size > 0
      ? `/experts/category/${category.id}?sub=${[...next].join(",")}`
      : `/experts/category/${category.id}`;
  }

  const user = await getUser();
  const [wishlistedIds, donatingIds] = await Promise.all([
    user ? getWishlistedExpertIds(user.id) : Promise.resolve(new Set<string>()),
    getExpertIdsWithNgoDonations(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/experts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All experts
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
          {getCategoryIcon(category.name)}
        </div>
        <div>
          <h1 className="text-2xl font-semibold leading-tight">{category.name}</h1>
          {category.tagline && (
            <p className="text-sm text-black/50 dark:text-white/50">{category.tagline}</p>
          )}
        </div>
      </div>

      {subcategories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href={`/experts/category/${category.id}`}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium ${
              selectedSubs.size === 0
                ? "border-foreground bg-foreground text-background"
                : "border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            }`}
          >
            All
          </Link>
          {subcategories.map((s) => (
            <Link
              key={s.id}
              href={subcategoryHref(s.id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                selectedSubs.has(s.id)
                  ? "border-foreground bg-foreground text-background"
                  : "border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              }`}
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      <p className="mb-4 text-sm text-black/50 dark:text-white/50">
        {visibleExperts.length} {visibleExperts.length === 1 ? "expert" : "experts"}
      </p>

      {visibleExperts.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">No experts in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibleExperts.map((expert) => (
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
