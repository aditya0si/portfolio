# Program Architecture & Engineering Decisions Log

## Summary of Decisions

| Decision ID | Date | Subject | Status | Summary of Decision & Rationale |
| :---: | :---: | :--- | :---: | :--- |
| **DEC-001** | 2026-09-19 | **Design Direction & IA** | **ACCEPTED** | Adopted **Direction A (The Systems Ledger / Blueprint v2)** combining high-density technical schematics with role-filter navigation. Rejected generic Vercel SaaS template (Direction B) and text-heavy monograph (Direction C). Documented in [ADR-001](file:///C:/Users/oliad/Desktop/Portfolio/docs/decisions/ADR-001-information-architecture-and-design-direction.md). |
| **DEC-002** | 2026-09-19 | **Provisional Product Candidate Roster** | **ACCEPTED** | Surface 5 complementary candidates in the UI: `schemeGPT` (RAG), `Sentinel` (guardrails/OTel), `mcp-from-scratch` (protocol), `tenant-api-platform` (multi-tenant Go API), and `event-stream-platform` (Go streaming). Candidates remain provisional until their listed execution and live-deployment gaps close. |
| **DEC-003** | 2026-09-19 | **Strict Truth & Evidence Model** | **ACCEPTED** | Enforced Contractor Standard ("Truth over impressiveness"). Prohibited unverified metrics, synthetic claims, or ungrounded benchmarks. Every metric displayed must cite its verified source (e.g. `HISTORICAL BENCHMARK ARTIFACT`, `PYTEST SUITE IN TREE`, `EVAL HARNESS REPORT`). |
| **DEC-004** | 2026-09-19 | **Explicit Conceptual System Labeling** | **ACCEPTED** | All proposed systems designed to bridge signal gaps (`Aether-Gateway`, `Chronos-Drift`, `KVCache-Router`, `Chaos-Agent`, `Raft-KV-Mesh`) are explicitly marked as `CONCEPTUAL SYSTEM (R&D)` and placed in a dedicated section with transparent 1–5 integer `ConceptValue` formula scores. |
| **DEC-005** | 2026-09-19 | **Phase 1 Isolation Gate & Status** | **ACCEPTED** | Strictly quarantined Phase 1 to audit, research, and durable artifact creation. Set Phase 1 status to **VERIFIED-PARTIAL (DRAFT)** pending physical execution verification in Phase 2. Prohibited remote git pushes, Vercel deployments, or premature UI redesigns. |
| **DEC-006** | 2026-09-19 | **Static Site Generation (SSG) Architecture** | **ACCEPTED** | Preserved Next.js static generation for all routes to guarantee zero server cold starts, 100% availability during recruiter traffic, and deterministic pre-rendering. |
