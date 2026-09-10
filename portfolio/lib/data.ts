// All content below is sourced from real data: github.com/aditya0si (API + repo READMEs)
// and user-confirmed details. Do not add metrics or claims that aren't real.

export const profile = {
  name: "Aditya Singh",
  role: "AI/LLM Engineer — Agent Systems",
  headline: "I build agentic AI systems that survive production.",
  sub: "Retrieval quality, offline evals tied to online metrics, and segmentation that decides what ships — across RAG pipelines, guardrails and the OCR data pipelines that feed them. Final-year B.Tech CCE @ MIT Manipal, two AI internships, everything on this page runs from a public repo.",
  email: "oliaditya05@gmail.com",
  github: "https://github.com/aditya0si",
  githubUser: "aditya0si",
  linkedin: "https://linkedin.com/in/aditya-singh-387774295",
  site: "https://adityasingh.ai.studio",
} as const;

export const evidence = [
  { k: "EX-IBM", v: "SWE INTERN · OCR + RAG" },
  { k: "EX-HCL", v: "GENAI INTERN · LANGGRAPH" },
  { k: "43", v: "PUBLIC REPOS" },
  { k: "NPM", v: "OPENCODE-TEAMWORK" },
  { k: "SIH 2026", v: "FLOODLENS · BUSTWATCH" },
] as const;

export const marqueeItems = [
  "AGENTIC SYSTEMS",
  "RAG PIPELINES",
  "GUARDRAILS",
  "LLM EVALS",
  "MCP",
  "OCR PIPELINES",
  "OBSERVABILITY",
  "FULL-STACK",
] as const;

export type Flagship = {
  slug: string;
  repo: string; // actual GitHub repository name
  index: string;
  name: string;
  status: string;
  tagline: string;
  problem: string;
  built: string[];
  highlights: string[];
  stack: string[];
  metrics: { value: string; label: string }[];
  flow: string[];
  links: { label: string; href: string }[];
};

