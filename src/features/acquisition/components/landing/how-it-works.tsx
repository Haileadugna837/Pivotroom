const STEPS = [
  { n: "01", text: "Tell us what you're trying to solve." },
  { n: "02", text: "Find someone with relevant experience." },
  { n: "03", text: "Book focused one-to-one time with them." },
];

export function AcquisitionHowItWorks({ onGetEarlyAccess }: { onGetEarlyAccess: () => void }) {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-4xl px-6 py-16 text-center">
      <h2 className="text-2xl font-semibold sm:text-3xl">One conversation can save months of guessing.</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.n}>
            <p className="text-sm font-semibold text-black/30 dark:text-white/30">{step.n}</p>
            <p className="mt-2 text-base">{step.text}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onGetEarlyAccess}
        className="mt-10 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background"
      >
        Get Early Access
      </button>
    </section>
  );
}
