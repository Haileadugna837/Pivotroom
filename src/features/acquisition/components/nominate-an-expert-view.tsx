"use client";

import { useState } from "react";
import Link from "next/link";
import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
import { NominationForm } from "@/features/acquisition/components/funnel/nomination-form";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";

export function NominateAnExpertView() {
  const [sessionId] = useState(() => getOrCreateAcquisitionSessionId() || null);

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <CaptureAcquisitionVisit />
      <Link href="/" className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
        ← Home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">Who would you love to speak with?</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Tell us who you&apos;d like to see on Pivotroom — a specific person, or the type of person you&apos;re
        looking for.
      </p>
      <div className="mt-8">
        {sessionId && <NominationForm sessionId={sessionId} />}
      </div>
    </div>
  );
}
