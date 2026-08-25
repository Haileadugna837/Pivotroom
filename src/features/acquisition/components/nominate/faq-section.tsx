"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Will the person know I nominated them?",
    a: "Yes. If we decide to move forward, we reach out to them directly and let them know they were nominated — including who nominated them, unless you'd prefer to stay anonymous.",
  },
  {
    q: "Does a nomination guarantee acceptance?",
    a: "No. Every nomination is reviewed for fit before anyone is contacted. Being nominated is the start of a conversation, not an automatic invitation.",
  },
  {
    q: "Can I nominate someone I do not personally know?",
    a: "Yes. You just need enough context — what they've done, why their experience is useful — for us to evaluate the fit.",
  },
  {
    q: "Do nominees need to be famous?",
    a: "No. What matters is that their experience is real, specific and credible — not how well-known they are.",
  },
];

export function NominateFaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto w-full max-w-[860px] border-b border-pivot-line px-6 py-20 md:py-28">
      <div className="mb-11 text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
        Questions
      </div>
      <div className="flex flex-col">
        {FAQS.map((faq, index) => {
          const isOpen = open === index;
          return (
            <div key={faq.q} className="border-t border-pivot-line py-6 last:border-b">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 text-left"
              >
                <span className="font-serif text-xl font-normal text-pivot-ink sm:text-2xl">{faq.q}</span>
                <span className="text-xl text-pivot-accent">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-pivot-muted">{faq.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
