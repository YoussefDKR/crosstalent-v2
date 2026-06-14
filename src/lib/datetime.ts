/** Calendar dates for analytics and admin stats (North Africa / EU default). */
export const APP_TIMEZONE =
  process.env.NEXT_PUBLIC_APP_TIMEZONE?.trim() || "Europe/Paris";

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") % 24,
    minute: get("minute"),
    second: get("second"),
  };
}

function zonedTimeToUtc(
  local: ZonedParts,
  timeZone: string
): Date {
  let utc = Date.UTC(
    local.year,
    local.month - 1,
    local.day,
    local.hour,
    local.minute,
    local.second
  );

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const actual = getZonedParts(new Date(utc), timeZone);
    const desiredMs = Date.UTC(
      local.year,
      local.month - 1,
      local.day,
      local.hour,
      local.minute,
      local.second
    );
    const actualMs = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second
    );
    const diff = desiredMs - actualMs;
    if (diff === 0) return new Date(utc);
    utc += diff;
  }

  return new Date(utc);
}

function zonedTimeToUtcFromDayKey(
  dayKey: string,
  hour: number,
  minute: number,
  second: number,
  timeZone: string
): Date {
  const [year, month, day] = dayKey.split("-").map(Number);
  return zonedTimeToUtc(
    { year, month, day, hour, minute, second },
    timeZone
  );
}

/** YYYY-MM-DD in the app timezone. */
export function toDayKey(
  date: Date | string,
  timeZone: string = APP_TIMEZONE
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { year, month, day } = getZonedParts(d, timeZone);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function todayDayKey(timeZone: string = APP_TIMEZONE): string {
  return toDayKey(new Date(), timeZone);
}

export function addDaysToDayKey(
  dayKey: string,
  days: number,
  timeZone: string = APP_TIMEZONE
): string {
  const anchor = zonedTimeToUtcFromDayKey(dayKey, 12, 0, 0, timeZone);
  const shifted = new Date(anchor.getTime() + days * 86_400_000);
  return toDayKey(shifted, timeZone);
}

export function lastNDayKeys(
  days: number,
  timeZone: string = APP_TIMEZONE
): string[] {
  const today = todayDayKey(timeZone);
  const result: string[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    result.push(addDaysToDayKey(today, -offset, timeZone));
  }
  return result;
}

/** ISO timestamp for midnight at the start of today in the app timezone. */
export function startOfTodayIso(timeZone: string = APP_TIMEZONE): string {
  return zonedTimeToUtcFromDayKey(
    todayDayKey(timeZone),
    0,
    0,
    0,
    timeZone
  ).toISOString();
}

/** ISO timestamp for midnight N calendar days ago in the app timezone. */
export function startOfDayDaysAgoIso(
  days: number,
  timeZone: string = APP_TIMEZONE
): string {
  const dayKey = addDaysToDayKey(todayDayKey(timeZone), -days, timeZone);
  return zonedTimeToUtcFromDayKey(dayKey, 0, 0, 0, timeZone).toISOString();
}

export function formatDayKeyLabel(
  dayKey: string,
  timeZone: string = APP_TIMEZONE
): string {
  const date = zonedTimeToUtcFromDayKey(dayKey, 12, 0, 0, timeZone);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone,
  }).format(date);
}

export function formatAppTimezoneLabel(
  timeZone: string = APP_TIMEZONE
): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(new Date());
  const offset =
    parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  return offset ? `${timeZone} (${offset})` : timeZone;
}

export function isSameAppDay(
  iso: string,
  dayKey: string,
  timeZone: string = APP_TIMEZONE
): boolean {
  return toDayKey(iso, timeZone) === dayKey;
}

export function isTodayInAppTz(
  iso: string,
  timeZone: string = APP_TIMEZONE
): boolean {
  return isSameAppDay(iso, todayDayKey(timeZone), timeZone);
}
