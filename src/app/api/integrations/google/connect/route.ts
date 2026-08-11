import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createOAuthClient, GOOGLE_CALENDAR_SCOPES } from "@/lib/google/client";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL));
  }

  const oauth2Client = createOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GOOGLE_CALENDAR_SCOPES,
    state: user.id,
  });

  return NextResponse.redirect(url);
}
