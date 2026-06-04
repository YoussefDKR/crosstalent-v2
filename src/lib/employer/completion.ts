import { COMPANY_DESCRIPTION_MIN_LENGTH } from "@/config/employer";
import type { CompanyCompletion, CompanyProfileData } from "@/types/employer";

function descriptionMeetsMinimum(text: string | null | undefined): boolean {
  return (text?.trim() ?? "").length >= COMPANY_DESCRIPTION_MIN_LENGTH;
}

const CHECKS: {
  key: string;
  label: string;
  weight: number;
  test: (data: CompanyProfileData) => boolean;
}[] = [
  {
    key: "name",
    label: "Contact name",
    weight: 10,
    test: (d) => Boolean(d.profile.fullName?.trim()),
  },
  {
    key: "company_name",
    label: "Company name",
    weight: 15,
    test: (d) => Boolean(d.company?.company_name?.trim()),
  },
  {
    key: "tagline",
    label: "Company tagline",
    weight: 10,
    test: (d) => Boolean(d.company?.tagline?.trim()),
  },
  {
    key: "description",
    label: `About the company (${COMPANY_DESCRIPTION_MIN_LENGTH}+ characters)`,
    weight: 15,
    test: (d) => descriptionMeetsMinimum(d.company?.description),
  },
  {
    key: "industry",
    label: "Industry & company size",
    weight: 10,
    test: (d) =>
      Boolean(d.company?.industry?.trim() && d.company?.company_size),
  },
  {
    key: "headquarters",
    label: "HQ city & country",
    weight: 10,
    test: (d) =>
      Boolean(
        d.company?.headquarters_city?.trim() &&
          d.company?.headquarters_country
      ),
  },
  {
    key: "hiring",
    label: "Hiring regions",
    weight: 10,
    test: (d) => Boolean(d.company?.hiring_in_regions?.trim()),
  },
  {
    key: "website",
    label: "Website or LinkedIn",
    weight: 10,
    test: (d) =>
      Boolean(
        d.company?.website?.trim() || d.company?.linkedin_url?.trim()
      ),
  },
  {
    key: "contact",
    label: "Contact email",
    weight: 10,
    test: (d) => Boolean(d.company?.contact_email?.trim()),
  },
  {
    key: "logo",
    label: "Company logo",
    weight: 10,
    test: (d) => Boolean(d.company?.logo_url?.trim()),
  },
];

export function calculateCompanyCompletion(
  data: CompanyProfileData
): CompanyCompletion {
  const items = CHECKS.map(({ key, label, weight, test }) => ({
    key,
    label,
    weight,
    done: test(data),
  }));

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const earned = items
    .filter((i) => i.done)
    .reduce((sum, i) => sum + i.weight, 0);

  return {
    percent: Math.round((earned / totalWeight) * 100),
    completed: items.filter((i) => i.done).length,
    total: items.length,
    items,
  };
}

export function getIncompleteCompanyLabels(
  completion: CompanyCompletion
): string[] {
  return completion.items.filter((i) => !i.done).map((i) => i.label);
}
