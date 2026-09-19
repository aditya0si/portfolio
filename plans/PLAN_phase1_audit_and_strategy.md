# Implementation Plan — Portfolio Transformation: Phase 1 Audit & Strategy

## Section A — Goal & Acceptance Criteria

### Technical Restatement
Execute Phase 1 ("Audit and Strategy") of the portfolio engineering program delegation specified in `AGENT_MISSION.md`. The goal is to perform a rigorous, evidence-first audit of the existing Next.js portfolio codebase, the owner's 47-repository GitHub ecosystem (`aditya0si`), and 2026 hiring signals across nine target engineering roles (AI Engineer, Forward Deployed Engineer, Software Engineer, Backend Engineer, Full-Stack Engineer, AI Product Engineer, Applied AI Engineer, ML Systems Engineer, and Systems/Platform Engineer). The audit produces 13 durable operational and strategic artifacts documenting baseline metrics, complete repository inventory, category-weighted project scorings (normalized to 100), flagship selections, signal-gap coverage, 4–8 conceptual system proposals, 3 independent information architecture designs critiqued across 9 reviewer personas, an ADR selection, and an execution roadmap (M0–M18). No production deployment or code refactoring of the portfolio UI is performed in this phase.

### Observable "Done" Definition
1. **Repository & Build Baseline Recorded**: Exact outcomes of test execution (`npm test`), TypeScript verification (`npx tsc --noEmit`), and production build (`npm run build`) documented with limitations (such as ESLint configuration initialization).
2. **Exhaustive GitHub Inventory**: All 47 public and private repositories under `aditya0si` inspected via `gh` API and cataloged across 28 required fields in `docs/portfolio/project-inventory.md` without omission.
3. **Rigorous Weighted Project Scoring**: Every viable project scored across 11 weighted categories summing to 100% in `docs/portfolio/project-scores.json`, verified programmatically for mathematical correctness and valid JSON schema.
4. **Market-Grounded Role Signal Research**: `docs/research/2026-role-signals.md` completed with verifiable URLs from leading 2025–2026 engineering teams (Anthropic, OpenAI, Palantir, Scale AI, Stripe, Cursor, Databricks) distinguishing observed requirements from interpretation.
5. **Role-Signal Matrix**: `docs/portfolio/role-signal-matrix.md` mapping candidate evidence across 15 technical domains with falsifiable ratings (`NONE`, `WEAK`, `MODERATE`, `STRONG`).
6. **Provisional Flagships & Conceptual Systems**: 4–5 complementary flagships selected against strict eligibility gates, and 4–8 conceptual systems proposed with mathematical `ConceptValue` formula scoring to address verified coverage gaps.
7. **Three-Way Information Architecture Critique & ADR**: Three distinct design directions evaluated across 9 engineering and recruiting personas, with the winning architecture recorded as an Architecture Decision Record in `docs/decisions/ADR-001-information-architecture-and-design-direction.md`.
8. **Implementation Roadmap (M0–M18)**: Complete 19-milestone implementation plan prioritized by `Impact × Confidence × RoleRelevance × EvidenceValue ÷ Effort` in `.agent/ROADMAP.md`.
9. **All Durable Operational Artifacts Established**: `.agent/MASTER_STATE.md`, `.agent/ROADMAP.md`, `.agent/DECISIONS.md`, `.agent/KNOWN_ISSUES.md`, `.agent/EXPERIMENTS.md`, `.agent/METRICS.md`, `.agent/NEXT_ACTIONS.md`, and `docs/portfolio/INITIAL-AUDIT.md` created with 100% factual integrity and zero AI slop.
10. **Build & Test Parity**: Baseline tests and Next.js build re-run and passing post-audit documentation creation.

### Out of Scope
- Direct UI redesign or code refactoring of `portfolio/app/` components in this phase (strictly deferred to implementation milestones M2+).
- Git push to remote repository (`origin/main`) or Vercel deployment during this phase.
- Fabrication of any metric, user count, benchmark, or work experience not grounded in repository code, commit history, or confirmed user details.

---

## Section B — Tech Stack & Constraints

