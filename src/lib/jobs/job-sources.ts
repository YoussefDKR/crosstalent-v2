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
  /** Source API already returns Europe-focused listings */
  europePreFiltered?: boolean;
};

export const JOB_IMPORT_SOURCES: JobSourceConfig[] = [
  {
    id: "jobicy",
    label: "Jobicy",
    format: "json",
    url: "https://jobicy.com/api/v2/remote-jobs?count=100&geo=europe",
    maxItems: 100,
    europePreFiltered: true,
  },
  {
    id: "remotive",
    label: "Remotive",
    format: "json",
    url: "https://remotive.com/api/remote-jobs?limit=100",
    maxItems: 100,
  },
  {
    id: "remoteok",
    label: "RemoteOK",
    format: "json",
    url: "https://remoteok.com/api",
    maxItems: 100,
    userAgent: "CrossTalent/1.0 (+https://crosstalent.io)",
  },
];

export const JOB_SOURCE_LABELS: Record<JobImportSourceId, string> = {
  jobicy: "Jobicy",
  weworkremotely: "We Work Remotely",
  remotive: "Remotive",
  remoteok: "RemoteOK",
};
