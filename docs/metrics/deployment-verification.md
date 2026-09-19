# Live deployment verification

**Verified:** 2026-09-19
**Repository:** `aditya0si/portfolio`
**Verified source revision:** `2d1afaa0662dbe07d7d4ef4f91cb9612a655ff16`

## Deployment identity

- GitHub deployment ID: `6542754630`
- Environment: `Production`
- GitHub deployment status: `success`
- Revision-linked deployment URL: `https://portfolio-cp8t6s5dh-adityasinghprojects.vercel.app`
- Public production alias: `https://portfolio-gray-five-72.vercel.app`

The GitHub Deployments API returned the deployment above when filtered by the exact source SHA. The public alias was then probed independently.

## External probes

All of these public endpoints returned HTTP 200:

- `/`
- `/projects/schemegpt`
- `/projects/sentinel`
- `/projects/mcp-from-scratch`
- `/projects/tenant-api-platform`
- `/projects/event-stream-platform`
- `/robots.txt`
- `/sitemap.xml`
- `/fonts/clash-display-500.woff2`
- `/fonts/clash-display-600.woff2`

The deployed HTML contains the expected current-release markers for the product catalog, Tenant API database-backed suite, Event Stream Docker integration, and conceptual systems. It contains no Fontshare reference.

## Deployed response hardening

The public alias returned:

- `Content-Security-Policy` with `frame-ancestors 'none'` and no `unsafe-eval`;
- `Cross-Origin-Embedder-Policy: credentialless`;
- `Cross-Origin-Opener-Policy: same-origin`;
- `Cross-Origin-Resource-Policy: same-origin`;
- `Strict-Transport-Security`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- no `X-Powered-By` header.

## CI attached to the release

GitHub Actions run `35453129836` completed successfully at the same SHA. It passed Node tests, ESLint, TypeScript, production build, dependency audit, all evidence validators, 12 Playwright/axe checks, and Gitleaks.

This verifies the portfolio deployment and release revision. It does not verify deployments of the five candidate source repositories.
