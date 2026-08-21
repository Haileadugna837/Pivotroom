"use client";

import { motion } from "framer-motion";

const SUPPORTING_PARAGRAPHS = [
  "It lives in founders who built through difficult markets, executives who scaled teams and companies, specialists who solved industry-specific problems, and operators who learned lessons that never made it into a textbook.",
  "The problem is that most of that experience is still locked inside private networks, introductions, and hard-to-reach circles.",
];

export function AcquisitionPositioningSection() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center border-t border-black/10 bg-black/[0.03] px-6 py-20 text-center dark:border-white/15 dark:bg-white/5">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl"
      >
        Africa doesn&apos;t have an experience problem.
        <br />
        It has an access problem.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-8 max-w-2xl text-lg font-medium sm:text-xl"
      >
        The knowledge already exists.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-5 max-w-2xl space-y-5"
      >
        {SUPPORTING_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph} className="text-black/60 sm:text-lg dark:text-white/60">
            {paragraph}
          </p>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mx-auto mt-10 max-w-xl rounded-2xl border-l-4 border-foreground bg-background p-6 text-left shadow-sm"
      >
        <p className="text-lg font-medium">
          Pivotroom makes the right experience easier to find, access, and learn from.
        </p>
      </motion.div>
    </section>
  );
}
