import { getUser } from "@/lib/supabase/server";
import { HeaderClient } from "@/features/auth/components/header-client";

export async function Header() {
  const user = await getUser();
  return <HeaderClient isSignedIn={Boolean(user)} />;
}
