const CARDS = [
  {
    label: "01 / PRIORITY",
    title: "Tell us what expertise to recruit.",
    copy: "Your real problems help Pivotroom understand where demand already exists before the marketplace opens.",
  },
  {
    label: "02 / ACCESS",
    title: "Hear first when relevant experts arrive.",
    copy: "Instead of checking repeatedly, early users can be notified when a strong match becomes available.",
  },
  {
    label: "03 / INFLUENCE",
    title: "Help shape how Pivotroom works.",
    copy: "Early demand tells us which categories, session formats and matching flows deserve the most attention.",
  },
];

export function AcquisitionWhySection() {
  return (
    <section id="why" className="mx-auto w-full max-w-[1400px] px-6 py-20 md:py-28">
      <div className="mb-11 flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-end">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
            Why join early
          </div>
          <h2 className="mt-2.5 font-serif text-[42px] leading-[0.94] font-normal tracking-[-0.03em] text-pivot-ink sm:text-[56px] md:text-[64px]">
            Early users should get more than a &ldquo;waitlist.&rdquo;
          </h2>
        </div>
        <p className="max-w-[430px] text-[13px] leading-relaxed text-pivot-muted">
          Joining early should make the product better for you, not just put your email in a spreadsheet.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CARDS.map((card) => (
          <article key={card.label} className="flex min-h-[260px] flex-col border-t border-pivot-ink pt-4.5">
            <small className="text-pivot-muted">{card.label}</small>
            <h3 className="mt-auto mb-3.5 font-serif text-[32px] leading-none font-normal text-pivot-ink">
              {card.title}
            </h3>
            <p className="m-0 text-[13px] leading-relaxed text-pivot-muted">{card.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
