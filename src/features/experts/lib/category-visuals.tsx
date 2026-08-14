type CategoryVisual = {
  icon: React.ReactNode;
  boxClassName: string;
};

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: "0 0 20 20",
  fill: "none",
  "aria-hidden": true,
} as const;

const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  "Starting & Building a Business": {
    boxClassName: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    icon: (
      <svg {...ICON_PROPS}>
        <path
          d="M10 2c2.5 1.6 4 4.3 4 7.5 0 2-1 4-2 5l-2 2-2-2c-1-1-2-3-2-5 0-3.2 1.5-5.9 4-7.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="9" r="1.6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7 14.5 5.5 18M13 14.5 14.5 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  "Marketing, Brand & Growth": {
    boxClassName: "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400",
    icon: (
      <svg {...ICON_PROPS}>
        <path
          d="M3 8.5v3a1 1 0 0 0 1 1h1.6L10 15.5v-11L5.6 7.5H4a1 1 0 0 0-1 1Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M13 7.5c1 .8 1 3.7 0 4.5M15.5 5.5c2 2 2 6.5 0 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  "Sales, Partnerships & Expansion": {
    boxClassName: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M2.5 10.5 6 7l3 2 5-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 4.5h3.5V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 14h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  "Funding, Investment & Finance": {
    boxClassName: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 6.5v7M12 8c0-1-1-1.5-2-1.5s-2 .5-2 1.5c0 2 4 1 4 3 0 1-1 1.5-2 1.5s-2-.5-2-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  "Leadership, Management & Operations": {
    boxClassName: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="10" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="4.5" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15.5" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 7.5v2M8.7 11.5 6 12.6M11.3 11.5 14 12.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  "Product, Technology & AI": {
    boxClassName: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="6" y="6" width="8" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
        <rect x="8.5" y="8.5" width="3" height="3" rx="0.6" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M15.4 4.6 14 6M6 14l-1.4 1.4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  "Career & Professional Development": {
    boxClassName: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="6.5" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 13 5v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M3 10.5h14" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  "Industry & Specialized Expertise": {
    boxClassName: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 17V6l4.5 3V6L13 9V6l3 2v9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M4 17h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7.2 12.2h.01M10.2 12.2h.01M13.2 12.2h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
};

const DEFAULT_VISUAL: CategoryVisual = {
  boxClassName: "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60",
  icon: (
    <svg {...ICON_PROPS}>
      <rect x="3.5" y="3.5" width="13" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
};

export function getCategoryVisual(name: string): CategoryVisual {
  return CATEGORY_VISUALS[name] ?? DEFAULT_VISUAL;
}
