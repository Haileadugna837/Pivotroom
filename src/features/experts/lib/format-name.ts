// Privacy-formatted display name for list/browse surfaces — "Lidiya
// Fitsum" -> "Lidiya F.". Only the 2nd word becomes the initial; any
// further words (e.g. a grandfather's name) are dropped. The expert's
// own detail page shows the real full name unchanged — this is
// list-view-only, per product decision.
export function formatListDisplayName(fullName: string | null, headline: string | null): string {
  if (!fullName) return headline ?? "Expert";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return parts[0] ?? headline ?? "Expert";
  return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
}
