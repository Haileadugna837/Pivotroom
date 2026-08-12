"use client";

import { useId, useRef, useState } from "react";
import { compressImage } from "./compress-image";

export function PhotoUploadField({ initialPhotoUrl }: { initialPhotoUrl?: string | null }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialPhotoUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setBusy(true);
    setPreview(URL.createObjectURL(file));

    try {
      const compressed = await compressImage(file);

      // Swap the input's FileList for the compressed version, so the
      // actual form submission uploads the small file, not the original.
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(compressed);
      if (inputRef.current) inputRef.current.files = dataTransfer.files;

      setPreview(URL.createObjectURL(compressed));
      setFileName(`${compressed.name} (${Math.round(compressed.size / 1024)}KB)`);
    } catch {
      // Compression unsupported/failed (rare) — fall back to the original
      // file as selected; server-side size validation still applies.
      setFileName(file.name);
      if (file.size > 5 * 1024 * 1024) {
        setError("Couldn't process this image and it's over 5MB — try a smaller photo.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium">Profile photo</p>
      <div className="flex items-center gap-4">
        <div className="h-28 w-24 shrink-0 overflow-hidden rounded-md bg-black/5 dark:bg-white/10">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-black/40 dark:text-white/40">
              No photo
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={inputId}
            className="w-fit cursor-pointer rounded-md border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            {preview ? "Change photo" : "Upload photo"}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            name="photo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleChange}
            className="sr-only"
          />
          {busy && <p className="text-xs text-black/50 dark:text-white/50">Processing…</p>}
          {!busy && fileName && (
            <p className="text-xs text-black/50 dark:text-white/50">{fileName}</p>
          )}
          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
          <p className="text-xs text-black/50 dark:text-white/50">JPG, PNG, or WEBP.</p>
        </div>
      </div>
    </div>
  );
}
