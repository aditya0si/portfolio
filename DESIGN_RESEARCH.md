# Design Research — Aditya Singh Portfolio Redesign

*Research round: 2026-08-17. References analyzed live: brikken.co, goodgrowth.com, haoqi.design, awwwards.com/websites/portfolio. GitHub audited: github.com/aditya0si (17 public repos).*

---

## 1. Reference site analysis

### brikken.co — warm editorial minimalism
- **Palette:** warm off-white `#EEECe9` bg, pure black text, near-zero chrome. No gradients.
- **Type:** PP Neue Montreal, one family everywhere. Display heading ~278px at weight 500 — scale does the design work, not color.
- **Feel:** studio-grade, calm, confident. Whitespace as luxury. Tactile 3D accents instead of effects.

### goodgrowth.com — bold personal color-block (Awwwards listed)
- **Palette:** single electric violet `#4101F5` field, white text. One saturated color owns the whole identity.
- **Type:** custom display font "BBH Bartle" at ~158px + "Stack Sans Text" body. Playful, human, personality-first.
- **Feel:** memorable personal brand, not corporate. Proof a single bold color + custom type beats gradient soup.

### haoqi.design — "design engineer" blueprint (Developer Award + SOTD Aug 14, 2026)
- **Palette:** cream `#FBFAF4` bg, black text. Theme toggle (`THEME[A]`) + sound toggle (`SOUND[\]`) in the header.
- **Type:** "tiktok" sans (Pangram Pangram-style grotesk), huge statements: "I BRING CRAFT & TASTE TO DIGITAL WORK".
- **Signature details (HUD/terminal chrome):** live local clock `GMT+8 CN 03:05 25°C`, cursor coordinates `0720 X 0450 Y`, square glyph markers, systems language ("Thinking in systems. Designing with care."), one WebGL canvas.
- **Feel:** technical + crafted simultaneously. The most relevant identity model for a dev/AI-engineer portfolio.

### Awwwards portfolio trends (current winners list)
- Dominant tags: **GSAP, WebGL, scrolling animation, typography, microinteractions, single page**.
- Trending fonts: Aeonik, Circular, Druk, Clash, Apercu, Editorial New (modern grotesques + editorial).
- No single theme dominates — dark neutrals and light/cream both win; what wins is **commitment to one clear idea**.
- Both haoqi.design and goodgrowth.com appear on the current winners list; brikken.co is also listed.

## 2. Audit of current portfolio (portfolio/index.html)

**What's good and worth keeping:** GSAP + Lenis smooth scroll stack, section structure, full-screen overlay nav, GSAP ScrollTrigger choreography — the motion foundation is right.

**Design tells (why it reads generic):**
- Purple→cyan gradient text/buttons, glassmorphism cards, particle canvas — the default "AI-generated 2023" stack; thousands of clones exist.
- Space Grotesk + Inter + gradient accents = template signature.
- Fake-looking stats ("99% Client Satisfaction") actively hurt credibility.

**Content credibility problems (must fix before LinkedIn):**
1. **Broken project links:** `github.com/aditya0si/nexus` and `/healthdb` → **404**. These repos don't exist. Meanwhile real repos (Sentinel, agentic_rag_system, HealthCareOCR, CoverAI…) are unfeatured.
2. **Education claim:** "B.Tech … Massachusetts Institute of Technology (MIT) 2023–2027" — MIT (Cambridge) awards no B.Tech; this reads as placeholder and any recruiter will catch it. Verify real institution.
3. **Certifications:** Google Cloud PCA, AWS SA, NVIDIA DLI listed — verify these are real or remove.
4. **Privacy:** personal phone number (`tel:` link) exposed in two places — remove before public LinkedIn push.
5. **Missing `og:image` / `og:url`** — LinkedIn link previews will look bare.

## 3. GitHub reality (what we can actually feature)

