"use client";

import { useActionState } from "react";
import {
  addSocialLink,
  deleteSocialLink,
  type SocialLinkState,
} from "@/features/experts/server/social-links-actions";
import { SOCIAL_PLATFORMS, SocialIcon, platformLabel } from "@/features/experts/components/social-icons";

type SocialLink = { id: string; platform: string; url: string };

const initialState: SocialLinkState = {};
const MAX_LINKS = 3;

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
  const [state, formAction, pending] = useActionState(addSocialLink, initialState);
  const atLimit = links.length >= MAX_LINKS;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Social media ({links.length}/{MAX_LINKS})</p>

      {links.length > 0 && (
        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
            >
              <div className="flex items-center gap-2">
                <SocialIcon platform={link.platform} className="h-4 w-4" />
                <span>{platformLabel(link.platform)}</span>
                <span className="truncate text-black/50 dark:text-white/50">{link.url}</span>
              </div>
              <form action={deleteSocialLink}>
                <input type="hidden" name="id" value={link.id} />
                <button type="submit" className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {!atLimit && (
        <form action={formAction} className="flex flex-wrap items-end gap-2">
          <select
            name="platform"
            required
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          >
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            name="url"
            type="url"
            required
            placeholder="https://..."
            className="min-w-0 flex-1 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {pending ? "Adding…" : "Add"}
          </button>
        </form>
      )}
      {atLimit && (
        <p className="text-xs text-black/50 dark:text-white/50">
          Maximum of {MAX_LINKS} social links reached — remove one to add another.
        </p>
      )}
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
    </div>
  );
}
