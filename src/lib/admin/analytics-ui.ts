export function adminAnalyticsPeriodLabel(days: number): string {
  if (days === 1) return "Today";
  return `Last ${days} days`;
}
