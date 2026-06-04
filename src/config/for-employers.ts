export const employerBenefits = [
  {
    title: "Reach vetted MENA talent",
    description:
      "Search candidates across Morocco, Algeria, Tunisia, Egypt, and beyond — with skills, languages, and CVs in one profile.",
    icon: "search" as const,
  },
  {
    title: "Post jobs that convert",
    description:
      "Clear remote/hybrid labels, salary ranges, and company branding so the right people apply — not everyone.",
    icon: "briefcase" as const,
  },
  {
    title: "Manage applications",
    description:
      "Review applicants, shortlist, and track status without spreadsheets or scattered inboxes.",
    icon: "clipboard" as const,
  },
  {
    title: "Message in one place",
    description:
      "Start conversations from applications and keep hiring discussions inside CrossTalent.",
    icon: "message" as const,
  },
] as const;

export const employerSteps = [
  {
    step: "01",
    title: "Create your company profile",
    description:
      "Add your logo, hiring regions, and what makes your team a great place to work.",
  },
  {
    step: "02",
    title: "Post & publish roles",
    description:
      "Save drafts while you write, then post jobs live on the board when you are ready.",
  },
  {
    step: "03",
    title: "Review & hire",
    description:
      "Filter applications, message finalists, and close roles with confidence.",
  },
] as const;

export const employerFaqs = [
  {
    question: "Can I try CrossTalent before paying?",
    answer:
      "Yes. The Starter plan is free — set up your company, explore candidate search, and draft a job post before upgrading.",
  },
  {
    question: "Where do my jobs appear?",
    answer:
      "Published roles show on the public job board and in candidate search results, branded with your company profile.",
  },
  {
    question: "How do candidates apply?",
    answer:
      "They apply through CrossTalent with their profile. You receive applications in your dashboard with status tracking and messaging.",
  },
] as const;
