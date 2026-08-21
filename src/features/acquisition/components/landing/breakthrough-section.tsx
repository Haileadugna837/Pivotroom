"use client";

import { motion } from "framer-motion";

export function AcquisitionBreakthroughSection({ onGetEarlyAccess }: { onGetEarlyAccess: () => void }) {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center bg-black px-6 text-center text-white">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-3xl font-medium leading-tight text-transparent sm:text-4xl md:text-5xl"
      >
        Your next breakthrough
        <br />
        is one call away.
      </motion.h2>

      <motion.button
        type="button"
        onClick={onGetEarlyAccess}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-10 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black"
      >
        Join Early Access Waitlist
      </motion.button>
    </section>
  );
}