export const flagships: Flagship[] = [
  {
    slug: "schemegpt",
    repo: "schemeGPT",
    index: "P.01",
    name: "SchemeGPT",
    status: "PRODUCTION RAG",
    tagline:
      "Decision-support RAG for Indian government schemes — hybrid retrieval tuned against offline RAGAS evals, quote verification as the online quality metric, bilingual answers.",
    problem:
      "Welfare schemes are scattered across 30+ ministry and state portals. Dense eligibility rules and language barriers stop qualifying citizens from claiming entitlements.",
    built: [
      "Hybrid dense + sparse retrieval: pgvector embeddings fused with PostgreSQL full-text search via Reciprocal Rank Fusion",
      "Exact quote verification — every generated claim must match indexed source text before it's shown, with inline citations",
      "Deterministic citizen-profile matching and bilingual (English/Hindi) SSE-streamed answers on a Next.js 15 frontend",
    ],
    highlights: [
      "RAGAS offline evaluation suite runs as a CI gate — answer regressions fail the build, not the user",
      "Groq gpt-oss-120b inference behind a multi-step tool-calling agent",
      "Docker Compose one-liner deployment with a production VPS runbook",
    ],
    stack: ["Python", "FastAPI", "Next.js 15", "PostgreSQL", "pgvector", "RRF", "RAGAS", "Groq", "Docker"],
    metrics: [
      { value: "2-WAY", label: "HYBRID RETRIEVAL → RRF" },
      { value: "EN/HI", label: "BILINGUAL ANSWERS" },
      { value: "RAGAS", label: "EVAL GATE IN CI" },
      { value: "100%", label: "QUOTE-VERIFIED CLAIMS" },
    ],
    flow: ["QUERY (EN/HI)", "HYBRID RETRIEVAL · PGVECTOR + FTS", "RRF FUSION", "QUOTE VERIFICATION", "GROQ LLM", "CITED ANSWER"],
    links: [{ label: "SOURCE", href: "https://github.com/aditya0si/schemeGPT" }],
  },
  {
    slug: "sentinel",
    repo: "Sentinel",
    index: "P.02",
    name: "Sentinel",
    status: "OPEN SOURCE · MIT",
    tagline:
      "Quality gates for agentic AI — a validation proxy that segments every failure by guardrail type and turns golden-set evals into a ship/block experiment on each PR.",
    problem:
      "Autonomous agents ship unvalidated JSON, leak PII and hallucinate mid-run. Most stacks have no shared quality gate that works identically in CI and on live traffic.",
    built: [
      "FastAPI validation proxy + embeddable Python library enforcing schema, PII, toxicity and grounding checks on every completion",
      "Golden-set evaluation gate wired into GitHub Actions that blocks PRs when aggregate answer quality drops below threshold",
      "Multi-provider routing with failover across Groq, Google Gemini, OpenAI and local Ollama",
    ],
    highlights: [
      "<180ms p95 validation latency — heuristic and regex validators run sub-millisecond, LLM-judge fallback under 200ms",
      "5 built-in guardrail types: Pydantic schemas, PII redaction, toxicity, hallucination grounding, custom YAML policies",
      "OpenTelemetry traces to Jaeger, Prometheus metrics, Grafana dashboards — SQLite-backed rolling drift alerts",
      "60+ unit and integration tests covering the engine, validation pipeline and API",
    ],
    stack: ["Python", "FastAPI", "LangChain", "OpenTelemetry", "Jaeger", "Grafana", "Docker Compose"],
    metrics: [
      { value: "<180ms", label: "P95 VALIDATION" },
      { value: "5", label: "GUARDRAIL TYPES" },
      { value: "60+", label: "TESTS" },
      { value: "CI", label: "QUALITY GATE" },
    ],
    flow: ["AGENT OUTPUT", "SENTINEL VALIDATORS", "DRIFT MONITOR", "PASS / BLOCK", "USER + TRACES"],
    links: [{ label: "SOURCE", href: "https://github.com/aditya0si/Sentinel" }],
  },
  {
    slug: "mcp-from-scratch",
    repo: "mcp-from-scratch",
    index: "P.03",
    name: "mcp-from-scratch",
    status: "PROTOCOL DEEP-DIVE",
    tagline:
      "The Model Context Protocol implemented from raw JSON-RPC 2.0 — no SDK, no LangChain — plus a trajectory-grading eval harness.",
    problem:
      "Most MCP usage is five lines of SDK config. When an agent's tool call fails in production, you need to know what's actually on the wire.",
    built: [
      "JSON-RPC 2.0 codec with full error-code coverage (−32700 → −32603) over HTTP and stdio transports",
      "MCP server core dispatching all five protocol methods: initialize, tools/list, tools/call, resources/list, resources/read",
      "Minimal ReAct agent loop plus an eval harness with 5 graders (exact match, substring, tool-called, step-count, LLM-judge) emitting per-task score reports",
    ],
    highlights: [
      "stdlib + FastAPI only — the entire protocol surface is readable in an afternoon",
      "pytest suite plus a demo runner that writes eval_report.json with per-task grades",
    ],
    stack: ["Python", "JSON-RPC 2.0", "FastAPI", "stdio", "pytest"],
    metrics: [
      { value: "5", label: "MCP METHODS DISPATCHED" },
      { value: "0", label: "SDKS / FRAMEWORKS" },
      { value: "5", label: "TRAJECTORY GRADERS" },
      { value: "2", label: "TRANSPORTS · HTTP + STDIO" },
    ],
    flow: ["CLIENT", "JSON-RPC 2.0 · HTTP/STDIO", "MCP SERVER CORE", "TOOL REGISTRY", "REACT AGENT", "EVAL HARNESS"],
    links: [{ label: "SOURCE", href: "https://github.com/aditya0si/mcp-from-scratch" }],
  },
  {
    slug: "opencode-teamwork",
    repo: "OpenCode-Team",
    index: "P.04",
    name: "OpenCode-Teamwork",
    status: "PUBLISHED ON NPM",
    tagline:
      "Antigravity-style multi-agent orchestration for OpenCode — scout, propose, falsify, synthesize, verify, packaged as a one-line install.",
    problem:
      "Complex tasks need coordinated agents, but orchestration usually means bespoke glue code rewritten per project.",
    built: [
      "10 role-specialized agents over 6 topology patterns, from small-focused fixes to long-proof swarms",
      "DAG engine dispatching work in dependency order with per-agent git worktree isolation",
      "Typed artifact bus (spec.json, plan.dag.json, patch.diff — Zod-validated), per-agent cost tracking with budget halt, session checkpointing",
    ],
    highlights: [
      "Published as opencode-teamwork on npm — 7 slash commands, per-role model presets (anthropic / google / openai / free)",
      "Shared pitfall registry distills verifier findings into answer-agnostic mistakes reused across rounds",
    ],
    stack: ["TypeScript", "Node.js", "npm", "Zod", "DAG engine", "Git worktrees"],
    metrics: [
      { value: "10", label: "AGENTS" },
      { value: "6", label: "TOPOLOGY PATTERNS" },
      { value: "NPM", label: "PUBLISHED PACKAGE" },
      { value: "7", label: "SLASH COMMANDS" },
    ],
    flow: ["TASK", "SCOUT", "PROPOSE ×N", "FALSIFY ×N", "SYNTHESIZE", "VERIFY"],
    links: [
      { label: "SOURCE", href: "https://github.com/aditya0si/OpenCode-Team" },
      { label: "NPM", href: "https://www.npmjs.com/package/opencode-teamwork" },
    ],
  },
];

