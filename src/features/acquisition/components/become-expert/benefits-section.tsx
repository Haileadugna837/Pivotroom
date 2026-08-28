"use client";

import { motion } from "framer-motion";

const BENEFITS = [
  {
    title: "You control your time.",
    copy: "Open only the hours you want. One hour a month is enough to participate meaningfully.",
  },
  {
    title: "You set your price.",
    copy: "Choose pricing that reflects your time, reputation and depth of experience.",
  },
  {
    title: "Clients arrive with context.",
    copy: "Users can submit the problem they want help with before the session, so the conversation starts closer to the point.",
  },
  {
    title: "Your profile builds authority.",
    copy: "Show what you have actually built, led and learned rather than presenting another generic professional bio.",
  },
  {
    title: "Pivotroom handles the mechanics.",
    copy: "Discovery, booking, reminders, payments and session logistics live in one place.",
  },
];

export function BecomeExpertBenefits() {
  return (
    <section className="border-t border-b border-pivot-line bg-pivot-paper-2 px-6 py-24">
      <div className="mx-auto grid w-full max-w-[1420px] gap-14 lg:grid-cols-[0.75fr_1.25fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-ink uppercase">
            Why experts join
          </div>
          <h2 className="mt-2.5 font-serif text-[40px] leading-[0.95] text-pivot-ink sm:text-[54px]">
            Make your experience accessible without making yourself constantly available.
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-pivot-muted">
            Pivotroom is designed around controlled access. You set the boundaries. The platform creates the context
            and handles the repetitive parts.
          </p>
        </motion.div>

        <div className="border-t border-pivot-ink">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid grid-cols-[40px_1fr] gap-5 border-b border-pivot-line py-6"
            >
              <div className="pt-1 text-[11px] text-pivot-muted">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="font-serif text-[26px] leading-none font-normal text-pivot-ink">{benefit.title}</h3>
                <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-pivot-muted">{benefit.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
