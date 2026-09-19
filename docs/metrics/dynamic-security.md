# Dynamic security baseline

**Measured:** 2026-09-19
**Target:** authorized local Next.js production server at `http://host.docker.internal:3000`
**Tool:** OWASP ZAP stable container, passive baseline scan

## Result

- ZAP failure alerts: **0**
- ZAP process exit: **2**, because baseline warnings remained
- Warning categories in the retained JSON: **4** (2 medium CSP categories and 2 informational cache categories)
- Passing passive rules: **65**

| Risk | Finding | Observed instances | Disposition |
|---|---|---:|---|
| Medium | `script-src 'unsafe-inline'` in CSP | 3 | Known Next.js boot/theme-script constraint; `unsafe-eval` was removed. Replace with nonce/hash CSP before claiming strict CSP. |
| Medium | `style-src 'unsafe-inline'` in CSP | 5 | Retained for current React/Tailwind inline-style behavior; requires a dedicated nonce/hash migration. |
| Informational | Storable/cacheable content | 5 | Expected for public static assets and pages. |
| Informational | Storable but non-cacheable content | 1 | Informational; review CDN policy after deployment. |

Hardening completed during the scan cycle:

- removed `unsafe-eval` from `script-src`;
- restricted image and connection origins;
- added `base-uri`, `object-src`, `form-action`, `worker-src`, and `manifest-src` directives;
- added COEP, COOP, and CORP headers;
- removed the Next.js `X-Powered-By` header;
- removed the mutable third-party font stylesheet and self-hosted the two required WOFF2 assets, eliminating runtime SRI drift and external font origins from CSP.

The machine-readable report is `zap-final.json` in this directory. This was a passive baseline scan, not an exploit test or proof that the application is vulnerability-free.
