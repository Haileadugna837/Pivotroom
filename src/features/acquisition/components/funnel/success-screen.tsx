"use client";

import { useEffect, useRef, useState } from "react";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";

const SHARE_MESSAGE =
  "I just joined early access for Pivotroom — 1:1 conversations with experienced African founders, executives and specialists. Join me:";

export function EarlyAccessSuccessScreen({
  sessionId,
  referralCode,
  onClose,
}: {
  sessionId: string;
  referralCode: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const fired = useRef(false);
  const referralUrl =
    typeof window !== "undefined" ? `${window.location.origin}/?ref=${referralCode}` : `/?ref=${referralCode}`;

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
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
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <h2 className="text-2xl font-semibold">You&apos;re in.</h2>
      <p className="mt-3 text-sm text-black/60 dark:text-white/60">
        You&apos;ll be among the first to hear when Pivotroom opens access to relevant experts.
      </p>

      <div className="mt-10 w-full rounded-2xl border border-black/10 p-5 dark:border-white/15">
        <p className="text-sm font-medium">Invite someone who should know about Pivotroom.</p>
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
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium dark:border-white/15"
          >
            {copied ? "Link copied!" : "Copy link"}
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium dark:border-white/15"
            >
              More share options
            </button>
          )}
        </div>
      </div>

      <button type="button" onClick={onClose} className="mt-8 text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
        Done
      </button>
    </div>
  );
}
