"use client";

import { useState } from "react";
import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
import { AcquisitionNav } from "@/features/acquisition/components/landing/nav";
import { AcquisitionHero } from "@/features/acquisition/components/landing/hero";
import { EarlyAccessFunnel } from "@/features/acquisition/components/funnel/early-access-modal";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";
import type { ExpertPreviewCard } from "@/features/acquisition/server/queries";

export function AcquisitionLandingClient({ experts }: { experts: ExpertPreviewCard[] }) {
  const [sessionId] = useState(() => getOrCreateAcquisitionSessionId() || null);
  const [isEarlyAccessOpen, setEarlyAccessOpen] = useState(false);

  function openEarlyAccess() {
    if (sessionId) recordFunnelEvent(sessionId, "early_access_cta_clicked").catch(() => {});
    setEarlyAccessOpen(true);
  }

  return (
    <div className="flex flex-1 flex-col">
      <CaptureAcquisitionVisit />
      <AcquisitionNav onGetEarlyAccess={openEarlyAccess} />
      <AcquisitionHero experts={experts} onGetEarlyAccess={openEarlyAccess} />

      {isEarlyAccessOpen && sessionId && (
        <EarlyAccessFunnel sessionId={sessionId} onClose={() => setEarlyAccessOpen(false)} />
      )}
    </div>
  );
}
