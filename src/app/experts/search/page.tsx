import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
import { getApprovedExperts } from "@/features/experts/server/queries";
import { getWishlistedExpertIds } from "@/features/wishlist/server/queries";
import { getExpertIdsWithNgoDonations } from "@/features/ngo/server/queries";
import { ExpertSearchView } from "@/features/experts/components/expert-search-view";

export const metadata: Metadata = {
  title: "Search experts",
  description: "Search and filter African experts by category.",
};

export default async function ExpertSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, experts, user] = await Promise.all([searchParams, getApprovedExperts(), getUser()]);

  const [wishlistedIds, donatingIds] = await Promise.all([
    user ? getWishlistedExpertIds(user.id) : Promise.resolve(new Set<string>()),
    getExpertIdsWithNgoDonations(),
  ]);

  return (
    <ExpertSearchView
      experts={experts}
      wishlistedIds={Array.from(wishlistedIds)}
      donatingIds={Array.from(donatingIds)}
      isSignedIn={Boolean(user)}
      initialQuery={q ?? ""}
    />
  );
}
