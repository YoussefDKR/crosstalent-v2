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
    whyCrossTalent: "/why-crosstalent",
    forEmployers: "/for-employers",
    forCandidates: "/for-candidates",
    candidateDashboard: "/candidate/dashboard",
    employerDashboard: "/employer/dashboard",
    employerApplications: "/employer/applications",
    employerCompany: "/employer/company",
    employerJobs: "/employer/jobs",
    employerCandidates: "/employer/candidates",
    employerMessages: "/employer/messages",
    candidateMessages: "/candidate/messages",
    candidateSettings: "/candidate/settings",
    employerBilling: "/employer/billing",
    employerSettings: "/employer/settings",
  },
} as const;

export const stats = [
  { value: "150,000+", label: "Professionals", icon: "users" as const },
  { value: "5,000+", label: "Open opportunities", icon: "briefcase" as const },
  { value: "1,200+", label: "European companies", icon: "building" as const },
  { value: "8", label: "Countries connected", icon: "globe" as const },
  { value: "3", label: "Time zones close to Europe", icon: "clock" as const },
] as const;

export const heroBenefits = [
  {
    title: "Better opportunities",
    subtitle: "Higher salaries",
    icon: "opportunities" as const,
  },
  {
    title: "Work remotely",
    subtitle: "From anywhere",
    icon: "remote" as const,
  },
  {
    title: "Grow your career",
    subtitle: "With global companies",
    icon: "growth" as const,
  },
] as const;

export const howItWorksSteps = [
  {
    step: "01",
    title: "Create your profile",
    description:
      "Showcase your skills, experience, and what you're looking for.",
    icon: "user" as const,
  },
  {
    step: "02",
    title: "Discover opportunities",
    description:
      "Find remote and hybrid jobs that match your goals.",
    icon: "search" as const,
  },
  {
    step: "03",
    title: "Work with Europe",
    description:
      "Join great companies and build your future.",
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
