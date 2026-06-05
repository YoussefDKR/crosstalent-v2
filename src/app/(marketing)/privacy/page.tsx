import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_PUBLIC_EMAIL } from "@/config/contact";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CrossTalent collects, uses, and protects your data",
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

export default function PrivacyPage() {
  const updated = "June 5, 2026";

  return (
    <div className="bg-slate-50/50 py-12 sm:py-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {updated}
          </p>
          <p className="mt-4 text-muted-foreground">
            {siteConfig.name} ({siteConfig.url}) connects job seekers and
            employers across North Africa and Europe. This policy explains what
            we collect and how we use it.
          </p>
        </header>

        <div className="space-y-10 rounded-2xl border border-border/80 bg-white p-6 shadow-sm sm:p-10">
          <Section title="Who we are">
            <p>
              CrossTalent is operated from the European Union. For privacy
              questions, contact us at{" "}
              <a
                href={`mailto:${CONTACT_PUBLIC_EMAIL}`}
                className="font-medium text-[#2563EB] hover:underline"
              >
                {CONTACT_PUBLIC_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="Information we collect">
            <p>
              <strong className="text-[#0F172A]">Account data:</strong> name,
              email, login credentials, account type, and profile photo if you
              upload one.
            </p>
            <p>
              <strong className="text-[#0F172A]">Profile data:</strong> CV,
              skills, languages, work history, location, and other details you
              choose to add to your profile.
            </p>
            <p>
              <strong className="text-[#0F172A]">Employer data:</strong> company
              name, logo, job posts, and messages with other users.
            </p>
            <p>
              <strong className="text-[#0F172A]">Usage data:</strong> basic
              technical information such as IP address, browser type, and pages
              visited, used to keep the service secure and running.
            </p>
            <p>
              <strong className="text-[#0F172A]">Communications:</strong> emails
              and messages you send us through our contact or support channels.
            </p>
          </Section>

          <Section title="How we use your information">
            <ul className="list-disc space-y-2 pl-5">
              <li>Create and manage your account</li>
              <li>Show job listings and candidate profiles to the right users</li>
              <li>Let employers and candidates message each other</li>
              <li>Process job applications</li>
              <li>Manage paid plans and account access</li>
              <li>Respond to support and contact requests</li>
              <li>Improve security and prevent abuse</li>
            </ul>
            <p>We do not sell your personal data.</p>
          </Section>

          <Section title="Third-party services">
            <p>
              We work with trusted service providers who help us operate the
              platform. Depending on how you use CrossTalent, your data may be
              processed by partners that provide:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Website hosting and infrastructure</li>
              <li>Account sign-in and authentication</li>
              <li>Secure payment processing</li>
              <li>Email and notification delivery</li>
              <li>File storage for uploads such as CVs and logos</li>
            </ul>
            <p>
              These partners only receive the information needed to perform
              their services and are required to protect it. They may have their
              own privacy policies, which we encourage you to review.
            </p>
          </Section>

          <Section title="Who can see your information">
            <p>
              Job listings and company profiles you publish may be visible on
              our public job board. Profile information is shared with other
              users only as needed for the platform to work — for example, when
              employers browse talent or candidates apply to roles. Private
              messages are only visible to the people in that conversation.
            </p>
          </Section>

          <Section title="How long we keep data">
            <p>
              We keep your account data while your account is active. If you
              delete your account or ask us to remove your data, we will delete
              or anonymise it within a reasonable period, except where we must
              keep records for legal or billing reasons.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              Depending on where you live (including the EU/EEA under GDPR), you
              may have the right to access, correct, delete, or export your
              data, and to object to or restrict certain processing. To exercise
              these rights, email{" "}
              <a
                href={`mailto:${CONTACT_PUBLIC_EMAIL}`}
                className="font-medium text-[#2563EB] hover:underline"
              >
                {CONTACT_PUBLIC_EMAIL}
              </a>
              .
            </p>
            <p>
              You may also lodge a complaint with your local data protection
              authority.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              We use essential cookies to keep you signed in and to protect the
              service. We do not use advertising cookies.
            </p>
          </Section>

          <Section title="Children">
            <p>
              CrossTalent is not intended for users under 16. We do not
              knowingly collect data from children.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We may update this policy from time to time. We will post the new
              version on this page and update the date above.
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
