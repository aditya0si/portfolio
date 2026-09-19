# Known Technical Debt & Issues Register

## Active

### ISSUE-002 — Dual server paths
The root Express development server and the verified Next.js production server are distinct paths. `/research` static mounting exists only in Express. Decide whether required assets should move under `portfolio/public` and whether Express can be removed.

### ISSUE-007 — Candidate-project live deployment evidence
The portfolio itself is externally verified at the deployed Git revision. Candidate source repositories still must not be called live unless an owned deployment URL and deployed revision are independently verified.

### ISSUE-009 — CSP inline allowances
The verified CSP no longer permits `unsafe-eval`, but it still permits inline scripts and styles for Next.js hydration/theme and current React styling. OWASP ZAP reported these as the two remaining medium warning categories. Replace them with nonce/hash policy in a dedicated migration.

### ISSUE-010 — Field performance data unavailable
Lighthouse lab measurement and axe-core automation are complete. Real-user Core Web Vitals/CrUX and RUM remain unavailable; lab values must not be represented as field data. Current local Lighthouse performance is 72 with LCP 4.7 s and TBT 320 ms, so performance optimization remains open.

### ISSUE-012 — DevAtlas repair is not published
The repaired DevAtlas working tree passes 202 Docker-backed tests but is based on audited commit `7d266b3` plus uncommitted fixes. Do not attribute that result to the unchanged Git commit or remote repository until the repair is separately reviewed and published.

## Resolved

- Docker-backed Tenant API suite passed against PostgreSQL and Redis; Windows `-race` compilation remains unavailable because the installed C compiler lacks 64-bit support.
- Docker-backed Event Stream passed 86 Go tests plus the Compose smoke test with PostgreSQL, Redis, and Redpanda.
- DevAtlas PostgreSQL/Redis integration passed 202 tests on the repaired local working tree.
- GitHub Actions reconciliation covered all 47 audited repository snapshots: 21 successful at audited SHAs, 21 with no runs, 4 with runs but no success, and 1 missing an audited SHA.
- Next.js workspace-root warning was resolved with explicit `turbopack.root` and `outputFileTracingRoot`.
- Missing deterministic lint configuration: resolved with ESLint flat config.
- Browser regression and accessibility automation: resolved with 12 Playwright tests including axe-core.
- Critical/high npm advisories: resolved; npm audit reports zero vulnerabilities.
- Portfolio secret-scan gap: gitleaks completed with no findings.
- Baseline response headers: configured and asserted in browser tests.
