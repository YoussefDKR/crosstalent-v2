import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/site";

const CONTACT_EMAIL = "hello@crosstalent.io";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the CrossTalent team",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50/50 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Contact us
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions about pricing, partnerships, or getting started? We&apos;re
            happy to help.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-start gap-4 rounded-2xl border border-border/80 bg-white p-6 shadow-sm transition-colors hover:border-[#2563EB]/30"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <Mail className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-[#0F172A]">Email</p>
              <p className="mt-1 text-sm text-muted-foreground">
                For employers, candidates, and general enquiries.
              </p>
              <p className="mt-2 font-medium text-[#2563EB]">{CONTACT_EMAIL}</p>
            </div>
          </a>

          <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                <MessageSquare className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-[#0F172A]">Already signed up?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Employers can manage billing and trials from the dashboard.
                  Candidates can update their profile anytime.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link
                    href={siteConfig.links.login}
                    className="font-medium text-[#2563EB] hover:underline"
                  >
                    Sign in
                  </Link>
                  <Link
                    href={siteConfig.links.pricing}
                    className="font-medium text-[#2563EB] hover:underline"
                  >
                    View pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          We typically reply within one business day.
        </p>
      </div>
    </div>
  );
}
