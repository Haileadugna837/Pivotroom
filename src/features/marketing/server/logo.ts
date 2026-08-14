import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadFeaturedLogo(
  storage: SupabaseClient["storage"],
  logoId: string,
  logo: File,
): Promise<string> {
  if (logo.size > 5 * 1024 * 1024) {
    throw new Error("Logo must be under 5MB.");
  }

  const ext = logo.type === "image/png" ? "png" : logo.type === "image/webp" ? "webp" : "jpg";
  const path = `${logoId}/logo.${ext}`;

  const { error: uploadError } = await storage
    .from("featured-logos")
    .upload(path, logo, { upsert: true, contentType: logo.type });
  if (uploadError) {
    throw new Error(`Logo upload failed: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = storage.from("featured-logos").getPublicUrl(path);
  return `${publicUrl}?t=${Date.now()}`;
}
