import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { Sidebar, type SidebarItem } from "@/components/sidebar";

const items: SidebarItem[] = [
  { href: "/admin", label: "Pending Experts" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/dashboard", label: "My Account" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) redirect("/");

  return (
    <div className="flex flex-1">
      <Sidebar title="Admin" items={items} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
