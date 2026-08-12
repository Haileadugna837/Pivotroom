import { createClient, getUser } from "@/lib/supabase/server";

export async function getMyPaymentsAsExpert() {
  const user = await getUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id, client_id, start_time, price, currency, status, payment_proofs(status), expert_payouts(status, amount, paid_at)",
    )
    .eq("expert_id", user.id)
    .order("start_time", { ascending: false });

  if (error) throw error;
  if (!bookings.length) return [];

  const { data: clientProfiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in(
      "id",
      bookings.map((b) => b.client_id),
    );
  const nameByClientId = new Map((clientProfiles ?? []).map((p) => [p.id, p.full_name]));

  return bookings.map((b) => {
    const proof = Array.isArray(b.payment_proofs) ? b.payment_proofs[0] : b.payment_proofs;
    const payout = Array.isArray(b.expert_payouts) ? b.expert_payouts[0] : b.expert_payouts;
    return {
      id: b.id,
      clientName: nameByClientId.get(b.client_id) ?? null,
      startTime: b.start_time,
      price: b.price,
      currency: b.currency,
      bookingStatus: b.status,
      paymentStatus: proof?.status ?? null,
      payoutStatus: payout?.status ?? null,
      payoutAmount: payout?.amount ?? null,
      paidAt: payout?.paid_at ?? null,
    };
  });
}
