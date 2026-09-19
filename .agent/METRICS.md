# Portfolio Program Metrics & Verification Ledger

## M0–M3 local verification

| Metric | Measured result | Source |
|---|---:|---|
| Next.js production build | Exit 0 | `npm run build` |
| Static-generation work units | 12 | Next.js 16.3.5 build output |
| Product pages | 5 | Build route list (`/projects/[slug]`) |
| Emitted JavaScript | 14 chunks / 647,906 raw bytes | `portfolio/.next/static` |
| Emitted CSS | 1 file / 20,634 raw bytes | `portfolio/.next/static` |
| Node data checks | 12 passed across 2 scripts | `npm test` |
| ESLint | Exit 0 | `npm run lint` |
| TypeScript | Exit 0 | `npx tsc --noEmit -p portfolio/tsconfig.json` |
| Production browser checks | 12 passed | `npm run test:e2e` |
| Automated accessibility | 0 serious/critical axe violations | Playwright + axe-core |
| npm vulnerabilities | 0 total | `npm audit --json` |
| Portfolio secret scan | No leaks found | gitleaks |
| Phase 1 evidence validator | 542 passed | `node research/validate_evidence_and_scores.js` |
| Lighthouse lab scores | Performance 72; Accessibility/Best Practices/SEO 100 | `docs/metrics/lighthouse-final.report.json` |
| Lighthouse lab CWV proxies | LCP 4.7 s; CLS 0; TBT 320 ms | Local mobile simulation; not field data |
| OWASP ZAP baseline | 0 FAIL alerts; 2 medium warning categories | Authorized local passive scan |

## Repository evidence program

- Metadata/tree snapshots: 47 repositories.
- Deeper evidence records: 27 repositories.
- Evidence-ledger entries: 449.
- Scored projects: 15; top provisional evidence-strength score: 77.05.
- Sentinel provisional evidence-strength score: 75.49.
- Excluded projects: 12.
- CI reconciliation: 47 snapshots; 21 successful at audited SHAs, 21 no runs, 4 without successful runs, 1 missing audited SHA.
- Provisional products in UI: 5 (`schemeGPT`, `Sentinel`, `mcp-from-scratch`, `tenant-api-platform`, `event-stream-platform`).
- Conceptual systems in UI: 5, all labeled `FUTURE / UNBUILT`.

## Executed project checks

| Project | Executed result |
|---|---|
| Sentinel | 62 pytest tests passed |
| mcp-from-scratch | 29 pytest tests passed |
| tenant-api-platform | Full Go suite passed against Docker-backed PostgreSQL and Redis; vet/build passed; local `-race` compile blocked by Windows C compiler |
| event-stream-platform | 86 Go tests and Compose smoke test passed with PostgreSQL, Redis, and Redpanda |
| schemeGPT | 71 pytest tests passed; deployment and RAGAS remain unverified |
| DevAtlas | 202 tests passed against Docker-backed PostgreSQL/Redis on a repaired, uncommitted working tree |

Detailed records: `research/execution-ledger.json`, `docs/metrics/performance.md`, `docs/metrics/dynamic-security.md`, and `docs/metrics/ci-reconciliation.md`.
