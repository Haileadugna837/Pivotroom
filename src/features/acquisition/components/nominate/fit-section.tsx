const FITS = [
  {
    label: "01 / FOUNDERS",
    title: "They've built something real.",
    copy: "They have firsthand experience starting, growing, raising, expanding, surviving or rebuilding a business.",
  },
  {
    label: "02 / EXECUTIVES",
    title: "They've carried serious responsibility.",
    copy: "They've led companies, teams, functions or markets and can speak from execution rather than theory.",
  },
  {
    label: "03 / INVESTORS",
    title: "They've seen decisions from the other side.",
    copy: "They understand capital, founder readiness, investment decisions, financial strategy or governance.",
  },
  {
    label: "04 / OPERATORS",
    title: "They know how the work actually gets done.",
    copy: "They have deep functional or sector expertise where implementation and context matter.",
  },
];

export function NominateFitSection() {
  return (
    <section id="who" className="mx-auto w-full max-w-[1420px] px-6 py-20 md:py-28">
      <div className="mb-11 flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-end">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
            Who should you nominate?
          </div>
          <h2 className="mt-2.5 font-serif text-[42px] leading-[0.94] font-normal tracking-[-0.03em] text-pivot-ink sm:text-[56px] md:text-[64px]">
            People with useful experience.
          </h2>
        </div>
        <p className="max-w-[430px] text-[13px] leading-relaxed text-pivot-muted">
          The person does not need to be famous. What matters is whether their experience is credible, specific and
          worth accessing.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {FITS.map((fit) => (
          <article key={fit.label} className="flex min-h-[300px] flex-col border-t border-pivot-ink pt-4.5">
            <small className="text-pivot-muted">{fit.label}</small>
            <h3 className="mt-auto mb-3.5 font-serif text-[30px] leading-none font-normal text-pivot-ink">
              {fit.title}
            </h3>
            <p className="m-0 text-[13px] leading-relaxed text-pivot-muted">{fit.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
