"use client";

import { useState } from "react";
import Link from "next/link";
import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
import { FoundingExpertModal } from "@/features/acquisition/components/funnel/founding-expert-modal";
import { FoundingExpertsHero } from "@/features/acquisition/components/founding-experts/hero";
import { FoundingExpertsManifesto } from "@/features/acquisition/components/founding-experts/manifesto-section";
import { FoundingExpertsBenefits } from "@/features/acquisition/components/founding-experts/benefits-section";
import { FoundingExpertsHowItWorks } from "@/features/acquisition/components/founding-experts/how-it-works-section";
import { FoundingExpertsWho } from "@/features/acquisition/components/founding-experts/who-section";
import { FoundingExpertsFaq } from "@/features/acquisition/components/founding-experts/faq-section";
import { FoundingExpertsFinalCta } from "@/features/acquisition/components/founding-experts/final-cta-section";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";

export function FoundingExpertsView({ applicationCount }: { applicationCount: number }) {
  const [sessionId] = useState(() => getOrCreateAcquisitionSessionId() || null);
  const [modalOpen, setModalOpen] = useState(false);

  function handleApply() {
    if (sessionId) recordFunnelEvent(sessionId, "founding_expert_cta_clicked", { source: "founding_experts_page" }).catch(() => {});
    setModalOpen(true);
  }

  return (
    <div className="flex flex-1 flex-col bg-pivot-paper font-dm-sans text-pivot-ink">
      <CaptureAcquisitionVisit />
      <div className="flex min-h-[100svh] flex-col">
        <div className="px-6 py-4">
          <Link href="/" className="text-sm text-pivot-muted hover:text-pivot-ink">
            ← Home
          </Link>
        </div>
        <FoundingExpertsHero applicationCount={applicationCount} onApply={handleApply} />
      </div>

      <FoundingExpertsManifesto />
      <FoundingExpertsBenefits />
      <FoundingExpertsHowItWorks />
      <FoundingExpertsWho />
      <FoundingExpertsFaq />
      <FoundingExpertsFinalCta applicationCount={applicationCount} onApply={handleApply} />

      {sessionId && modalOpen && <FoundingExpertModal sessionId={sessionId} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
