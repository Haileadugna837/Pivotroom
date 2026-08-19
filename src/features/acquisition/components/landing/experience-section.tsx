import Image from "next/image";

function QuoteBubble() {
  return (
    <div className="rounded-2xl border border-black/10 bg-background p-4 text-left shadow-lg dark:border-white/15 lg:rounded-br-sm">
      <p lang="am" className="text-sm font-medium leading-snug">
        &ldquo;በዚህች ሀገር የሚያጋጥሙን ነገሮች በንግድ መጻሕፍት ውስጥ የሉም።&rdquo;
      </p>
      <p className="mt-2 text-xs leading-snug text-black/50 dark:text-white/50">
        &ldquo;The things that encounter us in this country are not inside business books.&rdquo;
      </p>
      <p className="mt-2 text-[11px] font-medium text-black/40 dark:text-white/40">
        — Ermyas Amelga, on Meri Podcast
      </p>
    </div>
  );
}

export function AcquisitionExperienceSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative">
            <Image
              src="/acquisition/ermyas-amelga.webp"
              alt="Ermyas Amelga speaking on Meri Podcast"
              width={1343}
              height={1171}
              className="w-full"
              sizes="(min-width: 1024px) 480px, 90vw"
            />

            {/* Floating overlay only once there's real room beside the
                photo (lg:, matching the two-column breakpoint below) —
                below that it renders as a normal stacked block so it
                never overlaps the photo on phones/tablets. */}
            <div className="absolute top-2 right-0 hidden w-64 lg:-right-6 lg:block">
              <QuoteBubble />
              <span className="absolute -bottom-2 left-10 h-3 w-3 rounded-full border border-black/10 bg-background dark:border-white/15" />
              <span className="absolute -bottom-5 left-6 h-2 w-2 rounded-full border border-black/10 bg-background dark:border-white/15" />
            </div>
          </div>

          <div className="mt-4 lg:hidden">
            <QuoteBubble />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
            Some problems need experience, not theory.
          </h2>
          <p className="mt-4 text-black/60 dark:text-white/60">
            Business in Africa comes with realities you won&apos;t find in a textbook, course, or generic
            online advice. Talk directly with founders, operators, investors, marketers, and specialists who
            have already faced the problem you&apos;re dealing with.
          </p>

          <div className="mt-8 rounded-2xl border-l-4 border-foreground bg-black/[0.02] p-6 dark:bg-white/[0.04]">
            <p className="text-lg font-medium">That&apos;s why we built Pivotroom.Africa</p>
            <p className="mt-1.5 text-sm text-black/60 dark:text-white/60">
              A marketplace of real-world experts who&apos;ve lived it, solved it, and are ready to help you
              navigate it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
