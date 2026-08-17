"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSlotAvailable, isWithinAvailabilityWindow } from "./availability";
import { zonedWallTimeToUtc } from "./timezone";
import { captureServerEvent } from "@/lib/posthog/server";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("account_status")
    .eq("id", user.id)
    .maybeSingle();
  if (profile && profile.account_status !== "active") {
    redirect(
      `/experts/${expertId}?error=${encodeURIComponent("Your account can't book sessions right now. Contact support if you think this is a mistake.")}`,
    );
  }

  const { data: expert, error: expertError } = await supabase
    .from("experts")
    .select("price_per_15_min, currency, timezone")
    .eq("id", expertId)
    .eq("status", "approved")
    .maybeSingle();
  if (expertError) throw expertError;
  if (!expert) throw new Error("Expert not found");

  // The date/start_time the client picked describe the expert's declared
  // availability window in the expert's own local time — they must be
  // converted using the expert's timezone, not the server's, or every
  // booking silently shifts by however many hours apart the two are.
  const start = zonedWallTimeToUtc(date, `${startTimeOfDay}:00`, expert.timezone);
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  if (start.getTime() <= Date.now()) {
    redirect(`/experts/${expertId}?error=${encodeURIComponent("Pick a time in the future.")}`);
  }

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

  await captureServerEvent(user.id, "booking_created", {
    booking_id: booking.id,
    expert_id: expertId,
    price,
    currency: expert.currency,
  });

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

export async function cancelBooking(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) throw new Error("Missing booking_id");

  // Two separate RLS policies decide whether this is actually allowed —
  // pending_payment bookings can always be cancelled, confirmed ones only
  // more than 2 hours before start_time. RLS just silently excludes rows
  // that don't qualify rather than erroring, so a 0-row result means
  // "not allowed right now," not a real failure.
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("client_id", user.id)
    .select("id");
  if (error) throw error;

  if (!data || data.length === 0) {
    redirect(
      `/bookings/${bookingId}?error=${encodeURIComponent(
        "This booking can't be cancelled right now — confirmed sessions can only be cancelled more than 2 hours before they start.",
      )}`,
    );
  }

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/dashboard");
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
    .eq("id", bookingId)
    .eq("status", "confirmed")
    .lte("end_time", new Date().toISOString());
  if (error) throw error;

  revalidatePath(`/bookings/${bookingId}`);
}
