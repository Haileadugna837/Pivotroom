import { EarlyAccessCtaLink } from "@/features/acquisition/components/landing/early-access-cta-link";

export function AcquisitionFinalCtaSection() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid min-h-[370px] gap-10 bg-pivot-accent px-6 py-14 text-white sm:px-10 md:grid-cols-[1.2fr_0.8fr] md:items-end md:px-16">
          <h2 className="m-0 font-serif text-[44px] leading-[0.92] font-normal sm:text-[64px] md:text-[76px]">
            Tell us the problem you wish someone experienced would help you think through.
          </h2>
          <div className="max-w-[420px] justify-self-start md:justify-self-end">
            <p className="leading-relaxed opacity-90">That is the best place to start building Pivotroom around you.</p>
            <EarlyAccessCtaLink className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-paper px-[18px] text-sm font-medium text-pivot-ink">
              Join early access ↗
            </EarlyAccessCtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
