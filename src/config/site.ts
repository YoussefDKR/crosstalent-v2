export const siteConfig = {
  name: "CrossTalent",
  tagline: "Great talent. Better opportunities. Beyond borders.",
  description:
    "Premium recruitment platform connecting North African professionals with European companies.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
  links: {
    login: "/login",
    signup: "/signup",
    candidateSignup: "/signup?role=candidate",
    employerSignup: "/signup?role=employer",
    jobs: "/jobs",
    pricing: "/pricing",
    candidateDashboard: "/candidate/dashboard",
    employerDashboard: "/employer/dashboard",
    employerCompany: "/employer/company",
    employerJobs: "/employer/jobs",
    employerCandidates: "/employer/candidates",
    employerMessages: "/employer/messages",
    candidateMessages: "/candidate/messages",
    employerBilling: "/employer/billing",
  },
} as const;

export const stats = [
  { value: "12K+", label: "Active candidates" },
  { value: "850+", label: "European employers" },
  { value: "4.2K", label: "Successful placements" },
  { value: "18", label: "Countries connected" },
] as const;

export const howItWorksSteps = [
  {
    step: "01",
    title: "Create your profile",
    description:
      "Candidates build rich profiles with skills, languages, and experience. Employers showcase their company and hiring needs.",
    icon: "user" as const,
  },
  {
    step: "02",
    title: "Discover & match",
    description:
      "Smart filters and search help employers find talent across Morocco, Algeria, Tunisia, Egypt, and beyond.",
    icon: "search" as const,
  },
  {
    step: "03",
    title: "Connect & hire",
    description:
      "Message in real time, schedule interviews, and close roles with confidence — across borders.",
    icon: "message" as const,
  },
] as const;

export const testimonials = [
  {
    quote:
      "CrossTalent helped us hire three senior engineers in Berlin within six weeks. The quality of North African talent is exceptional.",
    author: "Sophie Laurent",
    role: "Head of Engineering",
    company: "NordScale GmbH",
    country: "Germany",
    initials: "SL",
  },
  {
    quote:
      "I landed my dream role in Paris without leaving Casablanca for interviews until the final round. The platform feels premium and trustworthy.",
    author: "Youssef Benali",
    role: "Product Designer",
    company: "Hired at PayFlow",
    country: "Morocco",
    initials: "YB",
  },
  {
    quote:
      "Finally a platform that understands cross-border hiring. Our Barcelona team grew 40% with talent from Tunisia and Egypt.",
    author: "Marco Rossi",
    role: "Talent Director",
    company: "VeloTech",
    country: "Spain",
    initials: "MR",
  },
] as const;
