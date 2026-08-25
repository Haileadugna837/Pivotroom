import { HOW_IT_WORKS_STEPS } from "@/features/experts/components/how-it-works-steps";

export function HowItWorks() {
  return (
    <div id="how-it-works" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-10">
      <h2 className="mb-4 text-xl font-semibold text-pivot-ink">How it works</h2>
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
    </div>
  );
}
