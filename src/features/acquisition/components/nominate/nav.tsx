import Link from "next/link";

export function NominateNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-pivot-line bg-pivot-paper/90 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1420px] items-center justify-between gap-6 px-6">
        <Link href="/" className="font-serif text-[30px] text-pivot-ink">
          pivotroom
        </Link>
        <div className="hidden gap-6 text-sm text-pivot-ink md:flex">
          <Link href="/experts" className="hover:text-pivot-accent">
            Experts
          </Link>
          <Link href="/" className="hover:text-pivot-accent">
            What do you need?
          </Link>
          <Link href="/founding-experts" className="hover:text-pivot-accent">
            For experts
          </Link>
        </div>
        <a
          href="#nominate"
          className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-ink px-[18px] text-sm font-medium text-pivot-paper"
        >
          Nominate someone ↗
        </a>
      </div>
    </nav>
  );
}
