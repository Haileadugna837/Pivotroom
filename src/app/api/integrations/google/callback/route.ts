import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOAuthClient } from "@/lib/google/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !code || !state || state !== user.id) {
    return NextResponse.redirect(new URL("/dashboard?google=invalid", siteUrl));
  }

  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    // Google only returns a refresh token on first consent. If the user
    // already connected before, they'll need to revoke access at
    // https://myaccount.google.com/permissions and reconnect.
    return NextResponse.redirect(new URL("/dashboard?google=no_refresh_token", siteUrl));
  }

  const admin = createAdminClient();

  const { data: expert } = await admin
    .from("experts")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!expert) {
    return NextResponse.redirect(new URL("/dashboard?google=not_an_expert", siteUrl));
  }

  const { error } = await admin.from("expert_google_tokens").upsert({
    expert_id: user.id,
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token ?? null,
    expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.redirect(new URL("/dashboard?google=save_failed", siteUrl));
  }

  return NextResponse.redirect(new URL("/dashboard?google=connected", siteUrl));
}
