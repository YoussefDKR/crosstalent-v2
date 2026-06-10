import { BIO_MIN_LENGTH } from "@/config/candidate";
import type { CandidateMessages } from "@/i18n/dictionaries/candidate/en";
import type {
  CandidateProfileData,
  ProfileCompletion,
} from "@/types/candidate";

function bioMeetsMinimum(bio: string | null | undefined): boolean {
  const trimmed = bio?.trim() ?? "";
  return trimmed.length >= BIO_MIN_LENGTH;
}

type CompletionItemKey = keyof CandidateMessages["completionItems"];

const CHECKS: {
  key: CompletionItemKey;
  weight: number;
  test: (data: CandidateProfileData) => boolean;
}[] = [
  {
    key: "name",
    weight: 8,
    test: (d) => Boolean(d.profile.fullName?.trim()),
  },
  {
    key: "photo",
    weight: 7,
    test: (d) => Boolean(d.profile.avatarUrl?.trim()),
  },
  {
    key: "headline",
    weight: 10,
    test: (d) => Boolean(d.details?.headline?.trim()),
  },
  {
    key: "bio",
    weight: 10,
    test: (d) => bioMeetsMinimum(d.details?.bio),
  },
  {
    key: "location",
    weight: 10,
    test: (d) =>
      Boolean(d.details?.location?.trim() && d.details?.country_code),
  },
  {
    key: "cv",
    weight: 20,
    test: (d) => Boolean(d.details?.cv_path),
  },
  {
    key: "skills",
    weight: 15,
    test: (d) => d.skills.length >= 3,
  },
  {
    key: "languages",
    weight: 10,
    test: (d) => d.languages.length >= 1,
  },
  {
    key: "experience",
    weight: 15,
    test: (d) => d.experiences.length >= 1,
  },
  {
    key: "linkedin",
    weight: 10,
    test: (d) =>
      Boolean(
        d.details?.linkedin_url?.trim() || d.details?.portfolio_url?.trim()
      ),
  },
];

function resolveItemLabel(
  key: CompletionItemKey,
  completionItems: CandidateMessages["completionItems"]
): string {
  return completionItems[key].replace("{min}", String(BIO_MIN_LENGTH));
}

export function calculateProfileCompletion(
  data: CandidateProfileData,
  completionItems?: CandidateMessages["completionItems"]
): ProfileCompletion {
  const items = CHECKS.map(({ key, weight, test }) => ({
    key,
    label: completionItems
      ? resolveItemLabel(key, completionItems)
      : key,
    weight,
    done: test(data),
  }));

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const earned = items
    .filter((i) => i.done)
    .reduce((sum, i) => sum + i.weight, 0);
  const percent = Math.round((earned / totalWeight) * 100);
  const completed = items.filter((i) => i.done).length;

  return {
    percent,
    completed,
    total: items.length,
    items,
  };
}

export function getIncompleteLabels(completion: ProfileCompletion): string[] {
  return completion.items.filter((i) => !i.done).map((i) => i.label);
}
