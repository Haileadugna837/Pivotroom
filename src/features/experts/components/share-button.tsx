"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="18" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="19" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10.8l8-4.4M8 13.2l8 4.4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {copied ? "Link copied!" : "Share"}
    </button>
  );
}
