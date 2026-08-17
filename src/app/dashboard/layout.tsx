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
    { href: "/dashboard", label: "My Bookings", group: "Account" },
    { href: "/dashboard/wishlist", label: "Wishlist", group: "Account" },
    { href: "/dashboard/nominations", label: "Nominations", group: "Account" },
  ];

  if (expertProfile?.status === "approved") {
    items.push(
      { href: "/dashboard/expert/bookings", label: "Expert Bookings", group: "Expert" },
      { href: "/dashboard/expert/availability", label: "Availability", group: "Expert" },
      { href: "/dashboard/expert/payments", label: "Payments", group: "Expert" },
      { href: "/dashboard/expert/profile", label: "Expert Profile", group: "Expert" },
    );
  } else if (expertProfile) {
    // Has an expert row but not yet approved (pending/rejected/suspended) —
    // let them view/manage their existing application. There's no open
    // self-serve "Become an Expert" entry point anymore; new applications
    // only start from an admin-sent invite link (see /become-an-expert).
    items.push({ href: "/dashboard/expert/profile", label: "Expert Application", group: "Expert" });
  }

  items.push({ href: "/dashboard/settings", label: "My Account" });

  if (isAdminEmail(user.email)) {
    items.push({ href: "/admin", label: "Admin" });
  }

  // Bottom tab bar (mobile only) pins the 4 most likely-to-be-used
  // destinations: bookings and wishlist are relevant to every account,
  // the third slot adapts to whichever task is actually primary for this
  // person (managing incoming sessions for an approved expert vs.
  // nominating someone as a plain client), and My Account rounds it out.
  // A plain client account has exactly these 4 items total, so the bar shows
  // no "More" tab at all (SidebarLayout omits it once nothing is left over).
  // Everything beyond these 4 — availability, payments, expert profile,
  // nominations for experts, admin — stays one tap away behind "More" only
  // for accounts that actually have that overflow (experts/admins).
  const primaryHrefs = [
    "/dashboard",
    "/dashboard/wishlist",
    expertProfile?.status === "approved" ? "/dashboard/expert/bookings" : "/dashboard/nominations",
    "/dashboard/settings",
  ];

  return (
    <SidebarLayout title="Account" items={items} mobileNav="bottom" primaryHrefs={primaryHrefs} hideStandaloneSignOut>
      {children}
    </SidebarLayout>
  );
}
