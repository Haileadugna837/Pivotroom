import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getApprovedExperts } from "@/features/experts/server/queries";

export type ExpertPreviewCard = {
  id: string;
  name: string;
  headline: string | null;
  category: string | null;
  photoUrl: string | null;
};

// Real approved experts only — the landing page must never show fabricated
// expert information. Gated by acquisition_show_experts_enabled
// (site_settings), read by the caller in acquisition-landing.tsx.
export async function getExpertPreviewCards(limit = 8): Promise<ExpertPreviewCard[]> {
  const experts = await getApprovedExperts();
  return experts.slice(0, limit).map((e) => ({
    id: e.id,
    name: e.profile?.full_name ?? "Pivotroom Expert",
    headline: e.headline,
    category: e.categories[0]?.name ?? null,
    photoUrl: e.photo_url,
  }));
}

// Most recent "Become an Expert" application for a signed-in user, if any —
// used by /become-an-expert to show an application-status view instead of
// the public form when someone who already applied comes back.
// expert_applications has zero RLS policies (service-role-only, same as
// every other read of this table), so this always goes through the admin
// client.
export async function getMyExpertApplication(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("expert_applications")
    .select("id, status, created_at")
    .eq("applicant_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}
