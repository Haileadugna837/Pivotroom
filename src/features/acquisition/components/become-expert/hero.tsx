"use client";

import { motion } from "framer-motion";

const NOTES = [
  { title: "You choose", copy: "your price, availability and session length" },
  { title: "1:1 only", copy: "focused conversations, not content production" },
  { title: "Selective", copy: "profiles are reviewed before going live" },
];

export function BecomeExpertHero() {
  return (
    <header className="grid border-b border-pivot-line lg:grid-cols-[1.08fr_0.92fr]">
      <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:py-24">
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
          className="mt-5 max-w-2xl font-serif text-[52px] leading-[0.9] tracking-[-0.03em] text-pivot-ink sm:text-[72px] lg:text-[92px]"
        >
          Your experience can become someone else&apos;s{" "}
          <em className="text-pivot-accent not-italic">unfair advantage.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-lg text-lg leading-relaxed text-pivot-ink-2"
        >
          Pivotroom gives experienced founders, executives, investors and operators a thoughtful way to make what
          they know accessible through focused one-to-one conversations.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-wrap gap-3"
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
          className="mt-12 grid max-w-lg grid-cols-1 gap-4 border-t border-pivot-ink pt-4.5 sm:grid-cols-3"
        >
          {NOTES.map((note) => (
            <div key={note.title}>
              <strong className="block text-lg font-medium text-pivot-ink">{note.title}</strong>
              <span className="mt-1 block text-[11px] leading-snug text-pivot-muted">{note.copy}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative flex min-h-[420px] flex-col justify-end bg-gradient-to-br from-pivot-olive to-pivot-ink px-8 py-10 text-pivot-paper lg:min-h-0">
        <blockquote className="font-serif text-3xl leading-[0.98] sm:text-4xl">
          &ldquo;The right conversation can save someone months of expensive guessing.&rdquo;
        </blockquote>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-pivot-paper/70">
          Pivotroom is built around access to lived experience, not generic advice.
        </p>
      </div>
    </header>
  );
}
