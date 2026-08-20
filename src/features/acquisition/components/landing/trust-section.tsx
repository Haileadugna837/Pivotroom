const POINTS = ["Curated experts", "Professional experience reviewed", "Real identity", "Clear areas of expertise"];

export function AcquisitionTrustSection() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
      <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">Real experience. Carefully selected.</h2>
      <p className="mx-auto mt-4 max-w-xl text-black/60 dark:text-white/60">
        Pivotroom prioritizes experts with meaningful real-world experience, demonstrated accomplishments,
        and expertise others can genuinely learn from — not open self-signup.
      </p>
      <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-black/70 dark:text-white/70">
        {POINTS.map((point) => (
          <span key={point} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            {point}
          </span>
        ))}
      </div>
    </section>
  );
}
