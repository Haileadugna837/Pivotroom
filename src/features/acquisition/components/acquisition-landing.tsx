import { getExpertPreviewCards, getFoundingExpertApplicationCount } from "@/features/acquisition/server/queries";
import { getAcquisitionShowExpertsEnabled } from "@/features/marketing/server/queries";
import { AcquisitionLandingClient } from "@/features/acquisition/components/acquisition-landing-client";

export async function AcquisitionLanding() {
  const showExperts = await getAcquisitionShowExpertsEnabled();
  const [experts, applicationCount] = await Promise.all([
    showExperts ? getExpertPreviewCards() : Promise.resolve([]),
    getFoundingExpertApplicationCount(),
  ]);
  return <AcquisitionLandingClient experts={experts} applicationCount={applicationCount} showExperts={showExperts} />;
}
