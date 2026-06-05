export type RssFeedSource = "weworkremotely" | "remotive" | "himalayas";

export type RssFeedConfig = {
  id: RssFeedSource;
  label: string;
  url: string;
  maxItems: number;
};

export const RSS_FEEDS: RssFeedConfig[] = [
  {
    id: "weworkremotely",
    label: "We Work Remotely",
    url: "https://weworkremotely.com/remote-jobs.rss",
    maxItems: 40,
  },
  {
    id: "remotive",
    label: "Remotive",
    url: "https://remotive.com/remote-jobs/feed",
    maxItems: 40,
  },
  {
    id: "himalayas",
    label: "Himalayas",
    url: "https://himalayas.app/jobs/rss",
    maxItems: 40,
  },
];

export const RSS_SOURCE_LABELS: Record<RssFeedSource, string> = {
  weworkremotely: "We Work Remotely",
  remotive: "Remotive",
  himalayas: "Himalayas",
};
