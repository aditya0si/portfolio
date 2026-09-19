# Portfolio Comprehensive Initial Audit & Strategic Report

## Executive Summary
This report establishes the baseline technical and strategic audit of Aditya Singh's personal engineering portfolio (`portfolio/`) and complete 47-repository GitHub ecosystem (`aditya0si`). The audit establishes the factual foundation for repositioning the site as an evidence-first engineering product catalog targeting top-tier 2026 roles: **AI Engineer**, **Forward Deployed Engineer (FDE / FDSE)**, **Backend Engineer**, **ML Systems Engineer**, **Systems / Platform Engineer**, and **AI Product Engineer**.

In strict adherence to the **Contractor Standard** and `AGENT_MISSION.md`, this audit operates on truth over impressiveness. All claims are anchored to registered Evidence IDs in `research/evidence-ledger.json` and mathematically constrained scores in `docs/portfolio/project-scores.json`. All evaluations are currently designated as **PROVISIONAL_PENDING_EXECUTION** until runtime test suites, live builds, and dynamic security audits are physically executed in subsequent phases.

---

## 1. Current Portfolio Assessment

### 1.1 Architecture & Codebase Inspection
*   **Framework**: Next.js 14.2.24 utilizing the App Router architecture with React 18.3.1 and TypeScript 5.7.3.
*   **Styling & UI**: Tailwind CSS 3.4.17 configured with custom technical blueprint CSS variables (`--bg`, `--ink`, `--ink2`, `--muted`, `--accent`, `--line`, `--surface`) in `portfolio/app/globals.css`.
*   **Custom Server**: A local development Express server (`server.js`) wraps the Next.js handler to statically serve legacy `/research` image assets while delegating route handling to Next.js.
*   **Routing Layout**:
    *   `/` (Homepage): Single-page presentation rendering Hero, Marquee, [01] Work, [02] Experience, [03] Capabilities/Stack, [04] AI Field Notes, [05] GitHub Activity, [06] Education, and [07] Contact.
    *   `/projects/[slug]`: Dynamic project detail page generating static paths for 4 historical projects (`schemegpt`, `sentinel`, `mcp-from-scratch`, `opencode-teamwork`).
    *   `/_not-found`, `/robots.txt`, `/sitemap.xml`.

### 1.2 Observed Strengths
1.  **Strict Static Site Generation (SSG)**: All 12 pages pre-render at build time with 0 build errors. First load JS is 106 kB for the homepage, well within standard performance budgets.
2.  **Zero-Error Compilation**: TypeScript strict type-checking (`tsc --noEmit`) passes with 0 errors across all routes and components.
3.  **Real Codebase Grounding**: Underlying projects (`schemeGPT`, `Sentinel`, `mcp-from-scratch`, `DevAtlas`, etc.) represent repositories in Aditya Singh's portfolio ecosystem.
4.  **Component Test Baseline**: A programmatic test suite for `AiConcepts.tsx` (one Node test script with 5 checks in `portfolio/test/concepts.test.js`, pending independent execution) verifies data structure invariants and keyboard event listeners.

### 1.3 Technical Limitations & Gaps
1.  **Nomenclature & Information Architecture**: Candidate flagship projects are labeled generically as "Work" rather than an engineering product catalog (`Products`), and conceptual systems are missing.
2.  **Interactive ESLint Prompt**: Running `npm run lint` pauses interactively because `.eslintrc.json` is missing in `portfolio/`, causing non-interactive CI runs to fail.
3.  **Absence of Automated E2E Browser Tests**: While unit tests exist for AI concept data, there are no Playwright/Cypress end-to-end integration tests verifying DOM hydration, theme toggling, or responsive mobile drawers.
4.  **Lack of Role-Filtered Navigation**: Technical recruiters cannot filter projects by role (e.g., viewing only FDE or Systems proof points).
5.  **Unmeasured Runtime Metrics**: Real-user layout shifts (CLS) and Core Web Vitals cannot be verified at build time and require live browser testing.

---

## 2. GitHub Inventory Summary

Across the `aditya0si` account, **47 total repositories** were audited via the GitHub API (`gh`). The audit strictly separates high-level metadata/tree snapshots from deep evidence records:

