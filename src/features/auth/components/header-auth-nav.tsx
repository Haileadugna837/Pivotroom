"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/features/auth/server/actions";

export function HeaderAuthNav({ isSignedIn }: { isSignedIn: boolean }) {
  const pathname = usePathname();

  if (!isSignedIn) {
    return (
      <>
        <Link href="/login" className="hidden md:inline">
          Sign in
        </Link>
        <Link
          href="/signup"
          className="hidden rounded-md bg-foreground px-3 py-1.5 text-background md:inline-block"
        >
          Sign up
        </Link>
        <Link
          href="/login"
          aria-label="Sign in"
          className="rounded-full border border-black/10 p-2 md:hidden dark:border-white/15"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="5.5" r="2.75" stroke="currentColor" strokeWidth="1.3" />
            <path
              d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </>
    );
  }

  const insideAccountArea = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (!insideAccountArea) {
    return (
      <>
        <Link href="/dashboard" className="hidden md:inline">
          Dashboard
        </Link>
        <Link
          href="/dashboard"
          aria-label="Dashboard"
          className="rounded-full border border-black/10 p-2 md:hidden dark:border-white/15"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 7.5 8 3l5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 6.8V12.5a.8.8 0 0 0 .8.8h6.4a.8.8 0 0 0 .8-.8V6.8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        </Link>
      </>
    );
  }

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="hidden items-center gap-1.5 rounded-md border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5 md:inline-flex dark:border-white/15 dark:hover:bg-white/10"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M6 2H3.5a1 1 0 00-1 1v10a1 1 0 001 1H6"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 11l3-3-3-3M13 8H6"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Sign out
      </button>
      <button
        type="submit"
        aria-label="Sign out"
        className="rounded-full border border-black/10 p-2 md:hidden dark:border-white/15"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M6 2H3.5a1 1 0 00-1 1v10a1 1 0 001 1H6"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 11l3-3-3-3M13 8H6"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
