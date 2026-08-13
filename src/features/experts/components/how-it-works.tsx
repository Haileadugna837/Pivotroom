import { HOW_IT_WORKS_STEPS } from "@/features/experts/components/how-it-works-steps";

export function HowItWorks() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h2 className="mb-4 text-xl font-semibold">How it works</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((step) => (
          <div key={step.title} className="rounded-xl bg-black/5 p-5 dark:bg-white/10">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mb-3">
              {step.icon}
            </svg>
            <p className="text-sm font-medium">{step.title}</p>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