### 2.1 Metadata & Tree Snapshots (47 Repositories)
All 47 repositories received git tree inspection, commit SHA extraction, primary language identification, and license/README scanning (`research/real_repo_evidence.json`). These 47 snapshots divide into:
*   **Meaningful Core Repositories**: 27 repositories containing original source code, models, microservices, or hardware RTL.
*   **Auxiliary & Non-Production Repositories**: 20 repositories comprising:
    *   4 private development workspaces (`agentic_rag_system`, `weathergpt`, `stormcast`, `HandyMan`).
    *   1 third-party community fork (`claw-code`).
    *   1 profile configuration repository (`aditya0si`).
    *   1 portfolio repository (`portfolio`).
    *   13 archived prototypes, exploratory scripts, coursework submissions, or empty stubs (`PulseGrid`, `FoodKart`, `solarwinds`, `PaddleOcr`, `CosmosSteller`, `Secure-File-Share`, `testrepo`, etc.).

### 2.2 Deep Evidence Records (27 Repositories)
The 27 meaningful repositories were subjected to granular code inspection, dependency manifest parsing, test path verification, and CI workflow analysis. These 27 repositories yielded 449 distinct evidence records registered in `research/evidence-ledger.json`.

Of the 27 meaningful repositories:
*   **15 Viable Projects** were scored in `docs/portfolio/project-scores.json` using the 11-category weighted model.
*   **12 Excluded Repositories** were formally disqualified with explicit documented rationales (hardware ASIC/PCB labs, duplicate OCR pipelines, or incomplete prototypes).

---

## 3. Strongest Existing Projects

Rankings are deterministically computed in `docs/portfolio/project-scores.json` using the weighted category model (`engineering_depth: 0.18`, `ai_relevance: 0.14`, `production_readiness: 0.14`, `systems_backend: 0.12`, `product_completeness: 0.10`, `originality: 0.08`, `measurable_evidence: 0.07`, `code_quality: 0.06`, `docs_explainability: 0.05`, `interview_depth: 0.04`, `demonstrability: 0.02`). Every score is clamped by Unit A3 deterministic evidence caps:

