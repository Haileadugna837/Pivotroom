import type { ExpertPreviewCard } from "@/features/acquisition/server/queries";

export function AcquisitionExpertPreview({
  experts,
  onGetEarlyAccess,
}: {
  experts: ExpertPreviewCard[];
  onGetEarlyAccess: () => void;
}) {
  if (experts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 text-center">
      <h2 className="text-2xl font-semibold sm:text-3xl">People worth 30 minutes of your time.</h2>
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {experts.slice(0, 8).map((expert) => (
          <div
            key={expert.id}
            className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 p-4 text-center dark:border-white/15"
          >
            {expert.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={expert.photoUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-lg font-semibold dark:bg-white/10">
                {expert.name.charAt(0)}
              </span>
            )}
            <div>
              <p className="truncate text-sm font-medium">{expert.name}</p>
              {expert.headline && (
                <p className="mt-0.5 truncate text-xs text-black/50 dark:text-white/50">{expert.headline}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onGetEarlyAccess}
        className="mt-10 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background"
      >
        Join Early Access
      </button>
    </section>
  );
}
