# Aditya Singh — Portfolio (Engineer's Blueprint)

A single-page portfolio for an agentic-AI builder: cream/ink editorial base, one
electric-violet accent, engineering HUD chrome (IST clock, availability status,
theme toggle) and a live agent-graph canvas as the hero's signature element.

## Stack

- **Zero build step** — vanilla HTML/CSS/JS. Open `index.html` or serve statically.
- **Type** — Clash Display + Satoshi ([Fontshare](https://fontshare.com)), JetBrains Mono (Google Fonts).
- **Motion** — [GSAP](https://gsap.com) + ScrollTrigger, [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll; `prefers-reduced-motion` respected (static graph, native scroll, no reveals).
  - **Story chapters** — the About section pins and zooms through three statements (CH.01–CH.03) as you scroll; stacks as plain text on mobile/reduced-motion.
  - **Mouse layer** (fine pointers only) — custom square cursor, magnetic buttons/links, hero depth parallax, and an agent graph that bends away from the cursor.
  - **Scroll zoom** — hero recedes like a title card, project names settle from over-scale, the contact title zooms up as the finale, ticker skews with scroll velocity.
- **Live data** — "Live from GitHub" strip fetches `api.github.com/users/aditya0si/repos` client-side; a static fallback list ships in the HTML when the API is unreachable.

## Files

```
portfolio/
├── index.html          # structure + content (all copy lives here)
├── css/index.css       # design tokens (light/dark themes), layout, components
├── js/main.js          # theme, IST clock, smooth scroll, reveals, agent graph, GitHub strip
├── og.png              # 1200x630 link-preview card
├── tools/gen_og.py     # regenerates og.png (python tools/gen_og.py)
└── README.md
```

## Theme toggle

`THEME[A]` = cream (default), `THEME[B]` = dark. Choice persists in
`localStorage` (`as-theme`); the canvas re-reads its colors on switch.

## Personalizing

- **Copy** (hero line, about, projects): edit `index.html` directly.
- **Featured projects**: the four `<article class="project">` blocks — keep
  links pointing at real repositories.
- **GitHub user**: change `GH_USER` at the top of `js/main.js`.
- **og image**: edit `tools/gen_og.py` and re-run it.
- **LinkedIn**: search `index.html` for `TODO` — a ready-made button is
  commented out in the contact section.

## Deploy

The folder is already linked to a Vercel project (`vercel --prod` from here).
After deploying, make `og:image` (and add `og:url`) absolute in `index.html`.
