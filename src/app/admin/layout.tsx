import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { SidebarLayout, type SidebarItem } from "@/components/sidebar";

const items: SidebarItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/experts", label: "Experts" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/ngos", label: "NGOs" },
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
    <SidebarLayout title="Admin" items={items}>
      {children}
    </SidebarLayout>
  );
}
