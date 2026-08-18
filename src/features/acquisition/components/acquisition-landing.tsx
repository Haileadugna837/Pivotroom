import { getExpertPreviewCards } from "@/features/acquisition/server/queries";
import { AcquisitionLandingClient } from "@/features/acquisition/components/acquisition-landing-client";

export async function AcquisitionLanding() {
  const experts = await getExpertPreviewCards();
  return <AcquisitionLandingClient experts={experts} />;
}
