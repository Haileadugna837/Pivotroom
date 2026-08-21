export function FoundingExpertsFinalCta({
  applicationCount,
  onApply,
}: {
  applicationCount: number;
  onApply: () => void;
}) {
  return (
    <section className="border-t border-white/10 px-6 py-20 text-center">
      <h2 className="mx-auto max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">
        The first 100 Founding Experts will shape what Pivotroom becomes.
      </h2>
      <button
        type="button"
        onClick={onApply}
        className="mt-8 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black"
      >
        Apply as a Founding Expert
      </button>
      <p className="mt-4 text-xs text-white/40">
        Apply now • Reviewed individually • Join before the founding group is full
      </p>
      {applicationCount > 0 && (
        <p className="mt-2 text-xs text-white/40">{applicationCount} applications received so far.</p>
      )}
    </section>
  );
}
