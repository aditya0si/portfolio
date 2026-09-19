# ADR-001: Information Architecture & Design Direction for 2026 Engineering Portfolio

## Status
**ACCEPTED** (Design Decision finalized; implementation scheduled for Phase 2 Milestones M0–M5)

## Date
2026-09-19

## Context & Problem Statement
Aditya Singh's portfolio must position him for high-impact 2026 engineering roles (**AI Engineer**, **Forward Deployed Engineer**, **Backend Engineer**, **ML Systems Engineer**, **Systems / Platform Engineer**, and **AI Product Engineer**). The existing website (`portfolio/`) implements an initial light/dark blueprint concept with 4 project cards, an interactive AI notes component, experience notes, and education.

To fulfill the requirements of `AGENT_MISSION.md`, the site must:
1.  Transition from a generic personal showcase to an **evidence-first engineering product catalog + technical profile + interactive system explorer**.
2.  Eliminate all "AI slop": inflated claims, repetitive cards, buzzword piles, fake terminals, and arbitrary skill bars.
3.  Strictly segregate **candidate flagship projects** (`[01] PRODUCTS`) from **conceptual future architectures** (`[02] CONCEPTUAL SYSTEMS (R&D)`).
4.  Enable rapid recruiter triage (30-second scan path) while providing deep technical rigor for skeptical staff-level interviewers.

---

## Decision Candidates: Three Information Architectures

### Direction A: The Systems Ledger / Blueprint v2 (Selected Direction)
*   **Design Aesthetic**: High-density engineering schematic inspired by aerospace telemetry consoles, hardware datasheets, and UNIX systems. Dark slate background (`#0b0f17`), sharp 1px borders, subtle grid overlays, monospaced metadata ledgers, and technical amber/cyan status badges.
*   **Information Architecture**:
    *   **Fixed HUD**: Live status indicator (`OPEN TO WORK`), target role tag, theme switcher, and persistent jump links (`[01] PRODUCTS`, `[02] SYSTEMS`, `[03] CAPABILITIES`, `[04] NOTES`, `[05] GITHUB`).
    *   **Hero / Credibility Snapshot**: Name, primary engineering focus, verified quantitative proof points (47 repositories audited, published npm package `opencode-teamwork`, hackathon engineering prototypes).
    *   **Role Filter Pills**: Subtle toggle pills (`ALL`, `AI ENGINEER`, `FORWARD DEPLOYED`, `BACKEND/SYSTEMS`) allowing instant filtering of the product catalog.
    *   **[01] Candidate Products (`Products`)**: Progressive disclosure dossiers for 5 provisional flagships (`schemeGPT`, `Sentinel`, `mcp-from-scratch`, `DevAtlas`, `event-stream-platform`). Each card surfaces: Role Signal, Status, Problem, System Flow, 4–6 Architecture Highlights, Verifiable Metrics, and Source/Runbook links.
    *   **[02] Conceptual Systems (`R&D / Systems`)**: Distinct card grid presenting 5 conceptual systems (`Aether-Gateway`, `Chronos-Drift`, `KVCache-Router`, `Chaos-Agent`, `Raft-KV-Mesh`) with explicit `FUTURE / UNBUILT` labeling and transparent 1–5 `ConceptValue` formula scores.
    *   **[03] Engineering Capabilities Ledger**: 35-capability evidence matrix directly linking technical skills to registered Evidence IDs in `evidence-ledger.json`.
    *   **[04] Technical Field Notes (`Notes`)**: Curated technical field notes across AI systems engineering with keyboard navigation.
    *   **[05] Repository Explorer / GitHub Live**: Clean API strip indexing verified repositories.

### Direction B: The Interactive Product Console / Split-Pane Workbench
*   **Design Aesthetic**: Linear / Vercel-inspired dark mode. Rounded cards (`rounded-xl`), floating command bar, blurred glassmorphic overlays, and soft indigo gradients.
*   **Information Architecture**:
    *   Full-width role-selector tab bar at top (`[All] [AI Eng] [FDE] [Backend] [Platform]`).
    *   Split-pane layout: Left column contains a vertical list of projects; right pane renders an interactive simulated API console, live request builder, or interactive code snippet viewer.
    *   Full-screen modal drawers for deep project dossiers.

