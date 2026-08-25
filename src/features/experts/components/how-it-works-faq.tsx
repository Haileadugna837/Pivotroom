import { HOW_IT_WORKS_STEPS } from "@/features/experts/components/how-it-works-steps";

const FAQS = [
  {
    q: "How does a 1:1 video consultation work?",
    a: "After you book and your payment is verified, you'll get a Google Meet link (when the expert has Calendar connected) for your scheduled time. Just join and ask away.",
  },
  {
    q: "How long are the sessions?",
    a: "You choose: 15, 30, 45, or 60 minutes. Price scales automatically from the expert's per-15-minute rate.",
  },
  {
    q: "How do I pay?",
    a: "You submit your payment details after requesting a time. An admin verifies it and confirms the session, usually within a day.",
  },
];

export function HowItWorksFaq() {
  return (
    <div className="mt-10 border-t border-pivot-line pt-8">
      <h2 className="mb-4 text-sm font-medium text-pivot-ink">How it works</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((step) => (
          <div key={step.title} className="rounded-xl bg-pivot-paper-2 p-5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="mb-3 text-pivot-accent"
            >
              {step.icon}
            </svg>
            <p className="text-sm font-medium text-pivot-ink">{step.title}</p>
            <p className="mt-1 text-sm text-pivot-muted">{step.description}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-1 mt-8 text-sm font-medium text-pivot-ink">Common questions</h2>
      <div>
        {FAQS.map((item) => (
          <details key={item.q} className="group border-t border-pivot-line py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-pivot-ink">
              {item.q}
              <span className="shrink-0 text-pivot-accent transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-pivot-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
