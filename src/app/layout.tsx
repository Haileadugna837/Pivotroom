import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, DM_Sans } from "next/font/google";
import { getUser } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { Header } from "@/features/auth/components/header";
import { Footer } from "@/components/footer";
import { PostHogIdentify } from "@/components/posthog-identify";
import { ChromeGate } from "@/components/chrome-gate";
import { getAcquisitionLandingEnabled } from "@/features/marketing/server/queries";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pivotroom.africa — Book time with African experts",
    template: "%s | Pivotroom.africa",
  },
  description: "Book 1:1 sessions with vetted African experts across every field.",
  openGraph: {
    siteName: "Pivotroom.africa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [user, acquisitionEnabled] = await Promise.all([getUser(), getAcquisitionLandingEnabled()]);
  const hideChromeOn = acquisitionEnabled ? ["/"] : [];

  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${instrumentSerif.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-dm-sans">
        <PostHogIdentify
          user={user ? { id: user.id, email: user.email ?? "", isAdmin: isAdminEmail(user.email) } : null}
        />
        <ChromeGate hideOn={hideChromeOn}>
          <Header />
        </ChromeGate>
        {children}
        <ChromeGate hideOn={hideChromeOn}>
          <Footer />
        </ChromeGate>
      </body>
    </html>
  );
}