### Direction C: The Technical Dossier / Whitepaper Monograph
*   **Design Aesthetic**: ACM Digital Library / Stripe Press editorial format. Warm off-white / monochrome dark, serif display typography paired with JetBrains Mono, single-column prose with margin sidenotes and technical footnotes.
*   **Information Architecture**:
    *   Academic paper abstract hero with executive summary.
    *   Linear deep-dive case studies formatted as technical engineering post-mortems and architecture whitepapers.
    *   Appendix containing raw repository tables and benchmark logs.

---

## Multi-Perspective Persona Review

### 1. Specialist Recruiter Review
*   **Direction A (Systems Ledger)**: **STRONG**. The 30-second scan path is effortless. Quantitative credibility metrics, clear role tags, and the role filter pills allow immediate qualification for specific job requisitions.
*   **Direction B (Interactive Console)**: **MODERATE**. Interactive widgets and split panes distract from fast resume matching; recruiters spend extra clicks navigating between panes.
*   **Direction C (Monograph)**: **WEAK**. Too text-dense. Recruiters bouncing within 45 seconds will not read 4,000 words of technical prose to find core technologies.

### 2. Staff Software Engineer Review
*   **Direction A (Systems Ledger)**: **STRONG**. Focuses squarely on architecture, failure modes, data invariants, and verifiable code links. Explicitly segregating conceptual systems from candidate project code builds immediate trust.
*   **Direction B (Interactive Console)**: **MODERATE**. Interactive mock simulators often feel like frontend toys ("AI slop") rather than serious backend/systems engineering.
*   **Direction C (Monograph)**: **STRONG**. Exceptional technical depth and post-mortem narrative, but lacks rapid architectural cross-referencing.

### 3. Designer Review
*   **Direction A (Systems Ledger)**: **STRONG**. Highly differentiated and authentic aesthetic. Avoids generic template fatigue and establishes a cohesive visual language grounded in engineering precision.
*   **Direction B (Interactive Console)**: **MODERATE**. Visually clean, but resembles hundreds of standard SaaS portfolio templates.
*   **Direction C (Monograph)**: **STRONG**. Elegant typography and reading rhythm, but conveys an academic researcher persona rather than a high-agency systems builder.

### 4. SRE & Performance Engineer Review
*   **Direction A (Systems Ledger)**: **STRONG**. 100% static site generation (Next.js SSG); small client JS footprint (106 kB first load JS); engineered with pre-allocated layout dimensions to prevent client-side layout shifts; instant page transitions.
*   **Direction B (Interactive Console)**: **WEAK**. Split-pane state synchronization and interactive mock runtimes increase client bundle size and risk mobile performance bottlenecks.
*   **Direction C (Monograph)**: **STRONG**. Minimal client JavaScript; fast first contentful paint.

---

## Decision & Rationale

We unanimously adopt **Direction A: The Systems Ledger / Blueprint v2**, incorporating the following ergonomic refinements:
1.  **Role Filter Pills**: Subtle, accessible role filter pills (`ALL`, `AI ENGINEER`, `FORWARD DEPLOYED`, `BACKEND/SYSTEMS`) in the product catalog header to allow recruiters to instantly filter flagships and conceptual dossiers.
2.  **Explicit Section Nomenclature**: Candidate flagship projects live strictly under `[01] PRODUCTS`, and conceptual architectures under `[02] CONCEPTUAL SYSTEMS (R&D)`.
3.  **Dossier Progressive Disclosure**: Maintain fast-skimming overview cards on `/` with one-click deep-dive routes at `/projects/[slug]`.
4.  **Anti-Slop Hardening**: Enforce that every metric displayed is accompanied by its verifiable measurement mechanism (e.g. `HISTORICAL BENCHMARK ARTIFACT`, `PYTEST SUITE IN TREE`, `EVAL HARNESS REPORT`).
5.  **Truthful Milestone Scoping**: Acknowledge that runtime execution and live deployment verification remain provisional pending Phase 2 physical execution.

---

## Consequences
*   **Positive**:
    *   Instantly differentiates Aditya Singh from generic portfolio templates.
    *   Highlights deep systems and hardware literacy alongside modern AI engineering.
    *   Delivers high static performance with zero server-side rendering cold starts.
    *   Satisfies all requirements of `AGENT_MISSION.md`.
*   **Tradeoffs & Mitigations**:
    *   *Tradeoff*: High information density can overwhelm casual mobile visitors.
    *   *Mitigation*: Implement clean responsive breakpoints where secondary metadata tables collapse into accessible disclosure accordions on mobile viewports.
