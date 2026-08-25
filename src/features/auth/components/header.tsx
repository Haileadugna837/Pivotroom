import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { HeaderAuthNav } from "@/features/auth/components/header-auth-nav";

export async function Header() {
  const user = await getUser();

  return (
    <header className="flex items-center justify-between border-b border-pivot-line px-6 py-4">
      <Link href="/" className="flex items-center gap-2 font-semibold text-pivot-ink" aria-label="Pivotroom.africa">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pivot-ink text-xs font-bold text-pivot-paper">
          P
        </span>
        <span className="hidden md:inline">Pivotroom.africa</span>
      </Link>
      <nav className="flex items-center gap-3 text-sm text-pivot-ink">
        <Link href="/experts" className="hidden md:inline">
          Find an expert
        </Link>
        <HeaderAuthNav isSignedIn={Boolean(user)} />
      </nav>
    </header>
  );
}
