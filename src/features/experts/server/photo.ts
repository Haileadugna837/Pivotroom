import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadExpertPhoto(
  storage: SupabaseClient["storage"],
  expertId: string,
  photo: File,
): Promise<string> {
  if (photo.size > 5 * 1024 * 1024) {
    throw new Error("Photo must be under 5MB.");
  }

  const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
  const path = `${expertId}/photo.${ext}`;

  const { error: uploadError } = await storage
    .from("expert-photos")
    .upload(path, photo, { upsert: true, contentType: photo.type });
  if (uploadError) {
    throw new Error(`Photo upload failed: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = storage.from("expert-photos").getPublicUrl(path);
  return `${publicUrl}?t=${Date.now()}`;
}
