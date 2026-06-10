import type { DeepString } from "@/i18n/types";

export const termsEn = {
  metaTitle: "Terms of Service",
  metaDescription: "Terms and conditions for using CrossTalent",
  title: "Terms of Service",
  lastUpdatedLabel: "Last updated:",
  updatedDate: "June 5, 2026",
  intro:
    "These terms govern your use of {name} ({url}). By creating an account or using the platform, you agree to them.",
  questions: "Questions?",
  contactUs: "Contact us",
  privacyPolicyLink: "Privacy Policy",
  sections: [
    {
      title: "The service",
      paragraphs: [
        "CrossTalent is a recruitment platform that helps job seekers and employers connect across North Africa and Europe. We provide profiles, job listings, applications, and messaging tools. We may update or discontinue features from time to time.",
      ],
    },
    {
      title: "Who can use CrossTalent",
      paragraphs: [
        "You must be at least 16 years old and able to enter a binding agreement. Employers must have authority to act on behalf of their organisation. You are responsible for keeping your login details secure and for activity on your account.",
      ],
    },
    {
      title: "Your account and content",
      paragraphs: [
        "You agree to provide accurate information and to keep your profile up to date. You retain ownership of content you upload, such as CVs, job posts, and messages. You grant us a limited licence to host, display, and share that content as needed to operate the platform — for example, showing a job post on the board or sharing a candidate profile with an employer you apply to.",
        "You must not upload unlawful, misleading, discriminatory, or infringing content. You must not impersonate others or misuse contact details obtained through the platform.",
      ],
    },
    {
      title: "Employer plans and payments",
      paragraphs: [
        "Some employer features require a paid plan or promotional access period. Prices and limits are shown on our pricing page. Paid subscriptions renew according to the plan you choose until you cancel. Fees are generally non-refundable except where required by law.",
        "We may change pricing or plan features with reasonable notice. Continued use after a change constitutes acceptance of the new terms for billing.",
      ],
    },
    {
      title: "Acceptable use",
      list: [
        "Use CrossTalent only for lawful hiring and job-seeking purposes",
        "Do not scrape, spam, harass, or attempt to bypass access controls",
        "Do not introduce malware or interfere with the service",
        "Respect other users' privacy and applicable employment laws",
      ],
      paragraphsAfter: [
        "We may suspend or terminate accounts that violate these rules or pose a risk to other users or the platform.",
      ],
    },
    {
      title: "No employment guarantee",
      paragraphs: [
        "CrossTalent is a marketplace, not an employer, recruiter of record, or legal advisor. We do not guarantee interviews, offers, hires, or candidate quality. Hiring decisions and compliance with labour and immigration rules remain solely between employers and candidates.",
      ],
    },
    {
      title: "Third-party links and sign-in",
      paragraphs: [
        "The platform may link to external sites or let you sign in through a third-party account provider. Those services are governed by their own terms and policies. We are not responsible for third-party websites or services.",
      ],
    },
    {
      title: "Disclaimer",
      paragraphs: [
        'CrossTalent is provided "as is" and "as available" to the extent permitted by law. We do not warrant uninterrupted or error-free operation. Our liability is limited to the maximum extent allowed by applicable law.',
      ],
    },
    {
      title: "Termination",
      paragraphs: [
        "You may delete your account at any time from your settings. We may suspend or end access if you breach these terms or if we stop offering the service in your region. Sections that by nature should survive termination will continue to apply.",
      ],
    },
    {
      title: "Privacy",
      privacyLink: {
        before: "Our ",
        after:
          " explains how we handle personal data. It forms part of these terms.",
      },
    },
    {
      title: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of the European Union member state from which CrossTalent operates, without regard to conflict of law rules. Disputes should first be raised with us at {email}.",
      ],
    },
    {
      title: "Changes",
      paragraphs: [
        "We may update these terms from time to time. We will post the new version on this page and update the date above. Material changes may also be communicated by email or in-product notice where appropriate.",
      ],
    },
  ],
} as const;

export type TermsMessages = DeepString<typeof termsEn>;
