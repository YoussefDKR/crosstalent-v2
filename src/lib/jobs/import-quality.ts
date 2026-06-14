/** Detect scraped/reposted listings we should not publish. */
export function isLowQualityImportedListing(
  title: string,
  description: string
): boolean {
  const haystack = `${title} ${description}`.toLowerCase();

  if (haystack.includes("see this and similar jobs on linkedin")) {
    return true;
  }

  if (
    haystack.includes("please mention the word") &&
    haystack.includes("when applying to show you read")
  ) {
    return true;
  }

  if (haystack.includes("this is a beta feature to avoid spam applicants")) {
    return true;
  }

  if (haystack.includes("companies can search these words to find applicants")) {
    return true;
  }

  if (haystack.includes("posted ") && haystack.includes("see this and similar")) {
    return true;
  }

  return false;
}

export function isVisiblePublishedJob(job: {
  source_type: string;
  status: string;
  title: string;
  description: string;
}): boolean {
  if (job.status !== "published") return false;
  if (
    job.source_type === "rss" &&
    isLowQualityImportedListing(job.title, job.description)
  ) {
    return false;
  }
  return true;
}
