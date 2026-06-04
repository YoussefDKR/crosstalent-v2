export const COMPANY_DESCRIPTION_MIN_LENGTH = 80;

export const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
] as const;

export const INDUSTRIES = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "E-commerce & Retail",
  "Manufacturing",
  "Consulting",
  "Education",
  "Media & Creative",
  "Logistics",
  "Other",
] as const;

export const EU_HQ_COUNTRIES = [
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
  { code: "OTHER", label: "Other EU" },
] as const;

export const HIRING_REGIONS = [
  "Morocco",
  "Algeria",
  "Tunisia",
  "Egypt",
  "All North Africa",
  "Middle East",
] as const;
