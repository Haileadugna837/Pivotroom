"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/features/auth/server/actions";
import { PivotroomBottomNavigation, type BottomNavItem } from "@/components/pivotroom-bottom-navigation";

export type SidebarItem = {
  href: string;
  label: string;
  /** Optional group label — consecutive items sharing a group get one small
   * uppercase divider before the first of them, instead of a flat list. */
  group?: string;
};

function SidebarNav({ items, onNavigate }: { items: SidebarItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item, index) => {
        const active = pathname === item.href;
        const previousGroup = index > 0 ? items[index - 1].group : undefined;
        const showGroupLabel = Boolean(item.group && item.group !== previousGroup);
        const groupLabelIsFirst = index === 0;
        return (
          <div key={item.href}>
            {showGroupLabel && (
              <p
                className={`mb-1 px-3 text-[11px] font-medium uppercase tracking-wide text-black/35 dark:text-white/35 ${
                  groupLabelIsFirst ? "mt-0" : "mt-4"
                }`}
              >
                {item.group}
              </p>
            )}
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`block rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-black/5 font-medium dark:bg-white/10"
                  : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

export function SidebarLayout({
  title,
  items,
  children,
  mobileNav = "drawer",
  primaryHrefs = [],
  hideStandaloneSignOut = false,
}: {
  title: string;
  items: SidebarItem[];
  children: React.ReactNode;
  /** "bottom" swaps the mobile hamburger+drawer for a sticky bottom tab bar (client/expert account area only — admin keeps the drawer). */
  mobileNav?: "drawer" | "bottom";
  /** Up to 4 hrefs (must exist in `items`) pinned to the bottom bar, in order; everything else is reachable via the trailing "More" tab. */
  primaryHrefs?: string[];
  /** Hides the standalone Sign out button in the drawer/desktop sidebar footer — for when a page in `items` already has its own sign-out action (e.g. "My Account"). */
  hideStandaloneSignOut?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const bottomNav = mobileNav === "bottom";
  const itemByHref = new Map(items.map((item) => [item.href, item]));
  const primaryItems = primaryHrefs.map((href) => itemByHref.get(href)).filter((item): item is SidebarItem => Boolean(item));

  // Bottom bar = primaryItems + a trailing "More" slot — but only when some
  // item isn't already pinned. A plain client account has exactly as many
  // items as fit in the bar, so there's nothing left to hide behind "More";
  // adding it anyway would be a dead tab that opens an empty-of-new-info drawer.
  const hasOverflowItems = items.length > primaryItems.length;
  const bottomNavItems: BottomNavItem[] = hasOverflowItems
    ? [...primaryItems.map((item) => ({ key: item.href, label: item.label, href: item.href })), { key: "more", label: "More", href: null }]
    : primaryItems.map((item) => ({ key: item.href, label: item.label, href: item.href }));
  const primaryActive = primaryItems.find((item) => item.href === pathname);
  const isOverflowActive = !primaryActive && items.some((item) => item.href === pathname);
  const activeKey = primaryActive ? primaryActive.href : isOverflowActive ? "more" : "";

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      {/* Mobile top bar (drawer mode only — bottom-nav mode relies on the global header for context) */}
      {!bottomNav && (
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 md:hidden dark:border-white/15">
          <span className="text-sm font-medium">{title}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-md border border-black/10 p-2 dark:border-white/15"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile sticky bottom tab bar */}
      {bottomNav && (
        <PivotroomBottomNavigation items={bottomNavItems} activeKey={activeKey} onSelectOverflow={() => setOpen(true)} />
      )}

      {/* Mobile drawer + backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col justify-between bg-background px-3 py-6">
            <div>
              <div className="mb-4 flex items-center justify-between px-3">
                <p className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
                  {title}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="text-black/50 dark:text-white/50"
                >
                  ✕
                </button>
              </div>
              <SidebarNav items={items} onNavigate={() => setOpen(false)} />
            </div>
            {!hideStandaloneSignOut && (
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                >
                  Sign out
                </button>
              </form>
            )}
          </aside>
        </div>
      )}

      {/* Static desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col justify-between border-r border-black/10 px-3 py-6 md:flex dark:border-white/15">
        <div>
          <p className="mb-4 px-3 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
            {title}
          </p>
          <SidebarNav items={items} />
        </div>
        {!hideStandaloneSignOut && (
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
            >
              Sign out
            </button>
          </form>
        )}
      </aside>

      <main className={`min-w-0 flex-1 ${bottomNav ? "pb-16 md:pb-0" : ""}`}>{children}</main>
    </div>
  );
}
