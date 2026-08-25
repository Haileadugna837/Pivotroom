import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 bg-pivot-paper px-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <h1 className="font-serif text-4xl font-normal text-pivot-ink">Page not found</h1>
        <p className="text-pivot-ink-2">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
        <Link href="/" className="rounded-full bg-pivot-ink px-6 py-3 text-sm font-medium text-pivot-paper">
          Back home
        </Link>
      </div>
    </div>
  );
}
