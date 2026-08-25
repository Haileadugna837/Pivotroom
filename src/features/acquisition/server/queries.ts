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

// Purely cosmetic "Founding 100" counter — does not gate applications in
// any way, every application still requires manual admin approval.
export async function getFoundingExpertApplicationCount(): Promise<number> {
  const admin = createAdminClient();
  const { count } = await admin.from("founding_expert_applications").select("*", { count: "exact", head: true });
  return count ?? 0;
}
