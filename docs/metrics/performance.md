# Portfolio performance and Core Web Vitals baseline

**Measured:** 2026-09-19
**Runtime:** Node.js 22.23.2, Next.js 16.3.5 production server, Lighthouse 13.5.0 mobile simulation

## Production build

`npm run build` completed successfully with Turbopack and generated 12 static-generation work units: the homepage, five product dossiers, framework metadata/image routes, and the not-found route.

Measured from `portfolio/.next/static` after the build:

| Asset class | Files | Raw bytes | Scope |
|---|---:|---:|---|
| JavaScript chunks | 14 | 647,906 | Aggregate emitted chunks; not per-route transfer size |
| CSS | 1 | 20,634 | Aggregate emitted CSS |

These are raw on-disk sizes, not compressed network transfer or route-specific payload.

## Lighthouse lab measurement

Command target: local production server at `http://127.0.0.1:3000`. Full machine-readable and HTML reports are stored as `lighthouse-final.report.json` and `lighthouse-final.report.html` in this directory.

| Category / metric | Result |
|---|---:|
| Performance | 72 / 100 |
| Accessibility | 100 / 100 |
| Best Practices | 100 / 100 |
| SEO | 100 / 100 |
| First Contentful Paint | 2.6 s |
| Largest Contentful Paint | 4.7 s |
| Total Blocking Time | 320 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 2.6 s |

These are Lighthouse lab measurements from one local run, not field data. LCP and TBT need improvement before making a high-performance claim.

## Browser/runtime verification

Playwright ran 12 Chromium tests against `next start`; all passed. The suite covers the homepage, five product routes, filtering, error handling, mobile overflow, keyboard focus, production headers, and a serious/critical axe-core accessibility scan.

## Still unknown

- Interaction to Next Paint: not emitted by this non-interactive Lighthouse lab run.
- Real-user Core Web Vitals / CrUX: no eligible field-data source was established.
- Route-specific transferred JavaScript.
- Production CDN latency and cache behavior for the newly built revision; deployment verification is recorded separately.

Do not represent the lab values as real-user measurements.
