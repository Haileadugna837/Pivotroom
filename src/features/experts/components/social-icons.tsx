export const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
  { key: "x", label: "X (Twitter)" },
  { key: "youtube", label: "YouTube" },
  { key: "facebook", label: "Facebook" },
  { key: "website", label: "Website" },
] as const;

export function platformLabel(platform: string) {
  return SOCIAL_PLATFORMS.find((p) => p.key === platform)?.label ?? platform;
}

export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  switch (platform) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M7.5 10v6.5M7.5 7.5v.01M11.5 16.5V10M11.5 12.5c0-1.4 1-2.5 2.4-2.5s2.1 1 2.1 2.6v3.9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M14 4v9.5a3 3 0 1 1-2.5-2.96M14 4c.3 2 1.9 3.5 4 3.7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M5 4l14 16M19 4L5 20"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M13.5 21v-6.5H15.5l.3-2.5H13.5V10.3c0-.7.2-1.3 1.3-1.3H16V6.6c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.2V12H9v2.5h2v6.4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "website":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
  }
}
