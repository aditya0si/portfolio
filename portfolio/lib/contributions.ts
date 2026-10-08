// Validated GitHub contribution-calendar fetcher.
//
// Fetches the contribution calendar for the configured login through GitHub's
// GraphQL API and returns a narrow, fully validated shape. Everything ingested
// from the network is treated as untrusted: response containers, integers,
// weekday range, contribution-level enum, real Gregorian dates, and global
// day ordering are all checked before any value is surfaced. Only the four safe
// day fields are exposed (no colors, no public-event or repo-count inference).
//
// This module has no Next.js runtime import; the optional `next` request option
// is expressed structurally so the fetcher can also be reused by a client.

export const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
export const GITHUB_CONTRIBUTION_LOGIN = "aditya0si";
export const CONTRIBUTION_CACHE_SECONDS = 3600;
export const CONTRIBUTION_TIMEOUT_MS = 5000;

export const contributionQuery = `query { user(login: "${GITHUB_CONTRIBUTION_LOGIN}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date weekday contributionCount contributionLevel } } } } } }`;

export const contributionLevels = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

export type ContributionLevel = (typeof contributionLevels)[number];

export interface ContributionDay {
  date: string;
  weekday: number;
  contributionCount: number;
  contributionLevel: ContributionLevel;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface Contributions {
  total: number;
  weeks: ContributionWeek[];
  updatedAt: string;
}

// Structural superset of RequestInit carrying Next.js's cache hint. Keeping it
// local avoids a Next runtime dependency while matching the framework option.
export type ContributionRequestInit = RequestInit & {
  next?: { revalidate?: number };
};

export type ContributionFetcher = (
  input: string,
  init: ContributionRequestInit
) => Promise<Response>;

const LEVEL_SET = new Set<string>(contributionLevels);

function fail(message: string): never {
  throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeNonNegativeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

// True only for a real, zero-padded Gregorian YYYY-MM-DD date. Regex alone is
// insufficient: 2024-02-30 and 2023-02-29 both match the shape but are invalid.
export function isValidGregorianDate(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const date = new Date(Date.UTC(2000, month - 1, day));
  date.setUTCFullYear(year);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function parseDay(raw: unknown, source: string): ContributionDay {
  if (!isRecord(raw)) {
    fail(`Invalid contribution day in ${source}`);
  }
  const { date, weekday, contributionCount, contributionLevel } = raw;
  if (!isValidGregorianDate(date)) {
    fail(`Invalid contribution date in ${source}`);
  }
  if (
    !Number.isInteger(weekday) ||
    (weekday as number) < 0 ||
    (weekday as number) > 6
  ) {
    fail(`Invalid weekday in ${source}`);
  }
  if (!isSafeNonNegativeInteger(contributionCount)) {
    fail(`Invalid contributionCount in ${source}`);
  }
  if (typeof contributionLevel !== "string" || !LEVEL_SET.has(contributionLevel)) {
    fail(`Invalid contributionLevel in ${source}`);
  }
  return {
    date,
    weekday: weekday as number,
    contributionCount,
    contributionLevel: contributionLevel as ContributionLevel,
  };
}

// Exported validation helper: turns an untrusted GraphQL payload into the
// normalized calendar. Reusable without any Next.js runtime dependency.
export function parseContributionCalendar(payload: unknown): {
  total: number;
  weeks: ContributionWeek[];
} {
  if (!isRecord(payload)) {
    fail("GitHub GraphQL response was not an object");
  }
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    fail("GitHub GraphQL response contained errors");
  }
  const data = payload.data;
  if (!isRecord(data)) {
    fail("GitHub GraphQL response is missing data");
  }
  const user = data.user;
  if (!isRecord(user)) {
    fail("GitHub GraphQL response is missing the user");
  }
  const collection = user.contributionsCollection;
  if (!isRecord(collection)) {
    fail("GitHub GraphQL response is missing the contribution calendar");
  }
  const calendar = collection.contributionCalendar;
  if (!isRecord(calendar)) {
    fail("GitHub GraphQL response is missing the contribution calendar");
  }
  if (!isSafeNonNegativeInteger(calendar.totalContributions)) {
    fail("Invalid totalContributions in contribution calendar");
  }
  if (!Array.isArray(calendar.weeks)) {
    fail("Invalid weeks container in contribution calendar");
  }

  let previousDate = "";
  const weeks: ContributionWeek[] = [];
  for (const rawWeek of calendar.weeks) {
    if (!isRecord(rawWeek)) {
      fail("Invalid contribution week");
    }
    if (!Array.isArray(rawWeek.contributionDays)) {
      fail("Invalid contributionDays container in contribution week");
    }
    const contributionDays: ContributionDay[] = [];
    for (const rawDay of rawWeek.contributionDays) {
      const day = parseDay(rawDay, "contribution week");
      if (day.date <= previousDate) {
        fail("Contribution days must be globally unique and sorted by date");
      }
      previousDate = day.date;
      contributionDays.push(day);
    }
    weeks.push({ contributionDays });
  }

  return { total: calendar.totalContributions, weeks };
}

export async function getContributions(
  token: string,
  fetcher: ContributionFetcher = fetch
): Promise<Contributions> {
  if (typeof token !== "string" || token.trim().length === 0) {
    fail("A non-blank GitHub token is required");
  }

  const init: ContributionRequestInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: contributionQuery }),
    signal: AbortSignal.timeout(CONTRIBUTION_TIMEOUT_MS),
    next: { revalidate: CONTRIBUTION_CACHE_SECONDS },
  };

  const response = await fetcher(GITHUB_GRAPHQL_ENDPOINT, init);
  if (!response.ok) {
    fail(`GitHub GraphQL request failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();
  const { total, weeks } = parseContributionCalendar(payload);

  return { total, weeks, updatedAt: new Date().toISOString() };
}
