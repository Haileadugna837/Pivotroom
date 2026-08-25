const STEPS = [
  {
    label: "01 / REVIEW",
    title: "Pivotroom checks the fit.",
    copy: "We look at the experience, credibility and relevance of every nomination before anything happens.",
  },
  {
    label: "02 / APPROACH",
    title: "Selected people are invited personally.",
    copy: "No cold platform emails. A real invitation, explaining why they were nominated and what Pivotroom is.",
  },
  {
    label: "03 / ONBOARD",
    title: "The expert decides whether to join.",
    copy: "Nothing is guaranteed. The person you nominate is always in full control of whether they join.",
  },
];

export function NominateHowItWorks() {
  return (
    <section className="bg-pivot-olive px-6 py-20 text-pivot-white md:py-28">
      <div className="mx-auto w-full max-w-[1420px]">
        <div className="mb-11 text-[11px] font-semibold tracking-[0.18em] uppercase opacity-80">
          What happens next
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {STEPS.map((step) => (
            <article key={step.label} className="flex flex-col border-t border-pivot-white/25 pt-4.5">
              <small className="opacity-70">{step.label}</small>
              <h3 className="mt-3.5 mb-3.5 font-serif text-[30px] leading-[1.02] font-normal">{step.title}</h3>
              <p className="m-0 text-[13px] leading-relaxed opacity-80">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
