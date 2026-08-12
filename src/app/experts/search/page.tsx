import { getApprovedExperts } from "@/features/experts/server/queries";
import { ExpertSearchView } from "@/features/experts/components/expert-search-view";

export default async function ExpertSearchPage() {
  const experts = await getApprovedExperts();

  return <ExpertSearchView experts={experts} />;
}
