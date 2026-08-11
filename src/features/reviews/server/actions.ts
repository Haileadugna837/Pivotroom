"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const bookingId = String(formData.get("booking_id") ?? "");
  const expertId = String(formData.get("expert_id") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim() || null;

  if (!bookingId || !expertId || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Error("Missing or invalid review details");
  }

  const { error } = await supabase.from("reviews").insert({
    booking_id: bookingId,
    client_id: user.id,
    expert_id: expertId,
    rating,
    comment,
  });
  if (error) throw error;

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath(`/experts/${expertId}`);
}
