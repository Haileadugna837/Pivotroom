import { createClient } from "@/lib/supabase/server";

export async function getBookingForClient(bookingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, client_id, expert_id, start_time, end_time, status, price, currency, meet_link, payment_proofs(status, transaction_id, payer_name, payment_date, admin_note)",
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const [{ data: expertProfile }, { data: clientProfile }] = await Promise.all([
    supabase.from("expert_public_profiles").select("full_name").eq("id", data.expert_id).maybeSingle(),
    supabase.from("profiles").select("full_name").eq("id", data.client_id).maybeSingle(),
  ]);

  return {
    ...data,
    expertName: expertProfile?.full_name ?? null,
    clientName: clientProfile?.full_name ?? null,
  };
}

export async function getMyBookingsAsClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("id, expert_id, start_time, status, price, currency")
    .eq("client_id", user.id)
    .order("start_time", { ascending: false });

  if (error) throw error;
  if (!data.length) return [];

  const { data: expertProfiles } = await supabase
    .from("expert_public_profiles")
    .select("id, full_name")
    .in(
      "id",
      data.map((b) => b.expert_id),
    );
  const nameByExpertId = new Map((expertProfiles ?? []).map((p) => [p.id, p.full_name]));

  return data.map((b) => ({ ...b, counterpartName: nameByExpertId.get(b.expert_id) ?? null }));
}

export async function getMyAvailability() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("expert_availability")
    .select("id, date, start_time, end_time")
    .eq("expert_id", user.id)
    .gte("date", today)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getMyBookingsAsExpert() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("id, client_id, start_time, status, price, currency, meet_link")
    .eq("expert_id", user.id)
    .order("start_time", { ascending: false });

  if (error) throw error;
  if (!data.length) return [];

  const { data: clientProfiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in(
      "id",
      data.map((b) => b.client_id),
    );
  const nameByClientId = new Map((clientProfiles ?? []).map((p) => [p.id, p.full_name]));

  return data.map((b) => ({ ...b, counterpartName: nameByClientId.get(b.client_id) ?? null }));
}
