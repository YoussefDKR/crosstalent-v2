export type ApplicationStatus = "pending" | "accepted" | "rejected";

export type JobApplicationRow = {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type EmployerApplicationListItem = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  note: string | null;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateHeadline: string | null;
  candidateAvatarUrl: string | null;
};

export type EmployerApplicationDetail = EmployerApplicationListItem & {
  jobDescription: string;
  candidateBio: string | null;
  candidateCountryCode: string | null;
  candidateSkills: string[];
};

export type CandidateApplicationStatus = {
  applied: boolean;
  status: ApplicationStatus | null;
  applicationId: string | null;
};

export type CandidateApplicationListItem = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  jobId: string;
  jobTitle: string;
  companyName: string | null;
  companyLogoUrl: string | null;
};
