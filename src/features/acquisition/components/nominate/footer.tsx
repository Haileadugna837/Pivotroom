import Link from "next/link";

export function NominateFooter() {
  return (
    <footer className="border-t border-pivot-line px-6 py-12">
      <div className="mx-auto flex w-full max-w-[1420px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <Link href="/" className="font-serif text-2xl text-pivot-ink">
          pivotroom
        </Link>
        <div className="flex gap-6 text-sm text-pivot-muted">
          <Link href="/experts" className="hover:text-pivot-ink">
            Experts
          </Link>
          <Link href="/become-an-expert" className="hover:text-pivot-ink">
            For experts
          </Link>
        </div>
        <p className="text-xs text-pivot-muted">© {new Date().getFullYear()} Pivotroom</p>
      </div>
    </footer>
  );
}
