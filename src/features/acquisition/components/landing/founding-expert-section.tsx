const BENEFITS = [
  "Set your own price",
  "Choose your availability",
  "Choose what you discuss",
  "No minimum session requirement",
  "Build your professional reputation",
  "Get paid for your time",
  "Founding Expert status",
  "Priority positioning at launch",
];

export function AcquisitionFoundingExpertSection({
  applicationCount,
  onApply,
}: {
  applicationCount: number;
  onApply: () => void;
}) {
  return (
    <section id="for-experts" className="bg-neutral-900 px-6 py-20 text-center text-white">
      <p className="text-xs font-medium uppercase tracking-wide text-white/50">The Founding 100</p>
      <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-semibold leading-tight sm:text-3xl">
        Your experience could save someone months of mistakes.
      </h2>
      <h3 className="mt-2 text-lg text-white/70">Become a Founding Expert.</h3>
      <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
        Pivotroom is selecting its first group of accomplished founders, executives, operators, specialists,
        creators and professionals for private one-to-one conversations. We&apos;re selecting the first 100
        Founding Experts who will help establish Pivotroom&apos;s expert community.
      </p>

      <ul className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-2 text-left text-sm text-white/80">
        {BENEFITS.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/50" />
            {b}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onApply}
        className="mt-10 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black"
      >
        Apply as a Founding Expert
      </button>
      {applicationCount > 0 && (
        <p className="mt-3 text-xs text-white/40">{applicationCount} applications received so far.</p>
      )}
    </section>
  );
}
