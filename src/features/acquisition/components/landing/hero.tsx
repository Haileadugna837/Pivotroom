import { EarlyAccessCtaLink } from "@/features/acquisition/components/landing/early-access-cta-link";

const PROOFS = [
  { title: "Problem-first", copy: "Start with what you need help solving." },
  { title: "Curated access", copy: "Meet experience relevant to your situation." },
  { title: "1:1 conversations", copy: "Focused help, not endless content." },
];

export function AcquisitionHero() {
  return (
    <header className="flex min-h-[620px] flex-col items-center justify-center border-b border-pivot-line px-6 py-16 text-center sm:min-h-[700px] md:py-24">
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-ink uppercase">
          Pivotroom early access
        </div>
        <h1 className="mx-0 my-5 font-serif text-[46px] leading-[0.92] tracking-[-0.04em] text-pivot-ink sm:text-[64px] md:text-[84px] lg:text-[104px]">
          Stop figuring everything out <em className="text-pivot-accent">the hard way.</em>
        </h1>
        <p className="max-w-[620px] text-lg leading-relaxed text-pivot-ink-2">
          Tell us what you&apos;re trying to solve. Pivotroom is building access to experienced founders,
          executives, investors and operators who have already faced problems like yours.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <EarlyAccessCtaLink className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-ink px-[18px] text-sm font-medium text-pivot-paper">
            Join early access ↗
          </EarlyAccessCtaLink>
          <a
            href="#problems"
            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-pivot-ink px-[18px] text-sm font-medium text-pivot-ink"
          >
            See what Pivotroom is for
          </a>
        </div>
        <div className="mt-3.5 text-[11px] text-pivot-muted">Free to join early access. No payment required now.</div>
        <div className="mt-11 grid w-full max-w-[650px] grid-cols-1 gap-6 border-t border-pivot-ink pt-5 sm:grid-cols-3 sm:gap-5">
          {PROOFS.map((proof) => (
            <div key={proof.title} className="text-center">
              <strong className="block text-[17px] font-medium text-pivot-ink">{proof.title}</strong>
              <span className="mt-1 block text-[11px] leading-snug text-pivot-muted">{proof.copy}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
