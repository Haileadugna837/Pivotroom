export function FoundingExpertsFinalCta({
  applicationCount,
  onApply,
}: {
  applicationCount: number;
  onApply: () => void;
}) {
  return (
    <section className="border-t border-pivot-line px-6 py-20 text-center">
      <h2 className="mx-auto max-w-xl font-serif text-3xl leading-tight font-normal text-pivot-ink sm:text-4xl">
        The first 100 Founding Experts will shape what Pivotroom becomes.
      </h2>
      <button
        type="button"
        onClick={onApply}
        className="mt-8 rounded-full bg-pivot-ink px-8 py-3.5 text-sm font-medium text-pivot-paper"
      >
        Apply as a Founding Expert
      </button>
      <p className="mt-4 text-xs text-pivot-muted">
        Apply now • Reviewed individually • Join before the founding group is full
      </p>
      {applicationCount > 0 && (
        <p className="mt-2 text-xs text-pivot-muted">{applicationCount} applications received so far.</p>
      )}
    </section>
  );
}
