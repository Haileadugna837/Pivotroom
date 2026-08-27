export function AcquisitionExperienceQuoteSection() {
  return (
    <section className="border-b border-pivot-line bg-pivot-paper">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-6 py-16 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:py-24">
        <div className="relative mx-auto flex h-[300px] w-full max-w-[380px] items-end justify-center overflow-hidden rounded-2xl bg-pivot-paper-2 sm:h-[380px] md:h-[440px] md:max-w-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/acquisition/ermyas-amelga.webp"
            alt="Ermyas Amelga"
            className="h-full w-full object-contain object-bottom"
          />
        </div>
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
            Real experience
          </div>
          <blockquote className="mt-3">
            <p
              lang="am"
              className="font-serif text-[26px] leading-[1.15] font-normal tracking-[-0.01em] text-pivot-ink sm:text-[32px] md:text-[40px]"
            >
              &ldquo;በዚህች ሀገር የሚያጋጥሙን ነገሮች ቢዝነስ መጻሕፍት ውስጥ የሉም።&rdquo;
            </p>
            <p className="mt-4 max-w-[520px] text-base leading-relaxed text-pivot-ink-2 sm:text-lg">
              &ldquo;The challenges we face in this country aren&apos;t written in any business book.&rdquo;
            </p>
          </blockquote>
          <p className="mt-5 text-[13px] font-medium text-pivot-muted">— Ermyas Amelga, Meri Podcast</p>
        </div>
      </div>
    </section>
  );
}
