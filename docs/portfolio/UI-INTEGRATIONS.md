# Portfolio UI integrations — runtime configuration

**Status:** configuration documented, `/api` endpoints deliberately unprovisioned locally.
**Last updated:** 2026-10-08
**Toolchain verified:** Node `v26.7.0` (native TypeScript type-stripping plus `node:module` `registerHooks`).
**Environment template:** `portfolio/.env.example` (names only, no credential material).

This document describes how the GitHub contributions panel and the footer visits counter are
configured at runtime, what each integration actually measures, and — importantly — what has
**not** been verified. It is written to avoid presenting local, fail-closed behaviour as a working
live integration.

## 1. Secret handling

- All credentials are **server-only**. The application reads them from the process environment at
  request time and never exposes them to the browser.
- No `NEXT_PUBLIC_*` variable is used for any integration. Nothing here is embedded into the
  client bundle at build time.
- `portfolio/.env.example` lists only the variable **names** — `GITHUB_TOKEN=`,
  `UPSTASH_REDIS_REST_URL=`, `UPSTASH_REDIS_REST_TOKEN=` — with empty values. No real credential
  content is committed.
- `.gitignore` at the repository root and inside `portfolio/` ignore every `.env*` file except
  `.env.example` (`!.env.example`), so real environment files stay untracked without obscuring the
  template.

## 2. GitHub contributions panel

- **Route:** `GET /api/contributions` (`portfolio/app/api/contributions/route.ts`).
- **Configuration:** the server reads `process.env.GITHUB_TOKEN` per request. The token should be a
  **least-privilege GitHub read token** used only for this server-side calendar fetch.
- **Upstream:** a single GraphQL request to `https://api.github.com/graphql` using the
  `contributionsCollection.contributionCalendar` field — i.e. the calendar for the **last year** of
  contribution history as GitHub returns it. It is **not** the public-events feed and the response is
  never used to infer repository counts or public events.
- **Validation:** the payload is treated as untrusted. Containers, safe non-negative integers, the
  `0..6` weekday range, the contribution-level enum, real Gregorian dates, and global date ordering
  are all validated before use. Only four safe day fields are surfaced (`date`, `weekday`,
  `contributionCount`, `contributionLevel`); colours and derived metrics are discarded.
- **Failure mode:** a missing/blank token, a non-2xx upstream response, malformed JSON, or a
  validation failure all return a fixed `503 { error: "Contributions unavailable" }` with
  `Cache-Control: no-store`. A missing configuration is reported as **unavailable, never `0`**, and
  never falls back to a host credential.

## 3. Footer visits counter

- **Routes:** `GET /api/visits` (read-only count) and `POST /api/visits` (register a visit),
  `portfolio/app/api/visits/route.ts` with the pure handler in `portfolio/lib/visit-handler.ts` and
  the store in `portfolio/lib/visits.ts`.
- **Configuration:** the server reads `process.env.UPSTASH_REDIS_REST_URL` and
  `process.env.UPSTASH_REDIS_REST_TOKEN` per request. The store is a Redis-compatible REST endpoint
  (Upstash-style) addressed over HTTPS with bearer auth; plain HTTP is tolerated only for localhost.
- **Persistent keys:** the running total is `portfolio:visits:v1:total`. Each visitor's short-lived
  dedup marker is `portfolio:visits:v1:seen:<sha256(visitorId)>` with a `86400` second (24 hour) TTL.
  The visitor id is hashed with `node:crypto` sha256; the raw id is never persisted, sent upstream, or
  logged.
- **What a "visit" is:** an **approximate per-browser, 24-hour** signal — **not** a unique-human or
  people-analytics figure. Concretely:
  - repeat visits from the same browser count at most once every 24 hours;
  - clearing cookies, using a different browser/profile, bots, and privacy tooling all distort the
    count;
  - the **first** cookie-less request has no id to dedup on, so two first requests racing in parallel
    can both register before a cookie is issued.
- **Cookie:** a successful registration sets `portfolio_visit` (`HttpOnly`, `SameSite=Lax`,
  `Path=/`, `Max-Age=31536000`, and `Secure` when the request URL is HTTPS). The cookie is set only
  after a successful store write has returned a validated count.
- **No IP storage:** no IP address is stored, hashed, or sent to the store. Dedup is cookie-id based
  only.
- **Writes are exclusive to the endpoint:** the read path never increments, there is no in-memory
  fallback counter, and there is no seeded total. The `portfolio:visits:v1:*` namespace is **not**
  seeded or reset by the application; manual changes to those keys are only for an authorized operator.
