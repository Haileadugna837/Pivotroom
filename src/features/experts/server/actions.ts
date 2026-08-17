"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadExpertPhoto } from "./photo";
import { markInviteCompleted } from "./invites";
import { TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from "@/lib/timezones";
import { parseLines } from "@/lib/text";

export type ApplyExpertState = { error?: string };

export async function applyAsExpert(
  _prevState: ApplyExpertState,
  formData: FormData,
): Promise<ApplyExpertState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const headline = String(formData.get("headline") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const pricePer15Min = Number(formData.get("price_per_15_min"));
  const payoutAccountName = String(formData.get("payout_account_name") ?? "").trim() || null;
  const payoutAccountNumber = String(formData.get("payout_account_number") ?? "").trim() || null;
  const timezoneInput = String(formData.get("timezone") ?? "");
  const timezone = TIMEZONE_OPTIONS.some((t) => t.value === timezoneInput)
    ? timezoneInput
    : DEFAULT_TIMEZONE;
  const expectations = parseLines(String(formData.get("expectations") ?? ""), 6);
  const exampleQuestions = parseLines(String(formData.get("example_questions") ?? ""), 6);

  const record: {
    id: string;
    headline: string;
    bio: string;
    price_per_15_min: number | null;
    currency: string;
    payout_account_name: string | null;
    payout_account_number: string | null;
    timezone: string;
    expectations: string[] | null;
    example_questions: string[] | null;
    photo_url?: string;
  } = {
    id: user.id,
    headline,
    bio,
    price_per_15_min: Number.isFinite(pricePer15Min) ? pricePer15Min : null,
    currency: "ETB",
    payout_account_name: payoutAccountName,
    payout_account_number: payoutAccountNumber,
    timezone,
    expectations: expectations.length > 0 ? expectations : null,
    example_questions: exampleQuestions.length > 0 ? exampleQuestions : null,
  };

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      record.photo_url = await uploadExpertPhoto(supabase.storage, user.id, photo);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Photo upload failed." };
    }
  }

  const { error } = await supabase.from("experts").upsert(record);
  if (error) {
    return { error: `Failed to save profile: ${error.message}` };
  }

  const inviteToken = String(formData.get("invite_token") ?? "");
  if (inviteToken) {
    await markInviteCompleted(inviteToken);
  }

  redirect("/dashboard?applied=1");
}

export async function disconnectGoogleCalendar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // expert_google_tokens only has a self-read RLS policy (writes go through
  // the OAuth callback via the admin client) — same admin client here.
  const admin = createAdminClient();
  const { error } = await admin.from("expert_google_tokens").delete().eq("expert_id", user.id);
  if (error) throw error;

  revalidatePath("/dashboard/expert/availability");
}
