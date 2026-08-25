"use client";

import { motion } from "framer-motion";
import { MessageCircle, Send, ShieldCheck, Sparkles } from "lucide-react";

const STEPS = [
  { n: "01", icon: Send, text: "Apply and tell us what you can speak to." },
  { n: "02", icon: ShieldCheck, text: "We review your application individually." },
  { n: "03", icon: Sparkles, text: "Approved experts set up pricing and availability." },
  { n: "04", icon: MessageCircle, text: "Go live and start one-to-one conversations." },
];

export function FoundingExpertsHowItWorks() {
  return (
    <section className="bg-pivot-olive px-6 py-20 text-center text-pivot-white">
      <h2 className="mx-auto max-w-lg font-serif text-3xl leading-tight font-normal sm:text-4xl">
        From application to your first call.
      </h2>

      <div className="relative mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
        <div
          aria-hidden="true"
          className="absolute top-7 right-0 left-0 hidden h-px bg-pivot-white/20 sm:block"
          style={{ marginInline: "12.5%" }}
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
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-pivot-white/40 bg-pivot-olive">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-pivot-white text-[11px] font-semibold text-pivot-olive">
                  {step.n}
                </span>
              </span>
              <p className="max-w-[10rem] text-sm font-medium text-pivot-white/90">{step.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
