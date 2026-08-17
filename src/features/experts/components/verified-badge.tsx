type VerifiedBadgeProps = {
  gold?: boolean;
  size?: number;
  className?: string;
};

export function VerifiedBadge({ gold = false, size = 14, className = "" }: VerifiedBadgeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      role="img"
      aria-label={gold ? "This expert donates their session income to a foundation" : "Approved expert"}
      className={className}
    >
      <title>{gold ? "This expert donates their session income to a foundation" : "Approved expert"}</title>
      <circle cx="10" cy="10" r="10" fill="currentColor" className={gold ? "text-amber-400" : "text-blue-500"} />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
