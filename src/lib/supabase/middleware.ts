import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "./admin";

function trackPageView(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    if (request.method !== "GET") return;
    if (pathname.startsWith("/api/")) return;
    if (request.headers.get("next-router-prefetch")) return;

    // Only count real browser navigations (typed URL, clicked <a>, hard
    // refresh) — not the RSC "fetch" requests Next.js's client router fires
    // for prefetch-adjacent revalidation, router.refresh() after a server
    // action, or background re-fetches of the page you're already on. Those
    // all share this same GET-without-prefetch-header shape, but browsers
    // tag them with `Sec-Fetch-Dest: empty` (fetch/XHR) instead of
    // `document` (a real navigation), which is what was inflating counts —
    // the same path was getting counted several times per second from a
    // single visit. Requests without this header at all (older browsers,
    // some bots) are still counted rather than silently dropped.
    const fetchDest = request.headers.get("sec-fetch-dest");
    if (fetchDest && fetchDest !== "document") return;

    createAdminClient()
      .from("page_views")
      .insert({ path: pathname })
      .then(
        () => {},
        () => {},
      );
  } catch {
    // Never let view tracking break the actual request.
  }
}

export async function updateSession(request: NextRequest) {
  trackPageView(request);

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session so Server Components can read a valid user.
  await supabase.auth.getUser();

  return supabaseResponse;
}
