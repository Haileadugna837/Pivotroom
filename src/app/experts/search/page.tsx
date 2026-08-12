import { createClient } from "@/lib/supabase/server";
import { getApprovedExperts } from "@/features/experts/server/queries";
import { getWishlistedExpertIds } from "@/features/wishlist/server/queries";
import { ExpertSearchView } from "@/features/experts/components/expert-search-view";

export default async function ExpertSearchPage() {
  const experts = await getApprovedExperts();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const wishlistedIds = user ? await getWishlistedExpertIds(user.id) : new Set<string>();

  return (
    <ExpertSearchView
      experts={experts}
      wishlistedIds={Array.from(wishlistedIds)}
      isSignedIn={Boolean(user)}
    />
  );
}
