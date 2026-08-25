const FAQS = [
  {
    q: "How much time will this take?",
    a: "As much or as little as you want. You control your own availability — there's no minimum number of sessions.",
  },
  {
    q: "How much can I charge?",
    a: "You set your own rate per session. You'll always see exactly what you're earning before you commit to anything.",
  },
  {
    q: "How are applications reviewed?",
    a: "Individually, by our team. We're looking for real, first-hand experience — not credentials or job titles alone.",
  },
  {
    q: "What happens after I apply?",
    a: "If you're a fit, we'll reach out to move your application forward. We're building this carefully, not quickly, so not every applicant hears back right away.",
  },
  {
    q: "Do I need to leave my current job?",
    a: "No. Most Founding Experts keep their existing role and take calls around it.",
  },
  {
    q: "What does \"Founding Expert\" actually mean?",
    a: "You're one of the first 100 experts on Pivotroom, with priority visibility when the marketplace opens and permanent recognition as part of the founding group.",
  },
  {
    q: "Is this only for people in Africa?",
    a: "No — we're looking for experienced African founders, executives, specialists and operators, wherever they're currently based.",
  },
];

export function FoundingExpertsFaq() {
  return (
    <section className="border-t border-pivot-line bg-pivot-paper-2 px-6 py-20">
      <h2 className="text-center font-serif text-3xl leading-tight font-normal text-pivot-ink sm:text-4xl">
        Frequently asked questions
      </h2>
      <div className="mx-auto mt-10 flex max-w-2xl flex-col divide-y divide-pivot-line">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-pivot-ink marker:content-none">
              {item.q}
              <span className="shrink-0 text-pivot-accent transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-pivot-ink-2">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
