"use client";

import { motion } from "framer-motion";
import type { ExpertPreviewCard } from "@/features/acquisition/server/queries";

export function AcquisitionHero({
  experts,
  onGetEarlyAccess,
  onBecomeFoundingExpert,
}: {
  experts: ExpertPreviewCard[];
  onGetEarlyAccess: () => void;
  onBecomeFoundingExpert: () => void;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-10 pb-16 text-center sm:pt-16">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
      >
        Talk to people who&apos;ve already done what you&apos;re trying to do.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-4 max-w-xl text-base text-black/60 sm:text-lg dark:text-white/60"
      >
        Get one-to-one access to experienced African founders, executives, specialists, creators and
        operators. Launching soon. Join early.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <button
          type="button"
          onClick={onGetEarlyAccess}
          className="w-full rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background sm:w-auto"
        >
          Get Early Access
        </button>
        <button
          type="button"
          onClick={onBecomeFoundingExpert}
          className="w-full rounded-full border border-black/15 px-8 py-3.5 text-sm font-medium sm:w-auto dark:border-white/20"
        >
          Become a Founding Expert
        </button>
      </motion.div>
      <p className="mt-3 text-xs text-black/40 dark:text-white/40">
        Early members get first access when bookings open.
      </p>

      {experts.length > 0 && (
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
          {experts.slice(0, 6).map((expert, i) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 bg-background p-4 text-left shadow-sm dark:border-white/15"
            >
              {expert.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={expert.photoUrl}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-lg font-semibold dark:bg-white/10">
                  {expert.name.charAt(0)}
                </span>
              )}
              <div className="w-full text-center">
                <p className="truncate text-sm font-medium">{expert.name}</p>
                {expert.headline && (
                  <p className="mt-0.5 truncate text-xs text-black/50 dark:text-white/50">{expert.headline}</p>
                )}
                {expert.category && (
                  <p className="mt-1 truncate text-[11px] text-black/40 dark:text-white/40">{expert.category}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
