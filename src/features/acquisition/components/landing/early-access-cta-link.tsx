"use client";

import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";

export function EarlyAccessCtaLink({ className, children }: { className?: string; children: React.ReactNode }) {
  function handleClick() {
    const sessionId = getOrCreateAcquisitionSessionId();
    if (sessionId) recordFunnelEvent(sessionId, "early_access_cta_clicked").catch(() => {});
  }

  return (
    <a href="#join" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
