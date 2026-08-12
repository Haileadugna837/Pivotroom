"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadExpertPhoto } from "./photo";

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
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const pricePer15Min = Number(formData.get("price_per_15_min"));
  const payoutAccountName = String(formData.get("payout_account_name") ?? "").trim() || null;
  const payoutAccountNumber = String(formData.get("payout_account_number") ?? "").trim() || null;

  const record: {
    id: string;
    headline: string;
    bio: string;
    category_id: string | null;
    price_per_15_min: number | null;
    currency: string;
    payout_account_name: string | null;
    payout_account_number: string | null;
    photo_url?: string;
  } = {
    id: user.id,
    headline,
    bio,
    category_id: categoryId,
    price_per_15_min: Number.isFinite(pricePer15Min) ? pricePer15Min : null,
    currency: "ETB",
    payout_account_name: payoutAccountName,
    payout_account_number: payoutAccountNumber,
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

  redirect("/dashboard?applied=1");
}
