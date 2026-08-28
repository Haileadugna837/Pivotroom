import { ForExpertsCtaLink } from "@/features/acquisition/components/landing/for-experts-cta-link";

export function AcquisitionForExpertsSection() {
  return (
    <section id="for-experts" className="bg-pivot-ink px-6 py-20 text-center text-pivot-paper">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-[11px] font-semibold tracking-[0.18em] uppercase opacity-70">For experts</div>
        <h2 className="mt-3 font-serif text-[36px] leading-[0.98] font-normal sm:text-[48px]">
          Have experience worth sharing?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed opacity-80 sm:text-base">
          If you&apos;ve built, led, invested or operated at a high level, Pivotroom gives you a focused way to turn
          that experience into well-paid 1:1 conversations — on your own schedule.
        </p>
        <ForExpertsCtaLink className="mt-7 inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-paper px-[18px] text-sm font-medium text-pivot-ink">
          Apply to become an expert ↗
        </ForExpertsCtaLink>
      </div>
    </section>
  );
}
