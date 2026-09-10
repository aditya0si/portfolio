# Implementation Plan — AI Concepts & Tech Terms Section

## Section A — Goal & Acceptance Criteria

### Technical Restatement
Integrate a dedicated, non-disruptive "AI Concepts / Field Notes" interactive section into the existing Next.js 14 App Router portfolio. The feature consists of a static dataset of curated, bite-sized AI engineering articles (`portfolio/lib/concepts.ts`), an interactive client-side reader component (`portfolio/app/components/AiConcepts.tsx`) presenting exactly one topic at a time with sequential navigation ("Next" / "Previous", keyboard arrow controls, progress indicator, and category tags), and placement on the main homepage (`portfolio/app/page.tsx`) without regressing any existing sections, design tokens, Theme A/B toggles, or build performance.

### Observable "Done" Definition
1. **Single-Topic Viewport**: When a visitor lands on or scrolls to the section, they see exactly 1 concept displayed in a clean blueprint card (topic name, category chip, read time, core explanation, and practical production takeaway).
2. **Sequential Navigation**: Clicking "Next →" advances immediately to the next topic; clicking "← Prev" returns to the previous topic; navigation cleanly wraps around modulo total count. Keyboard Left/Right arrow keys navigate when the section is in view or focused.
3. **Design Language Parity**: The component uses existing design tokens (`var(--bg)`, `var(--ink)`, `var(--ink2)`, `var(--muted)`, `var(--line)`, `var(--accent)`, `var(--surface)`), sharp borders, hairlines, and typography (`Clash Display`, `Satoshi`, `JetBrains Mono`). It switches themes seamlessly with the `THEME[A/B]` toggle.
4. **Non-Disruptive Integration**: Existing sections (Hero, Featured Work, Experience, Stack, GitHub, Education, Contact) and dossier pages (`/projects/[slug]`) remain 100% intact and functional.
5. **HUD Integration**: The fixed header navigation in `portfolio/app/components/Hud.tsx` includes a navigation link (`["NOTES", "/#concepts"]`) that smooth-scrolls to the section on both desktop and mobile drawer.
6. **Zero-Error Build**: `npm run build` and `npm run lint` compile with exit code 0, 0 type errors, and clean static page generation.

### Out of Scope
- Full separate multi-page blog system (e.g., `/blog/[slug]`) with heavy markdown parsers — deferred unless requested later.
- Dynamic external database/CMS fetching (content is stored statically in TypeScript for instantaneous rendering, zero network lag, and offline reliability).
- Commenting, user upvoting, or analytics tracking.

---

## Section B — Tech Stack & Constraints

- **Framework**: Next.js 14.2 (App Router), React 18, TypeScript 5.7.
- **Styling**: Tailwind CSS 3.4 with custom CSS variables defined in `portfolio/app/globals.css`.
- **Icons**: `lucide-react` (already installed in `package.json`).
- **Dependencies**: No new npm packages required.

### Architectural Decisions & Alternatives Considered
- *Alternative 1: Separate `/blog` or `/concepts` subpage.*
  - **Rejected because** the user requested discovering short explanations directly when someone opens the website, avoiding unnecessary navigation away from the portfolio.
- *Alternative 2: Accordion or vertical scroll list of all topics.*
  - **Rejected because** the user explicitly instructed "no need to show 100 at a time, like 1 topic with a next button if they wanna see more its up to them".
- *Alternative 3: Remote CMS / API endpoint (e.g., Supabase or Contentful).*
  - **Rejected because** static data in a TypeScript module guarantees zero CLS (cumulative layout shift), instant pagination, zero network latency, and 100% uptime during recruiter/visitor traffic.

### Stack Impact
- **Touched**:
  - `portfolio/lib/concepts.ts` (NEW): Typed data file containing curated AI concepts.
  - `portfolio/app/components/AiConcepts.tsx` (NEW): Client-side interactive card with Next/Prev and progress indicator.
  - `portfolio/app/page.tsx` (MODIFY): Import and render the new section; renumber subsequent section indices cleanly.
  - `portfolio/app/components/Hud.tsx` (MODIFY): Add `NOTES` / `CONCEPTS` link to desktop and mobile navigation arrays.
- **Untouched**:
  - All existing project dossiers (`/projects/[slug]`), `portfolio/lib/data.ts`, `server.js`, `tailwind.config.ts`, `globals.css`, and root configs.

---

## Section C — Blocking Questions & Assumptions

### Blocking Questions (0–3)
1. **Section Placement & HUD Link**:
   - Proposed: Insert the section between `[03] STACK` and `[04] GITHUB` as section `[04] AI FIELD NOTES` (and renumber GitHub to `[05]`, Education to `[06]`, Contact to `[07]`), and add `["NOTES", "/#concepts"]` to the HUD navigation bar.
   - *Recommended Default: Yes, approve this placement.*
2. **Initial Concept Topics & Curation**:
   - Proposed: Launch with 10 high-signal, production-grade AI/LLM terms matching Aditya's background:
     1. Test-Time Compute (TTC) & Reasoning Scaling
     2. Model Context Protocol (MCP)
     3. Speculative Decoding & Medusa Heads
     4. Context Caching & Prompt Prefix Sharing
     5. RAG Triad & Faithfulness Scoring (RAGAS)
     6. KV Cache Compression & PagedAttention
     7. Grammar-Constrained Decoding & Structured Outputs
     8. Agent Routing & Supervisor Trees
     9. Hallucination Guardrails & Self-Correction Loops
     10. Direct Preference Optimization (DPO) vs. RLHF
   - *Recommended Default: Yes, approve these 10 topics.*
