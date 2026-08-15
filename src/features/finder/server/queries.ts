import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getFinderSessionBySessionId(sessionId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("expert_finder_sessions")
    .select("session_id, identity, problem, category_id, subcategory_id, match_count, match_status")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (error) throw error;
  return data;
}
