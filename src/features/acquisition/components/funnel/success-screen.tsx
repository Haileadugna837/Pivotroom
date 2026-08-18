"use client";

import { useEffect, useRef, useState } from "react";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";
import { NominationForm } from "@/features/acquisition/components/funnel/nomination-form";

const SHARE_MESSAGE =
  "I just joined early access for Pivotroom — 1:1 conversations with experienced African founders, executives and specialists. Join me:";

type Phase = "prompt" | "nominate" | "share";

export function EarlyAccessSuccessScreen({
  sessionId,
  referralCode,
  leadId,
  onClose,
}: {
  sessionId: string;
  referralCode: string;
  leadId?: string;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("prompt");
  const [copied, setCopied] = useState(false);
  const shareFired = useRef(false);
  const promptFired = useRef(false);
  const referralUrl =
    typeof window !== "undefined" ? `${window.location.origin}/?ref=${referralCode}` : `/?ref=${referralCode}`;

  useEffect(() => {
    if (promptFired.current) return;
    promptFired.current = true;
    recordFunnelEvent(sessionId, "nomination_prompt_shown").catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    if (phase !== "share" || shareFired.current) return;
    shareFired.current = true;
    recordFunnelEvent(sessionId, "share_link_generated", { referral_code: referralCode }).catch(() => {});
  }, [phase, sessionId, referralCode]);

  function handleNominateClick() {
    recordFunnelEvent(sessionId, "nomination_prompt_accepted").catch(() => {});
    setPhase("nominate");
  }

  function handleSkipNomination() {
    recordFunnelEvent(sessionId, "nomination_prompt_skipped").catch(() => {});
    setPhase("share");
  }

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

      {phase === "prompt" && (
        <div className="mt-10 w-full">
          <p className="text-sm font-medium">Who would you love to speak with?</p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleNominateClick}
              className="w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background"
            >
              Nominate Someone
            </button>
            <button type="button" onClick={handleSkipNomination} className="w-full py-2 text-sm text-black/50 dark:text-white/50">
              Skip
            </button>
          </div>
        </div>
      )}

      {phase === "nominate" && (
        <div className="mt-8 w-full text-left">
          <NominationForm sessionId={sessionId} leadId={leadId} onSubmitted={() => setPhase("share")} onSkip={handleSkipNomination} />
        </div>
      )}

      {phase === "share" && (
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
      )}

      {phase !== "prompt" && (
        <button
          type="button"
          onClick={onClose}
          className="mt-8 text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
        >
          Done
        </button>
      )}
    </div>
  );
}
