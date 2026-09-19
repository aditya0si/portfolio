# Phase 2 M0/M1 verification

**Verified:** 2026-09-19
**Scope:** dependency security, linting, build compatibility, browser smoke tests, response headers, and secret scanning. No redesign, commit, push, or deployment was performed.

## Dependency migration

- Next.js: `16.3.5`
- React / ReactDOM: `19.3.0`
- Express: `5.2.1`
- Playwright: resolved to `1.63.0`
- Node.js: `22.23.2`
- npm: `12.0.2`

`npm ls next react react-dom express eslint @playwright/test --depth=1` showed one deduplicated React 19.3.0 graph and the expected Next/Express/ESLint/Playwright packages.

## Verification results

| Command | Result | Observed evidence |
|---|---|---|
| `npm test` | PASS | One Node script; 5 checks passed |
| `npm run lint` | PASS | ESLint flat config, exit 0 |
| `npx tsc --noEmit -p portfolio/tsconfig.json` | PASS | Exit 0 |
| `npm run build` | PASS | Next 16.3.5; 11 static-generation work units; homepage and 4 SSG project pages listed |
| `npm run test:e2e` | PASS | 6 Chromium tests passed in 11.1s |
| `npm audit --json` | PASS | 0 total vulnerabilities: 0 critical, high, moderate, low |
| `gitleaks detect --source . --no-banner --report-format json --report-path research/gitleaks-portfolio.json --exit-code 1` | PASS | 10 commits and about 412 KB scanned; no leaks found |

## E2E red-green evidence

The first complete six-test production-server run failed all six tests because CSP blocked the Fontshare stylesheet. The error was captured as a browser console error. The CSP was then narrowed to explicitly allow `https://api.fontshare.com` for styles and `https://cdn.fontshare.com` for fonts. After rebuilding, the same six tests passed.

The earlier delegated agent reported an infrastructure-absent RED run, but it did not leave a durable command log. It is therefore not counted as independently verified evidence.

## Browser coverage

- Homepage renders and returns HTTP 200.
- Four current static project pages render and return HTTP 200.
- Primary Work and Contact anchor navigation works.
- Unexpected `console.error` and uncaught page errors fail tests.
- Mobile viewport 390×844 has at most one pixel of horizontal width variance.
- Keyboard Tab produces a visible focused element.
- The live response asserts:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - CSP containing `frame-ancestors 'none'`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - Permissions Policy disabling camera, microphone, and geolocation

## Remaining limitations

- CSP still permits inline scripts/styles and `unsafe-eval` for current Next.js compatibility; nonce/hash hardening is deferred.
- Next reports a workspace-root warning because another lockfile exists above the repository. The build and production server still pass.
- Real Core Web Vitals, accessibility automation, Lighthouse, and live deployment checks remain unmeasured.
- The custom Express development server remains architecturally distinct from the verified `next start` production path.
