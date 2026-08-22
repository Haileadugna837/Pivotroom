"use client";

import { useEffect } from "react";
import { NominationForm } from "@/features/acquisition/components/funnel/nomination-form";

export function NominationModal({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground">
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/15">
        <span className="text-sm font-medium">Nominate someone</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="mx-auto w-full max-w-md flex-1 overflow-y-auto px-6 py-8">
        <h2 className="text-xl font-semibold">Who would you love to speak with?</h2>
        <div className="mt-6">
          <NominationForm sessionId={sessionId} onSubmitted={onClose} />
        </div>
      </div>
    </div>
  );
}