export const experience = [
  {
    company: "IBM",
    location: "Lucknow, IN",
    role: "Software Engineer Intern",
    period: "MAY — JUL 2026",
    points: [
      "Built an end-to-end medical OCR + LLM analysis pipeline over real hospital records",
      "Knowledge-graph + RAG over OCR output; clinical decision-support rule engine",
      "Deployed to a partner hospital as a pilot",
    ],
    tags: ["Python", "PaddleOCR", "Knowledge Graphs", "RAG"],
  },
  {
    company: "HCL Technologies",
    location: "Remote",
    role: "GenAI Intern",
    period: "MAY — JUL 2026",
    points: [
      "5-agent LangGraph RAG pipeline: rewrite → retrieve → rerank → grade → verify",
      "96.4% faithfulness, +27.8% context precision over naive RAG (measured with RAGAS)",
      "Production hardening: rate limiting, prompt-injection defense, structlog + Prometheus",
    ],
    tags: ["LangGraph", "RAGAS", "FastAPI", "Prometheus"],
  },
] as const;

export const capabilities = [
  {
    group: "AI & AGENT SYSTEMS",
    items: ["LangChain", "LangGraph", "CrewAI", "MCP (raw JSON-RPC)", "Multi-agent orchestration", "RAG pipelines", "RAGAS evals", "Prompt engineering"],
  },
  {
    group: "BACKEND & DATA",
    items: ["Python", "FastAPI", "PostgreSQL + pgvector", "Redis", "ChromaDB", "SQL", "ETL pipelines"],
  },
  {
    group: "DOCUMENT AI",
    items: ["PaddleOCR", "OpenCV", "pandas", "OCR → LLM structuring", "Bilingual NLP (EN/HI)"],
  },
  {
    group: "PRODUCT & WEB",
    items: ["TypeScript", "Next.js", "React", "Node.js / Express", "Tailwind", "SSE streaming"],
  },
  {
    group: "INFRA & OBSERVABILITY",
    items: ["Docker", "Kubernetes", "GitHub Actions", "OpenTelemetry", "Prometheus / Grafana", "Linux", "Vercel"],
  },
  {
    group: "LANGUAGES & CORE",
    items: ["Python", "TypeScript", "JavaScript", "C++", "Java", "SQL"],
  },
] as const;

// Static fallback for the live GitHub strip — real data from the GitHub API on 2026-09-02.
// GitHubLive.tsx refreshes this client-side when the API is reachable.
export const fallbackRepos = [
  { name: "TheButterFlyEffect", description: "Biomedical & legal Graph-RAG — 2,097-node knowledge graph, multi-hop traversal, grounded synthesis", language: "Python", pushed: "2026-09-01", url: "https://github.com/aditya0si/TheButterFlyEffect" },
  { name: "CoverAI", description: "AI vehicle-insurance platform — FastAPI + Next.js monorepo, RAG policy Q&A, claims triage", language: "TypeScript", pushed: "2026-09-02", url: "https://github.com/aditya0si/CoverAI" },
  { name: "bustwatch", description: "SIH 2026 — NWP forecast-bust detection & confidence mapping (GFS/GEFS/ECMWF)", language: "Python", pushed: "2026-08-26", url: "https://github.com/aditya0si/bustwatch" },
  { name: "floodlens", description: "SIH 2026 — urban flood nowcasting on IMD/Bhuvan rainfall data", language: "Python", pushed: "2026-08-26", url: "https://github.com/aditya0si/floodlens" },
  { name: "agentic_rag_system", description: "Agentic RAG loop: fetch → re-rank → answer → verify", language: "Python", pushed: "2026-08-19", url: "https://github.com/aditya0si/agentic_rag_system" },
  { name: "DevAtlas", description: "Developer-ecosystem intelligence — GitHub activity maps, repo classification, trend analysis", language: "Python", pushed: "2026-08-25", url: "https://github.com/aditya0si/DevAtlas" },
  { name: "HealthCareOCR", description: "Healthcare document extraction pipeline", language: "Python", pushed: "2026-06-28", url: "https://github.com/aditya0si/HealthCareOCR" },
  { name: "pipeline_ocr", description: "OCR pipeline experiments (PaddleOCR)", language: "Python", pushed: "2026-07-12", url: "https://github.com/aditya0si/pipeline_ocr" },
  { name: "E-commerce-Dashboard", description: "Olist BI product — 6 SQL marts over 99k orders, 5-page Streamlit app, RFM/cohort/funnel", language: "Python", pushed: "2026-09-08", url: "https://github.com/aditya0si/E-commerce-Dashboard" },
] as const;

export const education = {
  school: "Manipal Institute of Technology",
  short: "MIT MANIPAL",
  degree: "B.Tech, Computer & Communication Engineering",
  period: "2023 — 2027 (expected)",
  lines: [
    "Smart India Hackathon 2026 — built FloodLens (urban flood nowcasting) and BustWatch (NWP forecast-bust detection) end to end",
    "Coursework applied directly into shipped systems: algorithms, DBMS, networks, signal processing",
  ],
} as const;
