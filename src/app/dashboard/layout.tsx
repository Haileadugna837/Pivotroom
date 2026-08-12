import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { getMyExpertProfile } from "@/features/experts/server/self";
import { SidebarLayout, type SidebarItem } from "@/components/sidebar";

export const metadata: Metadata = {
  title: { template: "%s | My Account", default: "My Account" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user) redirect("/login");

  const expertProfile = await getMyExpertProfile(user.id);

  const items: SidebarItem[] = [
    { href: "/dashboard", label: "My Bookings" },
    { href: "/dashboard/wishlist", label: "Wishlist" },
    { href: "/dashboard/nominations", label: "Nominations" },
  ];

  if (expertProfile?.status === "approved") {
    items.push(
      { href: "/dashboard/expert/bookings", label: "Expert Bookings" },
      { href: "/dashboard/expert/availability", label: "Availability" },
      { href: "/dashboard/expert/payments", label: "Payments" },
      { href: "/dashboard/expert/profile", label: "Expert Profile" },
    );
  } else if (expertProfile) {
    // Has an expert row but not yet approved (pending/rejected/suspended) —
    // let them view/manage their existing application. There's no open
    // self-serve "Become an Expert" entry point anymore; new applications
    // only start from an admin-sent invite link (see /become-an-expert).
    items.push({ href: "/dashboard/expert/profile", label: "Expert Application" });
  }

  items.push({ href: "/dashboard/settings", label: "Settings" });

  if (isAdminEmail(user.email)) {
    items.push({ href: "/admin", label: "Admin" });
  }

  return (
    <SidebarLayout title="Account" items={items}>
      {children}
    </SidebarLayout>
  );
}
