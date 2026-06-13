import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { countryDisplayName } from "@/lib/geo/request-country";
import { formatJobPostedAt } from "@/lib/jobs/format";
import type { AdminUserProfile } from "@/lib/admin/types";
import { AdminUserActions } from "@/components/admin/admin-user-actions";

type AdminUserProfileViewProps = {
  data: AdminUserProfile;
};

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null | undefined;
  href?: string | null;
}) {
  if (!value?.trim()) {
    return (
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">—</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline"
        >
          {value}
          <ExternalLink className="size-3.5" />
        </a>
      ) : (
        <p className="mt-1 text-sm text-[#0F172A] whitespace-pre-wrap">{value}</p>
      )}
    </div>
  );
}

export function AdminUserProfileView({ data }: AdminUserProfileViewProps) {
  const { profile, candidate, company } = data;

  return (
    <div className="space-y-6">
      <Link href="/admin/users">
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="size-4" />
          Back to users
        </Button>
      </Link>

      <Card className="border-border/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ProfileAvatar
              pathOrUrl={profile.avatar_url}
              name={profile.full_name}
              size="lg"
              className="size-16"
            />
            <div>
              <h1 className="text-2xl font-semibold text-[#0F172A]">
                {profile.full_name ?? "Unnamed user"}
              </h1>
              <p className="text-muted-foreground">{profile.email ?? "—"}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="capitalize">
                  {profile.role}
                </Badge>
                <span>Joined {formatJobPostedAt(profile.created_at)}</span>
                {profile.signup_country && (
                  <span>
                    · Signup: {countryDisplayName(profile.signup_country)}
                  </span>
                )}
                {profile.is_banned && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    Suspended
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdminUserActions data={data} />

      {profile.role === "candidate" && candidate && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/80 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h2 className="font-semibold text-[#0F172A]">Candidate profile</h2>
              <Field label="Headline" value={candidate.headline} />
              <Field label="About" value={candidate.bio} />
              <Field label="Location" value={candidate.location} />
              <Field
                label="Country"
                value={
                  candidate.country_code
                    ? countryDisplayName(candidate.country_code)
                    : null
                }
              />
              <Field label="Phone" value={candidate.phone} />
              <Field
                label="LinkedIn"
                value={candidate.linkedin_url}
                href={candidate.linkedin_url}
              />
              <Field
                label="Portfolio"
                value={candidate.portfolio_url}
                href={candidate.portfolio_url}
              />
              <Field label="CV" value={candidate.cv_file_name} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/80 shadow-sm">
              <CardContent className="space-y-3 p-6">
                <h2 className="font-semibold text-[#0F172A]">Skills</h2>
                {candidate.skills.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {candidate.skills.map((skill) => (
                      <li key={skill.name} className="flex justify-between gap-3">
                        <span>{skill.name}</span>
                        {skill.level && (
                          <span className="text-muted-foreground capitalize">
                            {skill.level}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm">
              <CardContent className="space-y-3 p-6">
                <h2 className="font-semibold text-[#0F172A]">Languages</h2>
                {candidate.languages.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {candidate.languages.map((lang) => (
                      <li key={lang.name} className="flex justify-between gap-3">
                        <span>{lang.name}</span>
                        {lang.proficiency && (
                          <span className="text-muted-foreground capitalize">
                            {lang.proficiency}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No languages listed.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm">
              <CardContent className="space-y-3 p-6">
                <h2 className="font-semibold text-[#0F172A]">Experience</h2>
                {candidate.experiences.length > 0 ? (
                  <ul className="space-y-4 text-sm">
                    {candidate.experiences.map((exp, index) => (
                      <li key={`${exp.company}-${exp.title}-${index}`}>
                        <p className="font-medium text-[#0F172A]">{exp.title}</p>
                        <p className="text-muted-foreground">
                          {exp.company}
                          {exp.location ? ` · ${exp.location}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exp.start_date.slice(0, 4)}
                          {exp.is_current
                            ? " – Present"
                            : exp.end_date
                              ? ` – ${exp.end_date.slice(0, 4)}`
                              : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No experience listed.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {profile.role === "employer" && company && (
        <Card className="border-border/80 shadow-sm">
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <h2 className="font-semibold text-[#0F172A] sm:col-span-2">
              Company profile
            </h2>
            <Field label="Company name" value={company.company_name} />
            <Field label="Tagline" value={company.tagline} />
            <Field
              label="Website"
              value={company.website}
              href={company.website}
            />
            <Field label="Industry" value={company.industry} />
            <Field label="Company size" value={company.company_size} />
            <Field label="HQ city" value={company.headquarters_city} />
            <Field
              label="HQ country"
              value={
                company.headquarters_country
                  ? countryDisplayName(company.headquarters_country)
                  : null
              }
            />
            <Field label="Hiring regions" value={company.hiring_in_regions} />
            <Field
              label="LinkedIn"
              value={company.linkedin_url}
              href={company.linkedin_url}
            />
            <Field label="Contact email" value={company.contact_email} />
            <Field label="Contact phone" value={company.contact_phone} />
            <div className="sm:col-span-2">
              <Field label="About" value={company.description} />
            </div>
          </CardContent>
        </Card>
      )}

      {profile.role === "employer" && !company && (
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No company profile saved yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
