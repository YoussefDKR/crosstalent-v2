import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_PUBLIC_EMAIL } from "@/config/contact";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using CrossTalent",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  const updated = "June 5, 2026";

  return (
    <div className="bg-slate-50/50 py-12 sm:py-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {updated}
          </p>
          <p className="mt-4 text-muted-foreground">
            These terms govern your use of {siteConfig.name} ({siteConfig.url}).
            By creating an account or using the platform, you agree to them.
          </p>
        </header>

        <div className="space-y-10 rounded-2xl border border-border/80 bg-white p-6 shadow-sm sm:p-10">
          <Section title="The service">
            <p>
              CrossTalent is a recruitment platform that helps job seekers and
              employers connect across North Africa and Europe. We provide
              profiles, job listings, applications, and messaging tools. We may
              update or discontinue features from time to time.
            </p>
          </Section>

          <Section title="Who can use CrossTalent">
            <p>
              You must be at least 16 years old and able to enter a binding
              agreement. Employers must have authority to act on behalf of their
              organisation. You are responsible for keeping your login details
              secure and for activity on your account.
            </p>
          </Section>

          <Section title="Your account and content">
            <p>
              You agree to provide accurate information and to keep your profile
              up to date. You retain ownership of content you upload, such as
              CVs, job posts, and messages. You grant us a limited licence to
              host, display, and share that content as needed to operate the
              platform — for example, showing a job post on the board or sharing
              a candidate profile with an employer you apply to.
            </p>
            <p>
              You must not upload unlawful, misleading, discriminatory, or
              infringing content. You must not impersonate others or misuse
              contact details obtained through the platform.
            </p>
          </Section>

          <Section title="Employer plans and payments">
            <p>
              Some employer features require a paid plan or promotional access
              period. Prices and limits are shown on our pricing page. Paid
              subscriptions renew according to the plan you choose until you
              cancel. Fees are generally non-refundable except where required by
              law.
            </p>
            <p>
              We may change pricing or plan features with reasonable notice.
              Continued use after a change constitutes acceptance of the new
              terms for billing.
            </p>
          </Section>

          <Section title="Acceptable use">
            <ul className="list-disc space-y-2 pl-5">
              <li>Use CrossTalent only for lawful hiring and job-seeking purposes</li>
              <li>Do not scrape, spam, harass, or attempt to bypass access controls</li>
              <li>Do not introduce malware or interfere with the service</li>
              <li>Respect other users&apos; privacy and applicable employment laws</li>
            </ul>
            <p>
              We may suspend or terminate accounts that violate these rules or
              pose a risk to other users or the platform.
            </p>
          </Section>

          <Section title="No employment guarantee">
            <p>
              CrossTalent is a marketplace, not an employer, recruiter of record,
              or legal advisor. We do not guarantee interviews, offers, hires, or
              candidate quality. Hiring decisions and compliance with labour and
              immigration rules remain solely between employers and candidates.
            </p>
          </Section>

          <Section title="Third-party links and sign-in">
            <p>
              The platform may link to external sites or let you sign in through
              a third-party account provider. Those services are governed by
              their own terms and policies. We are not responsible for
              third-party websites or services.
            </p>
          </Section>

          <Section title="Disclaimer">
            <p>
              CrossTalent is provided &quot;as is&quot; and &quot;as available&quot; to the
              extent permitted by law. We do not warrant uninterrupted or
              error-free operation. Our liability is limited to the maximum
              extent allowed by applicable law.
            </p>
          </Section>

          <Section title="Termination">
            <p>
              You may delete your account at any time from your settings. We
              may suspend or end access if you breach these terms or if we stop
              offering the service in your region. Sections that by nature
              should survive termination will continue to apply.
            </p>
          </Section>

          <Section title="Privacy">
            <p>
              Our{" "}
              <Link
                href={siteConfig.links.privacy}
                className="font-medium text-[#2563EB] hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              explains how we handle personal data. It forms part of these
              terms.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              These terms are governed by the laws of the European Union member
              state from which CrossTalent operates, without regard to conflict
              of law rules. Disputes should first be raised with us at{" "}
              <a
                href={`mailto:${CONTACT_PUBLIC_EMAIL}`}
                className="font-medium text-[#2563EB] hover:underline"
              >
                {CONTACT_PUBLIC_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We may update these terms from time to time. We will post the new
              version on this page and update the date above. Material changes
              may also be communicated by email or in-product notice where
              appropriate.
            </p>
          </Section>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Questions?{" "}
          <Link
            href={siteConfig.links.contact}
            className="font-medium text-[#2563EB] hover:underline"
          >
            Contact us
          </Link>
        </p>
      </article>
    </div>
  );
}
