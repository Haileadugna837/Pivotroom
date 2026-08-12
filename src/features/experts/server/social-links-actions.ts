"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_PLATFORMS = ["instagram", "linkedin", "tiktok", "x", "youtube", "facebook", "website"];
const MAX_LINKS = 3;

export type SocialLinkState = { error?: string };

export async function addSocialLink(
  _prevState: SocialLinkState,
  formData: FormData,
): Promise<SocialLinkState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const platform = String(formData.get("platform") ?? "");
  const url = String(formData.get("url") ?? "").trim();

  if (!ALLOWED_PLATFORMS.includes(platform)) {
    return { error: "Pick a platform." };
  }
  if (!/^https?:\/\/.+/.test(url)) {
    return { error: "Enter a full link starting with https://" };
  }

  const { count } = await supabase
    .from("expert_social_links")
    .select("id", { count: "exact", head: true })
    .eq("expert_id", user.id);
  if ((count ?? 0) >= MAX_LINKS) {
    return { error: `You can add up to ${MAX_LINKS} social links.` };
  }

  const { error } = await supabase.from("expert_social_links").insert({
    expert_id: user.id,
    platform,
    url,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/expert/profile");
  return {};
}

export async function deleteSocialLink(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("expert_social_links").delete().eq("id", id).eq("expert_id", user.id);

  revalidatePath("/dashboard/expert/profile");
}
