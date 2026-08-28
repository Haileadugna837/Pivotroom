import Link from "next/link";

export function BecomeExpertApplicationStatus({
  status,
  submittedAt,
}: {
  status: string;
  submittedAt: string;
}) {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-pivot-paper px-6 text-center font-dm-sans text-pivot-ink">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
        Application on file
      </div>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-pivot-ink sm:text-5xl">
        You&apos;ve already applied.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-pivot-muted">
        You applied on {new Date(submittedAt).toLocaleDateString()}. Current status:{" "}
        <strong className="text-pivot-ink">{status}</strong>. We&apos;ll email you once a decision is made.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-ink px-[18px] text-sm font-medium text-pivot-paper"
      >
        Back to Pivotroom
      </Link>
    </section>
  );
}
