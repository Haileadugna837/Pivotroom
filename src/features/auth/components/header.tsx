import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/15">
      <Link href="/" className="font-semibold">
        Pivotroom.africa
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/experts" className="hidden md:inline">
          Find an expert
        </Link>
        {user ? (
          <Link href="/dashboard">Dashboard</Link>
        ) : (
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
        )}
      </nav>
    </header>
  );
}
