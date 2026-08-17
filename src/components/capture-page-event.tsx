"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

// Fires one PostHog event on mount — for Server Component pages that need a
// one-time "viewed X" capture. Deliberately client-side rather than an
// extension of the existing server-side page_views/expert_profile_views
// tracking: a client-side mount effect only runs for real browser renders,
// so it's naturally immune to the prefetch/RSC-fetch over-counting problem
// those two have to explicitly guard against via Sec-Fetch-Dest sniffing.
export function CapturePageEvent({ event, properties }: { event: string; properties?: Record<string, unknown> }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    posthog.capture(event, properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
