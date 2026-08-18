"use client";

import { useEffect, useRef } from "react";
import { getDeviceType, getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent, upsertAcquisitionSession } from "@/features/acquisition/server/actions";

// Fires once on mount — a client mount effect only runs for real browser
// renders, so it's naturally immune to the prefetch/RSC-refetch
// over-counting problem the site's server-side page_views tracking has to
// guard against via Sec-Fetch-Dest header sniffing (see MENU.md). Reads
// UTM/referrer/ref-code straight off window.location rather than
// useSearchParams, since this is one-time fire-and-forget capture with no
// need for the reactivity (or Suspense-boundary requirement) that hook
// brings.
export function CaptureAcquisitionVisit() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const sessionId = getOrCreateAcquisitionSessionId();
    if (!sessionId) return;

    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref") ?? undefined;

    upsertAcquisitionSession({
      sessionId,
      status: "started",
      sourcePage: window.location.pathname,
      entryPath: window.location.pathname + window.location.search,
      deviceType: getDeviceType(),
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
      utmTerm: params.get("utm_term") ?? undefined,
      utmContent: params.get("utm_content") ?? undefined,
      referrer: document.referrer || undefined,
      refCode,
    }).catch(() => {});

    recordFunnelEvent(sessionId, "landing_page_view", { source_page: window.location.pathname }).catch(() => {});
    if (refCode) {
      recordFunnelEvent(sessionId, "referral_link_visited", { ref_code: refCode }).catch(() => {});
    }
  }, []);

  return null;
}
