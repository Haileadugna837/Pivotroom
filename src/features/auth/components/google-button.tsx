"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleButton() {
  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
    >
      Continue with Google
    </button>
  );
}
