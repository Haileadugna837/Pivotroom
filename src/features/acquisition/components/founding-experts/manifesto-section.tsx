"use client";

import { motion } from "framer-motion";

const PARAGRAPHS = [
  "Every founder who built through uncertainty. Every executive who turned around a struggling team. Every specialist who solved a problem nobody else could. Every operator who learned the hard lessons on the job — that experience already exists.",
  "It just hasn't been organized into something people can actually reach. Right now it lives in DMs, favors, and one-off calls to whoever you happen to know.",
];

export function FoundingExpertsManifesto() {
  return (
    <section className="border-t border-white/10 bg-white/[0.02] px-6 py-20 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-2xl font-semibold leading-tight sm:text-3xl"
      >
        You&apos;ve already done the hard part.
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-6 max-w-xl space-y-4"
      >
        {PARAGRAPHS.map((paragraph) => (
          <p key={paragraph} className="text-sm text-white/60 sm:text-base">
            {paragraph}
          </p>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-8 max-w-lg rounded-2xl border-l-4 border-white bg-white/5 p-6 text-left"
      >
        <p className="text-base font-medium">
          Pivotroom turns that experience into something structured — real conversations, on your terms, with
          people who need exactly what you know.
        </p>
      </motion.div>
    </section>
  );
}
