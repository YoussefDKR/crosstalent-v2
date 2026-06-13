export type JobImportSourceId =
  | "jobicy"
  | "weworkremotely"
  | "remotive"
  | "remoteok";

export type JobSourceFormat = "rss" | "json";

export type JobSourceConfig = {
  id: JobImportSourceId;
  label: string;
  url: string;
  format: JobSourceFormat;
  maxItems: number;
  userAgent?: string;
};

export const JOB_IMPORT_SOURCES: JobSourceConfig[] = [
  {
    id: "jobicy",
    label: "Jobicy",
    format: "json",
    url: "https://jobicy.com/api/v2/remote-jobs?count=50&geo=europe",
    maxItems: 50,
  },
  {
    id: "weworkremotely",
    label: "We Work Remotely",
    format: "rss",
    url: "https://weworkremotely.com/remote-jobs.rss",
    maxItems: 50,
  },
  {
    id: "remotive",
    label: "Remotive",
    format: "json",
    url: "https://remotive.com/api/remote-jobs?limit=50",
    maxItems: 50,
  },
  {
    id: "remoteok",
    label: "RemoteOK",
    format: "json",
    url: "https://remoteok.com/api",
    maxItems: 50,
    userAgent: "CrossTalent/1.0 (+https://crosstalent.io)",
  },
];

export const JOB_SOURCE_LABELS: Record<JobImportSourceId, string> = {
  jobicy: "Jobicy",
  weworkremotely: "We Work Remotely",
  remotive: "Remotive",
  remoteok: "RemoteOK",
};