| Rank | Project Name | Calibrated Total Score | Eligibility & Flagship Status | Verified Test Files | Evidence-Capped Categories | Key Architectural Strengths |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | **schemeGPT** | **77.05** | Provisional Flagship | 20 | Prod Readiness: 6.0 (CI Cap)<br>Code Quality: 6.0 (Cap) | Next.js 16 + FastAPI hybrid RAG; PostgreSQL `pgvector` HNSW index + FTS `tsvector` Reciprocal Rank Fusion (RRF); exact quote verification gate. [Evidence: `EV-SG-RETRIEVAL`, `EV-SG-NEXT16`] |
| **2** | **Sentinel** | **75.49** | Provisional Flagship | 7 | Measurable Ev: 5.5 (7 Tests Cap)<br>Prod Readiness: 6.0 (CI Cap) | Decoupled validation proxy in FastAPI; OpenTelemetry tracer exporting to Jaeger; heuristic PII/toxicity guardrails; Prometheus `/metrics`. [Evidence: `EV-SEN-PROXY`, `EV-SEN-OBS`] |
| **3** | **mcp-from-scratch** | **75.27** | Provisional Flagship | 5 | Prod Readiness: 5.0 (Local Config)<br>Code Quality: 6.0 (Cap) | Pure Python standard library Model Context Protocol (MCP) server; raw JSON-RPC 2.0 wire codec; stdio and HTTP/SSE transports; 5-grader trajectory eval harness. [Evidence: `EV-MCP-CODEC`, `EV-MCP-EVAL`] |
| **4** | **DevAtlas** | **73.78** | Provisional Flagship | 40 | Measurable Ev: 6.0 (Cap)<br>Prod Readiness: 6.0 (CI Cap) | Full-stack developer intelligence platform; Next.js frontend, FastAPI REST services, Celery background worker queues, PostgreSQL relational schema, 40 test files in tree. [Evidence: `EV-DEVATLAS-ARCH`, `EV-DEVATLAS-TESTS`] |
| **5** | **CoverAI** | **71.72** | Viable | 13 | Measurable Ev: 5.8 (13 Tests Cap)<br>Prod Readiness: 6.0 (CI Cap) | Vehicle insurance claim OCR compliance engine; Next.js App Router, FastAPI backend, PaddleOCR document parser, structured damage assessment. [Evidence: `EV-COVERAI-ARCH`, `EV-COVERAI-AI`] |
| **6** | **grounded-knowledge-platform** | **71.61** | Viable | 7 | Measurable Ev: 5.5 (7 Tests Cap)<br>Prod Readiness: 6.0 (CI Cap) | Enterprise RAG engine combining PostgreSQL 16 (`pgvector` HNSW + `tsvector` FTS) with Redis cache/queue and server-derived SQL ACL tag enforcement. [Evidence: `EV-GROUNDED_KNOWLEDGE_PLATFORM-ARCH`, `EV-GKP-DB`] |
| **7** | **tenant-api-platform** | **70.86** | Provisional Flagship | 33 | Measurable Ev: 7.0 (Benchmark Cap)<br>Prod Readiness: 6.0 (CI Cap) | Go multi-tenant billing and service API; PostgreSQL Row-Level Security (RLS) tenant isolation; Redis token bucket rate limiting; 14 committed ADRs; historical benchmark artifact. [Evidence: `EV-TAP-RLS`, `EV-TAP-ADR`] |
| **8** | **event-stream-platform** | **68.44** | Provisional Flagship | 16 | Measurable Ev: 7.0 (Benchmark Cap)<br>Prod Readiness: 6.0 (CI Cap) | High-throughput Go telemetry streaming pipeline; `franz-go` client with Redpanda / Kafka; partitioned consumer groups, out-of-order sliding watermarks, DLQ routing; historical benchmark artifact. [Evidence: `EV-ESP-GO-MOD`, `EV-ESP-LOAD-BENCHMARK`] |
| **9** | **bustwatch** | **63.39** | Viable | 6 | Measurable Ev: 5.5 (6 Tests Cap)<br>Prod Readiness: 6.0 (CI Cap) | Transit delay prediction service; spatial clustering with DBSCAN, Redis caching, real-world Indian transit dataset integration. [Evidence: `EV-BUSTWATCH-ARCH`] |
| **10** | **floodlens** | **63.39** | Viable | 7 | Measurable Ev: 5.5 (7 Tests Cap)<br>Prod Readiness: 6.0 (CI Cap) | Hydrological elevation grid processing and flood inundation modeling using spatial raster data. [Evidence: `EV-FLOODLENS-ARCH`] |
| **11** | **OpenCode-Team** | **61.73** | Viable | 0 | Code Quality: 4.0 (Zero Test Cap)<br>Prod Readiness: 5.0 (Zero Test Cap) | Multi-agent DAG execution engine with git worktree isolation; published npm package (`opencode-teamwork`) with 7 CLI slash commands; capped due to 0 test files in repo. [Evidence: `EV-OCT-NPM-PACKAGE`, `EV-OCT-CONFLICT-LABELED`] |

---

## 4. Weak Projects (Exploratory & Auxiliary Repository Disposition)

The following repositories are categorized as exploratory, coursework, or auxiliary, and are excluded from the public flagship showcase:
*   `claw-code`: Third-party community fork; excluded to focus exclusively on candidate-developed repositories.
*   `solarwinds`: Incomplete script; archived.
*   `PulseGrid` & `FoodKart`: Empty repository stubs (0 bytes of code); excluded.
*   `HandyMan`: Incomplete UI demo without full backend integration.
*   `revenue-ops-orchestration`, `autonomus-sdr`, `intent-signal-engine`: Archived exploratory scripts; functionality superseded by `OpenCode-Team`.
*   `PaddleOcr` & `CosmosSteller`: Archived early student coursework scripts.
*   `asic-crc-engine`, `hardware-npi-lab`, `ate-fixture-lab`, `si-pi-lab`, `pcb-dfm-dft`, `pdn-thermal-lab`: Hardware RTL and PCB simulation suites; valid engineering artifacts but excluded from web/software engineering rankings.

