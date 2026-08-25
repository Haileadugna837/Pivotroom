const EXAMPLE_PROBLEMS = [
  "How should I raise my first investment round?",
  "Why are people seeing my ads but not buying?",
  "How do I enter a new African market?",
  "How do I build a team that actually executes?",
  "Is this startup idea worth building?",
  "How should I price this product?",
  "How do I fix weak B2B sales?",
  "I need someone who understands my industry.",
];

export function AcquisitionProblemsSection({ onSelect }: { onSelect: (problem: string) => void }) {
  return (
    <section id="problems" className="border-t border-b border-pivot-line bg-pivot-paper-2">
      <div className="mx-auto grid w-full max-w-[1400px] gap-14 px-6 py-20 md:grid-cols-[0.7fr_1.3fr] md:py-28">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
            What Pivotroom is for
          </div>
          <h2 className="mt-2.5 font-serif text-[42px] leading-[0.94] font-normal tracking-[-0.03em] text-pivot-ink sm:text-[56px] md:text-[64px]">
            Bring the problem you would normally spend weeks Googling.
          </h2>
          <p className="mt-4 max-w-[420px] text-[13px] leading-relaxed text-pivot-muted">
            Pivotroom is most useful when the answer depends on judgment, context and lived experience.
          </p>
        </div>
        <div className="border-t border-pivot-ink">
          {EXAMPLE_PROBLEMS.map((problem, i) => (
            <a
              key={problem}
              href="#join"
              onClick={() => onSelect(problem)}
              className="grid min-h-[77px] grid-cols-[50px_1fr_auto] items-center gap-4.5 border-b border-pivot-line"
            >
              <span className="text-[11px] text-pivot-muted">{String(i + 1).padStart(2, "0")}</span>
              <strong className="font-serif text-[22px] leading-tight font-normal text-pivot-ink sm:text-[27px]">
                &ldquo;{problem}&rdquo;
              </strong>
              <b className="text-xl text-pivot-ink">↗</b>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
