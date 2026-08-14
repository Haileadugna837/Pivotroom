"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderAuthNav } from "@/features/auth/components/header-auth-nav";

export function HeaderClient({ isSignedIn }: { isSignedIn: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    // Overlaid on the homepage hero as its own floating bar — scrolls away
    // with the page (absolute, not fixed) so it doesn't sit
    // unreadable-white-on-white once the user scrolls past the dark hero
    // into the light page below. Width matches the hero's own wrapper
    // (max-w-[1600px], px-2/px-3) so the two read as one unit.
    return (
      <header className="absolute inset-x-0 top-3 z-40 sm:top-4">
        <div className="mx-auto max-w-[1600px] px-2 sm:px-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-6 py-4 text-white backdrop-blur-sm sm:px-8">
            <Link href="/" className="font-semibold">
              Pivotroom.africa
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/experts" className="hidden md:inline">
                Find an expert
              </Link>
              <HeaderAuthNav isSignedIn={isSignedIn} dark />
            </nav>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/15">
      <Link href="/" className="font-semibold">
        Pivotroom.africa
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/experts" className="hidden md:inline">
          Find an expert
        </Link>
        <HeaderAuthNav isSignedIn={isSignedIn} />
      </nav>
    </header>
  );
}
