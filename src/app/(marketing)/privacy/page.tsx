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
              email, password (stored securely by our auth provider), role
              (candidate or employer), and profile photo if you upload one.
            </p>
            <p>
              <strong className="text-[#0F172A]">Candidate profiles:</strong> CV,
              skills, languages, work history, location, and other details you
              choose to add.
            </p>
            <p>
              <strong className="text-[#0F172A]">Employer data:</strong> company
              name, logo, job posts, billing status, and messages with
              candidates.
            </p>
            <p>
              <strong className="text-[#0F172A]">Usage data:</strong> basic
              technical logs (IP address, browser type, pages visited) collected
              by our hosting provider to keep the service secure and running.
            </p>
            <p>
              <strong className="text-[#0F172A]">Contact form:</strong> the email
              and message you send via our contact page.
            </p>
          </Section>

          <Section title="How we use your information">
            <ul className="list-disc space-y-2 pl-5">
              <li>Create and manage your account</li>
              <li>Show job listings and candidate profiles to the right users</li>
              <li>Let employers and candidates message each other</li>
              <li>Process job applications</li>
              <li>Handle subscriptions and trials (employers)</li>
              <li>Respond to support and contact requests</li>
              <li>Improve security and prevent abuse</li>
            </ul>
            <p>We do not sell your personal data.</p>
          </Section>

          <Section title="Third-party services">
            <p>We use trusted providers to run CrossTalent:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-[#0F172A]">Supabase</strong> — accounts,
                database, and file storage
              </li>
              <li>
                <strong className="text-[#0F172A]">Vercel</strong> — website
                hosting
              </li>
              <li>
                <strong className="text-[#0F172A]">Google</strong> — optional
                sign-in (only if you choose it)
              </li>
              <li>
                <strong className="text-[#0F172A]">Stripe</strong> — employer
                payments (when enabled)
              </li>
              <li>
                <strong className="text-[#0F172A]">Resend</strong> — contact
                form emails
              </li>
            </ul>
            <p>
              Each provider processes data under their own privacy policies and
              our instructions.
            </p>
          </Section>

          <Section title="What employers and candidates can see">
            <p>
              Published job posts are visible on our public job board. Employer
              company profiles are shown on listings. Candidate profiles are
              visible to employers with an active trial or subscription.
              Messages are only visible to the people in the conversation.
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
              service. We do not use advertising cookies. Session cookies are
              managed through our authentication system.
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
