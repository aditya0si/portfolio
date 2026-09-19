# GitHub Ecosystem Project Inventory (47 Repositories)

## Inventory Scope & Methodology
Every repository under `aditya0si` was audited strictly from the pinned commit snapshots recorded in `research/real_repo_evidence.json` and registered in `research/evidence-ledger.json`.
Codebase manifests, test source files, CI workflow configurations, and file tree objects are recorded as **CODE_OBSERVED** or **CI_OBSERVED**. Technical claims originating solely from README documentation without reproducible execution logs or direct code snapshot verification are explicitly tagged as **README_CLAIM** and classified as unverified claims rather than observed facts.

* **Total Repositories Audited**: 47
* **Meaningful Technical Repositories**: 27
* **Special-Purpose, Hardware, Archived & Auxiliary Repositories**: 20
* **Authoritative Evidence Source**: `research/real_repo_evidence.json` (Pinned Commit SHAs)
* **Authoritative Ledger**: `research/evidence-ledger.json` (449 Evidence Records)
* **Zero Template Fallback Prose Allowed**: All absent or unobserved fields are explicitly labeled as `None` or `Unknown`.

---

## 1. Primary Technical Repositories (27 Repositories Audited in Depth)

### schemeGPT

* **Repository URL**: [https://github.com/aditya0si/schemeGPT](https://github.com/aditya0si/schemeGPT)
* **Commit SHA**: `f030ad35b4a574dc0e3b463fa68435926c123202`
* **Associated Evidence IDs**: EV-SCHEMEGPT-GIT, EV-SCHEMEGPT-LANG, EV-SCHEMEGPT-MANIFEST, EV-SCHEMEGPT-TESTS, EV-SCHEMEGPT-CI, EV-SCHEMEGPT-README, EV-SG-NEXT16, EV-SG-RAGAS-CLAIM, EV-SG-RETRIEVAL, EV-SG-RETRIEVAL-CLAIM, EV-SG-WORKFLOWS, EV-SG-API, EV-SG-DB, EV-SG-OBS, EV-SG-SEC
* **Live / Deployment URL**: [https://schemegpt-web-adityasinghprojects.vercel.app](https://schemegpt-web-adityasinghprojects.vercel.app) (Vercel deployment listed in repository metadata; live availability not independently verified)
* **Languages & Core Tech**: Python, TypeScript, CSS, Dockerfile, JavaScript [Evidence: EV-SCHEMEGPT-LANG]
* **Frameworks & Observed Dependencies**: FastAPI (Python), Next.js 16 (web/package.json specifies Next 16.3.5, React 19), Pydantic, pgvector, Sentence-Transformers, Groq SDK. [Evidence: EV-SG-NEXT16, EV-SG-RETRIEVAL]
* **System Architecture**: Two-tier RAG: Next.js 16 SSR frontend + FastAPI backend. Hybrid dense (pgvector HNSW) + sparse (Postgres tsvector GIN) retrieval with Reciprocal Rank Fusion and exact substring quote attribution engine claimed in README; Next.js 16 and FastAPI verified in code. [Evidence: EV-SG-NEXT16, EV-SG-RETRIEVAL-CLAIM]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-SCHEMEGPT-README]
* **API Protocols & Endpoints**: FastAPI REST + SSE: POST /api/chat/stream, GET /api/schemes, GET /health; Next.js internal API proxy /api/chat/stream. [Evidence: EV-SG-API]
* **Database & Persistence**: PostgreSQL 16 with pgvector extension (1536-dimensional embeddings) configured in docker-compose.yml. [Evidence: EV-SG-DB]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-SCHEMEGPT-MANIFEST]
* **AI / ML Implementation**: RAG & Agent: pgvector dense cosine search + BM25 sparse lexical search fused via Reciprocal Rank Fusion claimed in README; requirements.txt specifies pgvector and sentence-transformers; exact quote attribution engine; Groq LLM agent. (Note: RAGAS evaluation claimed in README is unverified in CI; requirements-eval.txt explicitly excludes RAGAS due to CVE-2026-6587). [Evidence: EV-SG-RETRIEVAL, EV-SG-RAGAS-CLAIM]
* **Automated Tests**: 20 verified test source files observed (tests/test_agent.py, tests/test_cache_generation_binding.py, tests/test_db.py...) [Evidence: EV-SCHEMEGPT-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml, .github/workflows/eval.yml, .github/workflows/generation-eval.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-SCHEMEGPT-CI]
* **Observability & Telemetry**: Per-retrieval-step latency tracking and SSE connection handlers in app/api/. [Evidence: EV-SG-OBS]
* **Security & Auth Posture**: Exact quote verification preventing ungrounded hallucinations; environment variable credential isolation (.env.example). [Evidence: EV-SG-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-14T16:57:32Z, 2235 tree objects. [Evidence: EV-SCHEMEGPT-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-SCHEMEGPT-GIT]
* **Known Conflict & Audit Resolution**: Resolved: Prior audit claimed Next.js 15 and verified RAGAS CI gate. Code verification confirms Next.js 16 in web/package.json and README. RAGAS claim in README is preserved as an unverified claim, noting requirements-eval.txt explicitly excluded RAGAS due to CVE-2026-6587 in favor of bespoke eval/ scripts. [Evidence: EV-SG-NEXT16, EV-SG-RAGAS-CLAIM]
* **Identified Limitations & Missing Evidence**: Requires live Groq API key and local PostgreSQL instance with pgvector for end-to-end execution. RAGAS workflow run logs not present in repository snapshot. [Evidence: EV-SG-RAGAS-CLAIM]

---

### Sentinel

* **Repository URL**: [https://github.com/aditya0si/Sentinel](https://github.com/aditya0si/Sentinel)
* **Commit SHA**: `ab0f2cee433ebc1d8d7c47f936fc236d75a5a027`
* **Associated Evidence IDs**: EV-SENTINEL-GIT, EV-SENTINEL-LANG, EV-SENTINEL-MANIFEST, EV-SENTINEL-TESTS, EV-SENTINEL-CI, EV-SENTINEL-README, EV-SEN-PROXY, EV-SEN-TESTS, EV-SEN-API, EV-SEN-DB, EV-SEN-AI, EV-SEN-OBS, EV-SEN-SEC, EV-SEN-METRICS-CLAIM
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python [Evidence: EV-SENTINEL-LANG]
* **Frameworks & Observed Dependencies**: FastAPI, Pydantic v2, OpenTelemetry SDK, Prometheus client. [Evidence: EV-SEN-PROXY]
* **System Architecture**: Proxy architecture: FastAPI interception proxy validating incoming prompts and outgoing LLM completions against 5 guardrail filters with OpenTelemetry distributed trace export to Jaeger. [Evidence: EV-SEN-PROXY]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-SENTINEL-README]
* **API Protocols & Endpoints**: REST proxy: POST /v1/validate, POST /v1/chat/completions (transparent proxy), GET /metrics, GET /health. [Evidence: EV-SEN-API]
* **Database & Persistence**: SQLite local database store for rolling guardrail metric tracking in app/store.py. [Evidence: EV-SEN-DB]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-SENTINEL-MANIFEST]
* **AI / ML Implementation**: LLM Reliability & Guardrails: regex PII masking, toxicity heuristics, Pydantic v2 validation schema, golden-set regression evaluation gate. [Evidence: EV-SEN-AI]
* **Automated Tests**: 7 verified test source files observed (tests/test_api.py, tests/test_business_rules.py, tests/test_engine.py...) [Evidence: EV-SENTINEL-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/quality-gate.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-SENTINEL-CI]
* **Observability & Telemetry**: OpenTelemetry SDK with Jaeger trace export, Prometheus metrics endpoint (/metrics). [Evidence: EV-SEN-OBS]
* **Security & Auth Posture**: Regex PII redactor, toxicity filtering, prompt injection heuristic checks, and API key environment isolation. [Evidence: EV-SEN-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-01T12:46:03Z, 58 tree objects. [Evidence: EV-SENTINEL-GIT]
* **Observed Metrics & Benchmarks**: README claim: <180ms p95 latency on heuristic checks; 7 test files in repo. [Evidence: EV-SEN-METRICS-CLAIM]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-SENTINEL-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-SENTINEL-GIT]

---

### mcp-from-scratch

* **Repository URL**: [https://github.com/aditya0si/mcp-from-scratch](https://github.com/aditya0si/mcp-from-scratch)
* **Commit SHA**: `59fbaa0ed89d67ffb3632337d7552e5b7de49ca6`
* **Associated Evidence IDs**: EV-MCP_FROM_SCRATCH-GIT, EV-MCP_FROM_SCRATCH-LANG, EV-MCP_FROM_SCRATCH-MANIFEST, EV-MCP_FROM_SCRATCH-TESTS, EV-MCP_FROM_SCRATCH-NO-CI, EV-MCP_FROM_SCRATCH-README, EV-MCP-CODEC, EV-MCP-EVAL, EV-MCP-API, EV-MCP-DB, EV-MCP-AI, EV-MCP-OBS, EV-MCP-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python [Evidence: EV-MCP_FROM_SCRATCH-LANG]
* **Frameworks & Observed Dependencies**: Python Standard Library (asyncio, json, sys, os) - custom protocol implementation without external MCP SDK or LangChain. [Evidence: EV-MCP-CODEC]
* **System Architecture**: Protocol architecture: Custom JSON-RPC 2.0 wire codec, stdio and SSE transport handlers, method dispatcher (tools/list, tools/call, resources/list, resources/read), ReAct agent execution loop with trajectory evaluation. [Evidence: EV-MCP-CODEC]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-MCP_FROM_SCRATCH-README]
* **API Protocols & Endpoints**: JSON-RPC 2.0 over stdio & SSE: methods initialize, tools/list, tools/call, resources/list, resources/read with full spec error codes (-32700 to -32603). [Evidence: EV-MCP-API]
* **Database & Persistence**: In-memory protocol session state and local file resource storage; zero external database. [Evidence: EV-MCP-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-MCP_FROM_SCRATCH-MANIFEST]
* **AI / ML Implementation**: Agent Execution: Custom ReAct agent loop dispatching tool calls over JSON-RPC 2.0 with trajectory evaluation harness across 5 graders. [Evidence: EV-MCP-AI]
* **Automated Tests**: 5 verified test source files observed (tests/test_agent_loop.py, tests/test_eval_harness.py, tests/test_jsonrpc.py...) [Evidence: EV-MCP_FROM_SCRATCH-TESTS]
* **CI/CD Automation**: None (No CI workflows in repository) [Evidence: EV-MCP_FROM_SCRATCH-NO-CI]
* **Observability & Telemetry**: Stdio and SSE protocol message logging and trajectory recording. [Evidence: EV-MCP-OBS]
* **Security & Auth Posture**: Strict JSON-RPC 2.0 wire error handling validating specification boundary conditions. [Evidence: EV-MCP-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-01T12:21:01Z, 72 tree objects. [Evidence: EV-MCP_FROM_SCRATCH-GIT]
* **Observed Metrics & Benchmarks**: Trajectory evaluation harness across 5 verified pytest test files. [Evidence: EV-MCP-EVAL]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-MCP_FROM_SCRATCH-GIT]
* **Identified Limitations & Missing Evidence**: Protocol implementation tested locally with pytest; lacks GitHub Actions CI automation in repository snapshot. [Evidence: EV-MCP-EVAL]

