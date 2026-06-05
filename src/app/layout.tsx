import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import "./globals.css";
import { siteConfig } from "@/config/site";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "recruitment",
    "North Africa",
    "Europe",
    "remote jobs",
    "cross-border hiring",
    "MENA talent",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
