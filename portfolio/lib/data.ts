// All content below is sourced strictly from verified evidence in research/evidence-ledger.json,
// docs/portfolio/project-scores.json, docs/portfolio/INITIAL-AUDIT.md, and .agent/MASTER_STATE.md.
// No unsupported claims, unverified metrics, or speculative biographical entries.

export const profile = {
  name: "Aditya Singh",
  role: "AI Systems & Backend Engineer",
  headline: "Systems-first engineering across agent architectures, guardrails, and backend pipelines.",
  sub: "Computer & Communication Engineering student at MIT Manipal, focused on agent systems, evaluation harnesses, and backend infrastructure. Status labels distinguish code inspection from checks executed in this audit.",
  email: "oliaditya05@gmail.com",
  github: "https://github.com/aditya0si",
  githubUser: "aditya0si",
  linkedin: "https://linkedin.com/in/aditya-singh-387774295",
  site: "https://adityasingh.ai.studio",
} as const;

export const evidence = [
  { k: "TESTS", v: "VERIFIED LOCAL TEST RUNS" },
  { k: "CODEC", v: "RAW JSON-RPC 2.0 MCP" },
  { k: "REPOS", v: "27 DEEPER EVIDENCE REVIEWS" },
  { k: "EDUCATION", v: "B.TECH CCE · MIT MANIPAL" },
] as const;

export const marqueeItems = [
  "AGENT SYSTEMS",
  "RAG PIPELINES",
  "GUARDRAILS",
  "EVAL HARNESSES",
  "MCP PROTOCOL",
  "DISTRIBUTED STREAMING",
  "SYSTEM OBSERVABILITY",
  "FULL-STACK",
] as const;

export type RoleCategory = "ALL" | "AI ENGINEER" | "FORWARD DEPLOYED" | "BACKEND/SYSTEMS";

export type Flagship = {
  slug: string;
  repo: string; // actual GitHub repository name
  index: string;
  name: string;
  status: string; // explicitly indicates candidate / provisional status
  executionState: string; // execution and deployment status verified by audit
  roles: RoleCategory[];
  tagline: string;
  problem: string;
  built: string[];
  highlights: string[];
  stack: string[];
  metrics: { value: string; label: string }[];
  flow: string[];
  links: { label: string; href: string }[];
  evidenceId: string;
  evidenceUrl: string; // immutable GitHub path pinned to audited commit
  evidenceStrength: string;
};

