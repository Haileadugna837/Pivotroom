const FAQS = [
  {
    q: "When is Pivotroom launching?",
    a: "We're in early access. Members are the first to know as we open bookings.",
  },
  {
    q: "Who can become an expert?",
    a: "Accomplished founders, executives, operators, specialists and creators with real, first-hand experience — reviewed individually, not open self-signup.",
  },
  {
    q: "How much will sessions cost?",
    a: "Each expert sets their own rate. You'll see the price before you book.",
  },
  {
    q: "Will sessions be online or in person?",
    a: "Sessions happen over video call, so you can connect from anywhere.",
  },
  {
    q: "Can I request a specific expert?",
    a: "Yes — nominate anyone you'd love to talk to, and we'll factor it into who we recruit next.",
  },
  {
    q: "How are experts selected?",
    a: "We review real-world experience and accomplishments individually before anyone is approved — see “Real experience. Carefully selected.” above.",
  },
  {
    q: "Can people outside Africa use Pivotroom?",
    a: "Yes — Pivotroom connects you with experienced African founders, executives and specialists, wherever you're asking from.",
  },
];

export function AcquisitionFaqSection() {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-16">
      <h2 className="text-center text-2xl font-semibold leading-tight sm:text-3xl">Frequently asked questions</h2>
      <div className="mt-10 flex flex-col divide-y divide-black/10 dark:divide-white/15">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium marker:content-none">
              {item.q}
              <span className="shrink-0 text-black/40 transition-transform group-open:rotate-45 dark:text-white/40">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
