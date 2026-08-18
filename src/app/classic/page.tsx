import type { Metadata } from "next";
import { ClassicHomepage } from "@/features/marketing/components/classic-homepage";

// Always renders the pre-Phase-1-acquisition marketplace homepage,
// regardless of site_settings.acquisition_landing_enabled — so the classic
// homepage stays reachable/editable/QA-able even while the new acquisition
// landing page is live at "/". Not indexed since it's a working preview of
// the same content "/" already shows whenever the toggle is off.
export const metadata: Metadata = {
  title: "Classic homepage",
  robots: { index: false, follow: false },
};

export default async function ClassicHomepagePage() {
  return <ClassicHomepage />;
}