export const flagships: Flagship[] = [
  {
    slug: "schemegpt",
    repo: "schemeGPT",
    index: "P.01",
    name: "schemeGPT",
    status: "PROVISIONAL CANDIDATE · 71 TESTS PASSED",
    executionState:
      "71 pytest tests passed at commit f030ad3 in an isolated uv environment. Next.js 16 and FastAPI/pgvector dependencies were code-observed; deployment, live data sources, and RAGAS execution remain unverified.",
    roles: ["AI ENGINEER", "FORWARD DEPLOYED"],
    tagline:
      "Repository documentation describes hybrid pgvector + PostgreSQL full-text retrieval with Reciprocal Rank Fusion, quote attribution, and bilingual query handling; these behaviors were not executed in this audit.",
    problem:
      "The project targets discovery and interpretation of welfare-scheme eligibility guidance spread across government sources.",
    built: [
      "README-claimed hybrid retrieval combining pgvector and PostgreSQL full-text search through Reciprocal Rank Fusion",
      "Code-observed quote-verification path intended to check generated claims against indexed source text",
      "Next.js 16 interface and FastAPI route structure observed in the pinned repository snapshot",
    ],
    highlights: [
      "71 pytest tests passed locally; this does not establish deployed retrieval quality or RAGAS execution",
      "Next.js 16 and React 19 versions verified from web/package.json",
      "Custom retrieval evaluation files are present; their benchmark outputs and the README RAGAS claim were not independently executed",
      "Docker Compose and PostgreSQL/pgvector configuration observed in the repository tree",
    ],
    stack: ["Python", "FastAPI", "Next.js 16", "PostgreSQL", "pgvector", "RRF", "Sentence-Transformers", "Docker Compose"],
    metrics: [
      { value: "HYBRID", label: "PGVECTOR + FTS CLAIM" },
      { value: "71", label: "PYTESTS PASSED" },
      { value: "NEXT 16", label: "APP ROUTER WEB UI" },
      { value: "QUOTE", label: "SUBSTRING VERIFICATION" },
    ],
    flow: ["QUERY (EN/HI)", "HYBRID RETRIEVAL (PGVECTOR + FTS)", "RRF FUSION (TOP-4 DIVERSE)", "QUOTE VERIFICATION", "SSE STREAMING", "CITED ANSWER"],
    links: [
      { label: "SOURCE", href: "https://github.com/aditya0si/schemeGPT" },
      { label: "CI", href: "https://github.com/aditya0si/schemeGPT/actions/runs/34871798476" },
    ],
    evidenceId: "EV-SG-RETRIEVAL",
    evidenceUrl: "https://github.com/aditya0si/schemeGPT/blob/f030ad35b4a574dc0e3b463fa68435926c123202/app/retrieval.py",
    evidenceStrength: "VERIFIED TEST RUN (71 pytest passed; deployment and RAGAS claims remain unverified)",
  },
  {
    slug: "sentinel",
    repo: "Sentinel",
    index: "P.02",
    name: "Sentinel",
    status: "PROVISIONAL CANDIDATE · 62 TESTS PASSED",
    executionState:
      "62 pytest unit and integration tests passed in physical execution; OpenTelemetry tracer exporting to Jaeger and Prometheus metrics observed; latency benchmark claims unverified per EV-SEN-METRICS-CLAIM.",
    roles: ["AI ENGINEER", "BACKEND/SYSTEMS"],
    tagline:
      "Quality and reliability proxy for agentic workflows — validation proxy enforcing Pydantic schemas, PII redaction, toxicity filters, and grounding checks with OpenTelemetry distributed tracing.",
    problem:
      "Autonomous agent pipelines emit malformed JSON, leak sensitive PII, and generate ungrounded completions without shared quality gates between development and execution.",
    built: [
      "FastAPI validation proxy and embeddable Python library evaluating schema compliance, PII presence, toxicity, and grounding",
      "OpenTelemetry spans exported to Jaeger with Prometheus metrics endpoints tracking request throughput and validation verdicts",
      "Pluggable validator pipeline with multi-provider routing across Groq, Google Gemini, OpenAI, and local Ollama instances",
    ],
    highlights: [
      "62 pytest tests passed in test execution covering engine components, pipeline filters, and HTTP endpoints",
      "5 built-in guardrail categories: Pydantic schemas, regex PII redaction, toxicity filtering, hallucination grounding, custom YAML policies",
      "Docker Compose environment orchestrating Prometheus, Jaeger, and FastAPI validation services",
    ],
    stack: ["Python", "FastAPI", "Pydantic v2", "OpenTelemetry", "Jaeger", "Prometheus", "pytest", "Docker"],
    metrics: [
      { value: "62", label: "PYTESTS PASSED" },
      { value: "5", label: "GUARDRAIL TYPES" },
      { value: "OTEL", label: "JAEGER + PROMETHEUS" },
      { value: "CI", label: "WORKFLOW OBSERVED" },
    ],
    flow: ["AGENT COMPLETION", "POLICY & SCHEMA CHECK", "PII & TOXICITY VALIDATORS", "OTEL SPAN EXPORT", "VERDICT (PASS / BLOCK)"],
    links: [
      { label: "SOURCE", href: "https://github.com/aditya0si/Sentinel" },
      { label: "CI", href: "https://github.com/aditya0si/Sentinel/actions/runs/33509493282" },
    ],
    evidenceId: "EV-SEN-PROXY",
    evidenceUrl: "https://github.com/aditya0si/Sentinel/blob/ab0f2cee433ebc1d8d7c47f936fc236d75a5a027/app/proxy.py",
    evidenceStrength: "VERIFIED TEST RUN (62 pytest passed; latency unverified per EV-SEN-METRICS-CLAIM)",
  },
  {
    slug: "mcp-from-scratch",
    repo: "mcp-from-scratch",
    index: "P.03",
    name: "mcp-from-scratch",
    status: "PROVISIONAL CANDIDATE · 29 TESTS PASSED",
    executionState:
      "29 pytest tests passed at commit 59fbaa0. The standard-library JSON-RPC codec and stdio/SSE transport implementations were code-observed; deployed transport behavior was not tested.",
    roles: ["AI ENGINEER", "BACKEND/SYSTEMS"],
    tagline:
      "Model Context Protocol implemented directly from raw JSON-RPC 2.0 wire specifications without external SDKs, paired with a 5-grader trajectory evaluation harness.",
    problem:
      "High-level framework wrappers obscure underlying MCP protocol framing, complicating transport debugging and wire failure analysis in multi-agent tool setups.",
    built: [
      "JSON-RPC 2.0 wire codec with standard error code mapping (-32700 to -32603) over HTTP/SSE and stdio transports",
      "Core MCP server dispatching initialize, tools/list, tools/call, resources/list, and resources/read protocol methods",
      "ReAct agent loop integrated with a 5-grader evaluation harness outputting structured per-task score reports",
    ],
    highlights: [
      "29 pytest tests passed covering protocol serialization, transport adapters, and tool invocation handlers",
      "Pure Python standard library implementation with zero runtime SDK or framework dependencies",
      "5 trajectory graders: exact match, substring, tool-called verification, step-count limits, and LLM-judge scoring",
    ],
    stack: ["Python", "JSON-RPC 2.0", "FastAPI", "stdio", "SSE", "pytest"],
    metrics: [
      { value: "29", label: "PYTESTS PASSED" },
      { value: "5", label: "MCP METHODS" },
      { value: "0", label: "MCP SDK DEPENDENCIES" },
      { value: "2", label: "TRANSPORTS (HTTP + STDIO)" },
    ],
    flow: ["CLIENT REQUEST", "JSON-RPC 2.0 WIRE CODEC", "MCP METHOD DISPATCHER", "TOOL REGISTRY", "REACT AGENT LOOP", "EVAL HARNESS"],
    links: [{ label: "SOURCE", href: "https://github.com/aditya0si/mcp-from-scratch" }],
    evidenceId: "EV-MCP-CODEC",
    evidenceUrl: "https://github.com/aditya0si/mcp-from-scratch/tree/59fbaa0ed89d67ffb3632337d7552e5b7de49ca6/src/protocol",
    evidenceStrength: "VERIFIED TEST RUN (29 pytest passed; stdlib codec verified in tree)",
  },
  {
    slug: "tenant-api-platform",
    repo: "tenant-api-platform",
    index: "P.04",
    name: "tenant-api-platform",
    status: "PROVISIONAL CANDIDATE · DATABASE-BACKED SUITE PASSED",
    executionState:
      "The full Go suite passed at commit a6f715a against Docker-backed PostgreSQL and Redis; go vet and go build also passed. The Windows C compiler could not build Go's race runtime, so this local integration run used go test -count=1 without -race.",
    roles: ["BACKEND/SYSTEMS", "FORWARD DEPLOYED"],
    tagline:
      "Multi-tenant service and billing API in Go featuring PostgreSQL Row-Level Security (RLS) data isolation, Redis token bucket rate limiting, and 14 committed Architecture Decision Records.",
    problem:
      "Multi-tenant SaaS architectures require tenant data isolation and noisy-neighbor quota enforcement without error-prone manual query tenant filtering.",
    built: [
      "PostgreSQL Row-Level Security (RLS) data isolation enforced through session variable app.current_tenant_id and database migrations",
      "Distributed token bucket rate limiter implemented in Go and backed by Redis for tenant request quota enforcement",
      "Transactional outbox pattern for reliable webhook dispatching and idempotent billing event processing",
    ],
    highlights: [
      "Full Go test suite passed against Docker-backed PostgreSQL and Redis; go vet and go build also passed",
      "14 committed Architecture Decision Records (ADRs) documenting isolation models, auth boundaries, and data access layers",
      "Historical committed k6 artifact reports 6,250 requests at 120 req/s, 0% failure, and 28.8ms read p95 in a local single-node simulated run; it was not reproduced in this audit",
    ],
    stack: ["Go", "PostgreSQL", "RLS", "Redis", "Docker Compose", "k6"],
    metrics: [
      { value: "GO", label: "VET & BUILD PASSED" },
      { value: "14", label: "COMMITTED ADRS" },
      { value: "RLS", label: "TENANT ISOLATION" },
      { value: "REDIS", label: "TOKEN BUCKET LIMITER" },
    ],
    flow: ["TENANT REQUEST", "AUTH & TENANT CONTEXT", "REDIS RATE LIMITER", "POSTGRES RLS SESSION", "IDEMPOTENT WRITE", "OUTBOX WEBHOOK"],
    links: [
      { label: "SOURCE", href: "https://github.com/aditya0si/tenant-api-platform" },
      { label: "CI", href: "https://github.com/aditya0si/tenant-api-platform/actions/runs/34558220324" },
    ],
    evidenceId: "EV-TAP-RLS",
    evidenceUrl: "https://github.com/aditya0si/tenant-api-platform/tree/a6f715aac1d4e46b2ef30e12fb42d4719672f7f5/internal/db/migrations",
    evidenceStrength: "DATABASE-BACKED TEST, BUILD & VET VERIFIED (historical benchmark in load/results.json)",
  },
  {
    slug: "event-stream-platform",
    repo: "event-stream-platform",
    index: "P.05",
    name: "event-stream-platform",
    status: "PROVISIONAL CANDIDATE · DOCKER INTEGRATION PASSED",
    executionState:
      "At commit 4ecb068, Docker Compose started PostgreSQL, Redis, and Redpanda; the 86-test Go suite and the Compose smoke test passed. The committed historical ingest benchmark remains unreproduced.",
    roles: ["BACKEND/SYSTEMS"],
    tagline:
      "High-throughput Go telemetry streaming pipeline utilizing franz-go and Redpanda / Kafka with partitioned consumer groups, sliding-window watermarks, and DLQ routing.",
    problem:
      "Large-scale event ingestion platforms encounter message loss, consumer group starvation, and out-of-order delivery during traffic surges.",
    built: [
      "High-throughput event ingestion service utilizing franz-go client with Redpanda / Kafka message clustering",
      "Partitioned consumer groups with out-of-order handling, sliding window event watermarks, and dead-letter queue (DLQ) retry routing",
      "Multi-service Docker Compose environment orchestrating Redpanda, PostgreSQL, Redis, and Go telemetry workers",
    ],
    highlights: [
      "Docker-backed PostgreSQL, Redis, and Redpanda integration passed 86 Go tests plus the Compose smoke test",
      "Streaming pipeline flowcharts and fuzz testing suite committed in repository tree",
      "Historical committed ingest artifact reports a 40-second run at 2,500 offered events/s against a 2,000 events/s target in local Docker with synthetic events; it was not reproduced in this audit",
    ],
    stack: ["Go", "franz-go", "Redpanda", "Kafka", "PostgreSQL", "Docker Compose"],
    metrics: [
      { value: "86", label: "DOCKER-BACKED TESTS PASSED" },
      { value: "FRANZ-GO", label: "KAFKA / REDPANDA" },
      { value: "DLQ", label: "RETRY ROUTING" },
      { value: "PASS", label: "COMPOSE SMOKE TEST" },
    ],
    flow: ["TELEMETRY EVENT", "FRANZ-GO PRODUCER", "PARTITIONED TOPIC", "CONSUMER GROUP", "SLIDING WATERMARK", "DLQ / STORAGE"],
    links: [
      { label: "SOURCE", href: "https://github.com/aditya0si/event-stream-platform" },
      { label: "CI", href: "https://github.com/aditya0si/event-stream-platform/actions/runs/34623119770" },
    ],
    evidenceId: "EV-ESP-GO-MOD",
    evidenceUrl: "https://github.com/aditya0si/event-stream-platform/blob/4ecb068d032a155c74dc2911c2d8cf0a713ce857/go.mod",
    evidenceStrength: "DOCKER INTEGRATION, BUILD & VET VERIFIED (historical benchmark not reproduced)",
  },
];

