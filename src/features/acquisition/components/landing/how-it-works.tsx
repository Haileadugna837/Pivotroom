"use client";

import { motion } from "framer-motion";
import { Target, Search, Calendar } from "lucide-react";

const STEPS = [
  { n: "01", icon: Target, text: "Tell us what you're trying to solve." },
  { n: "02", icon: Search, text: "Find someone with relevant experience." },
  { n: "03", icon: Calendar, text: "Book focused one-to-one time with them." },
];

export function AcquisitionHowItWorks({ onGetEarlyAccess }: { onGetEarlyAccess: () => void }) {
  return (
    <section
      id="how-it-works"
      className="border-t border-black/10 bg-black/[0.02] px-6 py-20 text-center dark:border-white/15 dark:bg-white/[0.03]"
    >
      <h2 className="mx-auto max-w-lg text-2xl font-semibold leading-tight sm:text-3xl">
        One conversation can save months of guessing.
      </h2>

      <div className="relative mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-3 sm:gap-6">
        <div
          aria-hidden="true"
          className="absolute top-8 right-0 left-0 hidden h-px bg-black/10 sm:block dark:bg-white/15"
          style={{ marginInline: "16.6%" }}
        />
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex flex-col items-center gap-3"
            >
              <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-background">
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                  {step.n}
                </span>
              </span>
              <p className="max-w-[16rem] text-base font-medium">{step.text}</p>
            </motion.div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onGetEarlyAccess}
        className="mt-14 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background"
      >
        Get Early Access
      </button>
    </section>
  );
}
