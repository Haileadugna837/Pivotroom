export function BecomeExpertFinalCta() {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto grid w-full max-w-[1420px] items-end gap-10 bg-pivot-accent p-10 text-pivot-white sm:p-16 lg:grid-cols-[1.2fr_0.8fr]">
        <h2 className="font-serif text-[40px] leading-[0.92] font-normal sm:text-[56px] lg:text-[64px]">
          Someone is trying to solve a problem you&apos;ve already lived through.
        </h2>
        <div className="max-w-md justify-self-start lg:justify-self-end">
          <p className="leading-relaxed opacity-85">Make that experience accessible on your terms.</p>
          <a
            href="#apply"
            className="mt-5 inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-paper px-[18px] text-sm font-medium text-pivot-ink"
          >
            Apply to become an expert ↗
          </a>
        </div>
      </div>
    </section>
  );
}
