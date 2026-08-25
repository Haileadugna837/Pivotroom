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

export type SubmitEarlyAccessLeadState = { error?: string; success?: boolean; referralCode?: string; leadId?: string };

export async function submitEarlyAccessLead(
  sessionId: string,
  input: {
    name: string;
    phone: string;
    email?: string;
    categories: string[];
    problemText?: string;
    userType?: string;
    urgency?: string;
    company?: string;
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
        user_type: input.userType || undefined,
        urgency: input.urgency || undefined,
        company: input.company?.trim() || undefined,
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
        user_type: input.userType || null,
        urgency: input.urgency || null,
        company: input.company?.trim() || null,
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

  return { success: true, referralCode, leadId };
}

export type SubmitFoundingExpertApplicationState = { error?: string; success?: boolean };

export async function submitFoundingExpertApplication(
  sessionId: string,
  input: {
    name: string;
    phone?: string;
    email?: string;
    professionalType: string;
    professionalTypeSecondary?: string;
    expertiseTopics: string[];
    experienceText: string;
    currentRole?: string;
    currentCompany?: string;
    yearsExperience?: number;
    linkedinUrl?: string;
    websiteUrl?: string;
    instagramUrl?: string;
  },
): Promise<SubmitFoundingExpertApplicationState> {
  const name = input.name.trim();
  if (!name || name.length < 2) {
    return { error: "Enter your name." };
  }

  const rawPhone = input.phone?.trim();
  const normalized = rawPhone ? normalizePhone(rawPhone) : null;
  if (rawPhone && !normalized) {
    return { error: "Enter a valid phone number." };
  }
  const email = input.email?.trim() || null;
  if (!normalized && !email) {
    return { error: "Enter a phone number or email so we can reach you." };
  }

  if (!input.professionalType) {
    return { error: "Select what best describes you." };
  }
  if (input.expertiseTopics.length === 0) {
    return { error: "Add at least one topic you can speak about." };
  }
  if (!input.experienceText.trim()) {
    return { error: "Tell us briefly about your experience." };
  }

  const admin = createAdminClient();

  const { data: session } = await admin
    .from("acquisition_sessions")
    .select("source_page, utm_source, utm_medium, utm_campaign, utm_term, utm_content")
    .eq("session_id", sessionId)
    .maybeSingle();

  const { data: inserted, error } = await admin
    .from("founding_expert_applications")
    .insert({
      name,
      normalized_phone: normalized?.e164 ?? null,
      raw_phone: rawPhone || null,
      email,
      professional_type: input.professionalType,
      professional_type_secondary: input.professionalTypeSecondary || null,
      expertise_topics: input.expertiseTopics,
      experience_text: input.experienceText.trim(),
      current_role: input.currentRole?.trim() || null,
      current_company: input.currentCompany?.trim() || null,
      years_experience: input.yearsExperience ?? null,
      linkedin_url: input.linkedinUrl?.trim() || null,
      website_url: input.websiteUrl?.trim() || null,
      instagram_url: input.instagramUrl?.trim() || null,
      source_page: session?.source_page,
      utm_source: session?.utm_source,
      utm_medium: session?.utm_medium,
      utm_campaign: session?.utm_campaign,
      utm_term: session?.utm_term,
      utm_content: session?.utm_content,
      session_id: sessionId,
    })
    .select("id")
    .single();
  if (error) return { error: "Something went wrong submitting your application. Please try again." };

  await admin.from("acquisition_funnel_events").insert({
    session_id: sessionId,
    event_type: "expert_application_submitted",
    event_data: { application_id: inserted.id },
  });

  return { success: true };
}

export type SubmitNominationAnonymousState = { error?: string; success?: boolean };

// Anonymous-friendly nomination — no sign-in required. Reuses the existing
// nominees/nominations tables (extended in Round 1 with nullable
// name/nominator_id) so admin reviews both origins in one place.
export async function submitNominationAnonymous(
  sessionId: string,
  input: {
    nomineeName: string;
    nomineeTitle?: string;
    company?: string;
    nomineeLocation?: string;
    socialUrl?: string;
    categories: string[];
    reason: string;
    topic?: string;
    nominatorName: string;
    nominatorPhone: string;
    nominatorEmail?: string;
    nominatorRelationship: string;
    introComfort?: string;
  },
): Promise<SubmitNominationAnonymousState> {
  const nomineeName = input.nomineeName.trim();
  if (!nomineeName) {
    return { error: "Enter who you're nominating." };
  }
  if (!input.reason.trim()) {
    return { error: "Tell us why you're nominating this person." };
  }

  const nominatorName = input.nominatorName.trim();
  if (!nominatorName) {
    return { error: "Enter your name." };
  }
  const normalizedPhone = normalizePhone(input.nominatorPhone);
  if (!normalizedPhone) {
    return { error: "Enter a valid phone number." };
  }
  if (!input.nominatorRelationship) {
    return { error: "Select how you know them." };
  }

  const admin = createAdminClient();

  const { data: existingNominee } = await admin.from("nominees").select("id").ilike("name", nomineeName).maybeSingle();

  let nomineeId: string;
  if (existingNominee) {
    nomineeId = existingNominee.id;
  } else {
    const { data: createdNominee, error } = await admin
      .from("nominees")
      .insert({ name: nomineeName })
      .select("id")
      .single();
    if (error) return { error: "Something went wrong. Please try again." };
    nomineeId = createdNominee.id;
  }

  const { error: nominationError } = await admin.from("nominations").insert({
    nominee_id: nomineeId,
    nominee_title: input.nomineeTitle?.trim() || null,
    company: input.company?.trim() || null,
    nominee_location: input.nomineeLocation?.trim() || null,
    social_url: input.socialUrl?.trim() || null,
    categories_requested: input.categories,
    reason: input.reason.trim(),
    topic: input.topic?.trim() || null,
    nominator_name: nominatorName,
    nominator_phone: normalizedPhone.e164,
    nominator_email: input.nominatorEmail?.trim() || null,
    nominator_relationship: input.nominatorRelationship,
    intro_comfort: input.introComfort || null,
    source: "acquisition_landing",
    landing_session_id: sessionId,
  });
  if (nominationError) return { error: "Something went wrong. Please try again." };

  await admin.from("acquisition_funnel_events").insert({
    session_id: sessionId,
    event_type: "nomination_completed",
    event_data: { nominee_id: nomineeId },
  });

  return { success: true };
}
