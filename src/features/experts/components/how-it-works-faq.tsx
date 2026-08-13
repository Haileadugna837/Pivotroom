const STEPS = [
  {
    title: "Find an expert",
    description: "Browse categories and profiles to find the right person for what you need.",
    icon: (
      <>
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.5 12c.6-1.3 1.9-2 3.5-2s2.9.7 3.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M17.5 17.5l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Book a session",
    description: "Pick a duration and an open time, then submit payment to confirm it.",
    icon: (
      <>
        <rect x="3.5" y="4" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3.5 8h13" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 2.5v3M13 2.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7.5 11.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Join the video call",
    description: "Once your payment's verified you'll get a Meet link — join and ask away.",
    icon: (
      <>
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 7.5l6 2.5-6 2.5v-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </>
    ),
  },
];

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
    <div className="mt-10 border-t border-black/10 pt-8 dark:border-white/15">
      <h2 className="mb-4 text-sm font-medium">How it works</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.title} className="rounded-xl bg-black/5 p-5 dark:bg-white/10">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mb-3">
              {step.icon}
            </svg>
            <p className="text-sm font-medium">{step.title}</p>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">{step.description}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-1 mt-8 text-sm font-medium">Common questions</h2>
      <div>
        {FAQS.map((item) => (
          <details key={item.q} className="group border-t border-black/10 py-4 dark:border-white/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
              {item.q}
              <span className="shrink-0 transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
