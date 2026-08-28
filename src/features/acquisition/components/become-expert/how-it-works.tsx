"use client";

import { motion } from "framer-motion";

const STEPS = [
  { n: "01 / APPLY", title: "Tell us what you've actually done.", copy: "Share your experience, the kinds of problems you can help solve and a few proof points." },
  { n: "02 / REVIEW", title: "Pivotroom reviews the fit.", copy: "We look for specificity, credibility and whether your experience fills a real user need." },
  { n: "03 / BUILD PROFILE", title: "Turn experience into something searchable.", copy: "Your profile focuses on what users can talk to you about, not a long résumé dump." },
  { n: "04 / OPEN TIMES", title: "Choose when the room is open.", copy: "Set session lengths, price and availability. You remain in control of your calendar." },
];

export function BecomeExpertHowItWorks() {
  return (
    <section id="how" className="px-6 py-24">
      <div className="mx-auto w-full max-w-[1420px]">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-ink uppercase">
          How joining works
        </div>
        <h2 className="mt-2.5 max-w-2xl font-serif text-[40px] leading-[0.95] text-pivot-ink sm:text-[54px]">
          From application to your first useful conversation.
        </h2>

        <div className="mt-14 grid grid-cols-1 border-t border-pivot-ink sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.article
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex min-h-[260px] flex-col border-r border-pivot-line py-5 pr-7 pl-7 first:pl-0 last:border-r-0"
            >
              <div className="text-[11px] tracking-[0.13em] text-pivot-muted">{step.n}</div>
              <h3 className="mt-auto mb-3 font-serif text-[28px] leading-none font-normal text-pivot-ink">
                {step.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-pivot-muted">{step.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
