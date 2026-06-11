export type PasswordRequirement = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    id: "lower",
    label: "One lowercase letter (a–z)",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "upper",
    label: "One uppercase letter (A–Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "number",
    label: "One number (0–9)",
    test: (p) => /\d/.test(p),
  },
  {
    id: "special",
    label: "One special character (!@#$…)",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export type PasswordStrengthLevel =
  | "empty"
  | "weak"
  | "fair"
  | "good"
  | "strong";

export type PasswordStrength = {
  level: PasswordStrengthLevel;
  label: string;
  percent: number;
  metCount: number;
  total: number;
  requirements: { id: string; label: string; met: boolean }[];
  meetsMinimum: boolean;
};

const LEVEL_LABELS: Record<Exclude<PasswordStrengthLevel, "empty">, string> = {
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
    id: req.id,
    label: req.label,
    met: req.test(password),
  }));

  const metCount = requirements.filter((r) => r.met).length;
  const total = requirements.length;
  const meetsMinimum = metCount === total;

  if (!password) {
    return {
      level: "empty",
      label: "Enter a password",
      percent: 0,
      metCount: 0,
      total,
      requirements,
      meetsMinimum: false,
    };
  }

  let level: PasswordStrengthLevel;
  if (metCount <= 2) level = "weak";
  else if (metCount === 3) level = "fair";
  else if (metCount === 4) level = "good";
  else level = "strong";

  const percent = Math.round((metCount / total) * 100);

  return {
    level,
    label: LEVEL_LABELS[level],
    percent,
    metCount,
    total,
    requirements,
    meetsMinimum,
  };
}

export function getMissingPasswordRequirementIds(password: string): string[] {
  return evaluatePasswordStrength(password)
    .requirements.filter((r) => !r.met)
    .map((r) => r.id);
}
