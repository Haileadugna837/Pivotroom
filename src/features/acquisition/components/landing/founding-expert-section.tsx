import Link from "next/link";

export function AcquisitionFoundingExpertSection() {
  return (
    <section id="for-experts" className="bg-neutral-900 px-6 py-16 text-center text-white">
      <p className="text-xs font-medium uppercase tracking-wide text-white/50">The Founding 100</p>
      <h2 className="mx-auto mt-3 max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">
        Know something others shouldn&apos;t have to learn the hard way?
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
        We&apos;re inviting 100 accomplished African founders, executives and specialists to become
        Pivotroom&apos;s founding experts.
      </p>
      <Link
        href="/founding-experts"
        className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black"
      >
        Apply to the Founding 100 →
      </Link>
    </section>
  );
}