---

## 5. Flagship Ranking & The Event-Stream vs. Tenant-API Tradeoff

To maximize complementary engineering evidence across target roles, `AGENT_MISSION.md` mandates a **maximum of 5 provisional flagships**. The first 4 slots are awarded based on calibrated scores and orthogonal role coverage:
1.  **`schemeGPT`** (Score: 77.05): Production RAG, Next.js 16 + FastAPI, pgvector, Reciprocal Rank Fusion, quote attribution gate. Covers **AI Engineer / Full-Stack AI**.
2.  **`Sentinel`** (Score: 75.49): AI quality gates, FastAPI validation proxy, OpenTelemetry Jaeger tracing, Prometheus metrics. Covers **ML Systems / AI Platform**.
3.  **`mcp-from-scratch`** (Score: 75.27): Pure stdlib Model Context Protocol, JSON-RPC 2.0 wire codec, stdio/SSE transports, 5-grader trajectory eval harness. Covers **AI Systems / Protocol Engineering**.
4.  **`DevAtlas`** (Score: 73.78): Full-stack developer intelligence platform, Next.js + FastAPI + Celery, PostgreSQL schema, 40 test files in tree. Covers **Full-Stack Engineer / AI Product Engineer**.

### 5.1 The Event-Stream vs. Tenant-API Tradeoff (5th Flagship Slot)
Two Go backend repositories compete for the final provisional flagship slot:

| Evaluation Dimension | `tenant-api-platform` (Candidate A) | `event-stream-platform` (Candidate B) |
| :--- | :--- | :--- |
| **Calibrated Total Score** | **70.86** (Rank 7) | **68.44** (Rank 8) |
| **Primary Systems Signal** | Multi-tenant authorization, PostgreSQL Row-Level Security, Redis token bucket rate limiting. | Distributed streaming ingestion, partitioned consumer groups, sliding window watermarks, Dead-Letter Queues. |
| **Stack & Protocols** | Go `net/http`, PostgreSQL (RLS), Redis, Docker Compose. | Go (`franz-go`), Redpanda / Kafka, PostgreSQL, Docker Compose. |
| **Documentation Depth** | 14 committed Architecture Decision Records (`docs/adr/*.md`). | Architecture README with streaming pipeline flowcharts and fuzz testing suite. |
| **Measurable Evidence** | Historical committed load benchmark (`load/results.json`, capped at 7.0). | Historical committed load benchmark (`load/ingest-results.json`, capped at 7.0). |
| **Ecosystem Orthogonality** | Relational multi-tenancy overlaps with `DevAtlas` (Postgres + Redis). | Streaming event queues and backpressure are **completely orthogonal** to all other 4 flagships. |

### 5.2 Tradeoff Resolution: Selecting `event-stream-platform`
While `tenant-api-platform` achieves a higher mathematical score (70.86 vs 68.44) and features exceptional documentation (14 ADRs), **`event-stream-platform` is selected as the 5th provisional flagship**.

*Rationale*: `DevAtlas` already supplies strong proof of relational database design, REST APIs, and multi-service Docker orchestration. Featuring `tenant-api-platform` would create redundant relational API signal. In contrast, `event-stream-platform` provides irreplaceable evidence of distributed event-driven systems: partitioned message consumption, consumer group rebalancing, and sliding-window event watermarks via `franz-go` and Redpanda. `tenant-api-platform` remains the designated alternate flagship, fully documented in `docs/portfolio/project-inventory.md`.

---

## 6. Role Coverage Assessment

