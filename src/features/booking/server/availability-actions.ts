"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addAvailabilityWindow(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");

  if (!date || !startTime || !endTime) {
    throw new Error("Missing availability details");
  }
  if (startTime >= endTime) {
    throw new Error("End time must be after start time");
  }

  const { error } = await supabase.from("expert_availability").insert({
    expert_id: user.id,
    date,
    start_time: `${startTime}:00`,
    end_time: `${endTime}:00`,
  });
  if (error) throw error;

  revalidatePath("/dashboard");
}

export async function deleteAvailabilityWindow(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  const { error } = await supabase
    .from("expert_availability")
    .delete()
    .eq("id", id)
    .eq("expert_id", user.id);
  if (error) throw error;

  revalidatePath("/dashboard");
}
