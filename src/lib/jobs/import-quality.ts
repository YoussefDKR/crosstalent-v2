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
    haystack.includes("when applying to show you read the job post")
  ) {
    return true;
  }

  if (haystack.includes("this is a beta feature to avoid spam applicants")) {
    return true;
  }

  if (haystack.includes("posted ") && haystack.includes("see this and similar")) {
    return true;
  }

  return false;
}
