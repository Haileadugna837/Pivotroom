import type { Metadata } from "next";
import { getFoundingExpertApplicationCount } from "@/features/acquisition/server/queries";
import { FoundingExpertsView } from "@/features/acquisition/components/founding-experts-view";

// Standalone page holding the full Founding Expert pitch — the homepage
// acquisition landing section only shows a short teaser + link here, per
// the "main homepage = demand, expert page = supply" split. Renders inside
// the normal site chrome (Header/Footer), same as /nominate-an-expert,
// since it's reachable independent of the homepage's acquisition toggle.
export const metadata: Metadata = {
  title: "Become a Founding Expert",
};

export default async function FoundingExpertsPage() {
  const applicationCount = await getFoundingExpertApplicationCount();
  return <FoundingExpertsView applicationCount={applicationCount} />;
}
