"use client";

import { useId, useState } from "react";

export function PhotoUploadField({ initialPhotoUrl }: { initialPhotoUrl?: string | null }) {
  const inputId = useId();
  const [preview, setPreview] = useState<string | null>(initialPhotoUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
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
            id={inputId}
            name="photo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleChange}
            className="sr-only"
          />
          {fileName && <p className="text-xs text-black/50 dark:text-white/50">{fileName}</p>}
          <p className="text-xs text-black/50 dark:text-white/50">JPG, PNG, or WEBP. Up to 5MB.</p>
        </div>
      </div>
    </div>
  );
}
