import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFreeBusy } from "@/lib/google/calendar";
import { isStillBlocking } from "./availability-rules";

const ACTIVE_STATUSES = ["pending_payment", "payment_submitted", "confirmed"];

// Internal check only — never expose the underlying rows to callers, just
// the boolean. Uses the admin client because a client booking one expert
// has no RLS visibility into that expert's other bookings.
export async function isSlotAvailable({
  expertId,
  startTime,
  endTime,
}: {
  expertId: string;
  startTime: string;
  endTime: string;
}): Promise<{ available: boolean; reason?: string }> {
  const admin = createAdminClient();

  const { data: overlapping, error } = await admin
    .from("bookings")
    .select("id, status, created_at")
    .eq("expert_id", expertId)
    .in("status", ACTIVE_STATUSES)
    .lt("start_time", endTime)
    .gt("end_time", startTime);

  if (error) throw error;

  const stillBlocking = (overlapping ?? []).some((b) => isStillBlocking(b));
  if (stillBlocking) {
    return { available: false, reason: "That time overlaps another booking." };
  }

  const { data: tokenRow } = await admin
    .from("expert_google_tokens")
    .select("refresh_token")
    .eq("expert_id", expertId)
    .maybeSingle();

  if (tokenRow?.refresh_token) {
    try {
      const busy = await getFreeBusy({
        refreshToken: tokenRow.refresh_token,
        timeMin: startTime,
        timeMax: endTime,
      });
      const conflicts = busy.some((slot) => {
        if (!slot.start || !slot.end) return false;
        return new Date(slot.start) < new Date(endTime) && new Date(slot.end) > new Date(startTime);
      });
      if (conflicts) {
        return { available: false, reason: "The expert is busy at that time on Google Calendar." };
      }
    } catch {
      // If the calendar check fails (e.g. revoked access), fall back to
      // only the in-app overlap check above rather than blocking booking.
    }
  }

  return { available: true };
}

// Confirms the requested [startTime, endTime) on `date` sits fully inside
// one of the expert's declared availability windows for that date.
export async function isWithinAvailabilityWindow({
  expertId,
  date,
  startTime,
  endTime,
}: {
  expertId: string;
  date: string;
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
}): Promise<boolean> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("expert_availability")
    .select("id")
    .eq("expert_id", expertId)
    .eq("date", date)
    .lte("start_time", startTime)
    .gte("end_time", endTime)
    .limit(1);

  if (error) throw error;
  return data.length > 0;
}
