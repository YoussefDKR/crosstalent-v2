import { COMPANY_DESCRIPTION_MIN_LENGTH } from "@/config/employer";
import type { Messages } from "@/i18n/dictionaries/en";
import type { CompanyCompletion, CompanyProfileData } from "@/types/employer";

function descriptionMeetsMinimum(text: string | null | undefined): boolean {
  return (text?.trim() ?? "").length >= COMPANY_DESCRIPTION_MIN_LENGTH;
}

type CompletionItemKey = keyof Messages["employer"]["companyCompletionItems"];

const CHECKS: {
  key: CompletionItemKey;
  weight: number;
  test: (data: CompanyProfileData) => boolean;
}[] = [
  {
    key: "name",
    weight: 10,
    test: (d) => Boolean(d.profile.fullName?.trim()),
  },
  {
    key: "company_name",
    weight: 15,
    test: (d) => Boolean(d.company?.company_name?.trim()),
  },
  {
    key: "tagline",
    weight: 10,
    test: (d) => Boolean(d.company?.tagline?.trim()),
  },
  {
    key: "description",
    weight: 15,
    test: (d) => descriptionMeetsMinimum(d.company?.description),
  },
  {
    key: "industry",
    weight: 10,
    test: (d) =>
      Boolean(d.company?.industry?.trim() && d.company?.company_size),
  },
  {
    key: "headquarters",
    weight: 10,
    test: (d) =>
      Boolean(
        d.company?.headquarters_city?.trim() &&
          d.company?.headquarters_country
      ),
  },
  {
    key: "hiring",
    weight: 10,
    test: (d) => Boolean(d.company?.hiring_in_regions?.trim()),
  },
  {
    key: "website",
    weight: 10,
    test: (d) =>
      Boolean(
        d.company?.website?.trim() || d.company?.linkedin_url?.trim()
      ),
  },
  {
    key: "contact",
    weight: 10,
    test: (d) => Boolean(d.company?.contact_email?.trim()),
  },
  {
    key: "logo",
    weight: 10,
    test: (d) => Boolean(d.company?.logo_url?.trim()),
  },
];

function resolveItemLabel(
  key: CompletionItemKey,
  completionItems: Messages["employer"]["companyCompletionItems"]
): string {
  return completionItems[key].replace(
    "{min}",
    String(COMPANY_DESCRIPTION_MIN_LENGTH)
  );
}

export function calculateCompanyCompletion(
  data: CompanyProfileData,
  completionItems?: Messages["employer"]["companyCompletionItems"]
): CompanyCompletion {
  const items = CHECKS.map(({ key, weight, test }) => ({
    key,
    label: completionItems ? resolveItemLabel(key, completionItems) : key,
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
