"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
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

function iconFor(item: BottomNavItem): LucideIcon {
  if (!item.href) return MoreHorizontal;
  return ICON_BY_HREF[item.href] ?? Circle;
}

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];
const MORPH: Transition = { duration: 0.3, ease: EASE };
const MORPH_REDUCED: Transition = { duration: 0.12, ease: "linear" };

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
  const Icon = iconFor(item);

  const inner = (
    <motion.div
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.12 }}
      className="flex flex-1 flex-col items-center justify-end gap-1 pb-1"
    >
      <motion.div
        animate={{ y: active ? -8 : 0 }}
        transition={transition}
        className="relative flex min-h-12 items-center justify-center"
      >
        {active && (
          <motion.span
            layoutId="pivotroom-active-navigation"
            transition={transition}
            className="absolute inset-0 rounded-full bg-foreground"
          />
        )}
        <span
          className={`relative z-10 flex min-h-12 items-center gap-2 rounded-full px-4 ${
            active ? "text-background" : "text-black/50 dark:text-white/50"
          }`}
        >
          <motion.span
            animate={{ scale: active ? [1, 1.06, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center"
          >
            <Icon size={active ? 22 : 23} strokeWidth={1.8} aria-hidden="true" />
          </motion.span>
          <AnimatePresence initial={false}>
            {active && (
              <motion.span
                key="label"
                initial={{ opacity: 0, width: 0, x: -5 }}
                animate={{ opacity: 1, width: "auto", x: 0 }}
                exit={{ opacity: 0, width: 0, x: -5 }}
                transition={transition}
                className="overflow-hidden whitespace-nowrap text-[13px] font-medium"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.div>
      {!active && (
        <span className="text-[13px] font-normal text-black/50 dark:text-white/50">{item.label}</span>
      )}
    </motion.div>
  );

  const sharedProps = {
    "aria-label": item.label,
    "aria-current": active ? ("page" as const) : undefined,
    className: "flex flex-1 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
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
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around rounded-t-3xl border-t border-black/10 bg-background px-1 pt-3 shadow-[0_-6px_20px_rgba(0,0,0,0.025)] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden dark:border-white/15"
    >
      {items.map((item) => (
        <NavButton key={item.key} item={item} active={item.key === activeKey} onSelectOverflow={onSelectOverflow} />
      ))}
    </nav>
  );
}
