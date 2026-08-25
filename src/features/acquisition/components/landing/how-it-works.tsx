const STEPS = [
  {
    label: "01 / TELL US",
    title: "Describe what you're trying to solve.",
    copy: "It takes under a minute. We care more about the real problem than a perfectly written request.",
  },
  {
    label: "02 / WE LEARN",
    title: "Your request informs who Pivotroom recruits.",
    copy: "Repeated demand tells us which expert profiles and categories should be prioritized.",
  },
  {
    label: "03 / YOU GET ACCESS",
    title: "We notify you when the right access opens.",
    copy: "When Pivotroom launches or a relevant expert becomes available, early users should be among the first to know.",
  },
];

export function AcquisitionHowItWorks() {
  return (
    <section id="how" className="bg-pivot-olive py-20 text-pivot-paper md:py-28">
      <div className="mx-auto w-full max-w-[1400px] px-6">
        <div className="text-[11px] font-semibold tracking-[0.18em] uppercase opacity-90">
          How early access works
        </div>
        <h2 className="mt-2.5 max-w-2xl font-serif text-[42px] leading-[0.94] font-normal tracking-[-0.03em] sm:text-[56px] md:text-[64px]">
          You tell us the problem. We build the room around real demand.
        </h2>
        <div className="mt-12 grid grid-cols-1 border-t border-pivot-paper/45 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <article
              key={step.label}
              className={`flex min-h-[240px] flex-col pt-5.5 pb-6 ${
                i < STEPS.length - 1 ? "md:mr-7 md:border-r md:border-pivot-paper/20 md:pr-7" : ""
              }`}
            >
              <small className="opacity-55">{step.label}</small>
              <h3 className="mt-auto mb-3 font-serif text-[30px] leading-none font-normal">{step.title}</h3>
              <p className="m-0 text-[13px] leading-relaxed opacity-70">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
