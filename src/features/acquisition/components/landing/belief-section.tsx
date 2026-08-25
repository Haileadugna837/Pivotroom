export function AcquisitionBeliefSection() {
  return (
    <section className="mx-auto grid w-full max-w-[1400px] gap-14 border-b border-pivot-line px-6 py-20 md:grid-cols-[0.45fr_1.55fr] md:py-24">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
        The belief behind Pivotroom
      </div>
      <div>
        <blockquote className="m-0 font-serif text-[44px] leading-[0.95] font-normal text-pivot-ink sm:text-[64px] md:text-[74px]">
          Africa doesn&apos;t have an experience problem. <em className="text-pivot-accent">It has an access problem.</em>
        </blockquote>
        <p className="mt-6 max-w-[650px] text-xs leading-relaxed text-pivot-muted">
          Across Africa and the diaspora, experienced people already know how to solve many of the problems others
          are facing. Pivotroom is being built to make that experience easier to access.
        </p>
      </div>
    </section>
  );
}
