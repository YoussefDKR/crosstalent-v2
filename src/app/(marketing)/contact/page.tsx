import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/contact-page-content";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { CONTACT_PUBLIC_EMAIL } from "@/config/contact";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("footer.contact"),
    description: t("contact.pageSubtitle"),
  };
}

export default async function ContactPage() {
  const { t } = await getServerI18n();

  return (
    <>
      <MarketingPageHero
        align="center"
        title={t("contact.pageTitle")}
        subtitle={
          <>
            {t("contact.pageSubtitle")}{" "}
            <a
              href={`mailto:${CONTACT_PUBLIC_EMAIL}`}
              className="font-medium text-[#60A5FA] hover:underline"
            >
              {CONTACT_PUBLIC_EMAIL}
            </a>
            .
          </>
        }
      />

      <ContactPageContent />
    </>
  );
}
