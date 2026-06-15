"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { MarketingReveal } from "@/components/marketing/marketing-reveal";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/context/i18n-provider";

export function ContactPageContent() {
  const { t } = useI18n();

  return (
    <div className="bg-slate-50/80 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <MarketingReveal>
          <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
                <Mail className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-[#0F172A]">
                  {t("contact.sendMessage")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("contact.sendMessageDesc")}
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </MarketingReveal>

        <MarketingReveal className="mt-8 text-center text-sm text-muted-foreground" delay={0.12}>
          {t("contact.hasAccount")}{" "}
          <Link href={siteConfig.links.login} className="link-brand">
            {t("common.signIn")}
          </Link>
        </MarketingReveal>
      </div>
    </div>
  );
}
