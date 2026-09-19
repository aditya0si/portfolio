# Portfolio Engineering Experiments Register

## Experiment Tracking Methodology
Every optimization or structural change is treated as an empirical experiment with a stated hypothesis, measurable verification metric, baseline, and falsifiable outcome.

---

## Active & Planned Experiments

### EXP-001: Three-Direction Information Architecture Multi-Persona Review
- **Hypothesis**: Presenting projects in a high-density, schematic "Systems Ledger" format with explicit failure modes and verified metrics will score higher across Staff Engineer and Skeptical Interviewer reviews than a standard Vercel SaaS dark mode.
- **Metric**: Multi-persona qualitative evaluation matrix (Recruiter, Staff Engineer, Designer, SRE/Performance).
- **Baseline**: Existing portfolio layout (`portfolio/app/page.tsx`).
- **Variants Tested**:
  - Variant A: Systems Ledger / Hardware-Software Blueprint (Refined)
  - Variant B: Interactive Split-Pane Product Console
  - Variant C: Technical Whitepaper Monograph
- **Result**: **Variant A selected** with unanimous consensus across technical personas (Staff, SRE, Performance) while incorporating role-filter ergonomics from Variant B.
- **Status**: **CONCLUDED** (Documented in [ADR-001](file:///C:/Users/oliad/Desktop/Portfolio/docs/decisions/ADR-001-information-architecture-and-design-direction.md)).

---

### EXP-002: Role Filter Navigation vs. Monolithic Scroll
- **Hypothesis**: Adding accessible role filter pills (`ALL`, `AI ENGINEER`, `FORWARD DEPLOYED`, `BACKEND/SYSTEMS`) will reduce time-to-signal for recruiters from >45s to <15s without breaking static site generation.
- **Metric**: Time-to-relevant-project during simulated recruiter walkthroughs; DOM node complexity and bundle size.
- **Baseline**: Monolithic vertical scroll with all projects listed in fixed order.
- **Variant**: Stateful client-side filter with zero layout shift (hidden items collapse cleanly using CSS).
- **Scheduled**: Milestone M2.
- **Status**: **PLANNED**.

---

### EXP-003: Asset Harmonization & Cloud Build Independence
- **Hypothesis**: Moving `/research` images into `portfolio/public/research/` will eliminate Express `server.js` dependency on cloud hosting, allowing pure static edge deployments on Vercel with 0 missing assets.
- **Metric**: 404 response rate on research assets under Next.js static production build.
- **Baseline**: `server.js` serves images from `../research/`; Vercel build does not bundle `../research/`.
- **Variant**: Unified asset directory inside `portfolio/public/research/`.
- **Scheduled**: Milestone M1.
- **Status**: **PLANNED**.

---

### EXP-004: Anti-AI-Slop Metric Citation Enforcement
- **Hypothesis**: Appending explicit measurement sources to every displayed metric (e.g., `HISTORICAL BENCHMARK ARTIFACT`, `PYTEST SUITE IN TREE`, `EVAL HARNESS REPORT`) will increase perceived technical credibility by skeptical interviewers compared to unanchored numbers.
- **Metric**: Skeptical interviewer rubric score; 100% absence of unverified claims.
- **Baseline**: Bare metric numbers with 2-word labels.
- **Variant**: Two-tier metric chips displaying value + measurement mechanism tag.
- **Scheduled**: Milestone M3.
- **Status**: **PLANNED**.
