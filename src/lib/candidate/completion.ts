import { BIO_MIN_LENGTH } from "@/config/candidate";
import type {
  CandidateProfileData,
  ProfileCompletion,
} from "@/types/candidate";

function bioMeetsMinimum(bio: string | null | undefined): boolean {
  const trimmed = bio?.trim() ?? "";
  return trimmed.length >= BIO_MIN_LENGTH;
}

const CHECKS: {
  key: string;
  label: string;
  weight: number;
  test: (data: CandidateProfileData) => boolean;
}[] = [
  {
    key: "name",
    label: "Full name",
    weight: 8,
    test: (d) => Boolean(d.profile.fullName?.trim()),
  },
  {
    key: "photo",
    label: "Profile photo",
    weight: 7,
    test: (d) => Boolean(d.profile.avatarUrl?.trim()),
  },
  {
    key: "headline",
    label: "Professional headline",
    weight: 10,
    test: (d) => Boolean(d.details?.headline?.trim()),
  },
  {
    key: "bio",
    label: `About you (${BIO_MIN_LENGTH}+ characters)`,
    weight: 10,
    test: (d) => bioMeetsMinimum(d.details?.bio),
  },
  {
    key: "location",
    label: "Location & country",
    weight: 10,
    test: (d) =>
      Boolean(d.details?.location?.trim() && d.details?.country_code),
  },
  {
    key: "cv",
    label: "CV / resume upload",
    weight: 20,
    test: (d) => Boolean(d.details?.cv_path),
  },
  {
    key: "skills",
    label: "At least 3 skills",
    weight: 15,
    test: (d) => d.skills.length >= 3,
  },
  {
    key: "languages",
    label: "At least 1 language",
    weight: 10,
    test: (d) => d.languages.length >= 1,
  },
  {
    key: "experience",
    label: "Work experience",
    weight: 15,
    test: (d) => d.experiences.length >= 1,
  },
  {
    key: "linkedin",
    label: "LinkedIn or portfolio",
    weight: 10,
    test: (d) =>
      Boolean(
        d.details?.linkedin_url?.trim() || d.details?.portfolio_url?.trim()
      ),
  },
];

export function calculateProfileCompletion(
  data: CandidateProfileData
): ProfileCompletion {
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
