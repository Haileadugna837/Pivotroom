"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/features/auth/server/actions";

export type SidebarItem = {
  href: string;
  label: string;
};

export function Sidebar({ title, items }: { title: string; items: SidebarItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-black/10 px-3 py-6 dark:border-white/15">
      <div>
        <p className="mb-4 px-3 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
          {title}
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
  );
}
