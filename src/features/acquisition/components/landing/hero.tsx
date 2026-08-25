import { EarlyAccessCtaLink } from "@/features/acquisition/components/landing/early-access-cta-link";

const PROOFS = [
  { title: "Problem-first", copy: "Start with what you need help solving." },
  { title: "Curated access", copy: "Meet experience relevant to your situation." },
  { title: "1:1 conversations", copy: "Focused help, not endless content." },
];

export function AcquisitionHero() {
  return (
    <header className="grid min-h-[780px] border-b border-pivot-line md:grid-cols-[1.08fr_0.92fr]">
      <div className="flex flex-col justify-center px-6 py-16 md:py-24 md:pl-[max(24px,calc((100vw-1400px)/2))] md:pr-[7vw]">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-ink uppercase">
          Pivotroom early access
        </div>
        <h1 className="mx-0 my-5 max-w-[920px] font-serif text-[64px] leading-[0.87] tracking-[-0.045em] text-pivot-ink sm:text-[80px] md:text-[100px] lg:text-[120px]">
          Stop figuring everything out <em className="text-pivot-accent">the hard way.</em>
        </h1>
        <p className="max-w-[670px] text-lg leading-relaxed text-pivot-ink-2">
          Tell us what you&apos;re trying to solve. Pivotroom is building access to experienced founders,
          executives, investors and operators who have already faced problems like yours.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
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
        <div className="mt-11 grid max-w-[650px] grid-cols-3 gap-5 border-t border-pivot-ink pt-5">
          {PROOFS.map((proof) => (
            <div key={proof.title}>
              <strong className="block text-[17px] font-medium text-pivot-ink">{proof.title}</strong>
              <span className="mt-1 block text-[11px] leading-snug text-pivot-muted">{proof.copy}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative min-h-[500px] bg-cover bg-center md:min-h-[780px]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, transparent 40%, rgba(56,22,21,.6)), url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1500&q=88')",
        }}
      >
        <div className="absolute inset-x-[30px] bottom-[30px] text-pivot-paper">
          <blockquote className="font-serif text-[34px] leading-[0.98] font-normal sm:text-[46px] md:text-[58px]">
            &ldquo;Sometimes the answer isn&apos;t another video. It&apos;s one conversation with the right
            person.&rdquo;
          </blockquote>
          <small className="mt-3.5 block max-w-[450px] text-sm leading-relaxed opacity-80">
            Pivotroom is building a better way to access lived business experience across Africa and the diaspora.
          </small>
        </div>
      </div>
    </header>
  );
}
