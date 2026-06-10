import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CONTACT_PUBLIC_EMAIL } from "@/config/contact";
import { siteConfig } from "@/config/site";
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
    <div className="bg-slate-50/50 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            {t("contact.pageTitle")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("contact.pageSubtitle")}{" "}
            <a
              href={`mailto:${CONTACT_PUBLIC_EMAIL}`}
              className="font-medium text-[#2563EB] hover:underline"
            >
              {CONTACT_PUBLIC_EMAIL}
            </a>
            .
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-border/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <Mail className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-[#0F172A]">{t("contact.sendMessage")}</p>
              <p className="text-sm text-muted-foreground">
                {t("contact.sendMessageDesc")}
              </p>
            </div>
          </div>
          <ContactForm />
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("contact.hasAccount")}{" "}
          <Link
            href={siteConfig.links.login}
            className="font-medium text-[#2563EB] hover:underline"
          >
            {t("common.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
