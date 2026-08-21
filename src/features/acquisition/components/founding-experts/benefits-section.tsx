"use client";

import { motion } from "framer-motion";
import { Award, SlidersHorizontal, TrendingUp, type LucideIcon } from "lucide-react";

const GROUPS: { icon: LucideIcon; title: string; items: string[] }[] = [
  {
    icon: SlidersHorizontal,
    title: "On your terms",
    items: [
      "Set your own price",
      "Choose your availability",
      "Choose what you discuss",
      "No minimum session requirement",
    ],
  },
  {
    icon: Award,
    title: "Recognition",
    items: ["Founding Expert status", "Priority positioning at launch"],
  },
  {
    icon: TrendingUp,
    title: "Growth",
    items: ["Build your professional reputation", "Get paid for your time"],
  },
];

export function FoundingExpertsBenefits() {
  return (
    <section className="px-6 py-20">
      <h2 className="mx-auto max-w-lg text-center text-2xl font-semibold leading-tight sm:text-3xl">
        What you get as a Founding Expert.
      </h2>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
        {GROUPS.map((group, i) => {
          const Icon = group.icon;
          return (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold">{group.title}</p>
              <ul className="mt-3 space-y-2 text-left text-sm text-white/60">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