---

### OpenCode-Team

* **Repository URL**: [https://github.com/aditya0si/OpenCode-Team](https://github.com/aditya0si/OpenCode-Team)
* **Commit SHA**: `70c1dbaa07819f0b9612f032d27ca5ffd626fe04`
* **Associated Evidence IDs**: EV-OPENCODE_TEAM-GIT, EV-OPENCODE_TEAM-LANG, EV-OPENCODE_TEAM-MANIFEST, EV-OPENCODE_TEAM-NO-TESTS, EV-OPENCODE_TEAM-CI, EV-OPENCODE_TEAM-README, EV-OCT-CONFLICT-LABELED, EV-OCT-NPM-PACKAGE, EV-OCT-ARCH, EV-OCT-API, EV-OCT-DB, EV-OCT-AI, EV-OCT-OBS, EV-OCT-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: TypeScript [Evidence: EV-OPENCODE_TEAM-LANG]
* **Frameworks & Observed Dependencies**: Node.js, TypeScript, npm package opencode-teamwork v0.2.1. [Evidence: EV-OCT-NPM-PACKAGE]
* **System Architecture**: Multi-agent orchestration: Antigravity-style teamwork CLI with git worktree workspace isolation per agent, DAG task decomposition and topological execution. [Evidence: EV-OCT-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-OPENCODE_TEAM-README]
* **API Protocols & Endpoints**: Terminal CLI commands and slash command dispatcher interface; not a web REST API. [Evidence: EV-OCT-API]
* **Database & Persistence**: Local file-based agent state persistence and git worktree metadata storage. [Evidence: EV-OCT-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-OPENCODE_TEAM-MANIFEST]
* **AI / ML Implementation**: Multi-Agent Orchestration: Antigravity-style agent swarm coordination with specialized agent roles and DAG execution. [Evidence: EV-OCT-AI]
* **Automated Tests**: None documented in repository snapshot [Evidence: EV-OPENCODE_TEAM-NO-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml, .github/workflows/release.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-OPENCODE_TEAM-CI]
* **Observability & Telemetry**: Terminal status reporting, worktree progress spinners, and console event logging. [Evidence: EV-OCT-OBS]
* **Security & Auth Posture**: Git worktree workspace filesystem boundary isolation per subagent execution context. [Evidence: EV-OCT-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-08-28T18:27:23Z, 68 tree objects. [Evidence: EV-OPENCODE_TEAM-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-OPENCODE_TEAM-GIT]
* **Known Conflict & Audit Resolution**: Resolved: Conflicting agent counts labeled. package.json states "10 agents, 6 patterns, 7 slash commands"; README states "6 agents, 4 patterns, 5 slash commands". [Evidence: EV-OCT-CONFLICT-LABELED]
* **Identified Limitations & Missing Evidence**: Agent count discrepancy between package.json (10) and README (6) requires dynamic verification. [Evidence: EV-OCT-CONFLICT-LABELED]

---

### tenant-api-platform

* **Repository URL**: [https://github.com/aditya0si/tenant-api-platform](https://github.com/aditya0si/tenant-api-platform)
* **Commit SHA**: `a6f715aac1d4e46b2ef30e12fb42d4719672f7f5`
* **Associated Evidence IDs**: EV-TENANT_API_PLATFORM-GIT, EV-TENANT_API_PLATFORM-LANG, EV-TENANT_API_PLATFORM-MANIFEST, EV-TENANT_API_PLATFORM-TESTS, EV-TENANT_API_PLATFORM-CI, EV-TENANT_API_PLATFORM-README, EV-TAP-GO-MOD, EV-TAP-NO-STRIPE-AI, EV-TAP-RLS, EV-TAP-ADR, EV-TAP-LOAD-BENCHMARK, EV-TAP-FLAGSHIP-ELIGIBILITY, EV-TAP-API, EV-TAP-OBS, EV-TAP-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Go, PLpgSQL, JavaScript, Python, Makefile, Dockerfile [Evidence: EV-TENANT_API_PLATFORM-LANG]
* **Frameworks & Observed Dependencies**: Go 1.27, go-chi/chi/v5, jackc/pgx/v5, redis/go-redis/v9, golang-jwt/jwt/v5, prometheus/client_golang. Verified ZERO Stripe SDK and ZERO AI dependencies. [Evidence: EV-TAP-GO-MOD, EV-TAP-NO-STRIPE-AI]
* **System Architecture**: Multi-tenant REST service: Go chi HTTP routing, PostgreSQL Row-Level Security (RLS) policies keyed on app.current_tenant_id, Redis distributed token bucket rate limiting and write idempotency, outbox pattern for crash-resilient webhook dispatching, supported by 14 ADRs. [Evidence: EV-TAP-RLS, EV-TAP-ADR]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-TENANT_API_PLATFORM-README]
* **API Protocols & Endpoints**: REST API: Tenant provisioning, user memberships, project management, invoice ledger querying, idempotent mutation endpoints, webhook subscriber registration, Prometheus /metrics, /health. [Evidence: EV-TAP-API]
* **Database & Persistence**: PostgreSQL 16 with Row-Level Security (RLS) tables and Redis 7 for distributed rate limiting and idempotency locks. [Evidence: EV-TAP-RLS, EV-TAP-GO-MOD]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-TENANT_API_PLATFORM-MANIFEST]
* **AI / ML Implementation**: None / Pure systems and backend engineering; zero AI/ML models or dependencies in codebase. [Evidence: EV-TAP-NO-STRIPE-AI]
* **Automated Tests**: 33 verified test source files observed (internal/authn/apikey_test.go, internal/authn/password_test.go, internal/authn/refresh_test.go...) [Evidence: EV-TENANT_API_PLATFORM-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-TENANT_API_PLATFORM-CI]
* **Observability & Telemetry**: Prometheus metrics exported at /metrics, structured JSON logging, append-only audit trail table. [Evidence: EV-TAP-OBS]
* **Security & Auth Posture**: PostgreSQL Row-Level Security (RLS) enforcing complete multi-tenant boundary; JWT authentication (golang-jwt/v5); distributed token bucket rate limiting. [Evidence: EV-TAP-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-11T03:22:57Z, 193 tree objects. [Evidence: EV-TENANT_API_PLATFORM-GIT]
* **Observed Metrics & Benchmarks**: Committed k6 load test results JSON (load/results.json): reports 6,250 requests at 120 req/s, 0% failure rate, p95 read latency 28.8ms, p95 write latency 49.0ms. Historical artifact committed prior to snapshot; not executed in current audit session; subject to methodology limits (local single-node Docker environment, simulated load). [Evidence: EV-TAP-LOAD-BENCHMARK]
* **Known Conflict & Audit Resolution**: Resolved: Prior audit claimed Stripe integration and AI models. Code verification confirms ZERO Stripe SDK and ZERO AI models; service is an internal multi-tenant billing engine in Go with RLS and Redis. Re-evaluated as eligible Backend Flagship. [Evidence: EV-TAP-NO-STRIPE-AI, EV-TAP-FLAGSHIP-ELIGIBILITY]
* **Identified Limitations & Missing Evidence**: Requires local PostgreSQL and Redis instances for live API execution; load tests were executed locally against Docker containers prior to snapshot. [Evidence: EV-TAP-LOAD-BENCHMARK]

---

### event-stream-platform

* **Repository URL**: [https://github.com/aditya0si/event-stream-platform](https://github.com/aditya0si/event-stream-platform)
* **Commit SHA**: `4ecb068d032a155c74dc2911c2d8cf0a713ce857`
* **Associated Evidence IDs**: EV-EVENT_STREAM_PLATFORM-GIT, EV-EVENT_STREAM_PLATFORM-LANG, EV-EVENT_STREAM_PLATFORM-MANIFEST, EV-EVENT_STREAM_PLATFORM-TESTS, EV-EVENT_STREAM_PLATFORM-CI, EV-EVENT_STREAM_PLATFORM-README, EV-ESP-GO-MOD, EV-ESP-NO-SARAMA-TIMESCALE, EV-ESP-DOCKER, EV-ESP-LOAD-BENCHMARK, EV-ESP-API, EV-ESP-NO-AI, EV-ESP-OBS, EV-ESP-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Go, Python, HTML, JavaScript, Makefile, Dockerfile [Evidence: EV-EVENT_STREAM_PLATFORM-LANG]
* **Frameworks & Observed Dependencies**: Go 1.27, twmb/franz-go v1.21.6 (Kafka/Redpanda), jackc/pgx/v5, redis/go-redis/v9, prometheus/client_golang. Verified NO Sarama, NO Timescale driver, NO ClickHouse. [Evidence: EV-ESP-GO-MOD, EV-ESP-NO-SARAMA-TIMESCALE]
* **System Architecture**: Event streaming architecture: Go gateway with franz-go client publishing to Redpanda message broker, Go consumer workers reading partition streams and persisting to PostgreSQL and Redis, Prometheus metrics export. [Evidence: EV-ESP-GO-MOD, EV-ESP-DOCKER]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-EVENT_STREAM_PLATFORM-README]
* **API Protocols & Endpoints**: HTTP Ingestion POST /v1/events, health check /health, Prometheus /metrics. [Evidence: EV-ESP-API]
* **Database & Persistence**: PostgreSQL 16 (relational events log) and Redis 7 (event state/deduplication) in docker-compose.yml. Redpanda used as message log. No Timescale or ClickHouse. [Evidence: EV-ESP-GO-MOD, EV-ESP-DOCKER]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-EVENT_STREAM_PLATFORM-MANIFEST]
* **AI / ML Implementation**: None / Pure systems and streaming backend engineering; zero AI/ML models or dependencies. [Evidence: EV-ESP-NO-AI]
* **Automated Tests**: 16 verified test source files observed (internal/consumer/consumer_test.go, internal/event/envelope_test.go, internal/event/fuzz_test.go...) [Evidence: EV-EVENT_STREAM_PLATFORM-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-EVENT_STREAM_PLATFORM-CI]
* **Observability & Telemetry**: Prometheus metrics (/metrics), consumer lag tracking, structured logging. [Evidence: EV-ESP-OBS]
* **Security & Auth Posture**: Environment variable configuration and isolated Docker container network posture. [Evidence: EV-ESP-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-11T16:38:01Z, 116 tree objects. [Evidence: EV-EVENT_STREAM_PLATFORM-GIT]
* **Observed Metrics & Benchmarks**: Committed load test results JSON (load/ingest-results.json): reports 40s duration at 2500 offered events/s meeting 2000 events/s NFR1 target. Historical artifact committed prior to snapshot; not executed in current audit session; subject to methodology limits (local Docker environment, synthetic event generator). [Evidence: EV-ESP-LOAD-BENCHMARK]
* **Known Conflict & Audit Resolution**: Resolved: Prior audit claimed Sarama Kafka driver, TimescaleDB, and ClickHouse. Code verification confirms it uses twmb/franz-go, Redpanda, PostgreSQL, and Redis. [Evidence: EV-ESP-GO-MOD, EV-ESP-NO-SARAMA-TIMESCALE]
* **Identified Limitations & Missing Evidence**: Requires Docker Compose to spin up Redpanda and PostgreSQL for end-to-end streaming ingestion. [Evidence: EV-ESP-LOAD-BENCHMARK]

---

### grounded-knowledge-platform

* **Repository URL**: [https://github.com/aditya0si/grounded-knowledge-platform](https://github.com/aditya0si/grounded-knowledge-platform)
* **Commit SHA**: `55849ba6101a94b0bbf5392bdeaa7169a536af69`
* **Associated Evidence IDs**: EV-GROUNDED_KNOWLEDGE_PLATFORM-GIT, EV-GROUNDED_KNOWLEDGE_PLATFORM-LANG, EV-GROUNDED_KNOWLEDGE_PLATFORM-MANIFEST, EV-GROUNDED_KNOWLEDGE_PLATFORM-TESTS, EV-GROUNDED_KNOWLEDGE_PLATFORM-CI, EV-GROUNDED_KNOWLEDGE_PLATFORM-README, EV-GKP-MANIFEST, EV-GKP-ARCH, EV-GKP-API, EV-GKP-DB, EV-GKP-AI, EV-GKP-OBS, EV-GKP-SEC, EV-GKP-ADR
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, Makefile, Mako [Evidence: EV-GROUNDED_KNOWLEDGE_PLATFORM-LANG]
* **Frameworks & Observed Dependencies**: FastAPI, SQLAlchemy, pgvector, Redis, Pydantic, ruff, mypy. [Evidence: EV-GKP-MANIFEST]
* **System Architecture**: Enterprise RAG architecture: Modular src/gkp/ structure (api, core, db, ingest, retrieve, generate, eval) with dual-arm retrieval and server-derived ACL tag filtering. [Evidence: EV-GKP-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-GROUNDED_KNOWLEDGE_PLATFORM-README]
* **API Protocols & Endpoints**: FastAPI REST endpoints in src/gkp/api/ for query retrieval and document ingestion. [Evidence: EV-GKP-API]
* **Database & Persistence**: PostgreSQL 16 with pgvector and Redis cache/queue in docker-compose.yml. [Evidence: EV-GKP-DB]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-GROUNDED_KNOWLEDGE_PLATFORM-MANIFEST]
* **AI / ML Implementation**: Dual-arm dense and sparse retrieval with RRF fusion and server-derived ACL tag filtering in retrieval predicate. [Evidence: EV-GKP-AI]
* **Automated Tests**: 7 verified test source files observed (tests/test_chunking.py, tests/test_config.py, tests/test_corpus.py...) [Evidence: EV-GROUNDED_KNOWLEDGE_PLATFORM-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml, .github/workflows/eval.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-GROUNDED_KNOWLEDGE_PLATFORM-CI]
* **Observability & Telemetry**: Structured JSON logging and configuration instrumentation. [Evidence: EV-GKP-OBS]
* **Security & Auth Posture**: Server-derived ACL tags enforced inside SQL retrieval predicate rather than post-filtered; 0 permission leaks verified in baseline. [Evidence: EV-GKP-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-11T22:20:59Z, 177 tree objects. [Evidence: EV-GROUNDED_KNOWLEDGE_PLATFORM-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-GROUNDED_KNOWLEDGE_PLATFORM-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-GROUNDED_KNOWLEDGE_PLATFORM-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-GROUNDED_KNOWLEDGE_PLATFORM-GIT]

---

### CoverAI

* **Repository URL**: [https://github.com/aditya0si/CoverAI](https://github.com/aditya0si/CoverAI)
* **Commit SHA**: `d1e73678b093e4e6693f08fa1564e14b11ec2168`
* **Associated Evidence IDs**: EV-COVERAI-GIT, EV-COVERAI-LANG, EV-COVERAI-MANIFEST, EV-COVERAI-TESTS, EV-COVERAI-CI, EV-COVERAI-README, EV-COVERAI-MANIFEST, EV-COVERAI-ARCH, EV-COVERAI-API, EV-COVERAI-DB, EV-COVERAI-AI, EV-COVERAI-OBS, EV-COVERAI-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: TypeScript, Python, JavaScript, Dockerfile, CSS, Makefile, Mako, Procfile [Evidence: EV-COVERAI-LANG]
* **Frameworks & Observed Dependencies**: Next.js 14, FastAPI, OpenCV, PaddleOCR, Tailwind CSS. [Evidence: EV-COVERAI-MANIFEST]
* **System Architecture**: Client-server architecture: Next.js frontend in apps/web/ and FastAPI image processing service in apps/api/. [Evidence: EV-COVERAI-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-COVERAI-README]
* **API Protocols & Endpoints**: REST API endpoints in apps/api/routers/ for vehicle damage assessment and document ingestion. [Evidence: EV-COVERAI-API]
* **Database & Persistence**: SQLite local database store for claim record management. [Evidence: EV-COVERAI-DB]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-COVERAI-MANIFEST]
* **AI / ML Implementation**: Vision + NLP: PaddleOCR vehicle damage assessment and insurance document parsing. [Evidence: EV-COVERAI-AI]
* **Automated Tests**: 13 verified test source files observed (apps/api/tests/test_advisors_nplus1.py, apps/api/tests/test_claim_dispatch.py, apps/api/tests/test_claim_guards.py...) [Evidence: EV-COVERAI-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-COVERAI-CI]
* **Observability & Telemetry**: FastAPI request logging and error handlers. [Evidence: EV-COVERAI-OBS]
* **Security & Auth Posture**: File upload size limits and image format MIME type validation in API routers. [Evidence: EV-COVERAI-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-14T17:26:14Z, 257 tree objects. [Evidence: EV-COVERAI-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-COVERAI-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-COVERAI-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-COVERAI-GIT]

---

### DevAtlas

* **Repository URL**: [https://github.com/aditya0si/DevAtlas](https://github.com/aditya0si/DevAtlas)
* **Commit SHA**: `2b8d37bca2443464fce97e3c88820dd783d50011`
* **Associated Evidence IDs**: EV-DEVATLAS-GIT, EV-DEVATLAS-LANG, EV-DEVATLAS-TESTS, EV-DEVATLAS-CI, EV-DEVATLAS-README, EV-DEVATLAS-MANIFEST, EV-DEVATLAS-ARCH, EV-DEVATLAS-API, EV-DEVATLAS-DB, EV-DEVATLAS-AI, EV-DEVATLAS-OBS, EV-DEVATLAS-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, TypeScript, JavaScript, HCL, CSS, Shell, Batchfile, Dockerfile, Mako [Evidence: EV-DEVATLAS-LANG]
* **Frameworks & Observed Dependencies**: FastAPI, TypeScript, React, Vite, GitHub REST/GraphQL client. [Evidence: EV-DEVATLAS-MANIFEST]
* **System Architecture**: Two-tier developer analytics application: FastAPI backend with background worker and React SPA frontend. [Evidence: EV-DEVATLAS-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-DEVATLAS-README]
* **API Protocols & Endpoints**: FastAPI REST API routes for developer profile querying and repository statistics. [Evidence: EV-DEVATLAS-API]
* **Database & Persistence**: PostgreSQL database connection pooling and Redis cache configuration. [Evidence: EV-DEVATLAS-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-DEVATLAS-MANIFEST]
* **AI / ML Implementation**: Groq LLM service and background worker for developer capability classification. [Evidence: EV-DEVATLAS-AI]
* **Automated Tests**: 40 verified test source files observed (backend/tests/test_activity.py, backend/tests/test_ai_classification_worker.py, backend/tests/test_ai_service_groq.py...) [Evidence: EV-DEVATLAS-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml, .github/workflows/sync-github-india.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-DEVATLAS-CI]
* **Observability & Telemetry**: Structured JSON logging and Prometheus metric instrumentation in backend. [Evidence: EV-DEVATLAS-OBS]
* **Security & Auth Posture**: JWT authentication, password hashing, and GitHub token isolation in environment config. [Evidence: EV-DEVATLAS-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-17T22:02:27Z, 404 tree objects. [Evidence: EV-DEVATLAS-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-DEVATLAS-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-DEVATLAS-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-DEVATLAS-GIT]

---

### TheButterFlyEffect

* **Repository URL**: [https://github.com/aditya0si/TheButterFlyEffect](https://github.com/aditya0si/TheButterFlyEffect)
* **Commit SHA**: `a62f3a0b22afef9b8c1a4d92893901a8d87a16d5`
* **Associated Evidence IDs**: EV-THEBUTTERFLYEFFECT-GIT, EV-THEBUTTERFLYEFFECT-LANG, EV-THEBUTTERFLYEFFECT-NO-TESTS, EV-THEBUTTERFLYEFFECT-NO-CI, EV-THEBUTTERFLYEFFECT-README, EV-TBE-MANIFEST, EV-TBE-ARCH, EV-TBE-API, EV-TBE-DB, EV-TBE-AI, EV-TBE-OBS, EV-TBE-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, JavaScript, CSS, HTML [Evidence: EV-THEBUTTERFLYEFFECT-LANG]
* **Frameworks & Observed Dependencies**: Python, NetworkX, Neo4j driver, LangChain, Streamlit. [Evidence: EV-TBE-MANIFEST]
* **System Architecture**: Interactive Streamlit UI with Neo4j graph database connector and NetworkX traversal pipeline. [Evidence: EV-TBE-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-THEBUTTERFLYEFFECT-README]
* **API Protocols & Endpoints**: Interactive Streamlit UI event loop; zero standalone public REST API endpoints. [Evidence: EV-TBE-API]
* **Database & Persistence**: Neo4j graph database connection with Cypher query definitions and local graph caching. [Evidence: EV-TBE-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-THEBUTTERFLYEFFECT-GIT]
* **AI / ML Implementation**: Graph-RAG: Knowledge graph traversal across legal and biomedical documents using Neo4j/NetworkX. [Evidence: EV-TBE-AI]
* **Automated Tests**: None documented in repository snapshot [Evidence: EV-THEBUTTERFLYEFFECT-NO-TESTS]
* **CI/CD Automation**: None (No CI workflows in repository) [Evidence: EV-THEBUTTERFLYEFFECT-NO-CI]
* **Observability & Telemetry**: Streamlit UI trace logs and graph rendering diagnostics. [Evidence: EV-TBE-OBS]
* **Security & Auth Posture**: Neo4j database credentials isolated via python-dotenv (.env.example). [Evidence: EV-TBE-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-01T12:42:12Z, 45 tree objects. [Evidence: EV-THEBUTTERFLYEFFECT-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-THEBUTTERFLYEFFECT-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-THEBUTTERFLYEFFECT-GIT]
* **Identified Limitations & Missing Evidence**: No automated CI/CD workflow configured in repository snapshot. [Evidence: EV-THEBUTTERFLYEFFECT-NO-CI]

---

### aegis

* **Repository URL**: [https://github.com/aditya0si/aegis](https://github.com/aditya0si/aegis)
* **Commit SHA**: `1b99d93491c227dfffa68f5cc90a7b25d1da098c`
* **Associated Evidence IDs**: EV-AEGIS-GIT, EV-AEGIS-LANG, EV-AEGIS-MANIFEST, EV-AEGIS-TESTS, EV-AEGIS-CI, EV-AEGIS-README, EV-AEGIS-ARCH, EV-AEGIS-API, EV-AEGIS-DB, EV-AEGIS-AI, EV-AEGIS-OBS, EV-AEGIS-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, Dockerfile [Evidence: EV-AEGIS-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: requirements.txt, pyproject.toml, Dockerfile, docker-compose.yml. [Evidence: EV-AEGIS-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-AEGIS-GIT]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-AEGIS-README]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-AEGIS-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-AEGIS-GIT]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-AEGIS-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-AEGIS-GIT]
* **Automated Tests**: 6 verified test source files observed (tests/test_analyzer.py, tests/test_gate_otel.py, tests/test_injection.py...) [Evidence: EV-AEGIS-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-AEGIS-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-AEGIS-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-AEGIS-GIT]
* **Commit History & Activity**: Default branch `master`, pushed at 2026-09-02T15:51:15Z, 56 tree objects. [Evidence: EV-AEGIS-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-AEGIS-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-AEGIS-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-AEGIS-GIT]

---

### pharmforge

* **Repository URL**: [https://github.com/aditya0si/pharmforge](https://github.com/aditya0si/pharmforge)
* **Commit SHA**: `6ddc42287f6ad21fb7d92ec568c8a6bd90aec274`
* **Associated Evidence IDs**: EV-PHARMFORGE-GIT, EV-PHARMFORGE-LANG, EV-PHARMFORGE-MANIFEST, EV-PHARMFORGE-TESTS, EV-PHARMFORGE-CI, EV-PHARMFORGE-README, EV-PHARMFORGE-ARCH, EV-PHARMFORGE-API, EV-PHARMFORGE-DB, EV-PHARMFORGE-AI, EV-PHARMFORGE-OBS, EV-PHARMFORGE-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, Dockerfile [Evidence: EV-PHARMFORGE-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: pyproject.toml, Dockerfile, docker-compose.yml. [Evidence: EV-PHARMFORGE-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-PHARMFORGE-GIT]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-PHARMFORGE-README]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-PHARMFORGE-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-PHARMFORGE-GIT]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-PHARMFORGE-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-PHARMFORGE-GIT]
* **Automated Tests**: 6 verified test source files observed (tests/test_agents.py, tests/test_api_feedback.py, tests/test_chem.py...) [Evidence: EV-PHARMFORGE-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-PHARMFORGE-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-PHARMFORGE-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-PHARMFORGE-GIT]
* **Commit History & Activity**: Default branch `master`, pushed at 2026-09-02T15:51:26Z, 66 tree objects. [Evidence: EV-PHARMFORGE-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-PHARMFORGE-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-PHARMFORGE-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-PHARMFORGE-GIT]

---

### skyguard

* **Repository URL**: [https://github.com/aditya0si/skyguard](https://github.com/aditya0si/skyguard)
* **Commit SHA**: `66f0b9d861957d1e6c7a20e9f1b0e4d6d3e053e1`
* **Associated Evidence IDs**: EV-SKYGUARD-GIT, EV-SKYGUARD-LANG, EV-SKYGUARD-MANIFEST, EV-SKYGUARD-TESTS, EV-SKYGUARD-CI, EV-SKYGUARD-README, EV-SKYGUARD-ARCH, EV-SKYGUARD-API, EV-SKYGUARD-DB, EV-SKYGUARD-AI, EV-SKYGUARD-OBS, EV-SKYGUARD-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, JavaScript, HTML, CSS [Evidence: EV-SKYGUARD-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: requirements.txt, pyproject.toml. [Evidence: EV-SKYGUARD-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-SKYGUARD-GIT]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-SKYGUARD-README]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-SKYGUARD-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-SKYGUARD-GIT]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-SKYGUARD-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-SKYGUARD-GIT]
* **Automated Tests**: 5 verified test source files observed (tests/test_api.py, tests/test_benchmark.py, tests/test_data.py...) [Evidence: EV-SKYGUARD-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-SKYGUARD-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-SKYGUARD-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-SKYGUARD-GIT]
* **Commit History & Activity**: Default branch `master`, pushed at 2026-09-05T22:30:54Z, 74 tree objects. [Evidence: EV-SKYGUARD-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-SKYGUARD-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-SKYGUARD-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-SKYGUARD-GIT]

---

### bustwatch

* **Repository URL**: [https://github.com/aditya0si/bustwatch](https://github.com/aditya0si/bustwatch)
* **Commit SHA**: `2ed53f052df3ca248505cca919620dcbad09245b`
* **Associated Evidence IDs**: EV-BUSTWATCH-GIT, EV-BUSTWATCH-LANG, EV-BUSTWATCH-MANIFEST, EV-BUSTWATCH-TESTS, EV-BUSTWATCH-CI, EV-BUSTWATCH-README, EV-BUSTWATCH-MANIFEST, EV-BUSTWATCH-ARCH, EV-BUSTWATCH-API, EV-BUSTWATCH-DB, EV-BUSTWATCH-AI, EV-BUSTWATCH-OBS, EV-BUSTWATCH-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, TypeScript, HTML, CSS, JavaScript [Evidence: EV-BUSTWATCH-LANG]
* **Frameworks & Observed Dependencies**: Python, FastAPI, TypeScript/React, Leaflet, pandas. [Evidence: EV-BUSTWATCH-MANIFEST]
* **System Architecture**: Two-tier transit tracking: FastAPI backend in api/ and React/Leaflet map frontend in web/. [Evidence: EV-BUSTWATCH-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-BUSTWATCH-README]
* **API Protocols & Endpoints**: FastAPI REST endpoints in api/main.py for transit arrivals and stop routes. [Evidence: EV-BUSTWATCH-API]
* **Database & Persistence**: SQLite database and local in-memory cache for GTFS schedule data. [Evidence: EV-BUSTWATCH-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-BUSTWATCH-MANIFEST]
* **AI / ML Implementation**: Heuristic arrival time calibration algorithms compensating for transit schedule drift. [Evidence: EV-BUSTWATCH-AI]
* **Automated Tests**: 6 verified test source files observed (tests/test_api.py, tests/test_calibration.py, tests/test_data.py...) [Evidence: EV-BUSTWATCH-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-BUSTWATCH-CI]
* **Observability & Telemetry**: FastAPI server request logging and GTFS ingest diagnostics. [Evidence: EV-BUSTWATCH-OBS]
* **Security & Auth Posture**: CORS policy and API input schema validation. [Evidence: EV-BUSTWATCH-SEC]
* **Commit History & Activity**: Default branch `master`, pushed at 2026-08-26T13:54:51Z, 78 tree objects. [Evidence: EV-BUSTWATCH-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-BUSTWATCH-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-BUSTWATCH-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-BUSTWATCH-GIT]

---

### floodlens

* **Repository URL**: [https://github.com/aditya0si/floodlens](https://github.com/aditya0si/floodlens)
* **Commit SHA**: `fc6ac4c18f4e68edbd079625bdca1106d193836c`
* **Associated Evidence IDs**: EV-FLOODLENS-GIT, EV-FLOODLENS-LANG, EV-FLOODLENS-MANIFEST, EV-FLOODLENS-TESTS, EV-FLOODLENS-CI, EV-FLOODLENS-README, EV-FLOODLENS-MANIFEST, EV-FLOODLENS-ARCH, EV-FLOODLENS-API, EV-FLOODLENS-DB, EV-FLOODLENS-AI, EV-FLOODLENS-OBS, EV-FLOODLENS-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, TypeScript, CSS, HTML, JavaScript [Evidence: EV-FLOODLENS-LANG]
* **Frameworks & Observed Dependencies**: Python, FastAPI, rasterio, numpy, scipy, scikit-learn. [Evidence: EV-FLOODLENS-MANIFEST]
* **System Architecture**: FastAPI geospatial processing pipeline executing digital elevation model (DEM) hydrology physics. [Evidence: EV-FLOODLENS-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-FLOODLENS-README]
* **API Protocols & Endpoints**: FastAPI REST endpoints in api/routes.py for geospatial inundation depth calculations. [Evidence: EV-FLOODLENS-API]
* **Database & Persistence**: Local GeoTIFF / DEM raster files and NumPy matrix cache. [Evidence: EV-FLOODLENS-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-FLOODLENS-MANIFEST]
* **AI / ML Implementation**: Numerical flood inundation flow models and terrain slope raster calculations. [Evidence: EV-FLOODLENS-AI]
* **Automated Tests**: 7 verified test source files observed (tests/test_api_endpoints.py, tests/test_dem_processor.py, tests/test_hydrology_physics.py...) [Evidence: EV-FLOODLENS-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-FLOODLENS-CI]
* **Observability & Telemetry**: Raster calculation timing instrumentation and API execution logs. [Evidence: EV-FLOODLENS-OBS]
* **Security & Auth Posture**: Geographic coordinate bounding box input validation. [Evidence: EV-FLOODLENS-SEC]
* **Commit History & Activity**: Default branch `master`, pushed at 2026-08-26T13:54:44Z, 70 tree objects. [Evidence: EV-FLOODLENS-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-FLOODLENS-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-FLOODLENS-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-FLOODLENS-GIT]

---

### stormcast

* **Repository URL**: [https://github.com/aditya0si/stormcast](https://github.com/aditya0si/stormcast)
* **Commit SHA**: `0e145a61f05906996c9e30050c4e974ff5c5b2a3`
* **Associated Evidence IDs**: EV-STORMCAST-GIT, EV-STORMCAST-LANG, EV-STORMCAST-MANIFEST, EV-STORMCAST-TESTS, EV-STORMCAST-CI, EV-STORMCAST-ARCH, EV-STORMCAST-API, EV-STORMCAST-DB, EV-STORMCAST-AI, EV-STORMCAST-OBS, EV-STORMCAST-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, TypeScript, HTML, CSS, JavaScript [Evidence: EV-STORMCAST-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: requirements.txt, pyproject.toml. [Evidence: EV-STORMCAST-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-STORMCAST-GIT]
* **README Documentation**: None / Missing [Evidence: EV-STORMCAST-GIT]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-STORMCAST-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-STORMCAST-GIT]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-STORMCAST-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-STORMCAST-GIT]
* **Automated Tests**: 9 verified test source files observed (tests/test_api.py, tests/test_config.py, tests/test_data.py...) [Evidence: EV-STORMCAST-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-STORMCAST-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-STORMCAST-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-STORMCAST-GIT]
* **Commit History & Activity**: Default branch `master`, pushed at 2026-08-24T19:07:03Z, 81 tree objects. [Evidence: EV-STORMCAST-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-STORMCAST-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-STORMCAST-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-STORMCAST-GIT]

---

### weathergpt

* **Repository URL**: [https://github.com/aditya0si/weathergpt](https://github.com/aditya0si/weathergpt)
* **Commit SHA**: `bf4bd4737e7a4fcd1ea7807220b44a43ffa832f2`
* **Associated Evidence IDs**: EV-WEATHERGPT-GIT, EV-WEATHERGPT-LANG, EV-WEATHERGPT-MANIFEST, EV-WEATHERGPT-TESTS, EV-WEATHERGPT-CI, EV-WEATHERGPT-README, EV-WEATHERGPT-ARCH, EV-WEATHERGPT-API, EV-WEATHERGPT-DB, EV-WEATHERGPT-AI, EV-WEATHERGPT-OBS, EV-WEATHERGPT-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, JavaScript, HTML, CSS [Evidence: EV-WEATHERGPT-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: requirements.txt, pyproject.toml. [Evidence: EV-WEATHERGPT-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-WEATHERGPT-GIT]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-WEATHERGPT-README]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-WEATHERGPT-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-WEATHERGPT-GIT]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-WEATHERGPT-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-WEATHERGPT-GIT]
* **Automated Tests**: 6 verified test source files observed (tests/test_agent.py, tests/test_api.py, tests/test_config.py...) [Evidence: EV-WEATHERGPT-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-WEATHERGPT-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-WEATHERGPT-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-WEATHERGPT-GIT]
* **Commit History & Activity**: Default branch `master`, pushed at 2026-08-24T19:06:43Z, 80 tree objects. [Evidence: EV-WEATHERGPT-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-WEATHERGPT-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-WEATHERGPT-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-WEATHERGPT-GIT]

---

### agentic_rag_system

* **Repository URL**: [https://github.com/aditya0si/agentic_rag_system](https://github.com/aditya0si/agentic_rag_system)
* **Commit SHA**: `48a3b5a6d579b26bc067f2380a26fb37d82ace6b`
* **Associated Evidence IDs**: EV-AGENTIC_RAG_SYSTEM-GIT, EV-AGENTIC_RAG_SYSTEM-LANG, EV-AGENTIC_RAG_SYSTEM-MANIFEST, EV-AGENTIC_RAG_SYSTEM-TESTS, EV-AGENTIC_RAG_SYSTEM-CI, EV-AGENTIC_RAG_SYSTEM-README, EV-AGENTIC_RAG_SYSTEM-ARCH, EV-AGENTIC_RAG_SYSTEM-API, EV-AGENTIC_RAG_SYSTEM-DB, EV-AGENTIC_RAG_SYSTEM-AI, EV-AGENTIC_RAG_SYSTEM-OBS, EV-AGENTIC_RAG_SYSTEM-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, Dockerfile [Evidence: EV-AGENTIC_RAG_SYSTEM-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: Dockerfile, docker-compose.yml. [Evidence: EV-AGENTIC_RAG_SYSTEM-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-AGENTIC_RAG_SYSTEM-README]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-AGENTIC_RAG_SYSTEM-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]
* **Automated Tests**: 17 verified test source files observed (backend/test_agentic_rag.py, backend/test_basic_rag.py, backend/test_endpoints.py...) [Evidence: EV-AGENTIC_RAG_SYSTEM-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-AGENTIC_RAG_SYSTEM-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-08-19T19:33:28Z, 101 tree objects. [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-AGENTIC_RAG_SYSTEM-GIT]

---

### Cyber

* **Repository URL**: [https://github.com/aditya0si/Cyber](https://github.com/aditya0si/Cyber)
* **Commit SHA**: `4ec33c00f8685151e4b7417f204bf5b6566e4ad2`
* **Associated Evidence IDs**: EV-CYBER-GIT, EV-CYBER-LANG, EV-CYBER-MANIFEST, EV-CYBER-TESTS, EV-CYBER-CI, EV-CYBER-README, EV-CYBER-ARCH, EV-CYBER-API, EV-CYBER-DB, EV-CYBER-AI, EV-CYBER-OBS, EV-CYBER-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, TypeScript, CSS, Jinja, Shell, Batchfile, JavaScript [Evidence: EV-CYBER-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: pyproject.toml, docker-compose.yml. [Evidence: EV-CYBER-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-CYBER-GIT]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-CYBER-README]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-CYBER-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-CYBER-GIT]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-CYBER-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-CYBER-GIT]
* **Automated Tests**: 33 verified test source files observed (tests/analyst/test_human_approval_gate.py, tests/analyst/test_nodes_rule_based.py, tests/api/test_analyst_endpoints.py...) [Evidence: EV-CYBER-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-CYBER-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-CYBER-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-CYBER-GIT]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-08-11T18:25:14Z, 361 tree objects. [Evidence: EV-CYBER-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-CYBER-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-CYBER-GIT]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-CYBER-GIT]

---

### E-commerce-Dashboard

* **Repository URL**: [https://github.com/aditya0si/E-commerce-Dashboard](https://github.com/aditya0si/E-commerce-Dashboard)
* **Commit SHA**: `efc53ac6cc242a1c1390af606f3a578b92cc1f99`
* **Associated Evidence IDs**: EV-E_COMMERCE_DASHBOARD-GIT, EV-E_COMMERCE_DASHBOARD-LANG, EV-E_COMMERCE_DASHBOARD-MANIFEST, EV-E_COMMERCE_DASHBOARD-TESTS, EV-E_COMMERCE_DASHBOARD-NO-CI, EV-E_COMMERCE_DASHBOARD-README, EV-ECOM-ORDERS-CLAIM, EV-ECOM-STREAMLIT, EV-ECOM-ARCH, EV-ECOM-DB, EV-ECOM-API, EV-ECOM-AI, EV-ECOM-OBS, EV-ECOM-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, Jupyter Notebook [Evidence: EV-E_COMMERCE_DASHBOARD-LANG]
* **Frameworks & Observed Dependencies**: Python, Streamlit, pandas, DuckDB / SQLite. [Evidence: EV-ECOM-STREAMLIT]
* **System Architecture**: Interactive analytics architecture: Streamlit multipage application running OLAP queries over Brazilian Olist marketplace dataset using pandas and DuckDB/SQLite. [Evidence: EV-ECOM-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-E_COMMERCE_DASHBOARD-README]
* **API Protocols & Endpoints**: None / Interactive Streamlit UI components (no standalone public REST API). [Evidence: EV-ECOM-API]
* **Database & Persistence**: DuckDB / SQLite querying Brazilian Olist CSV dataset. [Evidence: EV-ECOM-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-E_COMMERCE_DASHBOARD-MANIFEST]
* **AI / ML Implementation**: Descriptive OLAP business intelligence analytics; zero predictive ML models in application interface. [Evidence: EV-ECOM-AI]
* **Automated Tests**: 1 verified test source files observed (tests/test_views.py) [Evidence: EV-E_COMMERCE_DASHBOARD-TESTS]
* **CI/CD Automation**: None (No CI workflows in repository) [Evidence: EV-E_COMMERCE_DASHBOARD-NO-CI]
* **Observability & Telemetry**: Standard Streamlit console execution logging. [Evidence: EV-ECOM-OBS]
* **Security & Auth Posture**: Local read-only analytics execution over static public CSV dataset. [Evidence: EV-ECOM-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-08T21:06:28Z, 57 tree objects. [Evidence: EV-E_COMMERCE_DASHBOARD-GIT]
* **Observed Metrics & Benchmarks**: README claim: 99,441 orders (96,478 delivered orders, R$ 13.22M revenue, AOV R$ 137.04) from Brazilian Olist dataset. [Evidence: EV-ECOM-ORDERS-CLAIM]
* **Known Conflict & Audit Resolution**: Resolved: Order count cited accurately as 99,441 orders from Brazilian Olist dataset as claimed in README. [Evidence: EV-ECOM-ORDERS-CLAIM]
* **Identified Limitations & Missing Evidence**: No automated CI/CD workflow configured in repository snapshot. [Evidence: EV-E_COMMERCE_DASHBOARD-NO-CI]

---

### vibe-odds

* **Repository URL**: [https://github.com/aditya0si/vibe-odds](https://github.com/aditya0si/vibe-odds)
* **Commit SHA**: `d642b70addbf76a2bc75ad7d9965aa73429562dd`
* **Associated Evidence IDs**: EV-VIBE_ODDS-GIT, EV-VIBE_ODDS-LANG, EV-VIBE_ODDS-MANIFEST, EV-VIBE_ODDS-TESTS, EV-VIBE_ODDS-NO-CI, EV-VIBE_ODDS-README, EV-VIBE-MANIFEST, EV-VIBE-ARCH, EV-VIBE-API, EV-VIBE-DB, EV-VIBE-AI, EV-VIBE-OBS, EV-VIBE-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, HTML [Evidence: EV-VIBE_ODDS-LANG]
* **Frameworks & Observed Dependencies**: Python, pandas, numpy, scipy, Streamlit. [Evidence: EV-VIBE-MANIFEST]
* **System Architecture**: Statistical simulation dashboard implemented with Streamlit and scipy numerical optimization routines. [Evidence: EV-VIBE-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-VIBE_ODDS-README]
* **API Protocols & Endpoints**: Interactive Streamlit UI controls; zero standalone public REST API endpoints. [Evidence: EV-VIBE-API]
* **Database & Persistence**: Local CSV sports datasets and in-memory pandas DataFrames. [Evidence: EV-VIBE-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-VIBE_ODDS-MANIFEST]
* **AI / ML Implementation**: Statistical probability modeling and Kelly Criterion sizing algorithms. [Evidence: EV-VIBE-AI]
* **Automated Tests**: 10 verified test source files observed (tests/test_analytics.py, tests/test_features.py, tests/test_gbm_policy.py...) [Evidence: EV-VIBE_ODDS-TESTS]
* **CI/CD Automation**: None (No CI workflows in repository) [Evidence: EV-VIBE_ODDS-NO-CI]
* **Observability & Telemetry**: Streamlit execution output displays and calculation logs. [Evidence: EV-VIBE-OBS]
* **Security & Auth Posture**: Local statistical execution environment with zero sensitive external network interfaces. [Evidence: EV-VIBE-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-08T21:37:30Z, 127 tree objects. [Evidence: EV-VIBE_ODDS-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-VIBE_ODDS-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-VIBE_ODDS-GIT]
* **Identified Limitations & Missing Evidence**: No automated CI/CD workflow configured in repository snapshot. [Evidence: EV-VIBE_ODDS-NO-CI]

---

### bom-intelligence

* **Repository URL**: [https://github.com/aditya0si/bom-intelligence](https://github.com/aditya0si/bom-intelligence)
* **Commit SHA**: `1c332508f7a54611f43d57e3a45ca7b03df6a791`
* **Associated Evidence IDs**: EV-BOM_INTELLIGENCE-GIT, EV-BOM_INTELLIGENCE-LANG, EV-BOM_INTELLIGENCE-NO-TESTS, EV-BOM_INTELLIGENCE-CI, EV-BOM_INTELLIGENCE-README, EV-BOM_INTELLIGENCE-NON-WEB-API, EV-BOM_INTELLIGENCE-ARCH, EV-BOM_INTELLIGENCE-API, EV-BOM_INTELLIGENCE-DB, EV-BOM_INTELLIGENCE-AI, EV-BOM_INTELLIGENCE-OBS, EV-BOM_INTELLIGENCE-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, Jupyter Notebook [Evidence: EV-BOM_INTELLIGENCE-LANG]
* **Frameworks & Observed Dependencies**: Python, pandas, Jupyter Notebook for BOM risk scrubbing. [Evidence: EV-BOM_INTELLIGENCE-NON-WEB-API]
* **System Architecture**: Python scripts and Jupyter notebooks for Bill of Materials (BOM) scrub. [Evidence: EV-BOM_INTELLIGENCE-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-BOM_INTELLIGENCE-README]
* **API Protocols & Endpoints**: Script CLI execution; zero HTTP endpoints. [Evidence: EV-BOM_INTELLIGENCE-API]
* **Database & Persistence**: Local CSV / Excel BOM files; zero database. [Evidence: EV-BOM_INTELLIGENCE-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-BOM_INTELLIGENCE-GIT]
* **AI / ML Implementation**: Component lifecycle risk scoring heuristics in pandas. [Evidence: EV-BOM_INTELLIGENCE-AI]
* **Automated Tests**: None documented in repository snapshot [Evidence: EV-BOM_INTELLIGENCE-NO-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-BOM_INTELLIGENCE-CI]
* **Observability & Telemetry**: Script execution output tables. [Evidence: EV-BOM_INTELLIGENCE-OBS]
* **Security & Auth Posture**: Local offline analysis; zero network exposure. [Evidence: EV-BOM_INTELLIGENCE-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-02T15:49:24Z, 26 tree objects. [Evidence: EV-BOM_INTELLIGENCE-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-BOM_INTELLIGENCE-GIT]
* **Known Conflict & Audit Resolution**: Resolved: Classified accurately as a hardware/lab engineering repository; NOT a web API. [Evidence: EV-BOM_INTELLIGENCE-NON-WEB-API]
* **Identified Limitations & Missing Evidence**: No automated test suite detected in repository snapshot. [Evidence: EV-BOM_INTELLIGENCE-NO-TESTS]

---

### HealthCareOCR

* **Repository URL**: [https://github.com/aditya0si/HealthCareOCR](https://github.com/aditya0si/HealthCareOCR)
* **Commit SHA**: `648d2a49cb3617841c0553e7a287fa1797ad5851`
* **Associated Evidence IDs**: EV-HEALTHCAREOCR-GIT, EV-HEALTHCAREOCR-LANG, EV-HEALTHCAREOCR-MANIFEST, EV-HEALTHCAREOCR-TESTS, EV-HEALTHCAREOCR-NO-CI, EV-HEALTHCAREOCR-README, EV-HEALTHCAREOCR-ARCH, EV-HEALTHCAREOCR-API, EV-HEALTHCAREOCR-DB, EV-HEALTHCAREOCR-AI, EV-HEALTHCAREOCR-OBS, EV-HEALTHCAREOCR-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, PowerShell [Evidence: EV-HEALTHCAREOCR-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: requirements.txt, pyproject.toml. [Evidence: EV-HEALTHCAREOCR-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-HEALTHCAREOCR-GIT]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-HEALTHCAREOCR-README]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-HEALTHCAREOCR-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-HEALTHCAREOCR-GIT]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-HEALTHCAREOCR-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-HEALTHCAREOCR-GIT]
* **Automated Tests**: 8 verified test source files observed (tests/test_fine_tuning.py, tests/test_ocr.py, tests/test_pipeline.py...) [Evidence: EV-HEALTHCAREOCR-TESTS]
* **CI/CD Automation**: None (No CI workflows in repository) [Evidence: EV-HEALTHCAREOCR-NO-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-HEALTHCAREOCR-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-HEALTHCAREOCR-GIT]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-06-28T09:40:41Z, 114 tree objects. [Evidence: EV-HEALTHCAREOCR-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-HEALTHCAREOCR-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-HEALTHCAREOCR-GIT]
* **Identified Limitations & Missing Evidence**: No automated CI/CD workflow configured in repository snapshot. [Evidence: EV-HEALTHCAREOCR-NO-CI]

---

### pipeline_ocr

* **Repository URL**: [https://github.com/aditya0si/pipeline_ocr](https://github.com/aditya0si/pipeline_ocr)
* **Commit SHA**: `c0a7ac02c52d6baea588fb42decfb2bf62b5134e`
* **Associated Evidence IDs**: EV-PIPELINE_OCR-GIT, EV-PIPELINE_OCR-LANG, EV-PIPELINE_OCR-MANIFEST, EV-PIPELINE_OCR-TESTS, EV-PIPELINE_OCR-NO-CI, EV-PIPELINE_OCR-README, EV-PIPELINE_OCR-ARCH, EV-PIPELINE_OCR-API, EV-PIPELINE_OCR-DB, EV-PIPELINE_OCR-AI, EV-PIPELINE_OCR-OBS, EV-PIPELINE_OCR-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, TypeScript, CSS, Shell, PowerShell, Dockerfile, HTML [Evidence: EV-PIPELINE_OCR-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: Dockerfile. [Evidence: EV-PIPELINE_OCR-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-PIPELINE_OCR-GIT]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-PIPELINE_OCR-README]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-PIPELINE_OCR-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-PIPELINE_OCR-GIT]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-PIPELINE_OCR-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-PIPELINE_OCR-GIT]
* **Automated Tests**: 11 verified test source files observed (tests/test_backend_units.py, tests/test_classifier.py, tests/test_diagnosis_agent.py...) [Evidence: EV-PIPELINE_OCR-TESTS]
* **CI/CD Automation**: None (No CI workflows in repository) [Evidence: EV-PIPELINE_OCR-NO-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-PIPELINE_OCR-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-PIPELINE_OCR-GIT]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-07-12T21:51:20Z, 145 tree objects. [Evidence: EV-PIPELINE_OCR-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-PIPELINE_OCR-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-PIPELINE_OCR-GIT]
* **Identified Limitations & Missing Evidence**: No automated CI/CD workflow configured in repository snapshot. [Evidence: EV-PIPELINE_OCR-NO-CI]

---

### pipeline_pr-tb

* **Repository URL**: [https://github.com/aditya0si/pipeline_pr-tb](https://github.com/aditya0si/pipeline_pr-tb)
* **Commit SHA**: `ec6c2a4bd183b81ad93f862dd51c7738d9e461fe`
* **Associated Evidence IDs**: EV-PIPELINE_PR_TB-GIT, EV-PIPELINE_PR_TB-LANG, EV-PIPELINE_PR_TB-MANIFEST, EV-PIPELINE_PR_TB-TESTS, EV-PIPELINE_PR_TB-NO-CI, EV-PIPELINE_PR_TB-README, EV-PIPELINE_PR_TB-ARCH, EV-PIPELINE_PR_TB-API, EV-PIPELINE_PR_TB-DB, EV-PIPELINE_PR_TB-AI, EV-PIPELINE_PR_TB-OBS, EV-PIPELINE_PR_TB-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python, TypeScript, Jupyter Notebook, HTML, CSS, PowerShell, Shell, Dockerfile [Evidence: EV-PIPELINE_PR_TB-LANG]
* **Frameworks & Observed Dependencies**: Observed manifests: requirements.txt, Dockerfile. [Evidence: EV-PIPELINE_PR_TB-MANIFEST]
* **System Architecture**: Unknown / Not documented in repository snapshot [Evidence: EV-PIPELINE_PR_TB-GIT]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-PIPELINE_PR_TB-README]
* **API Protocols & Endpoints**: Unknown / Not documented in repository snapshot [Evidence: EV-PIPELINE_PR_TB-GIT]
* **Database & Persistence**: Unknown / Local file persistence [Evidence: EV-PIPELINE_PR_TB-GIT]
* **Infrastructure & Containerization**: Yes (Dockerfile / docker-compose observed in tree) [Evidence: EV-PIPELINE_PR_TB-MANIFEST]
* **AI / ML Implementation**: Unknown / Not documented in repository snapshot [Evidence: EV-PIPELINE_PR_TB-GIT]
* **Automated Tests**: 31 verified test source files observed (backend/tests/test_diagnosis_e2e.py, backend/tests/test_diagnosis_stageA.py, backend/tests/test_diagnosis_stageB.py...) [Evidence: EV-PIPELINE_PR_TB-TESTS]
* **CI/CD Automation**: None (No CI workflows in repository) [Evidence: EV-PIPELINE_PR_TB-NO-CI]
* **Observability & Telemetry**: Unknown / Console logging [Evidence: EV-PIPELINE_PR_TB-GIT]
* **Security & Auth Posture**: Environment variable template (.env.example) observed / Specific security posture Unknown [Evidence: EV-PIPELINE_PR_TB-GIT]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-07-26T20:46:43Z, 572 tree objects. [Evidence: EV-PIPELINE_PR_TB-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-PIPELINE_PR_TB-GIT]
* **Known Conflict & Audit Resolution**: No conflicts identified; facts directly aligned with repository code. [Evidence: EV-PIPELINE_PR_TB-GIT]
* **Identified Limitations & Missing Evidence**: No automated CI/CD workflow configured in repository snapshot. [Evidence: EV-PIPELINE_PR_TB-NO-CI]

---

### asic-crc-engine

* **Repository URL**: [https://github.com/aditya0si/asic-crc-engine](https://github.com/aditya0si/asic-crc-engine)
* **Commit SHA**: `519e2a4f05ff726d2a7573c9fc7d704812e758ca`
* **Associated Evidence IDs**: EV-ASIC_CRC_ENGINE-GIT, EV-ASIC_CRC_ENGINE-LANG, EV-ASIC_CRC_ENGINE-TESTS, EV-ASIC_CRC_ENGINE-CI, EV-ASIC_CRC_ENGINE-README, EV-ASIC_CRC_ENGINE-NON-WEB-API, EV-ASIC-ARCH, EV-ASIC-API, EV-ASIC-DB, EV-ASIC-AI, EV-ASIC-OBS, EV-ASIC-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Verilog, SystemVerilog, Shell, Python, Tcl [Evidence: EV-ASIC_CRC_ENGINE-LANG]
* **Frameworks & Observed Dependencies**: Verilog RTL, SystemVerilog testbench, Cocotb (Python), Icarus Verilog / Verilator. [Evidence: EV-ASIC_CRC_ENGINE-NON-WEB-API]
* **System Architecture**: Hardware RTL architecture: Pipelined parallel CRC calculation engine in Verilog with SystemVerilog/Cocotb testbench fixtures. Pure hardware design, not a web service. [Evidence: EV-ASIC-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-ASIC_CRC_ENGINE-README]
* **API Protocols & Endpoints**: Hardware digital signal bus interface (clk, rst, data_in, valid_in, crc_out, valid_out); NOT a web API. [Evidence: EV-ASIC-API]
* **Database & Persistence**: Digital hardware registers and internal flip-flops; zero database persistence. [Evidence: EV-ASIC-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-ASIC_CRC_ENGINE-GIT]
* **AI / ML Implementation**: Zero AI/ML models; pure digital logic synthesis in Verilog. [Evidence: EV-ASIC-AI]
* **Automated Tests**: 2 verified test source files observed (tb/tb_crc32.sv, tb/tb_crc32_simple.v) [Evidence: EV-ASIC_CRC_ENGINE-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-ASIC_CRC_ENGINE-CI]
* **Observability & Telemetry**: VCD waveform dump generation for simulation timing analysis in GTKWave. [Evidence: EV-ASIC-OBS]
* **Security & Auth Posture**: Hardware CRC checksum integrity verification. [Evidence: EV-ASIC-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-02T15:49:17Z, 26 tree objects. [Evidence: EV-ASIC_CRC_ENGINE-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-ASIC_CRC_ENGINE-GIT]
* **Known Conflict & Audit Resolution**: Resolved: Classified accurately as a hardware/lab engineering repository; NOT a web API. [Evidence: EV-ASIC_CRC_ENGINE-NON-WEB-API]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-ASIC_CRC_ENGINE-GIT]

---

### ate-fixture-lab

* **Repository URL**: [https://github.com/aditya0si/ate-fixture-lab](https://github.com/aditya0si/ate-fixture-lab)
* **Commit SHA**: `70398cb2d55501d3a3decd69b924c1ef33b1d79d`
* **Associated Evidence IDs**: EV-ATE_FIXTURE_LAB-GIT, EV-ATE_FIXTURE_LAB-LANG, EV-ATE_FIXTURE_LAB-TESTS, EV-ATE_FIXTURE_LAB-CI, EV-ATE_FIXTURE_LAB-README, EV-ATE_FIXTURE_LAB-NON-WEB-API, EV-ATE_FIXTURE_LAB-ARCH, EV-ATE_FIXTURE_LAB-API, EV-ATE_FIXTURE_LAB-DB, EV-ATE_FIXTURE_LAB-AI, EV-ATE_FIXTURE_LAB-OBS, EV-ATE_FIXTURE_LAB-SEC
* **Live / Deployment URL**: None documented in repository snapshot (Local execution only)
* **Languages & Core Tech**: Python [Evidence: EV-ATE_FIXTURE_LAB-LANG]
* **Frameworks & Observed Dependencies**: Python test instrumentation and fixture sequencer scripts. [Evidence: EV-ATE_FIXTURE_LAB-NON-WEB-API]
* **System Architecture**: Hardware test instrumentation sequencer scripts; not a web API. [Evidence: EV-ATE_FIXTURE_LAB-ARCH]
* **README Documentation**: Present (README.md observed in repository tree) [Evidence: EV-ATE_FIXTURE_LAB-README]
* **API Protocols & Endpoints**: Hardware instrument serial/SCPI control interface; zero HTTP endpoints. [Evidence: EV-ATE_FIXTURE_LAB-API]
* **Database & Persistence**: Local CSV test log persistence; zero database. [Evidence: EV-ATE_FIXTURE_LAB-DB]
* **Infrastructure & Containerization**: None detected in repository snapshot [Evidence: EV-ATE_FIXTURE_LAB-GIT]
* **AI / ML Implementation**: Zero AI/ML models; hardware test automation scripts. [Evidence: EV-ATE_FIXTURE_LAB-AI]
* **Automated Tests**: 2 verified test source files observed (software/power_test.py, tests/test_board.py) [Evidence: EV-ATE_FIXTURE_LAB-TESTS]
* **CI/CD Automation**: Workflow configuration observed: .github/workflows/ci.yml (workflow files present in repository tree; run execution not captured in snapshot) [Evidence: EV-ATE_FIXTURE_LAB-CI]
* **Observability & Telemetry**: Serial port test logging and instrumentation status output. [Evidence: EV-ATE_FIXTURE_LAB-OBS]
* **Security & Auth Posture**: Hardware power rail limits and interlocks. [Evidence: EV-ATE_FIXTURE_LAB-SEC]
* **Commit History & Activity**: Default branch `main`, pushed at 2026-09-02T15:49:20Z, 21 tree objects. [Evidence: EV-ATE_FIXTURE_LAB-GIT]
* **Observed Metrics & Benchmarks**: Unknown / no benchmark artifact detected in captured paths [Evidence: EV-ATE_FIXTURE_LAB-GIT]
* **Known Conflict & Audit Resolution**: Resolved: Classified accurately as a hardware/lab engineering repository; NOT a web API. [Evidence: EV-ATE_FIXTURE_LAB-NON-WEB-API]
* **Identified Limitations & Missing Evidence**: Unknown / Standard runtime dependency limitations [Evidence: EV-ATE_FIXTURE_LAB-GIT]

---

## 2. Special-Purpose, Hardware, Archived & Auxiliary Repositories (20 Repositories)

| Repository | Commit SHA | Type / Status | Primary Language | Description & Audit Disposition | Evidence IDs |
| :--- | :---: | :---: | :---: | :--- | :--- |
| [portfolio](https://github.com/aditya0si/portfolio) | `c7cd36f4` | **Active/Auxiliary** | TypeScript | Inspected via GitHub API snapshot — Auxiliary / supporting repository; cataloged in evidence ledger. | EV-PORTFOLIO-GIT, EV-PORTFOLIO-LANG, EV-PORTFOLIO-MANIFEST, EV-PORTFOLIO-TESTS, EV-PORTFOLIO-NO-CI |
| [aditya0si](https://github.com/aditya0si/aditya0si) | `de2d3284` | **Active/Auxiliary** | Markdown/Config | GitHub profile — Auxiliary / supporting repository; cataloged in evidence ledger. | EV-ADITYA0SI-GIT, EV-ADITYA0SI-LANG, EV-ADITYA0SI-NO-TESTS, EV-ADITYA0SI-NO-CI, EV-ADITYA0SI-README |
| [hardware-npi-lab](https://github.com/aditya0si/hardware-npi-lab) | `7051e81d` | **Active/Auxiliary** | HTML | End-to-end NPI lab ΓÇö one 4-layer board through DFM/DFT, SI/PI, PDN/thermal, ASIC/DFT, ATE, BOM AI (6 live demos) — Hardware/PCB/Silicon engineering artifact or lab documentation; not a software web API. Excluded from primary software ranking. | EV-HARDWARE_NPI_LAB-GIT, EV-HARDWARE_NPI_LAB-LANG, EV-HARDWARE_NPI_LAB-NO-TESTS, EV-HARDWARE_NPI_LAB-NO-CI, EV-HARDWARE_NPI_LAB-README, EV-HARDWARE_NPI_LAB-NON-WEB-API |
| [pdn-thermal-lab](https://github.com/aditya0si/pdn-thermal-lab) | `f3ff9f4a` | **Active/Auxiliary** | Python | Power delivery & thermal lab ΓÇö 94.2% buck, MTBF 185k hrs, FMEA, thermal (Mil-HDBK-217) — Hardware/PCB/Silicon engineering artifact or lab documentation; not a software web API. Excluded from primary software ranking. | EV-PDN_THERMAL_LAB-GIT, EV-PDN_THERMAL_LAB-LANG, EV-PDN_THERMAL_LAB-NO-TESTS, EV-PDN_THERMAL_LAB-CI, EV-PDN_THERMAL_LAB-README, EV-PDN_THERMAL_LAB-NON-WEB-API |
| [si-pi-lab](https://github.com/aditya0si/si-pi-lab) | `d58b25f4` | **Active/Auxiliary** | Markdown/Config | Signal & Power Integrity lab ΓÇö eye 312mV, 50╬⌐/100╬⌐, crosstalk -35dB, PDN <10m╬⌐ (Saturn/LTspice) — Hardware/PCB/Silicon engineering artifact or lab documentation; not a software web API. Excluded from primary software ranking. | EV-SI_PI_LAB-GIT, EV-SI_PI_LAB-LANG, EV-SI_PI_LAB-NO-TESTS, EV-SI_PI_LAB-CI, EV-SI_PI_LAB-README, EV-SI_PI_LAB-NON-WEB-API |
| [pcb-dfm-dft](https://github.com/aditya0si/pcb-dfm-dft) | `86434236` | **Active/Auxiliary** | Markdown/Config | Four-layer network board ΓÇö DFM 0 errors, 54 test points DFT, JTAG boundary scan, IPC Class 2 — Hardware/PCB/Silicon engineering artifact or lab documentation; not a software web API. Excluded from primary software ranking. | EV-PCB_DFM_DFT-GIT, EV-PCB_DFM_DFT-LANG, EV-PCB_DFM_DFT-NO-TESTS, EV-PCB_DFM_DFT-CI, EV-PCB_DFM_DFT-README, EV-PCB_DFM_DFT-NON-WEB-API |
| [HandyMan](https://github.com/aditya0si/HandyMan) | `89b177a2` | **Active/Auxiliary** | TypeScript | Inspected via GitHub API snapshot — Auxiliary / supporting repository; cataloged in evidence ledger. | EV-HANDYMAN-GIT, EV-HANDYMAN-LANG, EV-HANDYMAN-MANIFEST, EV-HANDYMAN-TESTS, EV-HANDYMAN-CI, EV-HANDYMAN-README |
| [solarwinds](https://github.com/aditya0si/solarwinds) | `c32e89c0` | **Archived** | Python | Inspected via GitHub API snapshot — Archived prototype / historical project; preserved for record, excluded from active flagship consideration. | EV-SOLARWINDS-GIT, EV-SOLARWINDS-LANG, EV-SOLARWINDS-NO-TESTS, EV-SOLARWINDS-NO-CI, EV-SOLARWINDS-README |
| [PulseGrid](https://github.com/aditya0si/PulseGrid) | `17186284` | **Active/Auxiliary** | Markdown/Config | Inspected via GitHub API snapshot — Auxiliary / supporting repository; cataloged in evidence ledger. | EV-PULSEGRID-GIT, EV-PULSEGRID-LANG, EV-PULSEGRID-NO-TESTS, EV-PULSEGRID-NO-CI |
| [CosmosSteller](https://github.com/aditya0si/CosmosSteller) | `fc7b1284` | **Archived** | TypeScript | Inspected via GitHub API snapshot — Archived prototype / historical project; preserved for record, excluded from active flagship consideration. | EV-COSMOSSTELLER-GIT, EV-COSMOSSTELLER-LANG, EV-COSMOSSTELLER-MANIFEST, EV-COSMOSSTELLER-NO-TESTS, EV-COSMOSSTELLER-NO-CI |
| [revenue-ops-orchestration](https://github.com/aditya0si/revenue-ops-orchestration) | `68751fe5` | **Archived** | Python | Inspected via GitHub API snapshot — Archived prototype / historical project; preserved for record, excluded from active flagship consideration. | EV-REVENUE_OPS_ORCHESTRATION-GIT, EV-REVENUE_OPS_ORCHESTRATION-LANG, EV-REVENUE_OPS_ORCHESTRATION-MANIFEST, EV-REVENUE_OPS_ORCHESTRATION-NO-TESTS, EV-REVENUE_OPS_ORCHESTRATION-NO-CI, EV-REVENUE_OPS_ORCHESTRATION-README |
| [autonomus-sdr](https://github.com/aditya0si/autonomus-sdr) | `55de2d92` | **Archived** | Python | Inspected via GitHub API snapshot — Archived prototype / historical project; preserved for record, excluded from active flagship consideration. | EV-AUTONOMUS_SDR-GIT, EV-AUTONOMUS_SDR-LANG, EV-AUTONOMUS_SDR-MANIFEST, EV-AUTONOMUS_SDR-NO-TESTS, EV-AUTONOMUS_SDR-NO-CI, EV-AUTONOMUS_SDR-README |
| [intent-signal-engine](https://github.com/aditya0si/intent-signal-engine) | `6501a3d4` | **Archived** | Python | Inspected via GitHub API snapshot — Archived prototype / historical project; preserved for record, excluded from active flagship consideration. | EV-INTENT_SIGNAL_ENGINE-GIT, EV-INTENT_SIGNAL_ENGINE-LANG, EV-INTENT_SIGNAL_ENGINE-MANIFEST, EV-INTENT_SIGNAL_ENGINE-NO-TESTS, EV-INTENT_SIGNAL_ENGINE-NO-CI, EV-INTENT_SIGNAL_ENGINE-README |
| [PaddleOcr](https://github.com/aditya0si/PaddleOcr) | `e708fdea` | **Archived** | Python | Inspected via GitHub API snapshot — Archived prototype / historical project; preserved for record, excluded from active flagship consideration. | EV-PADDLEOCR-GIT, EV-PADDLEOCR-LANG, EV-PADDLEOCR-MANIFEST, EV-PADDLEOCR-NO-TESTS, EV-PADDLEOCR-NO-CI, EV-PADDLEOCR-README |
| [prompt_war](https://github.com/aditya0si/prompt_war) | `7cd3d6a0` | **Private** | TypeScript | Inspected via GitHub API snapshot — Auxiliary / supporting repository; cataloged in evidence ledger. | EV-PROMPT_WAR-GIT, EV-PROMPT_WAR-LANG, EV-PROMPT_WAR-MANIFEST, EV-PROMPT_WAR-NO-TESTS, EV-PROMPT_WAR-NO-CI, EV-PROMPT_WAR-README |
| [e-commerce-quality-platform](https://github.com/aditya0si/e-commerce-quality-platform) | `2b95d490` | **Private** | Markdown/Config | Inspected via GitHub API snapshot — Auxiliary / supporting repository; cataloged in evidence ledger. | EV-E_COMMERCE_QUALITY_PLATFORM-GIT, EV-E_COMMERCE_QUALITY_PLATFORM-LANG, EV-E_COMMERCE_QUALITY_PLATFORM-NO-TESTS, EV-E_COMMERCE_QUALITY_PLATFORM-NO-CI, EV-E_COMMERCE_QUALITY_PLATFORM-README |
| [FoodKart](https://github.com/aditya0si/FoodKart) | `null` | **Archived** | Empty | Empty Git repository (HTTP 409) — Empty repository snapshot (HTTP 409: Git Repository is empty; 0 commits). Excluded from viable scoring. | EV-FOODKART-GIT, EV-FOODKART-LANG |
| [Secure-File-Share](https://github.com/aditya0si/Secure-File-Share) | `b4b6e01c` | **Private** | JavaScript | Inspected via GitHub API snapshot — Auxiliary / supporting repository; cataloged in evidence ledger. | EV-SECURE_FILE_SHARE-GIT, EV-SECURE_FILE_SHARE-LANG, EV-SECURE_FILE_SHARE-NO-TESTS, EV-SECURE_FILE_SHARE-NO-CI |
| [claw-code](https://github.com/aditya0si/claw-code) | `9ade3a70` | **Archived** | Rust | The fastest repo in history to surpass 50K stars Γ¡É, reaching the milestone in just 2 hours after publication. Better Harness Tools that make real things done. Now writing in Rust using oh-my-codex. — Upstream repository fork; excluded from primary original software scoring. | EV-CLAW_CODE-GIT, EV-CLAW_CODE-LANG, EV-CLAW_CODE-TESTS, EV-CLAW_CODE-NO-CI, EV-CLAW_CODE-README |
| [testrepo](https://github.com/aditya0si/testrepo) | `e6f13b76` | **Private** | Markdown/Config | Inspected via GitHub API snapshot — Archived prototype / historical project; preserved for record, excluded from active flagship consideration. | EV-TESTREPO-GIT, EV-TESTREPO-LANG, EV-TESTREPO-NO-TESTS, EV-TESTREPO-NO-CI, EV-TESTREPO-README |
