import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAllNgos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ngos")
    .select("id, name, logo_url")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMyNgoAllocations(expertId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expert_ngo_allocations")
    .select("id, ngo_id, percentage, ngos(name, logo_url)")
    .eq("expert_id", expertId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

// Reads via the admin client (not RLS-gated) since this is used to decorate
// public expert listings with a gold badge — it only ever needs to know
// *who* donates, not expose individual allocation rows to the client.
export async function getExpertIdsWithNgoDonations(): Promise<Set<string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("expert_ngo_allocations").select("expert_id");
  if (error) throw error;
  return new Set(data.map((row) => row.expert_id));
}

export async function expertDonatesToNgo(expertId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("expert_ngo_allocations")
    .select("id")
    .eq("expert_id", expertId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}

export type NgoDonationSummary = { totalPercentage: number; ngoNames: string[] };

// Public expert-detail-page version of the donation callout — needs the
// actual percentage(s) and NGO name(s), not just a yes/no. Same admin-client
// reasoning as expertDonatesToNgo: `expert_ngo_allocations` RLS is owner-only,
// and this never exposes anything beyond what's already meant to be public
// (the expert chose these NGOs and percentages specifically to be shown).
export async function getExpertNgoDonationSummary(expertId: string): Promise<NgoDonationSummary | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("expert_ngo_allocations")
    .select("percentage, ngos(name)")
    .eq("expert_id", expertId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  if (!data.length) return null;

  return {
    totalPercentage: data.reduce((sum, row) => sum + Number(row.percentage), 0),
    ngoNames: data.map((row) => row.ngos?.name).filter((name): name is string => Boolean(name)),
  };
}
