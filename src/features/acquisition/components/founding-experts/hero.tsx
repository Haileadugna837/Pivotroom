"use client";

import { motion } from "framer-motion";

export function FoundingExpertsHero({
  applicationCount,
  onApply,
}: {
  applicationCount: number;
  onApply: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xs font-medium uppercase tracking-wide text-white/50"
      >
        The Founding 100
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mx-auto mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl"
      >
        Your experience could save someone months of mistakes.
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-3 text-lg text-white/70"
      >
        Become a Founding Expert.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mx-auto mt-5 max-w-xl text-sm text-white/60 sm:text-base"
      >
        Pivotroom is selecting its first group of accomplished founders, executives, operators, specialists,
        creators and professionals for private one-to-one conversations. We&apos;re building the first 100
        Founding Experts who will help establish Pivotroom&apos;s expert community.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          type="button"
          onClick={onApply}
          className="mt-9 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black"
        >
          Apply as a Founding Expert
        </button>
        {applicationCount > 0 && (
          <p className="mt-3 text-xs text-white/40">{applicationCount} applications received so far.</p>
        )}
      </motion.div>
    </section>
  );
}
