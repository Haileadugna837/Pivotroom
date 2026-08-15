"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { TablesInsert } from "@/lib/supabase/types";

export type UpsertFinderSessionInput = {
  sessionId: string;
  sourcePage?: string;
  deviceType?: string;
  identity?: string;
  problem?: string;
};

// Called once per meaningful selection (identity, problem) — never per
// keystroke. Partial upsert: only the columns present in `update` are
// touched, so an earlier answer is never clobbered by a later call.
export async function upsertFinderSession(input: UpsertFinderSessionInput) {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  const update: TablesInsert<"expert_finder_sessions"> = {
    session_id: input.sessionId,
    status: "in_progress",
    last_activity_at: now,
    updated_at: now,
  };
  if (input.sourcePage !== undefined) update.source_page = input.sourcePage;
  if (input.deviceType !== undefined) update.device_type = input.deviceType;
  if (input.identity !== undefined) update.identity = input.identity;
  if (input.problem !== undefined) update.problem = input.problem;

  const { error } = await admin.from("expert_finder_sessions").upsert(update, { onConflict: "session_id" });
  if (error) throw error;
}

export type FinderMatchPreview = {
  id: string;
  headline: string | null;
  photoUrl: string | null;
  fullName: string | null;
};

export type FinderMatchResult = {
  matchCount: number;
  matchStatus: "experts_found" | "no_match";
  previews: FinderMatchPreview[];
};

// Runs once, only when the visitor explicitly clicks "Find Experts" — never
// speculatively while they're still picking category options.
export async function runExpertMatch(input: {
  sessionId: string;
  categoryId: string;
  subcategoryId?: string;
}): Promise<FinderMatchResult> {
  const admin = createAdminClient();

  const matchCategoryIds = input.subcategoryId ? [input.subcategoryId] : await topAndChildIds(admin, input.categoryId);

  const { data: matchRows, error: matchError } = await admin
    .from("expert_categories")
    .select("expert_id")
    .in("category_id", matchCategoryIds);
  if (matchError) throw matchError;

  const expertIds = Array.from(new Set((matchRows ?? []).map((r) => r.expert_id)));

  let previews: FinderMatchPreview[] = [];
  let matchCount = 0;

  if (expertIds.length > 0) {
    const { data: experts, error: expertsError } = await admin
      .from("experts")
      .select("id, headline, photo_url")
      .eq("status", "approved")
      .in("id", expertIds);
    if (expertsError) throw expertsError;

    matchCount = experts.length;

    if (experts.length > 0) {
      const previewSlice = experts.slice(0, 3);
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, full_name")
        .in(
          "id",
          previewSlice.map((e) => e.id),
        );
      const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
      previews = previewSlice.map((e) => ({
        id: e.id,
        headline: e.headline,
        photoUrl: e.photo_url,
        fullName: nameById.get(e.id) ?? null,
      }));
    }
  }

  const matchStatus: "experts_found" | "no_match" = matchCount > 0 ? "experts_found" : "no_match";
  const now = new Date().toISOString();

  const { error: updateError } = await admin
    .from("expert_finder_sessions")
    .update({
      category_id: input.categoryId,
      subcategory_id: input.subcategoryId ?? null,
      match_count: matchCount,
      match_status: matchStatus,
      status: matchStatus === "experts_found" ? "search_completed" : "no_expert_found",
      last_activity_at: now,
      updated_at: now,
      completed_at: now,
    })
    .eq("session_id", input.sessionId);
  if (updateError) throw updateError;

  return { matchCount, matchStatus, previews };
}

async function topAndChildIds(admin: ReturnType<typeof createAdminClient>, categoryId: string) {
  const { data, error } = await admin.from("categories").select("id").eq("parent_id", categoryId);
  if (error) throw error;
  return [categoryId, ...(data ?? []).map((c) => c.id)];
}

export async function markFinderResultsViewed(sessionId: string) {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const { error } = await admin
    .from("expert_finder_sessions")
    .update({ status: "results_viewed", last_activity_at: now, updated_at: now })
    .eq("session_id", sessionId);
  if (error) throw error;
}

export type SubmitFinderContactState = { error?: string; success?: boolean };

export async function submitFinderContact(
  sessionId: string,
  name: string,
  phone: string,
): Promise<SubmitFinderContactState> {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  if (!trimmedName || trimmedName.length < 2) {
    return { error: "Enter your name." };
  }
  const digitCount = trimmedPhone.replace(/\D/g, "").length;
  if (digitCount < 7) {
    return { error: "Enter a valid phone number." };
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();
  const { error } = await admin
    .from("expert_finder_sessions")
    .update({
      name: trimmedName,
      phone: trimmedPhone,
      lead_submitted: true,
      status: "contact_submitted",
      last_activity_at: now,
      updated_at: now,
      completed_at: now,
    })
    .eq("session_id", sessionId);
  if (error) return { error: "Something went wrong saving your request. Please try again." };

  return { success: true };
}
