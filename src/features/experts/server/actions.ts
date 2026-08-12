"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function applyAsExpert(formData: FormData) {
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
    if (photo.size > 5 * 1024 * 1024) {
      throw new Error("Photo must be under 5MB");
    }
    const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const path = `${user.id}/photo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("expert-photos")
      .upload(path, photo, { upsert: true, contentType: photo.type });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("expert-photos").getPublicUrl(path);
    record.photo_url = `${publicUrl}?t=${Date.now()}`;
  }

  const { error } = await supabase.from("experts").upsert(record);

  if (error) throw error;

  redirect("/dashboard?applied=1");
}
