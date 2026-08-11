"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSlotAvailable, isWithinAvailabilityWindow } from "./availability";

const ALLOWED_DURATIONS = [15, 30, 45, 60];

export async function createBooking(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const expertId = String(formData.get("expert_id") ?? "");
  const date = String(formData.get("date") ?? "");
  const startTimeOfDay = String(formData.get("start_time") ?? "");
  const durationMinutes = Number(formData.get("duration_minutes"));

  if (!expertId || !date || !startTimeOfDay || !ALLOWED_DURATIONS.includes(durationMinutes)) {
    throw new Error("Missing or invalid booking details");
  }

  const start = new Date(`${date}T${startTimeOfDay}:00`);
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  if (start.getTime() <= Date.now()) {
    redirect(`/experts/${expertId}?error=${encodeURIComponent("Pick a time in the future.")}`);
  }

  const { data: expert, error: expertError } = await supabase
    .from("experts")
    .select("price_per_15_min, currency")
    .eq("id", expertId)
    .eq("is_approved", true)
    .maybeSingle();
  if (expertError) throw expertError;
  if (!expert) throw new Error("Expert not found");

  const withinWindow = await isWithinAvailabilityWindow({
    expertId,
    date,
    startTime: `${startTimeOfDay}:00`,
    endTime: `${fromMinutesOfDay(toMinutesOfDay(startTimeOfDay) + durationMinutes)}:00`,
  });
  if (!withinWindow) {
    redirect(
      `/experts/${expertId}?error=${encodeURIComponent("That time is outside the expert's available hours.")}`,
    );
  }

  const { available, reason } = await isSlotAvailable({
    expertId,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  });
  if (!available) {
    redirect(`/experts/${expertId}?error=${encodeURIComponent(reason ?? "That time is unavailable.")}`);
  }

  const price = expert.price_per_15_min != null ? (expert.price_per_15_min * durationMinutes) / 15 : null;

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      client_id: user.id,
      expert_id: expertId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      price,
      currency: expert.currency,
    })
    .select("id")
    .single();

  if (error) throw error;

  redirect(`/bookings/${booking.id}`);
}

function toMinutesOfDay(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutesOfDay(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (totalMinutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
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
