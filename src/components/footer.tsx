"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContactUsLauncher } from "@/features/contact/components/contact-us-launcher";

const COLUMNS: { header: string; links: { label: string; href: string }[] }[] = [
  {
    header: "About",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Nominate an expert", href: "/nominate-an-expert" },
    ],
  },
  {
    header: "Experts",
    links: [
      { label: "Find an expert", href: "/experts" },
      { label: "Become an expert", href: "/become-an-expert" },
    ],
  },
  {
    header: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Sign up", href: "/signup" },
    ],
  },
];

// Login/signup and the account areas (client/expert dashboard, admin) have
// their own focused chrome — the full marketing footer doesn't belong there,
// but a bare page with nothing at the bottom feels unfinished, so they get
// the simple single-line footer instead.
const SIMPLE_FOOTER_PREFIXES = ["/login", "/signup", "/dashboard", "/admin"];

function SimpleFooter() {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-pivot-line px-6 py-6 text-sm text-pivot-muted">
      <span>© {new Date().getFullYear()} Pivotroom.africa</span>
      <ContactUsLauncher />
    </footer>
  );
}

export function Footer() {
  const pathname = usePathname();
  const useSimpleFooter = SIMPLE_FOOTER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (useSimpleFooter) return <SimpleFooter />;

  return (
    <footer className="mt-auto bg-pivot-paper-2">
      <div className="mx-auto max-w-4xl px-6 pb-8 pt-10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-pivot-line">
          {COLUMNS.map((col) => (
            <div key={col.header} className="flex flex-col items-center text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-pivot-ink">{col.header}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-pivot-muted hover:text-pivot-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col items-center text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-pivot-ink">Support</p>
            <ul className="flex flex-col gap-2.5">
              <li className="text-sm text-pivot-muted [&_button]:text-pivot-muted [&_button]:no-underline [&_button:hover]:text-pivot-ink">
                <ContactUsLauncher />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-pivot-line">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-4 text-xs text-pivot-muted">
          <span>© {new Date().getFullYear()} Pivotroom.africa</span>
          <Link href="/privacy" className="hover:text-pivot-ink">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-pivot-ink">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
