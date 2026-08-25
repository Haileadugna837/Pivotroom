import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
import { getApprovedExpertById } from "@/features/experts/server/queries";
import { getPublicBookableTopics } from "@/features/experts/server/bookable-topics";
import { BookingLauncher } from "@/features/booking/components/booking-launcher";
import { getReviewsForExpert } from "@/features/reviews/server/queries";
import { ReviewList } from "@/features/reviews/components/review-list";
import { SocialIcon } from "@/features/experts/components/social-icons";
import { ShareButton } from "@/features/experts/components/share-button";
import { isExpertWishlisted } from "@/features/wishlist/server/queries";
import { WishlistHeartButton } from "@/features/wishlist/components/wishlist-heart-button";
import { getExpertNgoDonationSummary } from "@/features/ngo/server/queries";
import { VerifiedBadge } from "@/features/experts/components/verified-badge";
import { WhatToExpect } from "@/features/experts/components/what-to-expect";
import { HowItWorksFaq } from "@/features/experts/components/how-it-works-faq";
import { CapturePageEvent } from "@/components/capture-page-event";

function formatPercentage(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatNgoNameList(names: string[]) {
  return new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(names);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const expert = await getApprovedExpertById(id);
  if (!expert) return { title: "Expert not found" };

  const name = expert.profile?.full_name ?? "Expert";
  const description = expert.headline ?? `Book a 1:1 session with ${name} on Pivotroom.africa.`;

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      images: expert.photo_url ? [{ url: expert.photo_url }] : undefined,
    },
  };
}

export default async function ExpertDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; openBooking?: string }>;
}) {
  const { id } = await params;
  const { error, openBooking } = await searchParams;
  const expert = await getApprovedExpertById(id);
  if (!expert) notFound();

  const { reviews, average, count } = await getReviewsForExpert(id);

  const user = await getUser();
  const [wishlisted, ngoDonation, bookableTopics] = await Promise.all([
    user ? isExpertWishlisted(user.id, id) : Promise.resolve(false),
    getExpertNgoDonationSummary(id),
    getPublicBookableTopics(id),
  ]);
  const donatesToNgo = ngoDonation != null;

  const name = expert.profile?.full_name ?? "Expert";
  const loginHref = `/login?next=${encodeURIComponent(`/experts/${expert.id}?openBooking=1`)}`;
  const expectations = expert.expectations ?? [];
  const exampleQuestions = expert.example_questions ?? [];

  const donationMessage = ngoDonation
    ? `${formatPercentage(ngoDonation.totalPercentage)}% of proceeds will be donated to ${formatNgoNameList(ngoDonation.ngoNames)}`
    : null;

  return (
    <div className="mx-auto max-w-5xl bg-pivot-paper px-4 py-10 pb-24 md:pb-10">
      <CapturePageEvent
        event="expert_viewed"
        properties={{ expert_id: expert.id, expert_name: name, category_id: expert.primary_category_id }}
      />
      <div className="md:grid md:grid-cols-[1fr_380px] md:items-start md:gap-10">
        <div className="mx-auto w-full max-w-lg md:col-start-1 md:row-start-1 md:mx-0">
          <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-xl bg-pivot-paper-2 md:aspect-[4/5]">
            {expert.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={expert.photo_url} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-pivot-muted">
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

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-semibold text-pivot-ink">{name}</h1>
              <VerifiedBadge gold={donatesToNgo} size={16} />
            </div>
            <div className="flex items-center gap-2">
              {expert.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-pivot-line text-pivot-ink hover:bg-pivot-paper-2"
                >
                  <SocialIcon platform={link.platform} className="h-4 w-4" />
                </a>
              ))}
              <ShareButton title={name} />
            </div>
          </div>

          {expert.headline && <p className="mt-1 text-base text-pivot-ink-2">{expert.headline}</p>}

          {count > 0 && (
            <p className="mt-3 text-base text-pivot-ink">
              ★ {average?.toFixed(1)} <span className="text-pivot-muted">({count})</span>
            </p>
          )}

          {donationMessage && (
            <div className="mt-3 rounded-2xl bg-pivot-olive/10 px-5 py-4 text-center text-sm font-medium text-pivot-olive">
              {donationMessage}
            </div>
          )}

          {expert.bio && <p className="mt-3 text-base text-pivot-ink-2">{expert.bio}</p>}

          <WhatToExpect
            expectations={expectations}
            exampleQuestions={exampleQuestions}
            className="mt-4 md:hidden"
          />

          <p className="mt-4 text-lg font-semibold text-pivot-ink">
            {expert.price_per_15_min != null
              ? `${expert.currency} ${expert.price_per_15_min} • 15 min`
              : "Rate not set"}
          </p>
        </div>

        <BookingLauncher
          expertId={expert.id}
          pricePer15Min={expert.price_per_15_min}
          currency={expert.currency}
          availability={expert.availability}
          average={average}
          count={count}
          isSignedIn={Boolean(user)}
          loginHref={loginHref}
          error={error}
          autoOpen={openBooking === "1"}
        />

        <WhatToExpect
          expectations={expectations}
          exampleQuestions={exampleQuestions}
          className="hidden md:col-start-2 md:block"
        />
      </div>

      {bookableTopics.length > 0 && (
        <div className="mt-8 border-t border-pivot-line pt-6">
          <h2 className="mb-3 text-sm font-medium text-pivot-ink">What you can book {name} for</h2>
          <ul className="flex flex-col gap-3">
            {bookableTopics.map((t) => (
              <li key={t.id} className="rounded-lg border border-pivot-line p-3 text-sm text-pivot-ink">
                <p className="font-medium">{t.title}</p>
                <p className="mt-1 text-pivot-muted">{t.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 border-t border-pivot-line pt-6">
        <h2 className="mb-3 text-sm font-medium text-pivot-ink">Reviews</h2>
        <ReviewList reviews={reviews} average={average} count={count} />
      </div>

      <HowItWorksFaq />
    </div>
  );
}
