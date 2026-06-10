import Link from "next/link";
import type { PrivacyMessages } from "@/i18n/dictionaries/legal/privacy/en";
import type { TermsMessages } from "@/i18n/dictionaries/legal/terms/en";
import { siteConfig } from "@/config/site";

type LegalVars = {
  name: string;
  url: string;
  email: string;
};

function interpolate(text: string, vars: LegalVars): string {
  return text
    .replace(/\{name\}/g, vars.name)
    .replace(/\{url\}/g, vars.url)
    .replace(/\{email\}/g, vars.email);
}

function LegalParagraph({
  text,
  vars,
}: {
  text: string;
  vars: LegalVars;
}) {
  if (!text.includes("{email}")) {
    return <p>{interpolate(text, vars)}</p>;
  }

  const [before, after] = text.split("{email}");

  return (
    <p>
      {interpolate(before, vars)}
      <a
        href={`mailto:${vars.email}`}
        className="font-medium text-[#2563EB] hover:underline"
      >
        {vars.email}
      </a>
      {interpolate(after, vars)}
    </p>
  );
}

function LegalSection({
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

type PrivacySection = PrivacyMessages["sections"][number];
type TermsSection = TermsMessages["sections"][number];

function PrivacySectionBody({
  section,
  vars,
}: {
  section: PrivacySection;
  vars: LegalVars;
}) {
  return (
    <>
      {"paragraphs" in section &&
        section.paragraphs?.map((paragraph) => (
          <LegalParagraph key={paragraph} text={paragraph} vars={vars} />
        ))}
      {"items" in section &&
        section.items?.map((item) => (
          <p key={item.label}>
            <strong className="text-[#0F172A]">{item.label}</strong> {item.text}
          </p>
        ))}
      {"list" in section && section.list && section.list.length > 0 && (
        <ul className="list-disc space-y-2 pl-5">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {"paragraphsAfter" in section &&
        section.paragraphsAfter?.map((paragraph) => (
          <LegalParagraph key={paragraph} text={paragraph} vars={vars} />
        ))}
    </>
  );
}

function TermsSectionBody({
  section,
  vars,
  privacyLinkLabel,
}: {
  section: TermsSection;
  vars: LegalVars;
  privacyLinkLabel: string;
}) {
  if ("privacyLink" in section && section.privacyLink) {
    return (
      <p>
        {section.privacyLink.before}
        <Link
          href={siteConfig.links.privacy}
          className="font-medium text-[#2563EB] hover:underline"
        >
          {privacyLinkLabel}
        </Link>
        {section.privacyLink.after}
      </p>
    );
  }

  return (
    <>
      {"paragraphs" in section &&
        section.paragraphs?.map((paragraph) => (
          <LegalParagraph key={paragraph} text={paragraph} vars={vars} />
        ))}
      {"list" in section && section.list && section.list.length > 0 && (
        <ul className="list-disc space-y-2 pl-5">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {"paragraphsAfter" in section &&
        section.paragraphsAfter?.map((paragraph) => (
          <LegalParagraph key={paragraph} text={paragraph} vars={vars} />
        ))}
    </>
  );
}

export function PrivacyDocument({
  doc,
  vars,
}: {
  doc: PrivacyMessages;
  vars: LegalVars;
}) {
  return (
    <>
      {doc.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          <PrivacySectionBody section={section} vars={vars} />
        </LegalSection>
      ))}
    </>
  );
}

export function TermsDocument({
  doc,
  vars,
}: {
  doc: TermsMessages;
  vars: LegalVars;
}) {
  return (
    <>
      {doc.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          <TermsSectionBody
            section={section}
            vars={vars}
            privacyLinkLabel={doc.privacyPolicyLink}
          />
        </LegalSection>
      ))}
    </>
  );
}

export function LegalIntro({ text, vars }: { text: string; vars: LegalVars }) {
  return <p className="mt-4 text-muted-foreground">{interpolate(text, vars)}</p>;
}
