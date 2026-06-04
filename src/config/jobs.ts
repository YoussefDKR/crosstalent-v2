export const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
] as const;

export const REMOTE_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead / Principal" },
] as const;

export const JOB_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
] as const;

export const JOB_LOCATION_COUNTRIES = [
  { code: "FR", label: "France" },
  { code: "DE", label: "Germany" },
  { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" },
  { code: "NL", label: "Netherlands" },
  { code: "BE", label: "Belgium" },
  { code: "PT", label: "Portugal" },
  { code: "IE", label: "Ireland" },
  { code: "AT", label: "Austria" },
  { code: "CH", label: "Switzerland" },
  { code: "UK", label: "United Kingdom" },
  { code: "REMOTE", label: "Fully remote (EU)" },
] as const;

export const COMMON_JOB_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "DevOps",
  "AWS",
  "Product Management",
  "UX Design",
  "Data Analysis",
] as const;
