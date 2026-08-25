"use client";

import { useId, useRef, useState } from "react";
import { compressImage } from "./compress-image";

type PhotoUploadFieldProps = {
  initialPhotoUrl?: string | null;
  name?: string;
  label?: string;
};

export function PhotoUploadField({
  initialPhotoUrl,
  name = "photo",
  label = "Profile photo",
}: PhotoUploadFieldProps) {
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
      <p className="mb-2 text-sm font-medium text-pivot-ink">{label}</p>
      <div className="flex items-center gap-4">
        <div className="h-28 w-24 shrink-0 overflow-hidden rounded-md bg-pivot-paper-2">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-pivot-muted">
              No photo
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={inputId}
            className="w-fit cursor-pointer rounded-md border border-pivot-line px-4 py-2 text-sm font-medium text-pivot-ink hover:bg-pivot-paper-2"
          >
            {preview ? "Change photo" : "Upload photo"}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleChange}
            className="sr-only"
          />
          {busy && <p className="text-xs text-pivot-muted">Processing…</p>}
          {!busy && fileName && <p className="text-xs text-pivot-muted">{fileName}</p>}
          {error && <p className="text-xs text-pivot-danger">{error}</p>}
          <p className="text-xs text-pivot-muted">JPG, PNG, or WEBP.</p>
        </div>
      </div>
    </div>
  );
}