| Target Role | Coverage Rating | Primary Anchoring Projects | Remaining Signal Gaps |
| :--- | :---: | :--- | :--- |
| **AI Engineer** | **STRONG** | `schemeGPT`, `mcp-from-scratch`, `Sentinel` | Dynamic context caching, test-time compute allocation. |
| **Forward Deployed Engineer (FDE)** | **STRONG** | `schemeGPT`, `CoverAI`, `floodlens`, `bustwatch` | Live deployment verification, customer runbook validation under fault conditions. |
| **Backend Engineer** | **STRONG** | `event-stream-platform`, `tenant-api-platform`, `schemeGPT` | Live distributed concurrency load tests, multi-node database replication. |
| **ML Systems Engineer** | **MODERATE** | `Sentinel` (OTel), `event-stream-platform`, `mcp-from-scratch` | GPU kernel optimizations (Triton/CUDA), live inference KV-cache routing. |
| **Systems / Platform Engineer** | **MODERATE** | `event-stream-platform`, `tenant-api-platform`, `asic-crc-engine` | Distributed consensus (Raft/Paxos), partition tolerance verification. |
| **AI Product Engineer** | **STRONG** | `DevAtlas`, `OpenCode-Team`, `schemeGPT`, `portfolio` | Production telemetry collection, automated end-to-end browser tests. |

---

## 7. Missing Engineering Signals

To achieve comprehensive coverage across frontier 2026 hiring expectations, the following verified gaps must be bridged:
1.  **Inference Economics & Context Caching**: Demonstrating how to minimize token costs and Time-to-First-Token (TTFT) via semantic prefix sharing and dynamic KV cache routing.
2.  **Live Streaming Drift Detection**: Moving beyond batch/offline evals to real-time embedding drift detection over live inference streams.
3.  **Distributed Consensus**: Tangible implementation of Raft leader election, linearizable state machines, or log replication.
4.  **Enterprise Tool Gateway**: Multi-tenant authorization, tool RBAC, and security mediation for fleets of Model Context Protocol (MCP) servers.
5.  **Adversarial Agent Security (Red-Teaming)**: Automated prompt injection fuzzing and tool abuse simulation in sandboxed runtime environments.

---

## 8. Recommended Conceptual Systems (R&D Proposals)

To bridge the identified signal gaps without fabricating unbuilt systems, we propose **five conceptual systems**. Every system is explicitly designated as **FUTURE / UNBUILT / CONCEPTUAL R&D** and is scored using transparent 1–5 integer inputs anchored to the matrix gaps:

ConceptValue = RoleDemand (1-5) * MissingSignal (1-5) * Demonstrability (1-5) * TechnicalDepth (1-5) / BuildCost (1-5)

$$\text{ConceptValue} = \frac{\text{RoleDemand (1-5)} \times \text{MissingSignal (1-5)} \times \text{Demonstrability (1-5)} \times \text{TechnicalDepth (1-5)}}{\text{BuildCost (1-5)}}$$

| System Name | Technical Domain | Signal Addressed | RD | MS | Dem | TD | BC | Formula Calculation | ConceptValue |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Aether-Gateway** | Enterprise MCP Proxy | Multi-tenant MCP auth, tool RBAC, audit logging | 5 | 4 | 4 | 4 | 3 | $(5 \times 4 \times 4 \times 4) \div 3$ | **106.67** |
| **Chronos-Drift** | Streaming Observability | Real-time token drift & embedding anomaly monitoring | 4 | 4 | 4 | 4 | 3 | $(4 \times 4 \times 4 \times 4) \div 3$ | **85.33** |
| **KVCache-Router** | ML Systems / Inference | Semantic prefix caching & Radix Tree KV cache routing | 5 | 5 | 3 | 5 | 4 | $(5 \times 5 \times 3 \times 5) \div 4$ | **93.75** |
| **Chaos-Agent** | AI Safety / Red Teaming | Adversarial prompt fuzzing & agent sandbox testing | 4 | 4 | 4 | 4 | 2 | $(4 \times 4 \times 4 \times 4) \div 2$ | **128.00** |
| **Raft-KV-Mesh** | Distributed Systems | Raft consensus key-value store with linearizable reads | 4 | 5 | 3 | 5 | 4 | $(4 \times 5 \times 3 \times 5) \div 4$ | **75.00** |

---

## 9. Portfolio Architecture Proposal

