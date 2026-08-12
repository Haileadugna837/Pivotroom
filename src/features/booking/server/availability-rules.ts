// Pure decision logic, kept separate from availability.ts (which pulls in
// "server-only" + Supabase clients) so it can be unit tested directly.
export const PENDING_PAYMENT_TTL_MINUTES = 30;

// A booking is created as "pending_payment" the instant someone picks a
// slot, before they've actually paid — if they abandon it (close the tab,
// never submit proof), that row would otherwise block the slot forever with
// no way for anyone to know why. Give it a window to actually be paid for;
// past that, it no longer counts as occupying the slot. payment_submitted
// and confirmed always still block — those represent a real commitment.
export function isStillBlocking(
  booking: { status: string; created_at: string },
  now: number = Date.now(),
): boolean {
  const ttlCutoff = now - PENDING_PAYMENT_TTL_MINUTES * 60_000;
  return booking.status !== "pending_payment" || new Date(booking.created_at).getTime() > ttlCutoff;
}
