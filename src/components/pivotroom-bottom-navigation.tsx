"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Heart,
  Star,
  Settings as SettingsIcon,
  MoreHorizontal,
  CalendarCheck,
  Clock,
  Wallet,
  UserRound,
  ShieldCheck,
  Circle,
} from "lucide-react";

export type BottomNavItem = {
  key: string;
  label: string;
  /** null marks the overflow trigger ("More") — it opens the drawer instead of navigating. */
  href: string | null;
};

const ICON_BY_HREF: Record<string, LucideIcon> = {
  "/dashboard": Home,
  "/dashboard/wishlist": Heart,
  "/dashboard/nominations": Star,
  "/dashboard/expert/bookings": CalendarCheck,
  "/dashboard/expert/availability": Clock,
  "/dashboard/expert/payments": Wallet,
  "/dashboard/expert/profile": UserRound,
  "/dashboard/settings": SettingsIcon,
  "/admin": ShieldCheck,
};

// Returns a rendered icon node rather than a component reference — keeps the
// "resolve which icon" logic out of NavButton's render body so no capitalized
// binding is created there on every render.
function renderNavIcon(item: BottomNavItem, size: number) {
  const IconComponent: LucideIcon = item.href ? (ICON_BY_HREF[item.href] ?? Circle) : MoreHorizontal;
  return <IconComponent size={size} strokeWidth={1.8} aria-hidden="true" />;
}

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];
const MORPH: Transition = { duration: 0.3, ease: EASE };
const MORPH_REDUCED: Transition = { duration: 0.12, ease: "linear" };

// Icon-only tabs — labels are still passed through for aria-label/aria-current
// (and the drawer's own text list) but never rendered visually here, so the
// bar stays compact instead of "Wishlist / Nominations / Settings / More"
// crowding a phone-width row.
function NavButton({
  item,
  active,
  onSelectOverflow,
}: {
  item: BottomNavItem;
  active: boolean;
  onSelectOverflow: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? MORPH_REDUCED : MORPH;

  const inner = (
    <motion.div whileTap={{ scale: 0.94 }} transition={{ duration: 0.12 }} className="flex flex-1 items-center justify-center py-2">
      <motion.div animate={{ y: active ? -8 : 0 }} transition={transition} className="relative flex h-12 w-12 items-center justify-center">
        {active && (
          <motion.span
            layoutId="pivotroom-active-navigation"
            transition={transition}
            className="absolute inset-0 rounded-full bg-foreground"
          />
        )}
        <motion.span
          animate={{ scale: active ? [1, 1.06, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className={`relative z-10 flex items-center justify-center ${
            active ? "text-background" : "text-black/50 dark:text-white/50"
          }`}
        >
          {renderNavIcon(item, active ? 22 : 23)}
        </motion.span>
      </motion.div>
    </motion.div>
  );

  const sharedProps = {
    "aria-label": item.label,
    "aria-current": active ? ("page" as const) : undefined,
    className:
      "flex flex-1 items-center justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
  };

  if (item.href) {
    return (
      <Link href={item.href} {...sharedProps}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onSelectOverflow} {...sharedProps}>
      {inner}
    </button>
  );
}

export function PivotroomBottomNavigation({
  items,
  activeKey,
  onSelectOverflow,
}: {
  items: BottomNavItem[];
  activeKey: string;
  onSelectOverflow: () => void;
}) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around rounded-t-3xl border-t border-black/10 bg-background px-1 pt-2.5 shadow-[0_-6px_20px_rgba(0,0,0,0.025)] pb-[max(0.625rem,env(safe-area-inset-bottom))] md:hidden dark:border-white/15"
    >
      {items.map((item) => (
        <NavButton key={item.key} item={item} active={item.key === activeKey} onSelectOverflow={onSelectOverflow} />
      ))}
    </nav>
  );
}