In accordance with **ADR-001**, the portfolio will implement the **Systems Ledger / Blueprint v2** architecture:
1.  **Fixed System HUD**: Header showing target role tag, theme toggle, and section anchors: `[01] PRODUCTS`, `[02] SYSTEMS (R&D)`, `[03] CAPABILITIES`, `[04] NOTES`, `[05] GITHUB`.
2.  **Role Filter Pills**: Subtle toggle pills allowing visitors to view projects filtered for `ALL`, `AI ENGINEER`, `FORWARD DEPLOYED`, `BACKEND/SYSTEMS`.
3.  **Strict Product Segregation**:
    *   `[01] PRODUCTS`: 5 provisional flagships with full dossiers (`/projects/[slug]`).
    *   `[02] CONCEPTUAL SYSTEMS (R&D)`: Distinct card grid presenting the 5 conceptual systems with architecture specs, failure modes, and `ConceptValue` rationale.
4.  **Engineering Capabilities Ledger**: Replacing generic percentage bars with a verified capability grid directly linking technical skills to evidence in `evidence-ledger.json`.

---

## 10. Technical Debt Register

1.  **Missing `portfolio/.eslintrc.json`**: Root `npm run lint` delegates to Next.js which prompts interactively. Resolution: Add strict `.eslintrc.json` extending `next/core-web-vitals`.
2.  **Custom Express Server (`server.js`)**: While operational for local development, production Vercel deployments bypass `server.js` and serve static Next.js assets directly. Resolution: Copy research images into `portfolio/public/research/` so Vercel builds do not depend on Express.
3.  **Missing Automated E2E Browser Testing**: No Playwright suite currently tests page hydration, theme toggle invariants, or mobile drawer navigation. Resolution: Schedule Playwright test suite in Milestone M15.

---

## 11. Deployment State

*   **Local Production Build**: Verified. `npm run build` compiles 12 static HTML/SSG pages with 0 compilation errors. First load JS is 106 kB.
*   **Vercel Configuration**: `vercel.json` exists in project root specifying `framework: nextjs`, `buildCommand: npm run build`, `installCommand: npm install`.
*   **Public URL**: `https://portfolio-gray-five-72.vercel.app` (recorded in GitHub repository metadata).
*   **Phase 1 Quarantine Gate**: In strict compliance with `AGENT_MISSION.md`, **no remote deployments or git pushes are executed in this phase**.

---

## 12. Security Concerns & Unresolved Audit Checks

1.  **Unexecuted Test Suites**: While test source files exist across 14 repositories, zero test execution logs or passing test runs were captured in this static snapshot.
2.  **Unexecuted CI Workflows**: While `.github/workflows/*.yml` files exist in repositories like `Sentinel` and `schemeGPT`, remote GitHub Actions job logs were not verified.
3.  **Static Secret Scan Limitation**: Static inspection of captured paths observed standard `.env.example` templates; dynamic SAST, automated secret scanners (e.g. gitleaks, trufflehog), and live penetration tests were unexecuted.
4.  **Unverified Live Deployment Availability**: Live deployment URLs recorded in repository metadata have not been probed for live HTTP uptime or SSL health.

---

## 13. Immediate Priorities (Phase 2 Entry)

1.  Initialize `.eslintrc.json` in `portfolio/` to resolve interactive linting debt.
2.  Migrate legacy `/research` assets into `portfolio/public/research/` to guarantee cloud deployment independence.
3.  Implement the Role Filter Pills and Conceptual Systems section in `portfolio/app/page.tsx`.
4.  Expand the flagship dossiers to surface verifiable metrics, system flowcharts, and Docker runbooks.

---

## 14. Implementation Roadmap Summary (M0–M18)

The 19 implementation milestones are sequenced in `.agent/ROADMAP.md` based on the formula:
$$\text{Priority} = \frac{\text{Impact} \times \text{Confidence} \times \text{RoleRelevance} \times \text{EvidenceValue}}{\text{Effort}}$$

*   **M0–M1**: Technical debt resolution, lint configuration, and asset unification.
*   **M2–M5**: Information architecture upgrade, role filter bar, and section re-structuring.
*   **M6–M9**: Flagship dossier progressive disclosure, ASCII architecture diagrams, and runbook integration.
*   **M10–M12**: Conceptual systems implementation (Aether-Gateway, Chronos-Drift, KVCache-Router).
*   **M13–M15**: Testing expansion (Playwright E2E suites, Lighthouse performance audits).
*   **M16–M18**: Production deployment verification, live URL validation, and post-launch reflection.
