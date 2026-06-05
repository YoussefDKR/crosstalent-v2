import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CONTACT_PUBLIC_EMAIL } from "@/config/contact";
import { siteConfig } from "@/config/site";

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
            Send a message and we&apos;ll reply to your email. You can also reach
            us at{" "}
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
              <p className="font-semibold text-[#0F172A]">Send a message</p>
              <p className="text-sm text-muted-foreground">
                Employers, candidates, and partners welcome.
              </p>
            </div>
          </div>
          <ContactForm />
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={siteConfig.links.login}
            className="font-medium text-[#2563EB] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
