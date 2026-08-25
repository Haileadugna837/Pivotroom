"use client";

import { motion } from "framer-motion";
import { PROFESSIONAL_TYPES } from "@/features/acquisition/config";

export function FoundingExpertsWho() {
  return (
    <section className="px-6 py-20 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-lg font-serif text-3xl leading-tight font-normal text-pivot-ink sm:text-4xl"
      >
        We&apos;re not looking for job titles.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-4 max-w-lg text-sm text-pivot-muted sm:text-base"
      >
        We&apos;re looking for people who&apos;ve actually done things — built, scaled, sold, invested, failed
        forward, and figured out what actually works.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-2"
      >
        {PROFESSIONAL_TYPES.map((type) => (
          <span
            key={type}
            className="rounded-full border border-pivot-line bg-pivot-white px-4 py-2 text-sm font-medium text-pivot-ink-2"
          >
            {type}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
