"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderAuthNav } from "@/features/auth/components/header-auth-nav";

export function HeaderClient({ isSignedIn }: { isSignedIn: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    // Transparent, overlaid on the homepage hero — scrolls away with the
    // page (absolute, not fixed) so it doesn't sit unreadable-white-on-white
    // once the user scrolls past the dark hero into the light page below.
    return (
      <header className="absolute inset-x-0 top-6 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6 text-white sm:px-10">
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
