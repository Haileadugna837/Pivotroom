import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getApprovedExpertById } from "@/features/experts/server/queries";
import { BookingForm } from "@/features/booking/components/booking-form";
import { getReviewsForExpert } from "@/features/reviews/server/queries";
import { ReviewList } from "@/features/reviews/components/review-list";

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

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="relative mb-4 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl bg-black/5 dark:bg-white/10">
        {expert.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={expert.photo_url}
            alt={expert.profile?.full_name ?? "Expert"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-black/20 dark:text-white/20">
            {(expert.profile?.full_name ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <h1 className="text-xl font-semibold">{expert.profile?.full_name ?? "Expert"}</h1>
      {expert.categories?.name && (
        <span className="mt-1 inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
          {expert.categories.name}
        </span>
      )}
      {expert.headline && <p className="mt-3 text-sm">{expert.headline}</p>}
      {expert.bio && (
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">{expert.bio}</p>
      )}
      <p className="mt-3 font-medium">
        {expert.price_per_15_min != null
          ? `${expert.currency} ${expert.price_per_15_min} / 15 min`
          : "Rate not set"}
      </p>

      <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="mb-3 text-sm font-medium">Book a session</h2>
        {error && (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}
        {user ? (
          <BookingForm
            expertId={expert.id}
            pricePer15Min={expert.price_per_15_min}
            currency={expert.currency}
            availability={expert.availability}
          />
        ) : (
          <p className="text-sm">
            <a href={`/login?next=/experts/${expert.id}`} className="underline">
              Sign in
            </a>{" "}
            to book a session.
          </p>
        )}
      </div>

      <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="mb-3 text-sm font-medium">Reviews</h2>
        <ReviewList reviews={reviews} average={average} count={count} />
      </div>
    </div>
  );
}
