import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalIntro,
  PrivacyDocument,
} from "@/components/legal/legal-prose";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { CONTACT_PUBLIC_EMAIL } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getServerI18n();
  const doc = messages.legal.privacy;
  return {
    title: doc.metaTitle,
    description: doc.metaDescription,
  };
}

export default async function PrivacyPage() {
  const { messages } = await getServerI18n();
  const doc = messages.legal.privacy;
  const vars = {
    name: siteConfig.name,
    url: siteConfig.url,
    email: CONTACT_PUBLIC_EMAIL,
  };

  return (
    <>
      <MarketingPageHero
        align="center"
        title={doc.title}
        subtitle={
          <>
            {doc.lastUpdatedLabel} {doc.updatedDate}
          </>
        }
      />

      <div className="bg-slate-50/80 py-12 sm:py-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <LegalIntro text={doc.intro} vars={vars} />

          <div className="mt-10 space-y-10 rounded-2xl border border-border/80 bg-white p-6 shadow-sm sm:p-10">
            <PrivacyDocument doc={doc} vars={vars} />
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {doc.questions}{" "}
            <Link
              href={siteConfig.links.contact}
              className="font-medium text-[#2563EB] hover:underline"
            >
              {doc.contactUs}
            </Link>
          </p>
        </article>
      </div>
    </>
  );
}