3. **Navigation & Interaction Controls**:
   - Proposed: Provide "Next →" and "← Prev" buttons, a topic counter (e.g. `03 / 10`), a visual progress hairline, quick category filter badges (e.g. `ALL`, `ARCHITECTURES`, `EVALS`, `INFERENCE`), and keyboard left/right arrow navigation.
   - *Recommended Default: Yes, approve.*

*(You can simply reply **"yes to all"** to proceed with the defaults.)*

### Falsifiable Assumptions
- `[ASSUMPTION 1: Data Shape]` Each concept contains `{ id: string, title: string, category: string, readTime: string, summary: string, explanation: string, takeaway: string, tags: string[] }`.
- `[ASSUMPTION 2: Fallback & Resilience]` In environments without JavaScript, the component renders the first article statically inside standard semantic HTML with a noscript block, preventing blank cards.
- `[ASSUMPTION 3: Boundaries]` Updating `Hud.tsx` navigation array will not cause text wrap or overflow on standard laptop resolutions (>= 1024px).
- `[ASSUMPTION 4: State Management]` Active topic index uses lightweight React state `useState(0)` with modulo math `(prev + 1) % length` so visitors can cycle endlessly without hitting dead ends.
- `[ASSUMPTION 5: Styling Integrity]` Using existing classes (`mono-label`, `chip`, `btn-primary`, `btn-ghost`, `border-line`, `bg-surface`) guarantees 100% theme fidelity across both Theme A and Theme B.
- `[ASSUMPTION 6: Automated Testing]` Verification will be executed via `npm run build` (Next.js full static prerender check) and `npm run lint`.

---

## Section D — Session Modularization

### Session 1: Curated AI Concepts Dataset (`portfolio/lib/concepts.ts`)
- **Objective**: Create a strongly typed dataset of 10 concise, high-impact AI/LLM engineering concepts.
- **Scope**: `portfolio/lib/concepts.ts`
- **Output**: Exported `AiConcept` type and `aiConcepts` array with production-ready text.
- **Connects To**: Session 2 consumes `aiConcepts` and `AiConcept`.
- **Failure Surface**: Missing fields or syntax errors caught by TypeScript compiler during build.

### Session 2: Interactive Concept Reader Component (`portfolio/app/components/AiConcepts.tsx`)
- **Objective**: Build the interactive "one topic at a time" reader with Next/Previous buttons, counter, category badge, and keyboard listener.
- **Scope**: `portfolio/app/components/AiConcepts.tsx`
- **Output**: Fully functional client component with accessible buttons, smooth transitions, and responsive mobile/desktop layout.
- **Connects To**: Session 3 renders `<AiConcepts />` inside `page.tsx`.
- **Failure Surface**: Hydration mismatch or state index out of bounds; prevented by defensive clamp/modulo and pure client state.

### Session 3: Homepage Integration & Navigation Sync
- **Objective**: Slot the new section into `portfolio/app/page.tsx` and register the anchor link in `portfolio/app/components/Hud.tsx`.
- **Scope**: `portfolio/app/page.tsx`, `portfolio/app/components/Hud.tsx`
- **Output**: Clean section `[04] AI FIELD NOTES` with `SectionHeader`, updated indices for remaining sections, and updated HUD menu.
- **Connects To**: Session 4 for verification.
- **Failure Surface**: Anchor link misalignment or numbering mismatch.

### Session 4: Verification, Lint & Build Validation
- **Objective**: Validate the entire application with Next.js static build and type checks.
- **Scope**: Entire project build.
- **Output**: `npm run build` and `npm run lint` passing with code 0; visual and theme inspection.
- **Connects To**: Final delivery to user.
- **Failure Surface**: Build failure or CSS bleed.

---

## Section E — Progress Checklist

- [x] Session 1: Curated AI Concepts Dataset
  - [x] Define `AiConcept` interface in `portfolio/lib/concepts.ts`
  - [x] Author 10 authentic, concise AI technical breakdown entries
  - [x] Verify exports and TypeScript types
- [x] Session 2: Interactive Concept Reader Component
  - [x] Create `portfolio/app/components/AiConcepts.tsx` with `"use client"`
  - [x] Implement single-card viewport with title, category chip, read-time, summary, and takeaway
  - [x] Implement Next, Previous, and keyboard arrow controls with loop-around logic
  - [x] Implement category filter pills to browse topics by area
  - [x] Apply blueprint design styling compatible with Theme A and Theme B
- [x] Session 3: Homepage Integration & Navigation Sync
  - [x] Add Section `[04]` to `portfolio/app/page.tsx` wrapped in `<Reveal>`
  - [x] Adjust section numbers for GitHub `[05]`, Education `[06]`, Contact `[07]`
  - [x] Add `["CONCEPTS", "/#concepts"]` to `NAV` in `portfolio/app/components/Hud.tsx`
- [x] Session 4: Verification, Lint & Build Validation
  - [x] Run `npm run lint` and verify 0 errors
  - [x] Run `npm run build` and verify all static routes compile cleanly
  - [x] Confirm no regressions across existing sections or project dossiers
