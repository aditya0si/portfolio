# Next Immediate Actions

## Completed

- [x] Phase 1 evidence ledger, inventory, calibrated scoring, role research, role matrix, audit, and IA decision.
- [x] Dependency upgrade to Next 16.3.5 / React 19.3.0 / Express 5.2.1 with zero npm vulnerabilities.
- [x] ESLint, TypeScript, build, 12-test Playwright/axe suite, and gitleaks gates.
- [x] Evidence-to-UI reconciliation and five-candidate Products catalog.
- [x] Docker-backed Event Stream integration: 86 tests plus Compose smoke test passed.
- [x] Docker-backed Tenant API database suite passed without race instrumentation.
- [x] Docker-backed DevAtlas suite: 202 tests passed on the repaired local working tree.
- [x] GitHub Actions reconciliation across all 47 audited snapshots.
- [x] Lighthouse lab measurement and OWASP ZAP passive baseline.
- [x] Portfolio commit, GitHub push, Vercel production deployment, and external route/header probes.

## Next execution sequence

Phase 1 remains **VERIFIED-PARTIAL (DRAFT)** because field performance data, strict CSP, candidate-project deployment evidence, and the unpublished DevAtlas repair remain unresolved.

1. **Close CI and publication follow-up**
   - Keep the portfolio quality workflow green at the deployed revision.
   - Review and publish the DevAtlas repair separately; do not push it as part of the portfolio repository.

2. **Frontend performance and security**
   - Improve the measured 4.7 s lab LCP and 320 ms TBT.
   - Replace `unsafe-inline` CSP allowances with nonces/hashes where compatible.
   - Add real-user Core Web Vitals/RUM; continue labeling Lighthouse as lab-only.

3. **Dossier depth**
   - Expand five product dossiers with verified runbooks, telemetry flows, and failure modes.
   - Add deployment evidence only where an owned URL and deployed revision can be externally verified.

4. **Architecture cleanup**
   - Decide whether the root Express server is still required or can be removed in favor of the verified Next.js path.
