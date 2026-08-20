"use client";

import { motion } from "framer-motion";

export function AcquisitionHero({
  onGetEarlyAccess,
  onBecomeFoundingExpert,
}: {
  onGetEarlyAccess: () => void;
  onBecomeFoundingExpert: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
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
        className="mt-8 flex flex-col items-center"
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
          className="mt-4 text-sm font-medium text-black/60 underline underline-offset-4 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          Are you an expert? Apply to the Founding 100 →
        </button>
      </motion.div>
      <p className="mt-3 text-xs text-black/40 dark:text-white/40">
        Early members get first access when bookings open.
      </p>
    </section>
  );
}
