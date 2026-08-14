import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getMyWishlistedExperts } from "@/features/wishlist/server/queries";
import { getExpertIdsWithNgoDonations } from "@/features/ngo/server/queries";
import { ExpertCard } from "@/features/experts/components/expert-card";

export default async function WishlistPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const [experts, donatingIds] = await Promise.all([
    getMyWishlistedExperts(user.id),
    getExpertIdsWithNgoDonations(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-xl font-semibold">My Wishlist</h1>
      {experts.length === 0 ? (
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">
          You haven&apos;t saved any experts yet. Tap the heart icon on an expert&apos;s photo to add them here.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {experts.map((expert) => (
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
              wishlisted={true}
              isSignedIn={true}
              donatesToNgo={donatingIds.has(expert.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
