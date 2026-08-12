import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "./admin";

function trackPageView(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    if (request.method !== "GET") return;
    if (pathname.startsWith("/api/")) return;
    if (request.headers.get("next-router-prefetch")) return;

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
