import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from "next/font/google";
import { VisitTracker } from "@/components/analytics/visit-tracker";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { I18nProvider } from "@/context/i18n-provider";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { localeDirection, type Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/get-locale";
import { getMessages } from "@/i18n/get-messages";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
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
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.description}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [{ url: "/images/logo-icon.png", type: "image/png" }],
    apple: [{ url: "/images/logo-icon.png", type: "image/png" }],
  },
};

function bodyFontClass(locale: Locale): string {
  return locale === "ar" ? "font-arabic" : "font-sans";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const dir = localeDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={cn(plusJakarta.variable, ibmPlexArabic.variable)}
    >
      <body className={cn("min-h-screen antialiased", bodyFontClass(locale))}>
        <I18nProvider locale={locale} messages={messages}>
          {children}
          <VisitTracker />
          <CookieConsentBanner />
        </I18nProvider>
      </body>
    </html>
  );
}
