import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
import { NominateNav } from "@/features/acquisition/components/nominate/nav";
import { NominateHero } from "@/features/acquisition/components/nominate/hero";
import { NominateSignalBar } from "@/features/acquisition/components/nominate/signal-bar";
import { NominateWhySection } from "@/features/acquisition/components/nominate/why-section";
import { NominateFitSection } from "@/features/acquisition/components/nominate/fit-section";
import { NominateSection } from "@/features/acquisition/components/nominate/nomination-section";
import { NominateHowItWorks } from "@/features/acquisition/components/nominate/how-it-works";
import { NominateFaqSection } from "@/features/acquisition/components/nominate/faq-section";
import { NominateFinalCtaSection } from "@/features/acquisition/components/nominate/final-cta-section";
import { NominateFooter } from "@/features/acquisition/components/nominate/footer";

export function NominateAnExpertView() {
  return (
    <div className="flex flex-1 flex-col bg-pivot-paper font-dm-sans text-pivot-ink">
      <CaptureAcquisitionVisit />
      <NominateNav />
      <NominateHero />
      <NominateSignalBar />
      <NominateWhySection />
      <NominateFitSection />
      <NominateSection />
      <NominateHowItWorks />
      <NominateFaqSection />
      <NominateFinalCtaSection />
      <NominateFooter />
    </div>
  );
}
