export function NominateWhySection() {
  return (
    <section className="mx-auto w-full max-w-[1420px] border-b border-pivot-line px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-[0.45fr_1.55fr]">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
          Why nominations matter
        </div>
        <div>
          <h2 className="font-serif text-[42px] leading-[0.94] font-normal tracking-[-0.035em] text-pivot-ink sm:text-[56px] md:text-[76px]">
            Some of the most useful people are{" "}
            <span className="text-pivot-accent">not looking for another platform.</span>
          </h2>
          <p className="mt-8 max-w-[720px] text-lg leading-relaxed text-pivot-ink-2">
            They are running companies, leading teams, investing, operating, building and solving real problems.
            Nominations help Pivotroom discover people who may never apply on their own, but whose experience could
            be incredibly useful to others.
          </p>
        </div>
      </div>
    </section>
  );
}
