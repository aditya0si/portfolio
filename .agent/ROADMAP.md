# Portfolio Engineering Program Roadmap (M0–M18)

## Prioritization Methodology
Every milestone is scored and prioritized using the multi-variable formula:
$$\text{Priority Score} = \frac{\text{Impact} \times \text{Confidence} \times \text{RoleRelevance} \times \text{EvidenceValue}}{\text{Effort}}$$
*Scale*: Each variable is scored 1–10. Lower Effort increases Priority Score.

---

## Roadmap Milestone Table

| Milestone | Title & Scope | Primary Deliverables | Score (Imp × Conf × RR × EV ÷ Eff) | Priority Score | Risk Assessment |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **M0** | **Technical Debt & Linter Setup** | Add `.eslintrc.json` in `portfolio/`, test non-interactive `npm run lint` execution. | (8 × 10 × 7 × 8) ÷ 2 | **2240.0** | Low: mechanical configuration. |
| **M1** | **Asset Consolidation & Server Parity** | Copy `/research` images into `portfolio/public/research/` to decouple Vercel deployment from Express `server.js`. | (7 × 10 × 6 × 7) ÷ 2 | **1470.0** | Low: file copy operations. |
| **M2** | **Role Filter Navigation & HUD** | Add accessible role filter pills (`ALL`, `AI ENGINEER`, `FORWARD DEPLOYED`, `BACKEND/SYSTEMS`) in header and product catalog. | (9 × 9 × 10 × 8) ÷ 4 | **1620.0** | Low: stateful client filter. |
| **M3** | **Product Catalog Refactor (`[01] PRODUCTS`)** | Refactor homepage section [01] to display 5 complementary candidates (`schemeGPT`, `Sentinel`, `mcp-from-scratch`, `tenant-api-platform`, `event-stream-platform`) with qualified evidence. | (10 × 9 × 10 × 10) ÷ 5 | **1800.0** | Medium: visual regression risk. |
| **M4** | **Conceptual Systems Section (`[02] SYSTEMS`)** | Build interactive card grid for the 5 conceptual systems (`Aether-Gateway`, `Chronos-Drift`, `KVCache-Router`, `Chaos-Agent`, `Raft-KV-Mesh`) with 1–5 `ConceptValue` formula scores. | (9 × 9 × 9 × 8) ÷ 4 | **1458.0** | Low: new static/interactive section. |
| **M5** | **Engineering DNA / Evidence Matrix** | Replace generic capabilities list with the 35-capability evidence matrix directly linking skills to repository evidence IDs. | (9 × 9 × 9 × 9) ÷ 4 | **1640.25** | Low: data model enrichment. |
| **M6** | **Flagship Dossier: schemeGPT** | Expand `/projects/schemegpt` with RRF fusion math, quote citation verification algorithm, Next.js 16 App Router notes, and PostgreSQL schema. | (10 × 10 × 10 × 10) ÷ 4 | **2500.0** | Low: content & diagram expansion. |
| **M7** | **Flagship Dossier: Sentinel** | Expand `/projects/sentinel` with Jaeger trace diagram, validation proxy architecture, OpenTelemetry attributes, and Docker runbook. | (10 × 10 × 10 × 10) ÷ 4 | **2500.0** | Low: content & diagram expansion. |
| **M8** | **Flagship Dossier: mcp-from-scratch** | Expand `/projects/mcp-from-scratch` with JSON-RPC 2.0 wire frames, stdio vs HTTP/SSE transport tradeoffs, and 5-grader eval harness report. | (9 × 10 × 10 × 10) ÷ 3 | **3000.0** | Low: wire-protocol documentation. |
| **M9** | **Candidate Dossiers: Tenant API & Event Stream** | Expand `/projects/tenant-api-platform` and `/projects/event-stream-platform` with qualified architecture evidence and explicit execution gaps. | (9 × 10 × 9 × 10) ÷ 3 | **2700.0** | Low: content expansion. |
| **M10** | **Conceptual Spec: Aether-Gateway** | Create technical architecture spec, interface definitions, and failure mode benchmarks for Multi-Tenant MCP Gateway. | (9 × 8 × 9 × 9) ÷ 5 | **1166.4** | Medium: deep architectural rigor required. |
| **M11** | **Conceptual Spec: Chronos-Drift** | Create real-time embedding drift detection spec with Kolmogorov-Smirnov statistical formulas and streaming OTel integration. | (8 × 8 × 8 × 8) ÷ 4 | **1024.0** | Medium: mathematical formulation. |
| **M12** | **Conceptual Spec: KVCache-Router** | Create prefix-sharing Radix Tree routing spec demonstrating memory and TTFT savings during high-concurrency LLM inference. | (9 × 8 × 9 × 8) ÷ 5 | **1036.8** | Medium: algorithmic complexity. |
| **M13** | **Interactive Systems Explorer Component** | Build a client-side interactive system explorer (latency comparator, RAG retrieval simulator, or guardrail tester). | (8 × 7 × 9 × 8) ÷ 6 | **672.0** | High: client JS budget & complexity. |
| **M14** | **Accessibility & Responsive Hardening** | Complete WCAG 2.1 AA audit, full keyboard navigation (focus visible), screen reader landmarks, and reduced motion queries. | (8 × 9 × 7 × 7) ÷ 4 | **882.0** | Low: standard accessibility improvements. |
| **M15** | **Automated E2E Testing Suite** | Add Playwright test suite verifying theme switching, navigation jumps, dossier routing, and mobile drawer interaction. | (8 × 9 × 7 × 9) ÷ 5 | **907.2** | Medium: test environment setup. |
| **M16** | **Security & Performance Optimization** | Add security headers in `next.config.mjs`, audit bundle sizes, optimize fonts, and benchmark Lighthouse performance. | (9 × 9 × 8 × 9) ÷ 4 | **1458.0** | Low: Next.js configuration tuning. |
| **M17** | **Local Staging Verification & Pre-Flight Gate** | Run full production build, automated test suites, link checker, and adversarial anti-slop review before user confirmation. | (10 × 10 × 10 × 10) ÷ 2 | **5000.0** | Low: zero-risk verification gate. |
| **M18** | **Production Deployment & Post-Launch Validation** | Deploy to Vercel upon explicit user confirmation; run live HTTP verification on `portfolio-gray-five-72.vercel.app`. | (10 × 10 × 10 × 10) ÷ 2 | **5000.0** | Medium: depends on Vercel credentials. |