- **Execution Environment**: Windows 11, PowerShell, Node.js v22.23.2, npm.
- **Audited Repository Stack**: Next.js 14.2.24 (App Router), React 18.3.1, TypeScript 5.7.3, Tailwind CSS 3.4.17, Express custom server (`server.js`), Lucide React.
- **External Tooling & APIs**: GitHub CLI (`gh` v2.x authenticated as `aditya0si`), Web Search / Vertex Grounding for 2026 hiring signal retrieval.
- **Architectural Decisions & Alternatives Considered**:
  - *Alternative 1: Perform audit on only the 4 currently displayed projects in `portfolio/lib/data.ts`.*
    - **Rejected because** `AGENT_MISSION.md` explicitly mandates inspecting all 47 repositories under `aditya0si` so no viable candidate project is silently omitted.
  - *Alternative 2: Immediately begin refactoring `portfolio/app/page.tsx` into a new layout.*
    - **Rejected because** the delegation brief explicitly prohibits premature UI redesign before establishing baseline evidence, role coverage, and IA consensus.
  - *Alternative 3: Guess or fabricate production benchmarks for student projects.*
    - **Rejected because** "Truth over impressiveness" is a hard non-negotiable. Metrics must be cited from actual test runs, CI logs, or labeled as synthetic benchmarks where empirical production traffic does not exist.

### Stack Impact
- **Touched**:
  - Creation of `.agent/*` operational state files.
  - Creation of `docs/research/*`, `docs/portfolio/*`, and `docs/decisions/*` audit and strategy files.
  - Creation of `plans/PLAN_phase1_audit_and_strategy.md`.
  - Creation of `qna.md` (if any blocking personal questions arise).
- **Untouched**:
  - `portfolio/app/*` (all pages and components untouched).
  - `portfolio/lib/*` (existing runtime code untouched).
  - Git remote state (`origin/main` untouched; no push or deploy).

---

## Section C — Blocking Questions (0–3) & Assumptions

### Blocking Questions (0–3)
- **None (0)**. All necessary repository code, commit histories, GitHub APIs, and web search capabilities are available. Engineering decisions for scoring, architecture critique, and gap identification can be made using evidence-based reasoning without blocking the user. If biographical preferences emerge later, they will be logged in `qna.md`.

### Falsifiable Assumptions
- `[ASSUMPTION 1: Target Roles]`: The nine roles specified in `AGENT_MISSION.md` represent the complete evaluation envelope, with primary weighting placed on AI Engineer, Forward Deployed Engineer, and Backend/Systems roles.
- `[ASSUMPTION 2: Repository Scope]`: The 47 repositories fetched via `gh repo list aditya0si` represent the entire public and accessible private GitHub footprint of the candidate.
- `[ASSUMPTION 3: Scoring Integrity]`: Scoring weights (18% engineering depth, 14% AI relevance, 14% production readiness, 12% systems/backend, 10% product completeness, 8% originality, 7% measurable evidence, 6% code quality, 5% docs/explainability, 4% interview depth, 2% demonstrability) are fixed by `AGENT_MISSION.md` and strictly sum to 100%.
- `[ASSUMPTION 4: Baseline Health]`: `npm test`, `npx tsc --noEmit`, and `npm run build` define the baseline correctness bar; the missing `.eslintrc.json` for standalone `next lint` is a documented technical debt item to resolve in M0/M1 rather than a blocker for Phase 1.
- `[ASSUMPTION 5: Non-Destructive Operations]`: No git commits, tags, resets, pushes, or deployments will be executed in Phase 1.

---

## Section D — Session Modularization

### Session 1: Baseline Verification & Ecosystem Inspection
- **Objective**: Establish exact compilation, test, and type-checking baselines; extract complete structural and metadata details for all 47 repositories.
- **Scope**: Execution of `npm test`, `tsc --noEmit`, `npm run build`, and script-driven `gh api` extraction across all repos.
- **Output**: `research/all_repos.json`, `research/repo_details.json`, `research/deep_inspect.json`.
- **Connects To**: Feeds repository details into project inventory and scoring.
- **Failure Surface**: GitHub API rate limits or network failures (mitigated via local caching).

### Session 2: Market Signal Research & Role-Signal Matrix
- **Objective**: Synthesize verified 2026 hiring criteria across 9 target roles and map against candidate evidence.
- **Scope**: `docs/research/2026-role-signals.md` and `docs/portfolio/role-signal-matrix.md`.
- **Output**: Detailed market criteria with live URL citations and coverage ratings (`NONE`/`WEAK`/`MODERATE`/`STRONG`).
- **Connects To**: Identifies exact signal gaps needed to motivate conceptual systems.
- **Failure Surface**: Outdated or generic job summaries (mitigated by referencing live 2025–2026 career postings from OpenAI, Anthropic, Palantir, Scale AI, Stripe).

