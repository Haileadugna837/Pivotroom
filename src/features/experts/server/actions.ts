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
  const sessionRate = Number(formData.get("session_rate"));
  const sessionDurationMinutes = Number(formData.get("session_duration_minutes")) || 30;

  const { error } = await supabase.from("experts").upsert({
    id: user.id,
    headline,
    bio,
    category_id: categoryId,
    session_rate: Number.isFinite(sessionRate) ? sessionRate : null,
    session_duration_minutes: sessionDurationMinutes,
  });

  if (error) throw error;

  redirect("/dashboard?applied=1");
}
