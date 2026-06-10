export const en = {
  common: {
    login: "Log in",
    signup: "Sign up",
    signOut: "Sign out",
    signIn: "Sign in",
    dashboard: "Dashboard",
    soon: "Soon",
    accept: "Accept",
    decline: "Decline",
    privacyPolicy: "Privacy Policy",
    signingOut: "Signing out…",
    redirectingGoogle: "Redirecting to Google…",
    backToHome: "← Back to home",
    createOne: "Create one",
    pricing: "Pricing",
  },
  language: {
    label: "Language",
  },
  site: {
    tagline: "Great talent. Better opportunities. Beyond borders.",
    description:
      "Premium recruitment platform connecting North African professionals with European companies.",
    footerTagline: "Connecting MENA talent with European opportunity.",
    rights: "All rights reserved.",
  },
  nav: {
    dashboard: "Dashboard",
    forJobSeekers: "For job seekers",
    forEmployers: "For employers",
    jobBoard: "Job board",
    whyCrossTalent: "Why CrossTalent",
    findJobs: "Find jobs",
    messages: "Messages",
    jobs: "Jobs",
    applications: "Applications",
    candidates: "Candidates",
    company: "Company",
    billing: "Billing",
    myProfile: "My profile",
    settings: "Settings",
    myApplications: "My applications",
    savedJobs: "Saved jobs",
    jobAlerts: "Job alerts",
    users: "Users",
    subscriptions: "Subscriptions",
    revenue: "Revenue",
    viewSite: "View site",
  },
  footer: {
    product: "Product",
    forTalent: "For talent",
    forEmployers: "For employers",
    company: "Company",
    signUpFree: "Sign up free",
    browseJobs: "Browse jobs",
    createAccount: "Create account",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    pricing: "Pricing",
  },
  cookie: {
    title: "Cookies on {name}",
    description:
      "We use essential cookies to keep you signed in and to protect the service. We do not use advertising cookies. See our",
  },
  auth: {
    welcomeBack: "Welcome back",
    loginSubtitle: "Sign in to your CrossTalent account",
    loginSubtitleDashboard: "Sign in to continue to your CrossTalent dashboard.",
    createAccount: "Create your account",
    signupSubtitle: "Join as a candidate or employer",
    signupEmployerSubtitle: "Start hiring top talent from North Africa.",
    signupCandidateSubtitle: "Build your profile and discover European opportunities.",
    email: "Email",
    password: "Password",
    fullName: "Full name",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    continueGoogle: "Continue with Google",
    signInWithGoogle: "Sign in with Google",
    signUpWithGoogle: "Sign up with Google",
    signingUpAs: "I am signing up as",
    or: "or",
    signingIn: "Signing in…",
    creatingAccount: "Creating account…",
    createAccountBtn: "Create account",
    candidate: "Candidate",
    employer: "Employer",
    iAmA: "I am a",
    candidateRoleDesc: "Free · Looking for opportunities in Europe",
    employerRoleDesc: "Paid plans · Hiring from North Africa",
    termsNotice:
      "By continuing, you agree to our Terms and Privacy Policy. Role cannot be changed after registration.",
    authCallbackFailed:
      "Google or email sign-in could not be completed. Please try again.",
    premiumTagline: "Premium cross-border hiring",
  },
  landing: {
    heroTitle: "Real talent.",
    heroHighlight: "Global",
    heroTitleEnd: "opportunity.",
    heroGuest:
      "CrossTalent connects ambitious professionals from North Africa with European companies. Remote and hybrid jobs. Better futures for both.",
    heroCandidate:
      "Welcome back. Browse remote and hybrid roles with European companies, or finish your profile to stand out.",
    heroEmployer:
      "Manage your jobs and reach ambitious professionals across North Africa.",
    browseJobs: "Browse jobs",
    goToDashboard: "Go to dashboard",
    completeProfile: "Complete your profile",
    postAJob: "Post a job",
    getStartedFree: "Get started free",
    howItWorksTitle: "How CrossTalent works",
    howItWorksSubtitle:
      "Three simple steps from profile to your next role with a European company.",
    step1Title: "Create your profile",
    step1Description:
      "Showcase your skills, experience, and what you're looking for.",
    step2Title: "Discover opportunities",
    step2Description: "Find remote and hybrid jobs that match your goals.",
    step3Title: "Work with Europe",
    step3Description: "Join great companies and build your future.",
    findRemoteJobs: "Find remote jobs",
    myDashboard: "My dashboard",
    imHiring: "I'm hiring talent",
    earlyAccess:
      "Early access beta — help us build the future of cross-border hiring",
  },
  employer: {
    companyProfile: "Company profile",
    postNewJob: "Post a new job",
    postAJob: "Post a job",
  },
  admin: {
    overview: "Overview",
    profile: "Profile",
    viewJobBoard: "View public job board →",
    adminLabel: "Admin",
  },
} as const;

export type Messages = {
  common: Record<keyof typeof en.common, string>;
  language: Record<keyof typeof en.language, string>;
  site: Record<keyof typeof en.site, string>;
  nav: Record<keyof typeof en.nav, string>;
  footer: Record<keyof typeof en.footer, string>;
  cookie: Record<keyof typeof en.cookie, string>;
  auth: Record<keyof typeof en.auth, string>;
  landing: Record<keyof typeof en.landing, string>;
  employer: Record<keyof typeof en.employer, string>;
  admin: Record<keyof typeof en.admin, string>;
};
