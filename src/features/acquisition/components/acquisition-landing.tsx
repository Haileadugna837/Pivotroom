import { getExpertPreviewCards, getFoundingExpertApplicationCount } from "@/features/acquisition/server/queries";
import { AcquisitionLandingClient } from "@/features/acquisition/components/acquisition-landing-client";

export async function AcquisitionLanding() {
  const [experts, applicationCount] = await Promise.all([
    getExpertPreviewCards(),
    getFoundingExpertApplicationCount(),
  ]);
  return <AcquisitionLandingClient experts={experts} applicationCount={applicationCount} />;
}
