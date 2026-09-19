# Phase 2 M2/M3 Verification Report: Evidence-to-UI Reconciliation & Products Catalog

**Verified:** 2026-09-19
**Scope:** Elimination of stale/unsupported claims, first-class PRODUCTS catalog navigation, 5 provisional product candidates with explicit execution/candidate statuses, deterministic role filter pills with keyboard accessibility, visible evidence labels and verified test execution facts, segregated CONCEPTUAL SYSTEMS (R&D) with ConceptValue formulas, removal of unverified biography/experience sections, programmatic data tests, and Playwright E2E verification. No git push, commit, or remote deployment was executed.

---

## 1. Evidence-to-UI Reconciliation Summary

| Target Area | Prior Stale Claim | Corrected Factual State | Source Anchor |
|---|---|---|---|
| **Biography / Employment** | "Ex-IBM, ex-HCL intern", "two AI internships", deployed hospital pilot | Completely removed from UI headers, metadata, and sections; qna.md retained as open inquiry | `qna.md` Item 1 |
| **System Reliability Claims** | "survive production", "PRODUCTION RAG" | Qualified to "Systems-first engineering across agent architectures, guardrails, and backend pipelines" | `research/evidence-ledger.json` |
| **schemeGPT Version** | "Next.js 15" | Corrected to Next.js 16 App Router | `EV-SG-NEXT16` |
| **schemeGPT CI Gate** | "RAGAS offline evaluation suite runs as a CI gate" | Qualified: custom retrieval gate (`eval/retrieval_gate.py`); RAGAS unverified per CVE-2026-6587 exclusion in requirements-eval.txt | `EV-SG-RAGAS-CLAIM` |
| **schemeGPT Factuality** | "100% QUOTE-VERIFIED CLAIMS" | Qualified: deterministic substring quote verification against indexed source text | `EV-SG-RETRIEVAL` |
| **Sentinel Performance** | "<180ms p95 validation latency" | Removed from metrics/highlights; unverified README claim | `EV-SEN-METRICS-CLAIM` |
| **Sentinel Tests** | "60+ unit and integration tests" | Corrected to physical test execution count: **62 passed pytest tests** | `MASTER_STATE.md` |
| **mcp-from-scratch Tests** | Unspecified | Surfaced physical test execution count: **29 passed pytest tests** | `MASTER_STATE.md` |
| **OpenCode-Team** | Conflicting counts (10 vs 6 agents, 0 tests) | Replaced in flagship lineup by `tenant-api-platform` and `event-stream-platform` | `EV-OCT-CONFLICT-LABELED`, `INITIAL-AUDIT.md` Section 5 |
| **tenant-api-platform** | Prior absent from UI | Added with explicit candidate status; full Go suite passed against Docker-backed PostgreSQL and Redis, with `go vet` and `go build` also passing; historical k6 benchmark remains unreproduced | `EV-TAP-RLS`, `EV-TAP-ADR`, `EV-TAP-LOAD-BENCHMARK` |
| **event-stream-platform** | Prior absent from UI | Added with explicit candidate status; Docker-backed PostgreSQL, Redis, and Redpanda run passed 86 Go tests plus the Compose smoke test; historical ingest benchmark remains unreproduced | `EV-ESP-GO-MOD`, `EV-ESP-LOAD-BENCHMARK` |
| **Hackathon Claims** | "SIH 2026 FLOODLENS · BUSTWATCH", "Smart India Hackathon 2026" | Removed unverified SIH 2026 awards; repos factual descriptions retained | `research/evidence-ledger.json` |

---

## 2. Products Catalog Architecture

1. **Navigation**:
   - `Hud.tsx`: First-class `PRODUCTS` (`/#products`) navigation anchor.
   - Removed `WORK` and `EXPERIENCE`.
   - Added `SYSTEMS (R&D)` (`/#systems`).
2. **Role Filter Pills**:
   - Four interactive pills: `ALL` (5), `AI ENGINEER` (3), `FORWARD DEPLOYED` (2), `BACKEND/SYSTEMS` (4).
   - Deterministic client-side state filtering.
   - Fully accessible: `role="tablist"`, `aria-selected`, `tabIndex`, and ArrowRight/ArrowLeft/Home/End keyboard navigation.
3. **Execution State Callouts**:
   - Each product card and dossier renders an `[EXECUTION STATUS]` banner with exact local verification results, evidence ID, and evidence strength classification.
   - Backlink on dossiers links to `← ALL PRODUCTS`.
4. **Segregated Conceptual Systems (R&D)**:
   - Rendered under `[02] CONCEPTUAL SYSTEMS (R&D)` (`#systems`).
   - Sourced from `INITIAL-AUDIT.md` Section 8:
     - `Aether-Gateway`: Enterprise MCP Proxy (ConceptValue: 106.67)
     - `Chronos-Drift`: Streaming Observability (ConceptValue: 85.33)
     - `KVCache-Router`: ML Systems / Inference (ConceptValue: 93.75)
     - `Chaos-Agent`: AI Safety / Red Teaming (ConceptValue: 128.00)
     - `Raft-KV-Mesh`: Distributed Systems (ConceptValue: 75.00)
   - Every card explicitly carries the badge `FUTURE / UNBUILT`.

---

## 3. Verification Gates Results

| Gate / Command | Result | Details |
|---|---|---|
| `npm test` | **PASS** | 2 test scripts, 12 checks (AiConcepts invariants + evidence reconciliation, including immutable evidence URLs and execution qualifiers) |
| `npm run lint` | **PASS** | Flat-config ESLint, 0 warnings, 0 errors |
| `npx tsc --project portfolio/tsconfig.json --noEmit` | **PASS** | TypeScript 5.7.3 strict compilation, 0 errors |
| `npm run build` | **PASS** | Next.js 16.3.5 production build, 12 static work units generated |
| `npm run test:e2e` | **PASS** | 12 Playwright Chromium tests passed (navigation, claims absence, filtering, keyboard, 5 routes, mobile layout, security headers, and axe accessibility) |
| `npm audit` | **PASS** | 0 vulnerabilities found |
| `gitleaks detect` | **PASS** | 10 commits / 412 KB scanned, 0 leaks |
| `node research/validate_evidence_and_scores.js` | **PASS** | 542 validation checks passed with zero errors |
