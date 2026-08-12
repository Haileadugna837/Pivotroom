import { getReviewsForAdmin } from "@/features/admin/server/queries";
import { ReviewsView } from "@/features/admin/components/reviews-view";

export default async function AdminReviewsPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold">Reviews</h1>
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-500">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const reviews = await getReviewsForAdmin();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Reviews</h1>
      <p className="mb-6 text-sm text-black/50 dark:text-white/50">
        Hide a review to remove it from an expert&apos;s public profile without deleting it.
      </p>
      <ReviewsView reviews={reviews} />
    </div>
  );
}
