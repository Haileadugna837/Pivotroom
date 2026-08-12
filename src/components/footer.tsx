import Link from "next/link";
import { ContactUsLauncher } from "@/features/contact/components/contact-us-launcher";

export function Footer() {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-6 py-6 text-sm text-black/50 dark:border-white/15 dark:text-white/50">
      <span>© {new Date().getFullYear()} Pivotroom.africa</span>
      <div className="flex items-center gap-4">
        <Link href="/nominate" className="underline">
          Nominate an expert
        </Link>
        <ContactUsLauncher />
      </div>
    </footer>
  );
}
