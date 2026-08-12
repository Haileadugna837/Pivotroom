import { ContactUsLauncher } from "@/features/contact/components/contact-us-launcher";

export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-black/10 px-6 py-6 text-sm text-black/50 dark:border-white/15 dark:text-white/50">
      <span>© {new Date().getFullYear()} Pivotroom.africa</span>
      <ContactUsLauncher />
    </footer>
  );
}
