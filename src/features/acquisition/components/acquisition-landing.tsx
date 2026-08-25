import { getExpertPreviewCards } from "@/features/acquisition/server/queries";
import { getAcquisitionShowExpertsEnabled } from "@/features/marketing/server/queries";
import { AcquisitionLandingClient } from "@/features/acquisition/components/acquisition-landing-client";

export async function AcquisitionLanding() {
  const showExperts = await getAcquisitionShowExpertsEnabled();
  const experts = showExperts ? await getExpertPreviewCards() : [];
  return <AcquisitionLandingClient experts={experts} />;
}
