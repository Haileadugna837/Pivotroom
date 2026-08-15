const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  "aria-hidden": true,
} as const;

const SIDEBAR_ICONS: Record<string, React.ReactNode> = {
  "/dashboard": (
    <svg {...ICON_PROPS}>
      <path d="M3 9.5 10 3l7 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 8.5V16a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  "/dashboard/wishlist": (
    <svg {...ICON_PROPS}>
      <path
        d="M10 17s-6.5-4.06-8.5-8.06C.36 6.1 1.86 3 5 3c1.9 0 3.4 1.1 5 3 1.6-1.9 3.1-3 5-3 3.14 0 4.64 3.1 3.5 5.94C16.5 12.94 10 17 10 17z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "/dashboard/nominations": (
    <svg {...ICON_PROPS}>
      <path
        d="M10 2.5 12 7.2l5.2.5-4 3.4 1.2 5.1L10 13.6l-4.4 2.6 1.2-5.1-4-3.4L7.9 7.2 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "/dashboard/expert/bookings": (
    <svg {...ICON_PROPS}>
      <rect x="3" y="4" width="14" height="13" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 8h14M6.5 2.5v3M13.5 2.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 12 9 13.5l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "/dashboard/expert/availability": (
    <svg {...ICON_PROPS}>
      <circle cx="10" cy="10.5" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6.5v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "/dashboard/expert/payments": (
    <svg {...ICON_PROPS}>
      <rect x="2.5" y="5" width="15" height="10.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 8.5h15" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 12.2h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  "/dashboard/expert/profile": (
    <svg {...ICON_PROPS}>
      <circle cx="10" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 17c.8-3.4 3.6-5.2 6.5-5.2s5.7 1.8 6.5 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  "/dashboard/settings": (
    <svg {...ICON_PROPS}>
      <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 3v1.6M10 15.4V17M17 10h-1.6M4.6 10H3M14.8 5.2l-1.1 1.1M6.3 13.7l-1.1 1.1M14.8 14.8l-1.1-1.1M6.3 6.3 5.2 5.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  "/admin": (
    <svg {...ICON_PROPS}>
      <path
        d="M10 2.5 16 5v4.5c0 4-2.5 6.9-6 8-3.5-1.1-6-4-6-8V5l6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg {...ICON_PROPS}>
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const MORE_ICON = (
  <svg {...ICON_PROPS}>
    <circle cx="4.5" cy="10" r="1.4" fill="currentColor" />
    <circle cx="10" cy="10" r="1.4" fill="currentColor" />
    <circle cx="15.5" cy="10" r="1.4" fill="currentColor" />
  </svg>
);

export function getSidebarIcon(href: string): React.ReactNode {
  return SIDEBAR_ICONS[href] ?? DEFAULT_ICON;
}
