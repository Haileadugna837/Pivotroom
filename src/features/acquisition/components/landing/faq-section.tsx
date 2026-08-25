"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What am I joining right now?",
    a: "You're joining Pivotroom's early user list and telling us what kind of help you actually want. This helps shape the marketplace before it fully opens.",
  },
  {
    q: "Do I have to pay now?",
    a: "No. Early access is free. Paid bookings would happen later when expert sessions are available.",
  },
  {
    q: "Can I join if I don't know which expert I need?",
    a: "Yes. Start with the problem. Pivotroom should help narrow down what kind of experience is most relevant.",
  },
  {
    q: "Is Pivotroom only for founders?",
    a: "No. It can support founders, business owners, executives, managers and professionals facing business or career decisions.",
  },
];

export function AcquisitionFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto w-full max-w-[1400px] px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-[0.55fr_1.45fr]">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">Questions</div>
          <h2 className="mt-2.5 font-serif text-[42px] leading-[0.94] font-normal tracking-[-0.03em] text-pivot-ink sm:text-[56px] md:text-[64px]">
            Before you join early.
          </h2>
        </div>
        <div className="border-t border-pivot-ink">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="border-b border-pivot-line">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-[22px] leading-none font-normal text-pivot-ink sm:text-[27px]"
                >
                  {item.q}
                  <span className="shrink-0 text-2xl text-pivot-muted">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <p className="pr-0 pb-5.5 text-[13px] leading-relaxed text-pivot-muted sm:pr-10">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
