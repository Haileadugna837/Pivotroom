import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadNgoLogo(
  storage: SupabaseClient["storage"],
  ngoId: string,
  logo: File,
): Promise<string> {
  if (logo.size > 5 * 1024 * 1024) {
    throw new Error("Logo must be under 5MB.");
  }

  const ext = logo.type === "image/png" ? "png" : logo.type === "image/webp" ? "webp" : "jpg";
  const path = `${ngoId}/logo.${ext}`;

  const { error: uploadError } = await storage
    .from("ngo-logos")
    .upload(path, logo, { upsert: true, contentType: logo.type });
  if (uploadError) {
    throw new Error(`Logo upload failed: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = storage.from("ngo-logos").getPublicUrl(path);
  return `${publicUrl}?t=${Date.now()}`;
}
