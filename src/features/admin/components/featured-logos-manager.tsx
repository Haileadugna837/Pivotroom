"use client";

import { useActionState } from "react";
import { addFeaturedLogo, removeFeaturedLogo, type AddFeaturedLogoState } from "@/features/admin/server/actions";
import { PhotoUploadField } from "@/features/experts/components/photo-upload-field";

type FeaturedLogo = { id: string; name: string; logo_url: string; link_url: string | null };

const initialState: AddFeaturedLogoState = {};

export function FeaturedLogosManager({ logos }: { logos: FeaturedLogo[] }) {
  const [state, formAction, pending] = useActionState(addFeaturedLogo, initialState);

  return (
    <div className="flex flex-col gap-8">
      <form
        action={formAction}
        className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15"
      >
        <p className="text-sm font-medium">Add a logo</p>

        <PhotoUploadField name="logo" label="Logo" />

        <label className="text-sm">
          Name
          <input
            name="name"
            required
            placeholder="e.g. Forbes"
            className="mt-1 block w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <label className="text-sm">
          Link (optional)
          <input
            name="link_url"
            type="url"
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>

        {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add logo"}
        </button>
      </form>

      {logos.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">
          No logos added yet — this section is hidden on the homepage until at least one is added.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {logos.map((logo) => (
            <li
              key={logo.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-black/10 px-3 py-2 dark:border-white/15"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.logo_url}
                  alt=""
                  className="h-9 w-16 rounded object-contain bg-black/5 p-1 dark:bg-white/10"
                />
                <div className="text-sm">
                  <p className="font-medium">{logo.name}</p>
                  {logo.link_url && (
                    <a href={logo.link_url} target="_blank" rel="noopener noreferrer" className="text-xs underline">
                      {logo.link_url}
                    </a>
                  )}
                </div>
              </div>
              <form action={removeFeaturedLogo}>
                <input type="hidden" name="id" value={logo.id} />
                <button className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
