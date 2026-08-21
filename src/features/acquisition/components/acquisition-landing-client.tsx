"use client";

import { useState } from "react";
import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
import { AcquisitionNav } from "@/features/acquisition/components/landing/nav";
import { AcquisitionHero } from "@/features/acquisition/components/landing/hero";
import { AcquisitionExperienceSection } from "@/features/acquisition/components/landing/experience-section";
import { AcquisitionHowItWorks } from "@/features/acquisition/components/landing/how-it-works";
import { AcquisitionProblemCards } from "@/features/acquisition/components/landing/problem-cards";
import { AcquisitionExpertPreview } from "@/features/acquisition/components/landing/expert-preview";
import { AcquisitionTrustSection } from "@/features/acquisition/components/landing/trust-section";
import { AcquisitionWhyJoinEarlySection } from "@/features/acquisition/components/landing/why-join-early-section";
import { AcquisitionPositioningSection } from "@/features/acquisition/components/landing/positioning-section";
import { AcquisitionFoundingExpertSection } from "@/features/acquisition/components/landing/founding-expert-section";
import { AcquisitionFaqSection } from "@/features/acquisition/components/landing/faq-section";
import { AcquisitionFinalCtaSection } from "@/features/acquisition/components/landing/final-cta-section";
import { EarlyAccessFunnel } from "@/features/acquisition/components/funnel/early-access-modal";
import { NominationModal } from "@/features/acquisition/components/funnel/nomination-modal";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";
import type { ProblemCard } from "@/features/acquisition/config";
import type { ExpertPreviewCard } from "@/features/acquisition/server/queries";

type ActiveModal = "none" | "early-access" | "nominate";

export function AcquisitionLandingClient({
  experts,
  showExperts,
}: {
  experts: ExpertPreviewCard[];
  showExperts: boolean;
}) {
  const [sessionId] = useState(() => getOrCreateAcquisitionSessionId() || null);
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");
  const [seedCategories, setSeedCategories] = useState<string[] | undefined>(undefined);

  function openEarlyAccess() {
    if (sessionId) recordFunnelEvent(sessionId, "early_access_cta_clicked").catch(() => {});
    setSeedCategories(undefined);
    setActiveModal("early-access");
  }

  // Fires on every card click — records the demand signal and, for the
  // one nomination-intent card, opens that modal directly. All other
  // cards stay on the page and show real matching experts (or a
  // "recruiting" message) inline before asking for anything — see
  // handleJoinFromProblemResults for what actually opens Early Access.
  function handleProblemCardClicked(card: ProblemCard) {
    if (sessionId) recordFunnelEvent(sessionId, "problem_card_clicked", { card: card.key }).catch(() => {});
    if (card.opensNomination) {
      setActiveModal("nominate");
    }
  }

  function handleJoinFromProblemResults(card: ProblemCard) {
    if (sessionId) recordFunnelEvent(sessionId, "early_access_cta_clicked", { source: "problem_results" }).catch(() => {});
    setSeedCategories(card.categoryKey ? [card.categoryKey] : undefined);
    setActiveModal("early-access");
  }

  function closeModal() {
    setActiveModal("none");
  }

  return (
    <div className="flex flex-1 flex-col">
      <CaptureAcquisitionVisit />
      <div className="flex min-h-dvh flex-col">
        <AcquisitionNav onGetEarlyAccess={openEarlyAccess} />
        <AcquisitionHero onGetEarlyAccess={openEarlyAccess} />
      </div>
      <AcquisitionExperienceSection />
      <AcquisitionHowItWorks onGetEarlyAccess={openEarlyAccess} />
      <AcquisitionProblemCards onCardClicked={handleProblemCardClicked} onJoinEarlyAccess={handleJoinFromProblemResults} />
      {showExperts && <AcquisitionExpertPreview experts={experts} onGetEarlyAccess={openEarlyAccess} />}
      <AcquisitionTrustSection />
      <AcquisitionWhyJoinEarlySection onGetEarlyAccess={openEarlyAccess} />
      <AcquisitionPositioningSection />
      <AcquisitionFoundingExpertSection />
      <AcquisitionFaqSection />
      <AcquisitionFinalCtaSection onGetEarlyAccess={openEarlyAccess} />

      {sessionId && activeModal === "early-access" && (
        <EarlyAccessFunnel sessionId={sessionId} onClose={closeModal} initialCategories={seedCategories} />
      )}
      {sessionId && activeModal === "nominate" && <NominationModal sessionId={sessionId} onClose={closeModal} />}
    </div>
  );
}
