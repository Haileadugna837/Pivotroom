import Link from "next/link";
import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
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
      <div className="px-6 py-4">
        <Link href="/" className="text-sm text-pivot-muted hover:text-pivot-ink">
          ← Home
        </Link>
      </div>
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
