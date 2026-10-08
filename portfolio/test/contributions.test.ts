import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Test-local module resolution hook (same technique as featured-projects.test.ts).
// The application must import extensionless specifiers, but Node's ESM resolver
// needs an extension. This hook retries a failed relative resolution with the
// supported extensions so the REAL `lib/contributions.ts` module is loaded (and
// natively type-stripped) rather than a re-implementation.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".") || specifier.startsWith("/")) {
        for (const ext of [".ts", ".tsx", ".js", "/index.ts"]) {
          try {
            return nextResolve(specifier + ext, context);
          } catch {
            // Not resolvable with this extension; try the next candidate.
          }
        }
      }
      throw error;
    }
  },
});

type RawCalendar = { totalContributions?: unknown; weeks?: unknown };
type RawCollection = { contributionCalendar?: RawCalendar };
type RawUser = { contributionsCollection?: RawCollection };
type RawPayload = { data: { user: RawUser | null }; errors?: unknown };

type GraphQLInit = RequestInit & { next?: { revalidate?: number } };
type Call = { url: string; init: GraphQLInit };

function validPayload(): RawPayload {
  return {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: 5,
            weeks: [
              {
                contributionDays: [
                  {
                    date: "2024-01-07",
                    weekday: 0,
                    contributionCount: 2,
                    contributionLevel: "FIRST_QUARTILE",
                    color: "#9be9a8",
                  },
                  {
                    date: "2024-01-08",
                    weekday: 1,
                    contributionCount: 0,
                    contributionLevel: "NONE",
                    color: "#ebedf0",
                  },
                ],
              },
              {
                contributionDays: [
                  {
                    date: "2024-01-14",
                    weekday: 0,
                    contributionCount: 3,
                    contributionLevel: "THIRD_QUARTILE",
                    color: "#40c463",
                  },
                  {
                    date: "2024-01-15",
                    weekday: 1,
                    contributionCount: 0,
                    contributionLevel: "NONE",
                    color: "#ebedf0",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  };
}

function calendar(payload: RawPayload): RawCalendar {
  return payload.data.user!.contributionsCollection!.contributionCalendar!;
}

function weeksOf(payload: RawPayload): Array<{ contributionDays: Array<Record<string, unknown>> }> {
  return calendar(payload).weeks as Array<{ contributionDays: Array<Record<string, unknown>> }>;
}

function nthDay(payload: RawPayload, w: number, d: number): Record<string, unknown> {
  return weeksOf(payload)[w].contributionDays[d];
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function makeFetcher(response: Response, calls: Call[] = []) {
  const fetcher = async (url: string, init: GraphQLInit) => {
    calls.push({ url, init });
    return response;
  };
  return { fetcher, calls };
}

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed += 1;
    console.log(`  ok ${passed + failed} ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`  x  ${passed + failed} ${name}`);
    console.error(error);
  }
}

console.log("------------------------------------------------------------");
console.log("RUNNING GITHUB CONTRIBUTIONS FETCHER TESTS");
console.log("------------------------------------------------------------");

const { contributionQuery, getContributions } = await import("../lib/contributions");

// Sanity: the exported query references the required login and fields.
await test("contributionQuery requests the aditya0si contribution calendar", () => {
  assert.equal(typeof contributionQuery, "string");
  assert.match(contributionQuery, /user\s*\(\s*login:\s*"aditya0si"\s*\)/);
  assert.match(contributionQuery, /contributionsCollection/);
  assert.match(contributionQuery, /contributionCalendar/);
  assert.match(contributionQuery, /totalContributions/);
  assert.match(contributionQuery, /weeks/);
  assert.match(contributionQuery, /contributionDays/);
  assert.match(contributionQuery, /date/);
  assert.match(contributionQuery, /weekday/);
  assert.match(contributionQuery, /contributionCount/);
  assert.match(contributionQuery, /contributionLevel/);
});

// Happy path: normalized total/weeks, safe fields only, zeros preserved.
await test("normalizes a valid calendar and preserves zeros", async () => {
  const { fetcher } = makeFetcher(jsonResponse(validPayload()));
  const result = await getContributions("ghp_secret", fetcher as never);

  assert.equal(result.total, 5);
  assert.deepEqual(result.weeks, [
    {
      contributionDays: [
        { date: "2024-01-07", weekday: 0, contributionCount: 2, contributionLevel: "FIRST_QUARTILE" },
        { date: "2024-01-08", weekday: 1, contributionCount: 0, contributionLevel: "NONE" },
      ],
    },
    {
      contributionDays: [
        { date: "2024-01-14", weekday: 0, contributionCount: 3, contributionLevel: "THIRD_QUARTILE" },
        { date: "2024-01-15", weekday: 1, contributionCount: 0, contributionLevel: "NONE" },
      ],
    },
  ]);
  assert.deepEqual(
    Object.keys(result.weeks[0].contributionDays[0]).sort(),
    ["contributionCount", "contributionLevel", "date", "weekday"],
    "only safe day fields must be exposed"
  );
  assert.equal(typeof result.updatedAt, "string");
  assert.ok(!Number.isNaN(Date.parse(result.updatedAt)), "updatedAt must be a parseable ISO timestamp");
});

// Zero days: a fully zero calendar is kept, not treated as missing.
await test("keeps an all-zero calendar", async () => {
  const payload = validPayload();
  calendar(payload).totalContributions = 0;
  nthDay(payload, 0, 0).contributionCount = 0;
  nthDay(payload, 1, 0).contributionCount = 0;

  const { fetcher } = makeFetcher(jsonResponse(payload));
  const result = await getContributions("ghp_secret", fetcher as never);

  assert.equal(result.total, 0);
  assert.equal(result.weeks[0].contributionDays[0].contributionCount, 0);
  assert.equal(result.weeks[1].contributionDays[0].contributionCount, 0);
});

// Request shape: URL, method, auth, content type, query body, timeout signal, cache.
await test("sends a POST with bearer auth, query, timeout signal and revalidate", async () => {
  const { fetcher, calls } = makeFetcher(jsonResponse(validPayload()));
  await getContributions("ghp_token_123", fetcher as never);

  assert.equal(calls.length, 1);
  const { url, init } = calls[0];
  assert.equal(url, "https://api.github.com/graphql");
  assert.equal(init.method, "POST");

  const headers = init.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer ghp_token_123");
  assert.equal(headers["Content-Type"], "application/json");

  const body = JSON.parse(init.body as string) as { query: unknown };
  assert.equal(body.query, contributionQuery);

  assert.ok(init.signal instanceof AbortSignal, "a timeout AbortSignal must be attached");
  assert.deepEqual(init.next, { revalidate: 3600 });
});

// Blank token rejected before any network call.
await test("rejects a blank token without calling the fetcher", async () => {
  const { fetcher, calls } = makeFetcher(jsonResponse(validPayload()));
  await assert.rejects(() => getContributions("   ", fetcher as never), /token/i);
  assert.equal(calls.length, 0);
});

// Non-2xx status.
await test("rejects a non-2xx response", async () => {
  const { fetcher } = makeFetcher(jsonResponse({ message: "boom" }, 502));
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /status/i);
});

// GraphQL errors delivered with HTTP 200.
await test("rejects GraphQL errors carried on a 200 response", async () => {
  const payload = validPayload() as RawPayload;
  payload.errors = [{ message: "Could not resolve to a User" }];
  const { fetcher } = makeFetcher(jsonResponse(payload));
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /error/i);
});

// Null user.
await test("rejects a null user", async () => {
  const payload = validPayload();
  payload.data.user = null;
  const { fetcher } = makeFetcher(jsonResponse(payload));
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /user/i);
});

// Missing contributionsCollection / calendar.
await test("rejects a missing contribution calendar", async () => {
  const payload = validPayload();
  payload.data.user!.contributionsCollection = undefined;
  const { fetcher } = makeFetcher(jsonResponse(payload));
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /calendar/i);
});

// Invalid totals.
for (const [label, value] of [
  ["non-integer", 1.5],
  ["negative", -1],
  ["unsafe", Number.MAX_SAFE_INTEGER + 1],
  ["non-number", "5"],
] as const) {
  await test(`rejects a ${label} totalContributions`, async () => {
    const payload = validPayload();
    calendar(payload).totalContributions = value;
    const { fetcher } = makeFetcher(jsonResponse(payload));
    await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /total/i);
  });
}

// Invalid counts.
for (const [label, value] of [
  ["non-integer", 2.5],
  ["negative", -3],
  ["unsafe", Number.MAX_SAFE_INTEGER + 2],
  ["non-number", null],
] as const) {
  await test(`rejects a ${label} contributionCount`, async () => {
    const payload = validPayload();
    nthDay(payload, 0, 0).contributionCount = value;
    const { fetcher } = makeFetcher(jsonResponse(payload));
    await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /count/i);
  });
}

// Invalid weekday.
for (const value of [-1, 7, 1.5, "1"]) {
  await test(`rejects weekday ${String(value)}`, async () => {
    const payload = validPayload();
    nthDay(payload, 0, 0).weekday = value;
    const { fetcher } = makeFetcher(jsonResponse(payload));
    await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /weekday/i);
  });
}

// Unknown level.
await test("rejects an unknown contributionLevel", async () => {
  const payload = validPayload();
  nthDay(payload, 0, 0).contributionLevel = "FIFTH_QUARTILE";
  const { fetcher } = makeFetcher(jsonResponse(payload));
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /level/i);
});

// Regex-passing but non-Gregorian dates.
for (const value of ["2024-02-30", "2023-02-29", "2024-13-01", "2024-00-10", "2024-01-00", "2024-1-1"]) {
  await test(`rejects non-Gregorian date ${value}`, async () => {
    const payload = validPayload();
    nthDay(payload, 0, 0).date = value;
    const { fetcher } = makeFetcher(jsonResponse(payload));
    await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /date/i);
  });
}

// Duplicate day globally across weeks.
await test("rejects duplicate days across weeks", async () => {
  const payload = validPayload();
  nthDay(payload, 1, 0).date = "2024-01-08";
  const { fetcher } = makeFetcher(jsonResponse(payload));
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /(order|sorted|duplicate|unique)/i);
});

// Unsorted days globally across weeks.
await test("rejects globally unsorted days", async () => {
  const payload = validPayload();
  nthDay(payload, 1, 0).date = "2024-01-06";
  const { fetcher } = makeFetcher(jsonResponse(payload));
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /(order|sorted|duplicate|unique)/i);
});

// Container validation.
await test("rejects a non-array weeks container", async () => {
  const payload = validPayload();
  calendar(payload).weeks = "nope";
  const { fetcher } = makeFetcher(jsonResponse(payload));
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /week/i);
});

await test("rejects a non-array contributionDays container", async () => {
  const payload = validPayload();
  weeksOf(payload)[0].contributionDays = "nope" as never;
  const { fetcher } = makeFetcher(jsonResponse(payload));
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /(day|days)/i);
});

// Malformed JSON body.
await test("rejects malformed JSON", async () => {
  const { fetcher } = makeFetcher(
    new Response("{ not json", { status: 200, headers: { "Content-Type": "application/json" } })
  );
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never));
});

// Network failure.
await test("rejects a network failure", async () => {
  const fetcher = async () => {
    throw new TypeError("fetch failed");
  };
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /fetch failed/);
});

// Timeout / abort.
await test("rejects a timeout abort", async () => {
  const fetcher = async () => {
    throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
  };
  await assert.rejects(() => getContributions("ghp_secret", fetcher as never), /timeout/i);
});

console.log("------------------------------------------------------------");
console.log(`Contributions: ${passed} passed, ${failed} failed.`);
console.log("------------------------------------------------------------");

if (failed > 0) {
  process.exitCode = 1;
}
