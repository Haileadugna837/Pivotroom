import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { SidebarLayout, type SidebarItem } from "@/components/sidebar";

export const metadata: Metadata = {
  title: { template: "%s | Admin", default: "Admin" },
  robots: { index: false, follow: false },
};

const items: SidebarItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/experts", label: "Experts" },
  { href: "/admin/invites", label: "Expert Invites" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/nominees", label: "Nominations" },
  { href: "/admin/expert-demand", label: "Expert Demand" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/ngos", label: "NGOs" },
  { href: "/admin/audit-log", label: "Audit Log" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/dashboard", label: "My Account" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user || !isAdminEmail(user.email)) redirect("/");

  return (
    <SidebarLayout title="Admin" items={items}>
      {children}
    </SidebarLayout>
  );
}
