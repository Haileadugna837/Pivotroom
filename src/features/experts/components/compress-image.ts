// Resizes and re-encodes an image client-side before upload, so the
// request body stays small regardless of the original photo's size
// (phone camera photos routinely land in the multi-MB range, well past
// both Next.js's Server Action body limit and Vercel's own platform-level
// ~4.5MB cap on serverless function request bodies).
export async function compressImage(
  file: File,
  { maxDimension = 1200, quality = 0.82 }: { maxDimension?: number; quality?: number } = {},
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) throw new Error("Image compression failed");

  const name = file.name.replace(/\.\w+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}
