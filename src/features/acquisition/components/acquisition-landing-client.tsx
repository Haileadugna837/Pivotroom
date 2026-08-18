"use client";

import { useState } from "react";
import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
import { AcquisitionNav } from "@/features/acquisition/components/landing/nav";
import { AcquisitionHero } from "@/features/acquisition/components/landing/hero";
import { AcquisitionHowItWorks } from "@/features/acquisition/components/landing/how-it-works";
import { AcquisitionProblemCards } from "@/features/acquisition/components/landing/problem-cards";
import { AcquisitionExpertPreview } from "@/features/acquisition/components/landing/expert-preview";
import { AcquisitionPositioningSection } from "@/features/acquisition/components/landing/positioning-section";
import { AcquisitionFoundingExpertSection } from "@/features/acquisition/components/landing/founding-expert-section";
import { EarlyAccessFunnel } from "@/features/acquisition/components/funnel/early-access-modal";
import { FoundingExpertModal } from "@/features/acquisition/components/funnel/founding-expert-modal";
import { NominationModal } from "@/features/acquisition/components/funnel/nomination-modal";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";
import type { ProblemCard } from "@/features/acquisition/config";
import type { ExpertPreviewCard } from "@/features/acquisition/server/queries";

type ActiveModal = "none" | "early-access" | "founding-expert" | "nominate";

export function AcquisitionLandingClient({
  experts,
  applicationCount,
}: {
  experts: ExpertPreviewCard[];
  applicationCount: number;
}) {
  const [sessionId] = useState(() => getOrCreateAcquisitionSessionId() || null);
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");
  const [seedCategories, setSeedCategories] = useState<string[] | undefined>(undefined);

  function openEarlyAccess() {
    if (sessionId) recordFunnelEvent(sessionId, "early_access_cta_clicked").catch(() => {});
    setSeedCategories(undefined);
    setActiveModal("early-access");
  }

  function openFoundingExpert() {
    if (sessionId) recordFunnelEvent(sessionId, "founding_expert_cta_clicked").catch(() => {});
    setActiveModal("founding-expert");
  }

  function handleProblemCardSelect(card: ProblemCard) {
    if (sessionId) recordFunnelEvent(sessionId, "problem_card_clicked", { card: card.key }).catch(() => {});
    if (card.opensNomination) {
      setActiveModal("nominate");
      return;
    }
    setSeedCategories(card.categoryKey ? [card.categoryKey] : undefined);
    setActiveModal("early-access");
  }

  function closeModal() {
    setActiveModal("none");
  }

  return (
    <div className="flex flex-1 flex-col">
      <CaptureAcquisitionVisit />
      <AcquisitionNav onGetEarlyAccess={openEarlyAccess} />
      <AcquisitionHero experts={experts} onGetEarlyAccess={openEarlyAccess} onBecomeFoundingExpert={openFoundingExpert} />
      <AcquisitionHowItWorks onGetEarlyAccess={openEarlyAccess} />
      <AcquisitionProblemCards onSelect={handleProblemCardSelect} />
      <AcquisitionExpertPreview experts={experts} onGetEarlyAccess={openEarlyAccess} />
      <AcquisitionPositioningSection />
      <AcquisitionFoundingExpertSection applicationCount={applicationCount} onApply={openFoundingExpert} />

      {sessionId && activeModal === "early-access" && (
        <EarlyAccessFunnel sessionId={sessionId} onClose={closeModal} initialCategories={seedCategories} />
      )}
      {sessionId && activeModal === "founding-expert" && (
        <FoundingExpertModal sessionId={sessionId} onClose={closeModal} />
      )}
      {sessionId && activeModal === "nominate" && <NominationModal sessionId={sessionId} onClose={closeModal} />}
    </div>
  );
}
