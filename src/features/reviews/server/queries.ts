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