export const capabilities = [
  {
    group: "AI & AGENT SYSTEMS",
    items: ["LangChain", "LangGraph", "MCP (raw JSON-RPC)", "Multi-agent orchestration", "RAG pipelines", "Evaluation harnesses", "Prompt engineering"],
  },
  {
    group: "BACKEND & DATA",
    items: ["Python", "Go", "FastAPI", "PostgreSQL + pgvector", "Redis", "SQL", "ETL pipelines"],
  },
  {
    group: "STREAMING & PROTOCOLS",
    items: ["Redpanda / Kafka", "franz-go", "JSON-RPC 2.0", "SSE streaming", "REST APIs"],
  },
  {
    group: "PRODUCT & WEB",
    items: ["TypeScript", "Next.js", "React", "Node.js / Express", "Tailwind CSS"],
  },
  {
    group: "INFRA & OBSERVABILITY",
    items: ["Docker", "Docker Compose", "GitHub Actions", "OpenTelemetry", "Jaeger", "Prometheus", "Linux"],
  },
  {
    group: "LANGUAGES & CORE",
    items: ["Python", "Go", "TypeScript", "JavaScript", "SQL", "C++"],
  },
] as const;

// Static fallback for the live GitHub strip — real data from the GitHub API on 2026-09-02.
// GitHubLive.tsx refreshes this client-side when the API is reachable.
export const fallbackRepos = [
  { name: "TheButterFlyEffect", description: "Biomedical & legal Graph-RAG — 2,097-node knowledge graph, multi-hop traversal, grounded synthesis", language: "Python", pushed: "2026-09-01", url: "https://github.com/aditya0si/TheButterFlyEffect" },
  { name: "CoverAI", description: "AI vehicle-insurance platform — FastAPI + Next.js monorepo, RAG policy Q&A, claims triage", language: "TypeScript", pushed: "2026-09-02", url: "https://github.com/aditya0si/CoverAI" },
  { name: "bustwatch", description: "Transit delay prediction & confidence mapping (GFS/GEFS/ECMWF)", language: "Python", pushed: "2026-08-26", url: "https://github.com/aditya0si/bustwatch" },
  { name: "floodlens", description: "Urban flood nowcasting on IMD/Bhuvan rainfall raster data", language: "Python", pushed: "2026-08-26", url: "https://github.com/aditya0si/floodlens" },
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
    "Coursework focused on computer systems fundamentals: operating systems, computer architecture, distributed systems, and database systems.",
    "Applied engineering builds grounded in reproducible local builds, test suites, and architectural documentation.",
  ],
} as const;
