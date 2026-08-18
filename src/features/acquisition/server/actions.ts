"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { TablesInsert } from "@/lib/supabase/types";
import { normalizePhone } from "@/features/acquisition/lib/phone";

export type UpsertAcquisitionSessionInput = {
  sessionId: string;
  status?: "started" | "categories_selected" | "problem_entered" | "contact_submitted";
  categoriesSelected?: string[];
  problemTextDraft?: string;
  sourcePage?: string;
  entryPath?: string;
  deviceType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  refCode?: string;
};

// Partial upsert — only the columns present in `input` are touched, and
// this is only ever called on meaningful step transitions (category
// selection, problem submitted/skipped, contact step reached), never per
// keystroke. Mirrors upsertFinderSession's exact contract.
export async function upsertAcquisitionSession(input: UpsertAcquisitionSessionInput) {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  const update: TablesInsert<"acquisition_sessions"> = {
    session_id: input.sessionId,
    last_activity_at: now,
    updated_at: now,
  };
  if (input.status !== undefined) update.status = input.status;
  if (input.categoriesSelected !== undefined) update.categories_selected = input.categoriesSelected;
  if (input.problemTextDraft !== undefined) update.problem_text_draft = input.problemTextDraft;
  if (input.sourcePage !== undefined) update.source_page = input.sourcePage;
  if (input.entryPath !== undefined) update.entry_path = input.entryPath;
  if (input.deviceType !== undefined) update.device_type = input.deviceType;
  if (input.utmSource !== undefined) update.utm_source = input.utmSource;
  if (input.utmMedium !== undefined) update.utm_medium = input.utmMedium;
  if (input.utmCampaign !== undefined) update.utm_campaign = input.utmCampaign;
  if (input.utmTerm !== undefined) update.utm_term = input.utmTerm;
  if (input.utmContent !== undefined) update.utm_content = input.utmContent;
  if (input.referrer !== undefined) update.referrer = input.referrer;
  if (input.refCode !== undefined) update.ref_code = input.refCode;

  const { error } = await admin.from("acquisition_sessions").upsert(update, { onConflict: "session_id" });
  if (error) throw error;
}

// Discrete funnel/CTA/share events — called fire-and-forget from client
// components (same idiom as markFinderResultsViewed(...).catch(() => {})).
export async function recordFunnelEvent(sessionId: string, eventType: string, eventData?: Record<string, unknown>) {
  const admin = createAdminClient();
  const { error } = await admin.from("acquisition_funnel_events").insert({
    session_id: sessionId,
    event_type: eventType,
    event_data: eventData ? JSON.parse(JSON.stringify(eventData)) : null,
  });
  if (error) throw error;
}

function generateReferralCode() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

export type SubmitEarlyAccessLeadState = { error?: string; success?: boolean; referralCode?: string };

export async function submitEarlyAccessLead(
  sessionId: string,
  input: {
    name: string;
    phone: string;
    email?: string;
    categories: string[];
    problemText?: string;
  },
): Promise<SubmitEarlyAccessLeadState> {
  const name = input.name.trim();
  if (!name || name.length < 2) {
    return { error: "Enter your name." };
  }

  const normalized = normalizePhone(input.phone);
  if (!normalized) {
    return { error: "Enter a valid phone number." };
  }

  const email = input.email?.trim() || null;
  const admin = createAdminClient();
  const now = new Date().toISOString();

  // Attribution (source page, UTM params, referrer, referral code) was
  // already captured into the session row on page load by
  // CaptureAcquisitionVisit — read it back from there rather than having
  // the client resend it on submit.
  const { data: session } = await admin
    .from("acquisition_sessions")
    .select("source_page, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, ref_code")
    .eq("session_id", sessionId)
    .maybeSingle();

  const { data: existing, error: lookupError } = await admin
    .from("acquisition_leads")
    .select("id, categories_requested, problem_text, email, referral_code")
    .eq("normalized_phone", normalized.e164)
    .maybeSingle();
  if (lookupError) return { error: "Something went wrong. Please try again." };

  let leadId: string;
  let referralCode: string;
  let isNewLead: boolean;

  if (existing) {
    isNewLead = false;
    referralCode = existing.referral_code;
    const mergedCategories = Array.from(new Set([...(existing.categories_requested ?? []), ...input.categories]));
    const { error } = await admin
      .from("acquisition_leads")
      .update({
        name,
        email: existing.email ?? email,
        categories_requested: mergedCategories,
        problem_text: input.problemText?.trim() || existing.problem_text,
        last_session_id: sessionId,
        updated_at: now,
      })
      .eq("id", existing.id);
    if (error) return { error: "Something went wrong saving your request. Please try again." };
    leadId = existing.id;
  } else {
    isNewLead = true;
    referralCode = generateReferralCode();
    const { data: inserted, error } = await admin
      .from("acquisition_leads")
      .insert({
        name,
        normalized_phone: normalized.e164,
        raw_phone: input.phone,
        email,
        categories_requested: input.categories,
        problem_text: input.problemText?.trim() || null,
        referral_code: referralCode,
        referred_by_code: session?.ref_code || null,
        source_page: session?.source_page,
        utm_source: session?.utm_source,
        utm_medium: session?.utm_medium,
        utm_campaign: session?.utm_campaign,
        utm_term: session?.utm_term,
        utm_content: session?.utm_content,
        referrer: session?.referrer,
        last_session_id: sessionId,
      })
      .select("id")
      .single();
    if (error) return { error: "Something went wrong saving your request. Please try again." };
    leadId = inserted.id;
  }

  await admin
    .from("acquisition_sessions")
    .update({ lead_id: leadId, status: "contact_submitted", last_activity_at: now, completed_at: now, updated_at: now })
    .eq("session_id", sessionId);

  await admin.from("acquisition_funnel_events").insert({
    session_id: sessionId,
    event_type: "user_registration_completed",
    event_data: { lead_id: leadId, is_new_lead: isNewLead },
  });
  if (isNewLead && session?.ref_code) {
    await admin.from("acquisition_funnel_events").insert({
      session_id: sessionId,
      event_type: "referral_registration_completed",
      event_data: { lead_id: leadId, referred_by_code: session.ref_code },
    });
  }

  return { success: true, referralCode };
}
