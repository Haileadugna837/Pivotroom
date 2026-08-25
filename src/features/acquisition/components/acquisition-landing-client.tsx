"use client";

import { useState } from "react";
import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
import { AcquisitionNav } from "@/features/acquisition/components/landing/nav";
import { AcquisitionHero } from "@/features/acquisition/components/landing/hero";
import { AcquisitionSignalBar } from "@/features/acquisition/components/landing/signal-bar";
import { AcquisitionJoinSection } from "@/features/acquisition/components/landing/join-section";
import { AcquisitionWhySection } from "@/features/acquisition/components/landing/why-section";
import { AcquisitionProblemsSection } from "@/features/acquisition/components/landing/problems-section";
import { AcquisitionPeopleSection } from "@/features/acquisition/components/landing/people-section";
import { AcquisitionHowItWorks } from "@/features/acquisition/components/landing/how-it-works";
import { AcquisitionBeliefSection } from "@/features/acquisition/components/landing/belief-section";
import { AcquisitionFaqSection } from "@/features/acquisition/components/landing/faq-section";
import { AcquisitionFinalCtaSection } from "@/features/acquisition/components/landing/final-cta-section";
import { AcquisitionFooter } from "@/features/acquisition/components/landing/footer";
import type { ExpertPreviewCard } from "@/features/acquisition/server/queries";

export function AcquisitionLandingClient({ experts }: { experts: ExpertPreviewCard[] }) {
  const [prefillProblem, setPrefillProblem] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col bg-pivot-paper font-dm-sans text-pivot-ink">
      <CaptureAcquisitionVisit />
      <AcquisitionNav />
      <AcquisitionHero />
      <AcquisitionSignalBar />
      <AcquisitionJoinSection prefillProblem={prefillProblem} />
      <AcquisitionWhySection />
      <AcquisitionProblemsSection onSelect={setPrefillProblem} />
      <AcquisitionPeopleSection experts={experts} />
      <AcquisitionHowItWorks />
      <AcquisitionBeliefSection />
      <AcquisitionFaqSection />
      <AcquisitionFinalCtaSection />
      <AcquisitionFooter />
    </div>
  );
}
