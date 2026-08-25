export function NominateFinalCtaSection() {
  return (
    <section className="mx-auto w-full max-w-[1420px] px-6 py-20 md:py-28">
      <div className="flex flex-col items-start gap-8 rounded-[28px] bg-pivot-accent px-8 py-14 text-pivot-white sm:px-14 sm:py-20">
        <h2 className="max-w-[720px] font-serif text-[36px] leading-[1.05] font-normal tracking-[-0.02em] sm:text-[48px] md:text-[58px]">
          Who is the person you wish more people could get 30 minutes with?
        </h2>
        <p className="text-lg opacity-90">Put their name into the room.</p>
        <a
          href="#nominate"
          className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-pivot-white px-8 text-sm font-medium text-pivot-ink"
        >
          Nominate them ↗
        </a>
      </div>
    </section>
  );
}
