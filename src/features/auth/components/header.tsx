import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { HeaderAuthNav } from "@/features/auth/components/header-auth-nav";

export async function Header() {
  const user = await getUser();

  return (
    <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/15">
      <Link href="/" className="font-semibold">
        Pivotroom.africa
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/experts" className="hidden md:inline">
          Find an expert
        </Link>
        <HeaderAuthNav isSignedIn={Boolean(user)} />
      </nav>
    </header>
  );
}
