import { EarlyAccessCtaLink } from "@/features/acquisition/components/landing/early-access-cta-link";

export function AcquisitionNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-pivot-line bg-pivot-paper/90 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1400px] items-center justify-between gap-6 px-6">
        <a href="#" className="font-serif text-[30px] text-pivot-ink">
          pivotroom
        </a>
        <div className="hidden gap-6 text-sm text-pivot-ink md:flex">
          <a href="#why" className="hover:text-pivot-accent">
            Why join early
          </a>
          <a href="#problems" className="hover:text-pivot-accent">
            Use cases
          </a>
          <a href="#how" className="hover:text-pivot-accent">
            How it works
          </a>
          <a href="#faq" className="hover:text-pivot-accent">
            FAQ
          </a>
        </div>
        <EarlyAccessCtaLink className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-ink px-[18px] text-sm font-medium text-pivot-paper">
          Get early access ↗
        </EarlyAccessCtaLink>
      </div>
    </nav>
  );
}
