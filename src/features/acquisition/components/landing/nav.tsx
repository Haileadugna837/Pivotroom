"use client";

import Link from "next/link";

export function AcquisitionNav({ onGetEarlyAccess }: { onGetEarlyAccess: () => void }) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2 font-semibold" aria-label="Pivotroom.africa">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
          P
        </span>
        <span>Pivotroom.africa</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/experts" className="hidden text-black/70 hover:text-black sm:inline dark:text-white/70 dark:hover:text-white">
          Experts
        </Link>
        <a href="#how-it-works" className="hidden text-black/70 hover:text-black sm:inline dark:text-white/70 dark:hover:text-white">
          How It Works
        </a>
        <a href="#for-experts" className="hidden text-black/70 hover:text-black sm:inline dark:text-white/70 dark:hover:text-white">
          For Experts
        </a>
        <Link href="/login" className="hidden text-black/70 hover:text-black sm:inline dark:text-white/70 dark:hover:text-white">
          Sign In
        </Link>
        <button
          type="button"
          onClick={onGetEarlyAccess}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Get Early Access
        </button>
      </nav>
    </header>
  );
}
