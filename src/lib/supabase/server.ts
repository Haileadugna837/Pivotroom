import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component; safe to ignore
            // when middleware refreshes the session instead.
          }
        },
      },
    },
  );
}

// supabase.auth.getUser() always makes a real network round-trip to
// Supabase's Auth server to revalidate the JWT (deliberately, for security —
// unlike getSession() it can't be spoofed from a stale cookie). Most page
// trees call it multiple times per request (root layout's Header, a nested
// dashboard/admin layout, then the page itself), which used to mean 2-3
// redundant round-trips for the exact same check on a single navigation.
// react's cache() memoizes this per request, so every caller in the same
// render tree shares one actual call.
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
