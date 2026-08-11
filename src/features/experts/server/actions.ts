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

  const { error } = await supabase.from("experts").upsert({
    id: user.id,
    headline,
    bio,
    category_id: categoryId,
    price_per_15_min: Number.isFinite(pricePer15Min) ? pricePer15Min : null,
    currency: "ETB",
  });

  if (error) throw error;

  redirect("/dashboard?applied=1");
}