Top candidates by recency/substance (all Python unless noted):
| Repo | Last push | Notes |
|---|---|---|
| DevAtlas | 2026-08-13 | newest |
| Sentinel | 2026-07-30 | **has a description** — "Guardrails & quality-gate framework for agentic AI systems" — flagship candidate |
| agentic_rag_system | 2026-07-22 | strong name for AI/RAG positioning |
| revenue-ops-orchestration, autonomus-sdr, intent-signal-engine | 2026-07-09 | agentic GTM stack — tells a coherent story |
| HealthCareOCR / pipeline_ocr / PaddleOcr | 2026-06/07 | OCR pipeline cluster |
| CoverAI (TypeScript) | 2026-06-01 | already on the site, repo exists ✓ |
| CosmosSteller (TypeScript) | 2026-07-15 | front-end range |
| Cyber, solarwinds, PulseGrid | 2026-08 | security/infra breadth |

Profile gaps to fix on GitHub itself: no bio, no profile README, most repos have no description, nothing pinned. Recruiters click through — the portfolio will look polished while the GitHub looks abandoned.

**Recommended story angle:** "I build agentic AI systems — guardrails, RAG, orchestration" (Sentinel + agentic_rag_system + the GTM trio), with an OCR pipeline track and front-end range (CoverAI, CosmosSteller).

## 4. Recommended design direction — "Engineer's Blueprint"

Fusion: **haoqi's technical chrome × goodgrowth's boldness × brikken's restraint.**

- **Base:** warm cream `#F4F1EA`-ish light theme default + **dark mode toggle** (haoqi's `THEME[A]` pattern) — dark theme: near-black `#0A0A0B` with one accent, not gradients.
- **Accent:** ONE electric color (violet `#4101F5` à la goodgrowth or a signal green/orange) for links, markers, hover states. Kill the purple→cyan gradient completely.
- **Type:** swap Space Grotesk → a sharper display grotesk (Clash Display / Aeonik free alternatives) at extreme scale for statements; keep a clean grotesk body; mono (JetBrains Mono / Space Mono) for HUD details and labels.
- **HUD/terminal chrome (the personality layer):** corner details — local time (IST), availability status dot, cursor coordinates, `⬛` square glyph bullets, section markers like `[01] WORK`. Nods to engineering without being a terminal theme.
- **Hero:** name + one-line story ("Building agentic AI systems — guardrails, RAG, orchestration") + scroll cue. No "ENGINEERING INTELLIGENCE" corporatese.
- **Projects:** real repos only. 3–4 featured case-study cards (custom blurb + tech tags + real links) + a live "everything else" strip fetched client-side from the GitHub public API (name, description, language, last push) so it stays fresh automatically.
- **Stats:** replace fabricated numbers with real, verifiable ones — 17 public repos, GitHub contribution graph vibe, "agentic systems / OCR pipelines / full-stack" breadth counters.
- **Motion:** keep GSAP + Lenis; add scroll-driven type reveals and hover microinteractions (Awwwards pattern). Replace particle canvas with a subtle dot-grid/noise texture.

**Alternative directions** (if preferred): (B) Dark terminal — keep dark base but one accent + mono details, remove all gradients; (C) Color-block personal brand — goodgrowth's single saturated field + huge playful type.

## 5. GitHub + LinkedIn integration plan

**GitHub**
1. Curate featured projects (hand-written blurbs, design-controlled) — recommended 4: Sentinel, agentic_rag_system, CoverAI, HealthCareOCR.
2. Live repo strip via `fetch('https://api.github.com/users/aditya0si/repos?sort=pushed')` — no auth needed, cached, graceful fallback.
3. GitHub-side hygiene (outside the site): profile bio + README, repo descriptions, pin the featured repos.

**LinkedIn**
1. Deploy: repo already has Vercel config → deploy portfolio/ to Vercel; optional custom domain.
2. Add `og:image` (1200×630 branded card) + `og:url` so the LinkedIn preview looks designed.
3. LinkedIn: add site to **Featured** section + Contact Info → Websites; mention in headline ("Portfolio ↓").
4. Remove phone number from site before going public.

## 6. Decisions (user sign-off, 2026-08-17)
- **Design direction:** Engineer's Blueprint (Section 4) — approved.
- **Education:** user confirmed MIT is correct — keep the entry, written cleanly and concisely.
- **Certifications:** placeholders — drop them. Stats replaced with real, GitHub-derived numbers ("Placeholders — replace with real" approved).
- **Phone number:** still being removed (privacy, non-negotiable before LinkedIn).

---
*Screenshots from live research: `research/brikken-hero.png`, `research/goodgrowth-hero.jpeg`, `research/haoqi-hero.jpeg`.*
