import { createClient } from "@/lib/supabase/server";

export async function getReviewForBooking(bookingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at")
    .eq("booking_id", bookingId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Bulk average-rating + count per expert, used for sorting the marketplace
// listing by "Highest ratings" / "Most reviewed" without an N+1 query.
export async function getExpertRatingSummaries() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("reviews").select("expert_id, rating").eq("hidden", false);
  if (error) throw error;

  const totals = new Map<string, { sum: number; count: number }>();
  for (const r of data) {
    const entry = totals.get(r.expert_id) ?? { sum: 0, count: 0 };
    entry.sum += r.rating;
    entry.count += 1;
    totals.set(r.expert_id, entry);
  }

  return new Map(
    Array.from(totals.entries()).map(([expertId, { sum, count }]) => [
      expertId,
      { average: sum / count, count },
    ]),
  );
}

export async function getReviewsForExpert(expertId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at")
    .eq("expert_id", expertId)
    .eq("hidden", false)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const average =
    data.length > 0 ? data.reduce((sum, r) => sum + r.rating, 0) / data.length : null;

  return { reviews: data, average, count: data.length };
}
