export const candidateBenefits = [
  {
    title: "Always free for you",
    description:
      "Create your profile, browse jobs, apply, and message employers — no subscription required.",
    icon: "free" as const,
  },
  {
    title: "Remote & hybrid with Europe",
    description:
      "Roles from companies in France, Germany, Spain, Italy, and more — with work style stated upfront.",
    icon: "globe" as const,
  },
  {
    title: "A profile that stands out",
    description:
      "Show skills, languages, experience, and your CV so employers see your full story — not just a PDF.",
    icon: "profile" as const,
  },
  {
    title: "Apply in a few clicks",
    description:
      "One profile powers every application. Track where you applied and reply when employers message you.",
    icon: "apply" as const,
  },
] as const;

export const candidateSteps = [
  {
    step: "01",
    title: "Build your profile",
    description:
      "Add your headline, experience, languages, and CV — employers use this to evaluate fit.",
  },
  {
    step: "02",
    title: "Find roles that fit",
    description:
      "Filter the job board by country, skills, salary, and remote type.",
  },
  {
    step: "03",
    title: "Apply & connect",
    description:
      "Submit applications and continue the conversation in-platform when employers reach out.",
  },
] as const;

export const candidateFaqs = [
  {
    question: "Is CrossTalent really free for candidates?",
    answer:
      "Yes. Creating your profile, browsing the job board, and applying to roles is completely free.",
  },
  {
    question: "Do I need to speak multiple languages?",
    answer:
      "Many roles list language requirements (English, French, Arabic, etc.). Each job shows what is needed before you apply.",
  },
  {
    question: "Can I work from my home country?",
    answer:
      "A large share of listings are remote or hybrid from North Africa. Each post clearly states location and work model.",
  },
] as const;
