"use client";

import { useEffect, useRef, useState } from "react";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";

const SHARE_MESSAGE =
  "I just joined early access for Pivotroom — 1:1 conversations with experienced African founders, executives and specialists. Join me:";

export function EarlyAccessSuccessScreen({
  sessionId,
  referralCode,
}: {
  sessionId: string;
  referralCode: string;
}) {
  const [copied, setCopied] = useState(false);
  const shareFired = useRef(false);
  const referralUrl =
    typeof window !== "undefined" ? `${window.location.origin}/?ref=${referralCode}` : `/?ref=${referralCode}`;

  useEffect(() => {
    if (shareFired.current) return;
    shareFired.current = true;
    recordFunnelEvent(sessionId, "share_link_generated", { referral_code: referralCode }).catch(() => {});
  }, [sessionId, referralCode]);

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    recordFunnelEvent(sessionId, "copy_referral_link_clicked").catch(() => {});
  }

  function handleWhatsApp() {
    recordFunnelEvent(sessionId, "share_whatsapp_clicked").catch(() => {});
    window.open(`https://wa.me/?text=${encodeURIComponent(`${SHARE_MESSAGE} ${referralUrl}`)}`, "_blank");
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: "Pivotroom", text: SHARE_MESSAGE, url: referralUrl });
    } catch {
      // user cancelled the share sheet — not an error
    }
  }

  return (
    <div className="py-10">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
        You&apos;re on the early list
      </div>
      <h3 className="mt-2.5 font-serif text-[42px] leading-none font-normal text-pivot-ink sm:text-[50px]">
        Good. Now we know what you need.
      </h3>
      <p className="mt-3 leading-relaxed text-pivot-muted">
        Pivotroom can use your request to prioritize relevant experts and notify you when access opens or a strong
        match becomes available.
      </p>

      <div className="mt-8 rounded-none border border-pivot-line bg-pivot-paper-2 p-5">
        <p className="text-sm font-medium text-pivot-ink">Invite someone who should know about Pivotroom.</p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white"
          >
            Share on WhatsApp
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-pivot-ink px-5 py-3 text-sm font-medium text-pivot-ink"
          >
            {copied ? "Link copied!" : "Copy link"}
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="rounded-full border border-pivot-ink px-5 py-3 text-sm font-medium text-pivot-ink"
            >
              More share options
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
