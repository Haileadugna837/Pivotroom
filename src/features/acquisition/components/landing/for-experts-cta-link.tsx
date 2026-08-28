"use client";

import Link from "next/link";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";

export function ForExpertsCtaLink({ className, children }: { className?: string; children: React.ReactNode }) {
  function handleClick() {
    const sessionId = getOrCreateAcquisitionSessionId();
    if (sessionId) recordFunnelEvent(sessionId, "for_experts_cta_clicked").catch(() => {});
  }

  return (
    <Link href="/become-an-expert" onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
