import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getApprovedExpertById } from "@/features/experts/server/queries";
import { BookingLauncher } from "@/features/booking/components/booking-launcher";
import { getReviewsForExpert } from "@/features/reviews/server/queries";
import { ReviewList } from "@/features/reviews/components/review-list";
import { SocialIcon } from "@/features/experts/components/social-icons";
import { ShareButton } from "@/features/experts/components/share-button";
import { isExpertWishlisted } from "@/features/wishlist/server/queries";
import { WishlistHeartButton } from "@/features/wishlist/components/wishlist-heart-button";
import { expertDonatesToNgo } from "@/features/ngo/server/queries";
import { VerifiedBadge } from "@/features/experts/components/verified-badge";

export default async function ExpertDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const expert = await getApprovedExpertById(id);
  if (!expert) notFound();

  const { reviews, average, count } = await getReviewsForExpert(id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [wishlisted, donatesToNgo] = await Promise.all([
    user ? isExpertWishlisted(user.id, id) : Promise.resolve(false),
    expertDonatesToNgo(id),
  ]);

  const name = expert.profile?.full_name ?? "Expert";

  return (
    <div className="mx-auto max-w-lg px-4 py-10 pb-24 md:pb-10">
      <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/10">
        {expert.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={expert.photo_url} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-black/20 dark:text-white/20">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <WishlistHeartButton
          expertId={expert.id}
          initialWishlisted={wishlisted}
          isSignedIn={Boolean(user)}
          className="absolute right-3 top-3"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-semibold">{name}</h1>
          <VerifiedBadge gold={donatesToNgo} size={16} />
        </div>
        <ShareButton title={name} />
      </div>

      {expert.headline && (
        <p className="mt-1 text-base text-black/60 dark:text-white/60">{expert.headline}</p>
      )}

      {expert.socialLinks.length > 0 && (
        <div className="mt-3 flex gap-2">
          {expert.socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              <SocialIcon platform={link.platform} className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}

      {count > 0 && (
        <p className="mt-3 text-base">
          ★ {average?.toFixed(1)} <span className="text-black/50 dark:text-white/50">({count})</span>
        </p>
      )}

      {(expert.categories?.name || donatesToNgo) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {expert.categories?.name && (
            <span className="inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
              {expert.categories.name}
            </span>
          )}
          {donatesToNgo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <VerifiedBadge gold size={12} />
              Supports an NGO
            </span>
          )}
        </div>
      )}

      {expert.bio && (
        <p className="mt-3 text-base text-black/70 dark:text-white/70">{expert.bio}</p>
      )}

      <p className="mt-4 text-lg font-semibold">
        {expert.price_per_15_min != null
          ? `${expert.currency} ${expert.price_per_15_min} • 15 min`
          : "Rate not set"}
      </p>

      <BookingLauncher
        expertId={expert.id}
        pricePer15Min={expert.price_per_15_min}
        currency={expert.currency}
        availability={expert.availability}
        average={average}
        count={count}
        isSignedIn={Boolean(user)}
        loginHref={`/login?next=/experts/${expert.id}`}
        error={error}
      />

      <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="mb-3 text-sm font-medium">Reviews</h2>
        <ReviewList reviews={reviews} average={average} count={count} />
      </div>
    </div>
  );
}
