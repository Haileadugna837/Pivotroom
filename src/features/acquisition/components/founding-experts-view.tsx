"use client";

import { useState } from "react";
import Link from "next/link";
import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
import { FoundingExpertModal } from "@/features/acquisition/components/funnel/founding-expert-modal";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent } from "@/features/acquisition/server/actions";

const BENEFITS = [
  "Set your own price",
  "Choose your availability",
  "Choose what you discuss",
  "No minimum session requirement",
  "Build your professional reputation",
  "Get paid for your time",
  "Founding Expert status",
  "Priority positioning at launch",
];

export function FoundingExpertsView({ applicationCount }: { applicationCount: number }) {
  const [sessionId] = useState(() => getOrCreateAcquisitionSessionId() || null);
  const [modalOpen, setModalOpen] = useState(false);

  function handleApply() {
    if (sessionId) recordFunnelEvent(sessionId, "founding_expert_cta_clicked", { source: "founding_experts_page" }).catch(() => {});
    setModalOpen(true);
  }

  return (
    <div className="flex flex-1 flex-col bg-neutral-900 text-white">
      <CaptureAcquisitionVisit />
      <div className="px-6 py-4">
        <Link href="/" className="text-sm text-white/50 hover:text-white">
          ← Home
        </Link>
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 py-10 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-white/50">The Founding 100</p>
        <h1 className="mx-auto mt-3 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
          Your experience could save someone months of mistakes.
        </h1>
        <h2 className="mt-2 text-lg text-white/70">Become a Founding Expert.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
          Pivotroom is selecting its first group of accomplished founders, executives, operators, specialists,
          creators and professionals for private one-to-one conversations. We&apos;re selecting the first 100
          Founding Experts who will help establish Pivotroom&apos;s expert community.
        </p>

        <ul className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-2 text-left text-sm text-white/80">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/50" />
              {b}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleApply}
          className="mt-10 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black"
        >
          Apply as a Founding Expert
        </button>
        {applicationCount > 0 && (
          <p className="mt-3 text-xs text-white/40">{applicationCount} applications received so far.</p>
        )}
      </div>

      {sessionId && modalOpen && <FoundingExpertModal sessionId={sessionId} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
