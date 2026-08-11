import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { signOut } from "@/features/auth/server/actions";

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
        <Link href="/experts">Find an expert</Link>
        {user ? (
          <>
            {isAdminEmail(user.email) && <Link href="/admin">Admin</Link>}
            <Link href="/dashboard">Dashboard</Link>
            <form action={signOut}>
              <button type="submit" className="text-black/60 dark:text-white/60">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login">Sign in</Link>
            <Link
              href="/signup"
              className="rounded-md bg-foreground px-3 py-1.5 text-background"
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
