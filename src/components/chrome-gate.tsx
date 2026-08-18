"use client";

import { usePathname } from "next/navigation";

// Hides its children (the global Header/Footer) on paths where a page
// renders its own chrome instead — currently just the acquisition landing
// page when it's toggled on at "/". Header is a server component so it
// can't check the pathname itself; this client wrapper does it once, high
// up in the tree, rather than threading the toggle down into Header/Footer.
export function ChromeGate({ hideOn, children }: { hideOn: string[]; children: React.ReactNode }) {
  const pathname = usePathname();
  if (hideOn.includes(pathname)) return null;
  return <>{children}</>;
}
