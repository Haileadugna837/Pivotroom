import type { ExpertPreviewCard } from "@/features/acquisition/server/queries";

export function AcquisitionPeopleSection({ experts }: { experts: ExpertPreviewCard[] }) {
  if (experts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-20 md:py-28">
      <div className="mb-11 flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-end">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
            The people we&apos;re building access to
          </div>
          <h2 className="mt-2.5 font-serif text-[42px] leading-[0.94] font-normal tracking-[-0.03em] text-pivot-ink sm:text-[56px] md:text-[64px]">
            Not influencers. People who&apos;ve done the work.
          </h2>
        </div>
        <p className="max-w-[430px] text-[13px] leading-relaxed text-pivot-muted">
          A preview of real experts already approved on Pivotroom.
        </p>
      </div>
      <div className="flex flex-wrap justify-start gap-4">
        {experts.map((expert) => (
          <article key={expert.id} className="w-full max-w-[300px] flex-1 basis-[220px] border-t border-pivot-ink pt-2.5">
            <div className="relative my-2.5 mb-4 aspect-[0.82] overflow-hidden bg-pivot-paper-2">
              {expert.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={expert.photoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ filter: "saturate(.72)" }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-5xl text-pivot-muted">
                  {expert.name.charAt(0)}
                </div>
              )}
              <span className="absolute top-2.5 left-2.5 bg-pivot-paper px-2 py-1.5 text-[9px] tracking-[0.12em] text-pivot-ink uppercase">
                {expert.category ?? "Expert"}
              </span>
            </div>
            <h3 className="mb-1.5 font-serif text-[26px] leading-none font-normal text-pivot-ink sm:text-[29px]">
              {expert.name}
            </h3>
            <p className="text-[13px] leading-relaxed text-pivot-muted">
              {expert.headline ?? "Real experience, ready to talk through your problem."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
