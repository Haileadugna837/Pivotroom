"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSlotAvailable } from "./availability";

export async function createBooking(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const expertId = String(formData.get("expert_id") ?? "");
  const startTime = String(formData.get("start_time") ?? "");
  const durationMinutes = Number(formData.get("duration_minutes"));
  const price = Number(formData.get("price"));
  const currency = String(formData.get("currency") ?? "USD");

  if (!expertId || !startTime || !Number.isFinite(durationMinutes)) {
    throw new Error("Missing booking details");
  }

  const start = new Date(startTime);
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  if (start.getTime() <= Date.now()) {
    redirect(`/experts/${expertId}?error=${encodeURIComponent("Pick a time in the future.")}`);
  }

  const { available, reason } = await isSlotAvailable({
    expertId,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  });
  if (!available) {
    redirect(`/experts/${expertId}?error=${encodeURIComponent(reason ?? "That time is unavailable.")}`);
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      client_id: user.id,
      expert_id: expertId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      price: Number.isFinite(price) ? price : null,
      currency,
    })
    .select("id")
    .single();

  if (error) throw error;

  redirect(`/bookings/${booking.id}`);
}

export async function markBookingCompletedAsExpert(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) throw new Error("Missing booking_id");

  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId);
  if (error) throw error;

  revalidatePath(`/bookings/${bookingId}`);
}
