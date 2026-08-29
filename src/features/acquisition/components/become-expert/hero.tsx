"use client";

import { motion } from "framer-motion";

const NOTES = [
  { title: "You choose", copy: "your price, availability and session length" },
  { title: "1:1 only", copy: "focused conversations, not content production" },
  { title: "Selective", copy: "profiles are reviewed before going live" },
];

export function BecomeExpertHero() {
  return (
    <header className="flex min-h-[620px] flex-col items-center justify-center border-b border-pivot-line px-6 py-20 text-center sm:min-h-[700px] sm:py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-semibold tracking-[0.18em] text-pivot-ink uppercase"
        >
          For people whose experience matters
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-5 max-w-3xl font-serif text-[46px] leading-[0.94] tracking-[-0.03em] text-pivot-ink sm:text-[64px] md:text-[84px] lg:text-[96px]"
        >
          Your experience can become someone else&apos;s{" "}
          <em className="text-pivot-accent not-italic">unfair advantage.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-pivot-ink-2"
        >
          <span className="font-serif text-xl text-pivot-ink italic">
            &ldquo;The right conversation can save someone months of expensive guessing.&rdquo;
          </span>{" "}
          Pivotroom gives experienced founders, executives, investors and operators a thoughtful way to make what
          they know accessible through focused one-to-one conversations.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <a
            href="#apply"
            className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-ink px-[18px] text-sm font-medium text-pivot-paper"
          >
            Apply to become an expert ↗
          </a>
          <a
            href="#how"
            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-pivot-ink px-[18px] text-sm font-medium text-pivot-ink"
          >
            How it works
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 grid w-full max-w-lg grid-cols-1 gap-8 border-t border-pivot-ink pt-6 sm:mt-11 sm:grid-cols-3 sm:gap-5 sm:pt-5"
        >
          {NOTES.map((note) => (
            <div key={note.title} className="text-center">
              <strong className="block text-[17px] font-medium text-pivot-ink">{note.title}</strong>
              <span className="mt-1 block text-[11px] leading-snug text-pivot-muted">{note.copy}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </header>
  );
}
