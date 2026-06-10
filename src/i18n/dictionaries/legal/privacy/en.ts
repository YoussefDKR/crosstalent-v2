import type { DeepString } from "@/i18n/types";

export const privacyEn = {
  metaTitle: "Privacy Policy",
  metaDescription: "How CrossTalent collects, uses, and protects your data",
  title: "Privacy Policy",
  lastUpdatedLabel: "Last updated:",
  updatedDate: "June 5, 2026",
  intro:
    "{name} ({url}) connects job seekers and employers across North Africa and Europe. This policy explains what we collect and how we use it.",
  questions: "Questions?",
  contactUs: "Contact us",
  sections: [
    {
      title: "Who we are",
      paragraphs: [
        "CrossTalent is operated from the European Union. For privacy questions, contact us at {email}.",
      ],
    },
    {
      title: "Information we collect",
      items: [
        {
          label: "Account data:",
          text: "name, email, login credentials, account type, and profile photo if you upload one.",
        },
        {
          label: "Profile data:",
          text: "CV, skills, languages, work history, location, and other details you choose to add to your profile.",
        },
        {
          label: "Employer data:",
          text: "company name, logo, job posts, and messages with other users.",
        },
        {
          label: "Usage data:",
          text: "basic technical information such as IP address, browser type, and pages visited, used to keep the service secure and running.",
        },
        {
          label: "Communications:",
          text: "emails and messages you send us through our contact or support channels.",
        },
      ],
    },
    {
      title: "How we use your information",
      list: [
        "Create and manage your account",
        "Show job listings and candidate profiles to the right users",
        "Let employers and candidates message each other",
        "Process job applications",
        "Manage paid plans and account access",
        "Respond to support and contact requests",
        "Improve security and prevent abuse",
      ],
      paragraphsAfter: ["We do not sell your personal data."],
    },
    {
      title: "Third-party services",
      paragraphs: [
        "We work with trusted service providers who help us operate the platform. Depending on how you use CrossTalent, your data may be processed by partners that provide:",
      ],
      list: [
        "Website hosting and infrastructure",
        "Account sign-in and authentication",
        "Secure payment processing",
        "Email and notification delivery",
        "File storage for uploads such as CVs and logos",
      ],
      paragraphsAfter: [
        "These partners only receive the information needed to perform their services and are required to protect it. They may have their own privacy policies, which we encourage you to review.",
      ],
    },
    {
      title: "Who can see your information",
      paragraphs: [
        "Job listings and company profiles you publish may be visible on our public job board. Profile information is shared with other users only as needed for the platform to work — for example, when employers browse talent or candidates apply to roles. Private messages are only visible to the people in that conversation.",
      ],
    },
    {
      title: "How long we keep data",
      paragraphs: [
        "We keep your account data while your account is active. If you delete your account or ask us to remove your data, we will delete or anonymise it within a reasonable period, except where we must keep records for legal or billing reasons.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "Depending on where you live (including the EU/EEA under GDPR), you may have the right to access, correct, delete, or export your data, and to object to or restrict certain processing. To exercise these rights, email {email}.",
        "You may also lodge a complaint with your local data protection authority.",
      ],
    },
    {
      title: "Cookies",
      paragraphs: [
        "We use essential cookies to keep you signed in and to protect the service. We do not use advertising cookies.",
      ],
    },
    {
      title: "Children",
      paragraphs: [
        "CrossTalent is not intended for users under 16. We do not knowingly collect data from children.",
      ],
    },
    {
      title: "Changes",
      paragraphs: [
        "We may update this policy from time to time. We will post the new version on this page and update the date above.",
      ],
    },
  ],
} as const;

export type PrivacyMessages = DeepString<typeof privacyEn>;