- **Failure mode:** missing config, a provider error, a timeout, malformed JSON, or a
  non-safe/non-negative count all return a fixed `503 { error: "Visits unavailable" }` with
  `Cache-Control: no-store` — **unavailable, never a fabricated `0`** — and no cookie.
- **UI:** `portfolio/app/components/VisitorCounter.tsx` makes exactly one same-origin
  `POST /api/visits` on mount with a 6 second abort and no retries. It renders the server-validated
  integer, `0` only when the server returns a valid `0`, and `Visits unavailable` for every other
  outcome. Loading shows `Visits: loading`. The caption is exactly: *"Repeat visits from the same
  browser count at most once every 24 hours."* No unique-visitor, Nth-visitor, badge, or animation
  claim is made.

## 4. Origin, canonical URL, and the production caveat (critical)

The `POST /api/visits` handler performs a **strict, exact same-origin check first** — before config,
store, or UUID work. The expected origin is derived only from `request.url`; forwarded headers such as
`Host` / `X-Forwarded-Host` are **not** trusted. A missing or foreign `Origin` is rejected with
`403 { error: "Forbidden" }` before any store call.

On the local Next 16 production server, `request.url` is canonicalized to the server's configured
hostname: even when the transport dials `127.0.0.1`, `request.url` is `http://localhost:3000`.
Therefore an `http://127.0.0.1:3000` `Origin` is legitimately rejected with `403`, while the
canonical `http://localhost:3000` `Origin` reaches the (unprovisioned) handler and returns `503`.

- This comparison is **intentionally exact and was not weakened**; the route must not be changed to
  trust `Host` or `X-Forwarded-Host` without explicit approval.
- The deployment's **canonical request URL** must be finalized and validated so that the real
  same-origin origin aligns, **before** the production counter can be considered ready.
- The localhost same-origin API tests (canonical origin → `503`) prove only that the route **fails
  closed** without credentials. They do **not** prove a live counter works.

**No live integration is complete.** It remains blocked until, at minimum:

1. credentials are provisioned (see §5);
2. the canonical origin is decided and validated;
3. a sandbox run verifies atomicity, dedup, readback, restart persistence, and outage handling were
   independently authorized and observed.

This limitation is recorded here as a known gap, not as a disguised success.

## 5. Provisioning status (separate, not done)

- Upstash/Redis provisioning is a **separate** step and is **not done** by this configuration task.
  No provider was contacted, no namespace was created, and no credentials were stored.
- The e2e server is started with `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and
  `GITHUB_TOKEN` explicitly empty, which is the exact unprovisioned failure mode under test
  (`e2e/visits-api.spec.ts`, `e2e/contributions-api.spec.ts`).
- The mock-based unit tests exercise the store/handler contracts against injected fetchers. **Mock
  tests are not live-provider proof**: they model Redis semantics in-process and cannot confirm real
  atomicity, network behaviour, or provider uptime.

## 6. Runtime, build, and hosting

- Both API routes run in the **Node.js runtime** and are dynamic, because they read server
  environment at request time, but only the visits route declares this explicitly
  (`export const runtime = "nodejs"` and `export const dynamic = "force-dynamic"`); the
  contributions route has **no** `dynamic` export and relies on Next 16's default uncached GET
  being rendered dynamically (confirmed by the build). The app is **not** a static export
  (`next.config.mjs` does not set `output: "export"`); static export would be incompatible with
  per-request server configuration.
- **CSP is already same-origin for these routes.** `connect-src` is `'self' https://api.github.com`
  (the latter is only needed because the client-side `GitHubLive` component calls the GitHub REST API
  directly). The visits and contributions routes are same-origin, so **no additional CSP origins are
  required** for them.
- The pre-existing custom Express server at the repository root (`server.js`) is **preserved
  untouched**. It proxies all requests through Next via an Express 5 catch-all (`app.all('*')`);
  Express 5's path-to-regexp changed wildcard syntax, so that catch-all is a **known possible
  failure that was not tested here**. This task neither fixed nor exercised it.

## 7. `liveUrl` policy

`portfolio/lib/featured-projects.ts` deliberately defines **no `liveUrl`** for any featured project.
A `liveUrl` should only be added after a deployment is **independently verified**; until then the
absence is intentional and tested.

## 8. Running the checks

From the repository root, with the verified native toolchain (`node >= 22.15`; verified `v26.7.0`):

```
npm test        # concepts + evidence reconciliation + featured-projects + contributions + visits + visit-handler
npm run test:unit
npm run lint
npm run build   # preserves the prebuild evidence checks, then `next build`
```

The appended `.ts` suites rely on Node's native TypeScript support and the test-local
`node:module` `registerHooks` resolver (extensionless application imports). The root `tsconfig` and the
portfolio `tsconfig` were **not** globally weakened to enable this.
