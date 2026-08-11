"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { notifyAdminPaymentSubmitted } from "@/features/notifications/server/send";

export async function submitPaymentProof(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const bookingId = String(formData.get("booking_id") ?? "");
  const transactionId = String(formData.get("transaction_id") ?? "").trim();
  const payerName = String(formData.get("payer_name") ?? "").trim();
  const paymentDate = String(formData.get("payment_date") ?? "");

  if (!bookingId || !transactionId || !payerName || !paymentDate) {
    throw new Error("Missing payment proof details");
  }

  const { error: insertError } = await supabase.from("payment_proofs").insert({
    booking_id: bookingId,
    transaction_id: transactionId,
    payer_name: payerName,
    payment_date: paymentDate,
  });
  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "payment_submitted" })
    .eq("id", bookingId);
  if (updateError) throw updateError;

  await notifyAdminPaymentSubmitted(bookingId);

  revalidatePath(`/bookings/${bookingId}`);
}
