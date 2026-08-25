const PEOPLE = [
  {
    tag: "Founder",
    title: "The founder who already scaled.",
    copy: "Someone who has raised, hired, expanded and survived the mistakes.",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=86",
  },
  {
    tag: "Executive",
    title: "The executive who's led the function.",
    copy: "Marketing, finance, operations, sales or people leadership from someone who owned the outcome.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=86",
  },
  {
    tag: "Investor",
    title: "The investor who's seen hundreds of pitches.",
    copy: "Someone who understands what makes a business credible from the other side of the table.",
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=86",
  },
  {
    tag: "Operator",
    title: "The operator who knows the messy part.",
    copy: "Industry and functional specialists who know what implementation actually looks like.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=86",
  },
];

export function AcquisitionPeopleSection() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-20 md:py-28">
      <div className="mb-11 flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-end">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
            The people we&apos;re building access to
          </div>
          <h2 className="mt-2.5 font-serif text-[42px] leading-[0.94] font-normal tracking-[-0.03em] text-pivot-ink sm:text-[56px] md:text-[64px]">
            Not influencers. People who&apos;ve done the work.
          </h2>
        </div>
        <p className="max-w-[430px] text-[13px] leading-relaxed text-pivot-muted">
          These are archetypes for the early-stage page, not live expert listings.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PEOPLE.map((person) => (
          <article key={person.tag} className="border-t border-pivot-ink pt-2.5">
            <div className="relative my-2.5 mb-4 aspect-[0.82] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={person.photo}
                alt=""
                className="h-full w-full object-cover"
                style={{ filter: "saturate(.72)" }}
              />
              <span className="absolute top-2.5 left-2.5 bg-pivot-paper px-2 py-1.5 text-[9px] tracking-[0.12em] text-pivot-ink uppercase">
                {person.tag}
              </span>
            </div>
            <h3 className="mb-1.5 font-serif text-[26px] leading-none font-normal text-pivot-ink sm:text-[29px]">
              {person.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-pivot-muted">{person.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
