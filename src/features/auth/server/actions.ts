"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export type SettingsActionState = { error?: string; success?: string };

export async function updateEmail(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter an email address." };

  const { error } = await supabase.auth.updateUser({ email });
  if (error) return { error: error.message };

  return { success: "Check your new email address for a confirmation link." };
}

export async function updatePassword(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirmPassword) return { error: "Passwords don't match." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  revalidatePath("/admin/settings");
  return { success: "Password updated." };
}
