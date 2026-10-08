"use client";

import { useEffect, useState } from "react";
import {
  parseContributionCalendar,
  isValidGregorianDate,
  type ContributionDay,
  type ContributionLevel,
  type ContributionWeek,
} from "@/lib/contributions";

// Client-side contribution calendar.
//
// Fetches the same-origin, already-validated /api/contributions endpoint once on
// mount. The normalized payload is re-validated here (it is untrusted as far as
// the browser is concerned) by wrapping it into the GraphQL shape understood by
// the shared parser. All rendered text is a literal or a value derived from a
// validated number/date, so no untrusted string ever reaches the DOM. The
// request is aborted after six seconds with no retry and no console output.

const PROFILE_URL = "https://github.com/aditya0si";
const REQUEST_TIMEOUT_MS = 6000;

const LEVEL_SLUG: Record<ContributionLevel, string> = {
  NONE: "none",
  FIRST_QUARTILE: "first",
  SECOND_QUARTILE: "second",
  THIRD_QUARTILE: "third",
  FOURTH_QUARTILE: "fourth",
};

const LEGEND_LEVELS: ContributionLevel[] = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

type Normalized = {
  total: number;
  weeks: ContributionWeek[];
  updatedAt: string;
};

type State =
  | { status: "loading" }
  | { status: "ready"; data: Normalized }
  | { status: "unavailable" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Reuses the shared Gregorian guard before delegating to the full parser.
function hasValidDayDates(weeks: unknown): boolean {
  if (!Array.isArray(weeks)) {
    return false;
  }
  return weeks.every(
    (week) =>
      isRecord(week) &&
      Array.isArray(week.contributionDays) &&
      week.contributionDays.every(
        (day) => isRecord(day) && isValidGregorianDate(day.date),
      ),
  );
}

function normalizePayload(payload: unknown): Normalized | null {
  if (!isRecord(payload)) {
    return null;
  }
  const { total, weeks, updatedAt } = payload;
  if (typeof updatedAt !== "string" || !Number.isFinite(Date.parse(updatedAt))) {
    return null;
  }
  if (!hasValidDayDates(weeks)) {
    return null;
  }
  try {
    const parsed = parseContributionCalendar({
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: { totalContributions: total, weeks },
          },
        },
      },
    });
    return { total: parsed.total, weeks: parsed.weeks, updatedAt };
  } catch {
    return null;
  }
}

function ProfileLink() {
  return (
    <a
      href={PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="project-link mt-3 gap-2 border border-line-strong px-3 py-2 font-mono uppercase tracking-[0.14em] text-sm transition-colors hover:border-accent"
    >
      github.com/aditya0si ↗
    </a>
  );
}

function CalendarGrid({ weeks }: { weeks: ContributionWeek[] }) {
  return (
    <div className="contrib-scroll">
      <div className="contrib-grid">
        {weeks.map((week, weekIndex) => {
          const byWeekday = new Map<number, ContributionDay>();
          for (const day of week.contributionDays) {
            byWeekday.set(day.weekday, day);
          }
          return Array.from({ length: 7 }, (_, weekday) => {
            const day = byWeekday.get(weekday);
            if (!day) {
              return (
                <div
                  key={`${weekIndex}-${weekday}`}
                  data-contribution-cell="empty"
                  className="contrib-cell"
                  aria-hidden="true"
                />
              );
            }
            const label = `${day.contributionCount} contributions on ${day.date}`;
            return (
              <div
                key={`${weekIndex}-${weekday}`}
                data-contribution-cell="day"
                data-contribution-level={day.contributionLevel}
                className={`contrib-cell contrib-level-${LEVEL_SLUG[day.contributionLevel]}`}
                title={label}
              >
                <span className="sr-only">{label}</span>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}

function ReadyCalendar({ data }: { data: Normalized }) {
  const days = data.weeks.flatMap((week) => week.contributionDays);

  if (data.total === 0) {
    return (
      <p className="text-sm text-ink2">No contributions in this period</p>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-ink2">
        {data.total} contributions in the last year
      </p>

      <CalendarGrid weeks={data.weeks} />

      <div className="contrib-legend">
        <span>Less</span>
        {LEGEND_LEVELS.map((level) => (
          <span
            key={level}
            aria-hidden="true"
            className={`contrib-legend-swatch contrib-level-${LEVEL_SLUG[level]}`}
          />
        ))}
        <span>More</span>
      </div>

      <details className="mt-5 border border-line">
        <summary className="project-link cursor-pointer px-3 py-2 font-mono uppercase tracking-[0.14em] text-sm">
          Daily contributions
        </summary>
        <ul className="border-t border-line px-4 py-3">
          {days.map((day) => (
            <li key={day.date} className="py-0.5 font-mono text-sm text-ink2">
              {`${day.contributionCount} contributions on ${day.date}`}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export default function ContributionsCalendar() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/contributions", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("unavailable");
        }
        const data = normalizePayload(await response.json());
        if (active) {
          setState(data ? { status: "ready", data } : { status: "unavailable" });
        }
      } catch {
        if (active) {
          setState({ status: "unavailable" });
        }
      } finally {
        clearTimeout(timer);
      }
    })();

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return (
    <section
      data-contributions-calendar
      className="contributions-calendar border border-line bg-bg p-5 sm:p-6"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
        <h2 className="font-display text-2xl font-medium tracking-[-0.01em]">
          GitHub contributions
        </h2>
        {state.status === "ready" && (
          <time
            dateTime={state.data.updatedAt}
            className="font-mono text-sm uppercase tracking-[0.14em] text-muted"
          >
            Updated {state.data.updatedAt.slice(0, 10)}
          </time>
        )}
      </div>

      {state.status === "loading" && (
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.14em] text-muted">
            Loading contributions…
          </p>
          <ProfileLink />
        </div>
      )}

      {state.status === "unavailable" && (
        <div>
          <p className="text-sm text-ink2">Contributions unavailable</p>
          <ProfileLink />
        </div>
      )}

      {state.status === "ready" && <ReadyCalendar data={state.data} />}
    </section>
  );
}
