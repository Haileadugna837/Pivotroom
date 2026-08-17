import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { HeaderAuthNav } from "@/features/auth/components/header-auth-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Header() {
  const user = await getUser();

  return (
    <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/15">
      <Link href="/" className="flex items-center gap-2 font-semibold" aria-label="Pivotroom.africa">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
          P
        </span>
        <span className="hidden md:inline">Pivotroom.africa</span>
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link href="/experts" className="hidden md:inline">
          Find an expert
        </Link>
        <ThemeToggle />
        <HeaderAuthNav isSignedIn={Boolean(user)} />
      </nav>
    </header>
  );
}
