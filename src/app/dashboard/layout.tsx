import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { getMyExpertProfile } from "@/features/experts/server/self";
import { SidebarLayout, type SidebarItem } from "@/components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const expertProfile = await getMyExpertProfile(user.id);

  const items: SidebarItem[] = [{ href: "/dashboard", label: "My Bookings" }];

  if (expertProfile?.status === "approved") {
    items.push(
      { href: "/dashboard/expert/bookings", label: "Expert Bookings" },
      { href: "/dashboard/expert/availability", label: "Availability" },
      { href: "/dashboard/expert/payments", label: "Payments" },
      { href: "/dashboard/expert/profile", label: "Expert Profile" },
    );
  } else {
    items.push({ href: "/dashboard/expert/profile", label: "Become an Expert" });
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
