"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/features/auth/server/actions";
import { getSidebarIcon, MORE_ICON } from "@/components/sidebar-icons";

export type SidebarItem = {
  href: string;
  label: string;
};

function SidebarNav({ items, onNavigate }: { items: SidebarItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-md px-3 py-2 text-sm ${
              active
                ? "bg-black/5 font-medium dark:bg-white/10"
                : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
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
}: {
  title: string;
  items: SidebarItem[];
  children: React.ReactNode;
  /** "bottom" swaps the mobile hamburger+drawer for a sticky bottom tab bar (client/expert account area only — admin keeps the drawer). */
  mobileNav?: "drawer" | "bottom";
  /** Up to 4 hrefs (must exist in `items`) pinned to the bottom bar, in order; everything else is reachable via the trailing "More" tab. */
  primaryHrefs?: string[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const bottomNav = mobileNav === "bottom";
  const itemByHref = new Map(items.map((item) => [item.href, item]));
  const primaryItems = primaryHrefs.map((href) => itemByHref.get(href)).filter((item): item is SidebarItem => Boolean(item));

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
        <nav
          className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-black/10 bg-background px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5 md:hidden dark:border-white/15"
          aria-label={title}
        >
          {primaryItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex flex-1 flex-col items-center gap-1 py-1">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ease-out ${
                    active
                      ? "scale-100 bg-foreground text-background"
                      : "scale-90 text-black/50 dark:text-white/50"
                  }`}
                >
                  {getSidebarIcon(item.href)}
                </span>
                <span className={`text-[11px] ${active ? "font-medium" : "text-black/50 dark:text-white/50"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button type="button" onClick={() => setOpen(true)} className="flex flex-1 flex-col items-center gap-1 py-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-full text-black/50 dark:text-white/50">
              {MORE_ICON}
            </span>
            <span className="text-[11px] text-black/50 dark:text-white/50">More</span>
          </button>
        </nav>
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
            <form action={signOut}>
              <button
                type="submit"
                className="w-full rounded-md px-3 py-2 text-left text-sm text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
              >
                Sign out
              </button>
            </form>
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
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left text-sm text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
          >
            Sign out
          </button>
        </form>
      </aside>

      <main className={`min-w-0 flex-1 ${bottomNav ? "pb-20 md:pb-0" : ""}`}>{children}</main>
    </div>
  );
}