### Session 3: Repository Inventory, Scoring & Flagship Selection
- **Objective**: Complete exhaustive 28-field inventory of all 47 repositories, calculate normalized 100-point scores for viable projects, and select 3–5 provisional flagships.
- **Scope**: `docs/portfolio/project-inventory.md`, `docs/portfolio/project-scores.json`, and verification scripts.
- **Output**: Validated JSON dataset and markdown inventory table with rationale.
- **Connects To**: Feeds into Initial Audit and Architecture design.
- **Failure Surface**: Score calculation errors (mitigated by automated verification script).

### Session 4: Conceptual Systems, Architecture Directions & Initial Audit
- **Objective**: Formulate 4–8 conceptual systems with formulaic `ConceptValue` scoring, evaluate 3 independent IA directions across 9 reviewer personas, record ADR in `docs/decisions/`, and write comprehensive `docs/portfolio/INITIAL-AUDIT.md`.
- **Scope**: `docs/decisions/ADR-001-information-architecture-and-design-direction.md`, `docs/portfolio/INITIAL-AUDIT.md`.
- **Output**: Executive audit report and architectural blueprint.
- **Connects To**: Guides Phase 2 implementation.
- **Failure Surface**: Subjective claims or AI slop (mitigated by strict adversarial self-review).

### Session 5: Operational State Artifacts & Phase 1 Verification
- **Objective**: Establish the seven `.agent/*` durable tracking files, record M0–M18 roadmap, re-run baseline checks, and document exit state.
- **Scope**: `.agent/MASTER_STATE.md`, `.agent/ROADMAP.md`, `.agent/DECISIONS.md`, `.agent/KNOWN_ISSUES.md`, `.agent/EXPERIMENTS.md`, `.agent/METRICS.md`, `.agent/NEXT_ACTIONS.md`, `qna.md`.
- **Output**: 100% completed Phase 1 artifact package with zero unverified assertions.
- **Connects To**: Ready for user alignment gateway before Phase 2 code execution.
- **Failure Surface**: Build regression caused by documentation or script additions (mitigated by final test and build run).

---

## Section E — Progress Checklist

- [x] Session 1: Baseline Verification & Ecosystem Inspection
  - [x] Run and record `npm test` baseline (5/5 unit tests passing)
  - [x] Run and record `tsc --noEmit` baseline (0 type errors)
  - [x] Run and record `npm run build` baseline (12 static pages generated, exit code 0)
  - [x] Record `next lint` limitation (missing `.eslintrc.json`)
  - [x] Extract full metadata and file trees for all 47 GitHub repositories
- [ ] Session 2: Market Signal Research & Role-Signal Matrix
  - [ ] Author `docs/research/2026-role-signals.md` with verified URLs
  - [ ] Author `docs/portfolio/role-signal-matrix.md` with 15-domain coverage ratings
- [ ] Session 3: Repository Inventory, Scoring & Flagship Selection
  - [ ] Author `docs/portfolio/project-inventory.md` covering all 47 repos across 28 fields
  - [ ] Generate and validate `docs/portfolio/project-scores.json` with formulaic weights
  - [ ] Select 4–5 complementary provisional flagships against eligibility gates
- [ ] Session 4: Conceptual Systems, Architecture Directions & Initial Audit
  - [ ] Propose and score 4–8 real conceptual systems with `ConceptValue` math
  - [ ] Formulate 3 independent IA directions and critique across 9 personas
  - [ ] Record `docs/decisions/ADR-001-information-architecture-and-design-direction.md`
  - [ ] Author `docs/portfolio/INITIAL-AUDIT.md` covering all 14 required sections
- [ ] Session 5: Operational State Artifacts & Phase 1 Verification
  - [ ] Create `.agent/MASTER_STATE.md`
  - [ ] Create `.agent/ROADMAP.md` (M0–M18 prioritized by ICE formula)
  - [ ] Create `.agent/DECISIONS.md`
  - [ ] Create `.agent/KNOWN_ISSUES.md`
  - [ ] Create `.agent/EXPERIMENTS.md`
  - [ ] Create `.agent/METRICS.md`
  - [ ] Create `.agent/NEXT_ACTIONS.md`
  - [ ] Create `qna.md` documenting non-assumable questions or confirming 0 blockers
  - [ ] Re-run `npm test` and `npm run build` for final verification
  - [ ] Run programmatic JSON and math verification on `project-scores.json`
  - [ ] Conduct adversarial anti-AI-slop review
