import Link from "next/link";
import { ContactUsLauncher } from "@/features/contact/components/contact-us-launcher";

const COLUMNS: { header: string; links: { label: string; href: string }[] }[] = [
  {
    header: "About",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Nominate an expert", href: "/nominate" },
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
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Accent strip + logo badge straddling it and the band below */}
      <div className="relative h-1.5 bg-foreground">
        <div className="absolute left-1/2 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background ring-4 ring-background">
          P
        </div>
      </div>

      <div className="bg-black/[0.02] dark:bg-white/[0.03]">
        <div className="mx-auto max-w-4xl px-6 pb-8 pt-10">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-black/10 dark:sm:divide-white/15">
            {COLUMNS.map((col) => (
              <div key={col.header} className="flex flex-col items-center text-center">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider">{col.header}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-col items-center text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider">Support</p>
              <ul className="flex flex-col gap-2.5">
                <li className="text-sm text-black/60 [&_button]:text-black/60 [&_button]:no-underline [&_button:hover]:text-black dark:text-white/60 dark:[&_button]:text-white/60 dark:[&_button:hover]:text-white">
                  <ContactUsLauncher />
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 dark:border-white/15">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-4 text-xs text-black/50 dark:text-white/50">
            <span>© {new Date().getFullYear()} Pivotroom.africa</span>
            <Link href="/privacy" className="hover:text-black dark:hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-black dark:hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
