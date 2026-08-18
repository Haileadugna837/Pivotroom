import { getAcquisitionLandingEnabled } from "@/features/marketing/server/queries";
import { ClassicHomepage } from "@/features/marketing/components/classic-homepage";
import { AcquisitionLanding } from "@/features/acquisition/components/acquisition-landing";

export default async function Home() {
  const acquisitionEnabled = await getAcquisitionLandingEnabled();
  return acquisitionEnabled ? <AcquisitionLanding /> : <ClassicHomepage />;
}
