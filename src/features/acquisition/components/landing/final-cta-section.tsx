export function AcquisitionFinalCtaSection({ onGetEarlyAccess }: { onGetEarlyAccess: () => void }) {
  return (
    <section className="border-t border-black/10 px-6 py-20 text-center dark:border-white/15">
      <h2 className="mx-auto max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">
        Somewhere in Africa, someone has already solved the problem you&apos;re facing.
      </h2>
      <p className="mt-3 text-black/60 dark:text-white/60">Get access when Pivotroom opens.</p>
      <button
        type="button"
        onClick={onGetEarlyAccess}
        className="mt-8 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background"
      >
        Get Early Access
      </button>
      <p className="mt-4 text-xs text-black/40 dark:text-white/40">Join early • Request experts • Be first to know</p>
    </section>
  );
}
