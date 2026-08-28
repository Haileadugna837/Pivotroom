"use client";

import { motion } from "framer-motion";

export function BecomeExpertBelief() {
  return (
    <section className="grid gap-10 border-b border-pivot-line px-6 py-24 lg:grid-cols-[0.42fr_1.58fr] lg:gap-16 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-[11px] font-semibold tracking-[0.18em] text-pivot-ink uppercase"
      >
        The idea
      </motion.div>
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="max-w-3xl font-serif text-[42px] leading-[0.93] tracking-[-0.03em] text-pivot-ink sm:text-[58px] lg:text-[76px]"
        >
          You&apos;ve already paid for your experience in{" "}
          <span className="text-pivot-accent">time, mistakes and decisions.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-pivot-ink-2"
        >
          Someone else is facing a problem you&apos;ve already navigated. Pivotroom turns that gap into access. You
          decide when you are available, what you are useful for, and what your time is worth. We handle discovery,
          booking, payment and the structure around the conversation.
        </motion.p>
      </div>
    </section>
  );
}
