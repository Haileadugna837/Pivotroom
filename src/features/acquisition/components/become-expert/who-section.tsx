"use client";

import { motion } from "framer-motion";

const FIT_CARDS = [
  {
    n: "01 / FOUNDERS",
    title: "You've built something real.",
    copy: "You have firsthand lessons from starting, surviving, growing, raising, selling or rebuilding a business.",
  },
  {
    n: "02 / EXECUTIVES",
    title: "You've carried serious responsibility.",
    copy: "You have led teams, functions, markets or companies and can speak from execution, not theory.",
  },
  {
    n: "03 / INVESTORS",
    title: "You've evaluated risk and opportunity.",
    copy: "You understand capital, founder readiness, investment decisions, governance or financial strategy.",
  },
  {
    n: "04 / OPERATORS",
    title: "You know how the work actually gets done.",
    copy: "You carry deep functional or industry expertise in areas where context and experience matter.",
  },
];

export function BecomeExpertWho() {
  return (
    <section className="px-6 py-24 lg:py-28">
      <div className="mx-auto flex w-full max-w-[1420px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-ink uppercase">
            Who belongs on Pivotroom
          </div>
          <h2 className="mt-2 font-serif text-[40px] leading-[0.95] text-pivot-ink sm:text-[56px]">
            People with receipts.
          </h2>
        </div>
        <p className="max-w-sm text-[13px] leading-relaxed text-pivot-muted">
          Not everyone needs a public profile. We are looking for people whose experience is specific enough to be
          genuinely useful.
        </p>
      </div>

      <div className="mx-auto mt-10 grid w-full max-w-[1420px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FIT_CARDS.map((card, i) => (
          <motion.article
            key={card.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex min-h-[260px] flex-col border-t border-pivot-ink pt-4.5"
          >
            <div className="text-[11px] text-pivot-muted">{card.n}</div>
            <h3 className="mt-auto mb-3.5 font-serif text-[30px] leading-none font-normal text-pivot-ink">
              {card.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-pivot-muted">{card.copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
