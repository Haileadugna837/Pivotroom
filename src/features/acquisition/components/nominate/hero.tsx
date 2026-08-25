const PROOFS = [
  { title: "One name is enough", copy: "Start with the person. Add what you know." },
  { title: "Curated review", copy: "Pivotroom decides whether the fit is strong." },
  { title: "No pressure", copy: "A nomination does not automatically create a profile." },
];

export function NominateHero() {
  return (
    <header className="flex min-h-[700px] flex-col items-center justify-center border-b border-pivot-line px-6 text-center">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center justify-center py-24">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-ink uppercase">
          Help build the room
        </div>
        <h1 className="mx-auto my-5 max-w-[1060px] font-serif text-[64px] leading-[0.88] tracking-[-0.045em] text-pivot-ink sm:text-[80px] md:text-[100px] lg:text-[126px]">
          Who do you know that more people <em className="text-pivot-accent">should learn from?</em>
        </h1>
        <p className="mx-auto max-w-[700px] text-lg leading-relaxed text-pivot-ink-2">
          Nominate a founder, executive, investor, operator or specialist you believe people should be able to learn
          from one-to-one.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="#nominate"
            className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-ink px-[18px] text-sm font-medium text-pivot-paper"
          >
            Nominate an expert ↗
          </a>
          <a
            href="#who"
            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-pivot-ink px-[18px] text-sm font-medium text-pivot-ink"
          >
            Who should be nominated?
          </a>
        </div>
        <div className="mx-auto mt-12 grid w-full max-w-[760px] grid-cols-1 gap-6 border-t border-pivot-ink pt-4.5 text-left sm:grid-cols-3">
          {PROOFS.map((proof) => (
            <div key={proof.title}>
              <strong className="block text-[17px] font-medium text-pivot-ink">{proof.title}</strong>
              <span className="mt-1 block text-[11px] leading-snug text-pivot-muted">{proof.copy}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
