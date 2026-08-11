"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { createBookingEventWithMeet } from "@/lib/google/calendar";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    throw new Error("Not authorized");
  }
  return user;
}

export async function approveExpert(formData: FormData) {
  await requireAdmin();
  const expertId = String(formData.get("expert_id") ?? "");
  if (!expertId) throw new Error("Missing expert_id");

  const admin = createAdminClient();
  const { error } = await admin.from("experts").update({ is_approved: true }).eq("id", expertId);
  if (error) throw error;

  revalidatePath("/admin");
}

export async function rejectExpert(formData: FormData) {
  await requireAdmin();
  const expertId = String(formData.get("expert_id") ?? "");
  if (!expertId) throw new Error("Missing expert_id");

  const admin = createAdminClient();
  const { error } = await admin.from("experts").delete().eq("id", expertId);
  if (error) throw error;

  revalidatePath("/admin");
}

export async function verifyPayment(formData: FormData) {
  const adminUser = await requireAdmin();
  const proofId = String(formData.get("proof_id") ?? "");
  const bookingId = String(formData.get("booking_id") ?? "");
  const expertId = String(formData.get("expert_id") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");
  const price = formData.get("price");

  if (!proofId || !bookingId || !expertId) throw new Error("Missing verification details");

  const admin = createAdminClient();

  const { error: proofError } = await admin
    .from("payment_proofs")
    .update({ status: "verified", reviewed_by: adminUser.id, reviewed_at: new Date().toISOString() })
    .eq("id", proofId);
  if (proofError) throw proofError;

  // Try to generate a Google Meet link if the expert has connected their calendar.
  // Booking still gets confirmed either way — meet_link stays null otherwise.
  let meetLink: string | null = null;
  let calendarEventId: string | null = null;

  const { data: tokenRow } = await admin
    .from("expert_google_tokens")
    .select("refresh_token")
    .eq("expert_id", expertId)
    .maybeSingle();

  if (tokenRow?.refresh_token) {
    const { data: expertProfile } = await admin
      .from("profiles")
      .select("email")
      .eq("id", expertId)
      .maybeSingle();
    const { data: clientProfile } = await admin
      .from("profiles")
      .select("email")
      .eq("id", clientId)
      .maybeSingle();

    const attendeeEmails = [expertProfile?.email, clientProfile?.email].filter(
      (e): e is string => Boolean(e),
    );

    try {
      const result = await createBookingEventWithMeet({
        refreshToken: tokenRow.refresh_token,
        summary: "Pivotroom.africa session",
        startTime,
        endTime,
        attendeeEmails,
      });
      meetLink = result.meetLink;
      calendarEventId = result.eventId;
    } catch {
      // Calendar event creation failed (e.g. revoked access) — booking is
      // still confirmed; admin can share a meeting link manually.
    }
  }

  const { error: bookingError } = await admin
    .from("bookings")
    .update({
      status: "confirmed",
      meet_link: meetLink,
      calendar_event_id: calendarEventId,
    })
    .eq("id", bookingId);
  if (bookingError) throw bookingError;

  const { error: payoutError } = await admin.from("expert_payouts").insert({
    booking_id: bookingId,
    amount: price ? Number(price) : null,
  });
  if (payoutError) throw payoutError;

  revalidatePath("/admin");
}

export async function rejectPayment(formData: FormData) {
  const adminUser = await requireAdmin();
  const proofId = String(formData.get("proof_id") ?? "");
  const bookingId = String(formData.get("booking_id") ?? "");
  const adminNote = String(formData.get("admin_note") ?? "").trim() || null;

  if (!proofId || !bookingId) throw new Error("Missing rejection details");

  const admin = createAdminClient();

  const { error: proofError } = await admin
    .from("payment_proofs")
    .update({
      status: "rejected",
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      admin_note: adminNote,
    })
    .eq("id", proofId);
  if (proofError) throw proofError;

  const { error: bookingError } = await admin
    .from("bookings")
    .update({ status: "rejected" })
    .eq("id", bookingId);
  if (bookingError) throw bookingError;

  revalidatePath("/admin");
}

export async function markPayoutPaid(formData: FormData) {
  const adminUser = await requireAdmin();
  const payoutId = String(formData.get("payout_id") ?? "");
  if (!payoutId) throw new Error("Missing payout_id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("expert_payouts")
    .update({ status: "paid", paid_at: new Date().toISOString(), paid_by: adminUser.id })
    .eq("id", payoutId);
  if (error) throw error;

  revalidatePath("/admin");
}
