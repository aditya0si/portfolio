import fs from 'fs';
import path from 'path';

// 1. Load Authoritative Ledger and Repo Evidence
const ledgerData = JSON.parse(fs.readFileSync('research/evidence-ledger.json', 'utf8'));
const realEvidence = JSON.parse(fs.readFileSync('research/real_repo_evidence.json', 'utf8'));

const ledgerMap = new Map();
for (const entry of ledgerData.ledger) {
  ledgerMap.set(entry.id, entry);
}

// 2. Exact Scoring Weights
const weights = {
  engineering_depth: 0.18,
  ai_relevance: 0.14,
  production_readiness: 0.14,
  systems_backend: 0.12,
  product_completeness: 0.10,
  originality: 0.08,
  measurable_evidence: 0.07,
  code_quality: 0.06,
  docs_explainability: 0.05,
  interview_depth: 0.04,
  demonstrability: 0.02,
};

// Validate weights sum strictly to 1.0
const sumWeights = Object.values(weights).reduce((a, b) => a + b, 0);
if (Math.abs(sumWeights - 1.0) > 0.0001) {
  throw new Error(`Weights do not sum to 1.0! Sum: ${sumWeights}`);
}

// 3. Observable Deterministic Anchors & Caps Definition
const deterministicCaps = {
  README_CLAIM_ONLY_CAP_4: 'Categories supported exclusively by unverified README claims are strictly capped at 4.0.',
  MANIFEST_TREE_OBSERVED_ONLY_CAP_6: 'Categories supported only by package manifests or directory tree presence are capped at 6.0.',
  UNEXECUTED_TESTS_CAP_6: 'Test source files present in git tree but unexecuted in audit cap measurable evidence and code quality at 6.0.',
  CI_CONFIG_UNEXECUTED_CAP_6: 'CI workflow configuration files observed without executed run logs cap production readiness at 6.0.',
  HISTORICAL_BENCHMARK_UNEXECUTED_CAP_7: 'Historical benchmark JSON committed in repo but unexecuted in current audit caps measurable evidence at 7.0.',
  NO_TESTS_CODE_QUALITY_CAP_4: 'Repositories with zero verified test files have code quality strictly capped at 4.0.',
  NO_TESTS_PROD_READINESS_CAP_5: 'Repositories with zero verified test files have production readiness capped at 5.0.',
  NO_EXTERNAL_LIVE_DEPLOYMENT_CAP_7: 'Repositories with no independently verified live deployment URL have demonstrability capped at 7.0.',
  UNEXECUTED_AUDIT_CONFIDENCE_CAP_0_75: 'Repositories with zero TEST_EXECUTED or EXTERNAL_VERIFIED audit records have overall confidence capped at 0.75.'
};

// 4. Context specifications for 15 viable projects with exact repo-scoped ledger IDs
const projectConfigs = [
  {
    slug: 'sentinel',
    name: 'Sentinel',
    repo: 'aditya0si/Sentinel',
    commit_sha: realEvidence['Sentinel'].commitSha,
    url: 'https://github.com/aditya0si/Sentinel',
    is_flagship: true,
    flagship_role: 'AI Reliability & Guardrails Flagship (Provisional)',
    testCount: 7,
    hasCi: true,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 8.4,
    baseAi: 9.5,
    baseSystems: 8.2,
    baseProduct: 7.5,
    baseOrig: 8.8,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 8.6,
    baseDemo: 7.0,
    archId: 'EV-SEN-PROXY',
    aiId: 'EV-SEN-PROXY',
    ciId: 'EV-SENTINEL-CI',
    dbId: 'EV-SEN-PROXY',
    manifestId: 'EV-SENTINEL-MANIFEST',
    testId: 'EV-SENTINEL-TESTS',
    readmeId: 'EV-SENTINEL-README',
    langId: 'EV-SENTINEL-LANG',
    extraCodeQualityId: 'EV-SEN-TESTS',
    depthRationale: 'Decoupled proxy architecture intercepting inbound and outbound LLM traffic with OpenTelemetry Jaeger export and 5 pluggable guardrails.',
    aiRationale: 'Directly addresses 2026 enterprise AI requirements: non-deterministic output guardrails, PII redaction, prompt injection filtering.',
    prodRationale: 'CI quality gate workflow configuration (.github/workflows/quality-gate.yml), Docker Compose setup, and Prometheus metrics endpoint.',
    systemsRationale: 'FastAPI async proxy hooks, Prometheus metrics export, SQLite rolling telemetry store.',
    productRationale: 'Dual-mode library + standalone proxy container with live health, metrics, and validation endpoints.',
    origRationale: 'Quality-gate framework turning golden-set evaluation into a merge blocker.',
    measurableRationale: '7 verified test source files in tests/; no empirical benchmark artifact detected in captured paths.',
    codeQualityRationale: 'Pydantic v2 strict models, clean pluggable validator interfaces, strict schema validation; unexecuted in audit.',
    docsRationale: 'Detailed README with ASCII sequence diagrams, Jaeger trace documentation, and policy definitions; capped at 4.0 as unverified claims.',
    interviewRationale: 'Deep talking points on proxy middleware latency, regex vs model-judge tradeoffs, and drift alerting.',
    demoRationale: 'Runnable via docker-compose with Prometheus and Jaeger UI demonstrating local trace spans.'
  },
  {
    slug: 'schemegpt',
    name: 'schemeGPT',
    repo: 'aditya0si/schemeGPT',
    commit_sha: realEvidence['schemeGPT'].commitSha,
    url: 'https://github.com/aditya0si/schemeGPT',
    is_flagship: true,
    flagship_role: 'AI Engineering & Hybrid RAG Flagship (Provisional)',
    testCount: 20,
    hasCi: true,
    hasBenchmark: false,
    hasEvalHarness: true,
    hasExternalPackage: false,
    baseDepth: 8.4,
    baseAi: 9.6,
    baseSystems: 8.0,
    baseProduct: 8.5,
    baseOrig: 8.8,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 8.5,
    baseDemo: 7.0,
    archId: 'EV-SG-RETRIEVAL',
    aiId: 'EV-SG-RETRIEVAL',
    ciId: 'EV-SCHEMEGPT-CI',
    dbId: 'EV-SG-RETRIEVAL',
    manifestId: 'EV-SCHEMEGPT-MANIFEST',
    testId: 'EV-SCHEMEGPT-TESTS',
    readmeId: 'EV-SCHEMEGPT-README',
    langId: 'EV-SCHEMEGPT-LANG',
    evalId: 'EV-SG-WORKFLOWS',
    extraMeasurableId: 'EV-SG-RAGAS-CLAIM',
    extraProduct: 'EV-SG-NEXT16',
    depthRationale: 'Hybrid PostgreSQL pgvector dense HNSW search + PostgreSQL tsvector sparse lexical search fused via Reciprocal Rank Fusion, with exact substring quote attribution engine.',
    aiRationale: 'Direct 2026 core: tool-calling Groq LLM agent, deterministic retrieval gates, bilingual NLP (English + Hindi), citation validation.',
    prodRationale: 'Multi-stage Dockerfile, docker-compose orchestration, VPS production runbook, environment validation.',
    systemsRationale: 'PostgreSQL 16 HNSW vector indexing, FastAPI async endpoints, SSE streaming with backpressure handling.',
    productRationale: 'Full citizen welfare decision engine with Next.js 16 UI (Next 16.3.5 in web/package.json), search filters, and cited answer cards.',
    origRationale: 'Addresses public sector welfare access fragmentation in India rather than copying generic documentation RAG.',
    measurableRationale: 'Automated retrieval gate eval suite in eval/ running in GitHub Actions workflow definitions; RAGAS remains an unverified README claim.',
    codeQualityRationale: 'Clean modular structure (services, models, router, eval), strong typing with Pydantic schemas; unexecuted in audit.',
    docsRationale: 'Detailed README with architecture flowcharts, Docker runbooks, and eval formulas; capped at 4.0 as unverified claims.',
    interviewRationale: 'Extensive depth on vector indexing tradeoffs, RRF math, bilingual latency, and evaluation gating.',
    demoRationale: 'Next.js 16 frontend and FastAPI backend configurable via Docker Compose for local execution.'
  },
  {
    slug: 'tenant-api-platform',
    name: 'tenant-api-platform',
    repo: 'aditya0si/tenant-api-platform',
    commit_sha: realEvidence['tenant-api-platform'].commitSha,
    url: 'https://github.com/aditya0si/tenant-api-platform',
    is_flagship: true,
    flagship_role: 'Backend & Multi-Tenant Systems Flagship (Provisional)',
    testCount: 33,
    hasCi: true,
    hasBenchmark: true,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 8.8,
    baseAi: 3.0,
    baseSystems: 9.2,
    baseProduct: 8.0,
    baseOrig: 8.5,
    baseCodeQuality: 6.0,
    baseDocs: 6.0,
    baseInterview: 9.2,
    baseDemo: 7.0,
    archId: 'EV-TAP-RLS',
    domainIds: ['EV-TAP-ADR'],
    aiId: 'EV-TAP-NO-STRIPE-AI',
    ciId: 'EV-TENANT_API_PLATFORM-CI',
    dbId: 'EV-TAP-RLS',
    manifestId: 'EV-TENANT_API_PLATFORM-MANIFEST',
    testId: 'EV-TENANT_API_PLATFORM-TESTS',
    readmeId: 'EV-TENANT_API_PLATFORM-README',
    extraDocsId: 'EV-TAP-ADR',
    langId: 'EV-TENANT_API_PLATFORM-LANG',
    benchmarkId: 'EV-TAP-LOAD-BENCHMARK',
    extraCodeQualityId: 'EV-TAP-ADR',
    extraProduct: 'EV-TAP-FLAGSHIP-ELIGIBILITY',
    depthRationale: 'Go 1.27 multi-tenant billing engine with PostgreSQL Row-Level Security (RLS) enforcement, distributed Redis token-bucket rate limiting, idempotent write state machines, outbox pattern for crash-resilient webhook delivery, supported by 14 ADRs.',
    aiRationale: 'Pure backend and distributed systems engineering; verified zero external payment gateway or machine learning dependencies.',
    prodRationale: 'Dockerfile, docker-compose orchestration, and GitHub Actions CI workflow configuration.',
    systemsRationale: 'Go chi router, pgx v5 connection pooling, PostgreSQL session variables for RLS (app.current_tenant_id), Redis locks and sliding window counters.',
    productRationale: 'Complete multi-tenant API: tenant lifecycle, memberships, project resources, invoice ledger, idempotent mutations, outbox webhooks.',
    origRationale: 'Bespoke billing ledger and isolation architecture implementing complex primitives from first principles without SaaS lock-in.',
    measurableRationale: 'Committed k6 load test results: 6,250 HTTP requests at 120 req/s with 0% failure; p95 read 28.8ms, write 49.0ms (historical committed benchmark artifact; local synthetic Docker environment).',
    codeQualityRationale: 'Clean Go project structure with domain separation, database migrations, and 14 formal Architecture Decision Records.',
    docsRationale: 'Comprehensive docs/DESIGN.md detailing failure modes, 14 ADR files, and k6 benchmark logs; supported by observed ADR documents.',
    interviewRationale: 'Unmatched talking points on RLS vs application isolation, Redis rate limiting, outbox transactional dispatch, and idempotent state transitions.',
    demoRationale: 'Docker Compose environment boots PostgreSQL, Redis, and API server for local testing.'
  },
  {
    slug: 'mcp-from-scratch',
    name: 'mcp-from-scratch',
    repo: 'aditya0si/mcp-from-scratch',
    commit_sha: realEvidence['mcp-from-scratch'].commitSha,
    url: 'https://github.com/aditya0si/mcp-from-scratch',
    is_flagship: true,
    flagship_role: 'Agent Internals & Protocol Flagship (Provisional)',
    testCount: 5,
    hasCi: false,
    hasBenchmark: false,
    hasEvalHarness: true,
    hasExternalPackage: false,
    baseDepth: 8.5,
    baseAi: 9.8,
    baseSystems: 8.4,
    baseProduct: 7.0,
    baseOrig: 9.0,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 8.8,
    baseDemo: 6.5,
    archId: 'EV-MCP-CODEC',
    aiId: 'EV-MCP-CODEC',
    ciId: 'EV-MCP_FROM_SCRATCH-MANIFEST',
    noCiId: 'EV-MCP_FROM_SCRATCH-MANIFEST',
    dbId: 'EV-MCP-CODEC',
    manifestId: 'EV-MCP_FROM_SCRATCH-MANIFEST',
    testId: 'EV-MCP_FROM_SCRATCH-TESTS',
    readmeId: 'EV-MCP_FROM_SCRATCH-README',
    langId: 'EV-MCP_FROM_SCRATCH-LANG',
    evalId: 'EV-MCP-EVAL',
    depthRationale: 'Bespoke implementation of Model Context Protocol (MCP) server from scratch using Python standard library (asyncio, json) without official SDKs or LangChain dependencies.',
    aiRationale: 'Direct alignment with industry standard Model Context Protocol for agent tooling, resources, and execution.',
    prodRationale: 'Clean stdio and HTTP/SSE transport implementations with spec error code compliance (-32700 to -32603); local configuration.',
    systemsRationale: 'Low-level protocol wire serialization, asynchronous request dispatching, and streaming transport handlers.',
    productRationale: 'Includes both the protocol server and a minimal ReAct agent loop with evaluation harness.',
    origRationale: 'Educational and protocol-first deep dive into MCP internals rather than third-party wrapper usage.',
    measurableRationale: 'Evaluation harness with 5 verified pytest test files in tests/ and grader modules in eval/ testing spec compliance and tool execution.',
    codeQualityRationale: 'Clean object-oriented codec hierarchy, typed dataclasses, and standard Python library adherence.',
    docsRationale: 'Protocol wire sequence documentation, JSON-RPC schema breakdown, and quickstart client code; capped at 4.0 as unverified claims.',
    interviewRationale: 'Deep protocol surface: SSE framing, JSON-RPC 2.0 error handling, stdio pipe concurrency, and context injection mechanics.',
    demoRationale: 'Runnable locally via standard python CLI with mock client tool calling demonstration.'
  },
  {
    slug: 'event-stream-platform',
    name: 'event-stream-platform',
    repo: 'aditya0si/event-stream-platform',
    commit_sha: realEvidence['event-stream-platform'].commitSha,
    url: 'https://github.com/aditya0si/event-stream-platform',
    is_flagship: true,
    flagship_role: 'Streaming Infrastructure Flagship (Provisional)',
    testCount: 16,
    hasCi: true,
    hasBenchmark: true,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 8.6,
    baseAi: 3.0,
    baseSystems: 9.0,
    baseProduct: 7.5,
    baseOrig: 8.2,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 9.0,
    baseDemo: 7.0,
    archId: 'EV-ESP-GO-MOD',
    aiId: 'EV-ESP-NO-SARAMA-TIMESCALE',
    ciId: 'EV-EVENT_STREAM_PLATFORM-CI',
    dbId: 'EV-ESP-GO-MOD',
    manifestId: 'EV-EVENT_STREAM_PLATFORM-MANIFEST',
    testId: 'EV-EVENT_STREAM_PLATFORM-TESTS',
    readmeId: 'EV-EVENT_STREAM_PLATFORM-README',
    langId: 'EV-EVENT_STREAM_PLATFORM-LANG',
    benchmarkId: 'EV-ESP-LOAD-BENCHMARK',
    depthRationale: 'Go streaming pipeline utilizing twmb/franz-go for high-performance Redpanda consumption, with dead-letter queue routing, idempotent commit batches, and fuzz testing.',
    aiRationale: 'Specialized streaming systems infrastructure supporting event data pipelines; zero direct AI model dependencies.',
    prodRationale: 'Multi-container Docker Compose definition (Redpanda, PostgreSQL, Redis), Prometheus metrics export, and CI workflow configuration.',
    systemsRationale: 'franz-go Kafka protocol implementation, Redis distributed lock manager, PostgreSQL transaction batching, and graceful signal cancellation.',
    productRationale: 'End-to-end event stream processing pipeline from ingress to durable persistence and metrics reporting.',
    origRationale: 'High-throughput event streaming architecture avoiding heavyweight frameworks in favor of lean Go concurrency.',
    measurableRationale: 'Committed ingest benchmark results: 40s duration at 2500 offered events/s meeting 2000 events/s NFR1 target (historical committed benchmark artifact; local synthetic Docker environment).',
    codeQualityRationale: 'Idiomatic Go with clean package boundaries, strict error wrapping, and fuzz tests for event envelopes.',
    docsRationale: 'Detailed README with architecture flowcharts, consumer group failure runbooks, and throughput metrics; capped at 4.0 as unverified claims.',
    interviewRationale: 'Extensive interview depth: consumer rebalances, offset commit semantics, at-least-once delivery tradeoffs, and backpressure handling.',
    demoRationale: 'Full streaming infrastructure bootable via docker-compose with Redpanda console and Prometheus.'
  },
  {
    slug: 'devatlas',
    name: 'DevAtlas',
    repo: 'aditya0si/DevAtlas',
    commit_sha: realEvidence['DevAtlas'].commitSha,
    url: 'https://github.com/aditya0si/DevAtlas',
    is_flagship: true,
    flagship_role: 'Full-Stack & Developer Ecosystem Flagship (Provisional)',
    testCount: 40,
    hasCi: true,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 8.0,
    baseAi: 8.8,
    baseSystems: 7.8,
    baseProduct: 8.5,
    baseOrig: 8.0,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 8.0,
    baseDemo: 7.0,
    archId: 'EV-DEVATLAS-ARCH',
    aiId: 'EV-DEVATLAS-AI',
    ciId: 'EV-DEVATLAS-CI',
    dbId: 'EV-DEVATLAS-DB',
    manifestId: 'EV-DEVATLAS-MANIFEST',
    testId: 'EV-DEVATLAS-TESTS',
    readmeId: 'EV-DEVATLAS-README',
    langId: 'EV-DEVATLAS-LANG',
    depthRationale: 'Polyglot developer intelligence platform with Next.js frontend, FastAPI backend, Celery async ingestion workers, and Redis broker.',
    aiRationale: 'LLM classification and summarization of GitHub repositories, topic clustering, and developer ranking.',
    prodRationale: 'Multi-service architecture with Docker Compose orchestration, background queue workers, and CI workflow configuration.',
    systemsRationale: 'FastAPI async endpoints, Celery distributed tasks, PostgreSQL database schema with migration history.',
    productRationale: 'Complete developer exploration web application with search, interactive charts, and repository analytics.',
    origRationale: 'Holistic developer intelligence indexing open-source contributors and technical repositories.',
    measurableRationale: '40 verified test source files in backend/tests/; no empirical benchmark artifact detected in captured paths.',
    codeQualityRationale: 'Strict separation of UI, API, and worker services with 40 automated test source files; unexecuted in audit.',
    docsRationale: 'Clear repository setup instructions, architecture breakdown, and database migration documentation; capped at 4.0 as unverified claims.',
    interviewRationale: 'Talking points on asynchronous job queuing, rate-limited external API scraping, and frontend caching.',
    demoRationale: 'Local docker-compose setup spinning up web interface, API server, Redis, and Postgres.'
  },
  {
    slug: 'coverai',
    name: 'CoverAI',
    repo: 'aditya0si/CoverAI',
    commit_sha: realEvidence['CoverAI'].commitSha,
    url: 'https://github.com/aditya0si/CoverAI',
    is_flagship: false,
    flagship_role: null,
    testCount: 13,
    hasCi: true,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 7.8,
    baseAi: 8.5,
    baseSystems: 7.5,
    baseProduct: 8.0,
    baseOrig: 7.8,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 7.8,
    baseDemo: 6.8,
    archId: 'EV-COVERAI-ARCH',
    aiId: 'EV-COVERAI-AI',
    ciId: 'EV-COVERAI-CI',
    dbId: 'EV-COVERAI-DB',
    manifestId: 'EV-COVERAI-MANIFEST',
    testId: 'EV-COVERAI-TESTS',
    readmeId: 'EV-COVERAI-README',
    langId: 'EV-COVERAI-LANG',
    depthRationale: 'Automated insurance claim compliance engine combining OCR parsing, claim validation rules, and policy check evaluation.',
    aiRationale: 'Multi-modal document analysis, OCR extraction, and policy compliance verification.',
    prodRationale: 'Docker containerization, environment configuration, and GitHub Actions CI workflow configuration.',
    systemsRationale: 'FastAPI REST backend with database models, asynchronous document processing, and validation handlers.',
    productRationale: 'Interactive claim dashboard displaying parsed policies, validation flags, and compliance scores.',
    origRationale: 'Domain-specific enterprise workflow automating document verification and claim compliance.',
    measurableRationale: '13 verified test source files in apps/api/tests/; no empirical benchmark artifact detected in captured paths.',
    codeQualityRationale: 'Clean modular layout with domain models and 13 automated test source files; unexecuted in audit.',
    docsRationale: 'Documentation covering setup runbooks, claim submission schemas, and policy validation rules; capped at 4.0 as unverified claims.',
    interviewRationale: 'Discussion on document layout extraction, confidence scoring, and human-in-the-loop validation.',
    demoRationale: 'Local execution of web UI and API container via docker-compose.'
  },
  {
    slug: 'grounded-knowledge-platform',
    name: 'grounded-knowledge-platform',
    repo: 'aditya0si/grounded-knowledge-platform',
    commit_sha: realEvidence['grounded-knowledge-platform'].commitSha,
    url: 'https://github.com/aditya0si/grounded-knowledge-platform',
    is_flagship: false,
    flagship_role: null,
    testCount: 7,
    hasCi: true,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 7.5,
    baseAi: 9.0,
    baseSystems: 7.5,
    baseProduct: 7.0,
    baseOrig: 7.8,
    baseCodeQuality: 6.0,
    baseDocs: 6.0,
    baseInterview: 7.8,
    baseDemo: 6.5,
    archId: 'EV-GKP-ARCH',
    aiId: 'EV-GKP-AI',
    ciId: 'EV-GROUNDED_KNOWLEDGE_PLATFORM-CI',
    dbId: 'EV-GKP-DB',
    manifestId: 'EV-GKP-MANIFEST',
    testId: 'EV-GROUNDED_KNOWLEDGE_PLATFORM-TESTS',
    readmeId: 'EV-GROUNDED_KNOWLEDGE_PLATFORM-README',
    extraDocsId: 'EV-GKP-ADR',
    langId: 'EV-GROUNDED_KNOWLEDGE_PLATFORM-LANG',
    depthRationale: 'Knowledge graph RAG platform combining entity extraction, relation mapping, and grounded contextual retrieval.',
    aiRationale: 'Entity resolution, knowledge graph traversal, and factual grounding for generative AI queries.',
    prodRationale: 'Container definitions, database persistence configurations, and CI workflow configuration.',
    systemsRationale: 'Graph and relational database coordination, FastAPI async endpoints, and structured query routing.',
    productRationale: 'Graph-augmented search interface with entity visualization and citation cards.',
    origRationale: 'Grounded factual citations constructed directly from knowledge graph relations.',
    measurableRationale: '7 verified test source files in tests/; no empirical benchmark artifact detected in captured paths.',
    codeQualityRationale: 'Clean entity typing, graph schema definitions, and 7 automated test source files; unexecuted in audit.',
    docsRationale: 'Architecture diagrams, schema entity documentation, and ADR docs in corpus/docs/; supported by observed tree records.',
    interviewRationale: 'Technical tradeoffs between vector indexing and structured graph traversal in retrieval pipelines.',
    demoRationale: 'Local service runnable via Docker Compose with FastAPI and database containers.'
  },
  {
    slug: 'bustwatch',
    name: 'bustwatch',
    repo: 'aditya0si/bustwatch',
    commit_sha: realEvidence['bustwatch'].commitSha,
    url: 'https://github.com/aditya0si/bustwatch',
    is_flagship: false,
    flagship_role: null,
    testCount: 6,
    hasCi: true,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 6.8,
    baseAi: 6.0,
    baseSystems: 7.0,
    baseProduct: 6.8,
    baseOrig: 7.0,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 7.0,
    baseDemo: 6.5,
    archId: 'EV-BUSTWATCH-ARCH',
    aiId: 'EV-BUSTWATCH-AI',
    ciId: 'EV-BUSTWATCH-CI',
    dbId: 'EV-BUSTWATCH-DB',
    manifestId: 'EV-BUSTWATCH-MANIFEST',
    testId: 'EV-BUSTWATCH-TESTS',
    readmeId: 'EV-BUSTWATCH-README',
    langId: 'EV-BUSTWATCH-LANG',
    depthRationale: 'Public transit delay prediction API with spatial bus clustering and real-time route schedule telemetry.',
    aiRationale: 'Predictive machine learning models forecasting transit delay probabilities from spatial features.',
    prodRationale: 'Containerized deployment scripts, Redis cache integration, and CI workflow configuration.',
    systemsRationale: 'FastAPI async route handlers, geospatial indexing, and Redis query caching.',
    productRationale: 'Functional transit tracking API and client dashboard with route delay metrics.',
    origRationale: 'Civic tech telemetry application targeting municipal transit reliability.',
    measurableRationale: '6 verified test source files in tests/; no empirical benchmark artifact detected in captured paths.',
    codeQualityRationale: 'Modular Python layout with typed request schemas and 6 automated test source files; unexecuted in audit.',
    docsRationale: 'Clear README with installation steps, API route tables, and curl examples; capped at 4.0 as unverified claims.',
    interviewRationale: 'Discussions on feature engineering for transit delay, spatial clustering, and cache invalidation.',
    demoRationale: 'Runnable locally with Docker Compose spinning up FastAPI and Redis.'
  },
  {
    slug: 'floodlens',
    name: 'floodlens',
    repo: 'aditya0si/floodlens',
    commit_sha: realEvidence['floodlens'].commitSha,
    url: 'https://github.com/aditya0si/floodlens',
    is_flagship: false,
    flagship_role: null,
    testCount: 7,
    hasCi: true,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 6.8,
    baseAi: 6.0,
    baseSystems: 7.0,
    baseProduct: 6.8,
    baseOrig: 7.0,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 7.0,
    baseDemo: 6.5,
    archId: 'EV-FLOODLENS-ARCH',
    aiId: 'EV-FLOODLENS-AI',
    ciId: 'EV-FLOODLENS-CI',
    dbId: 'EV-FLOODLENS-DB',
    manifestId: 'EV-FLOODLENS-MANIFEST',
    testId: 'EV-FLOODLENS-TESTS',
    readmeId: 'EV-FLOODLENS-README',
    langId: 'EV-FLOODLENS-LANG',
    depthRationale: 'Hydrological physics elevation grid processing and flood risk modeling pipeline.',
    aiRationale: 'Geospatial ML models predicting localized flood inundation probability from digital elevation models.',
    prodRationale: 'Containerized spatial processing service with Docker Compose and CI workflow configuration.',
    systemsRationale: 'FastAPI geospatial processing endpoints, raster grid matrix manipulation, and caching.',
    productRationale: 'Interactive risk assessment dashboard with terrain elevation map visualization.',
    origRationale: 'Physics-informed hydrological modeling applied to regional climate resilience.',
    measurableRationale: '7 verified test source files in tests/; no empirical benchmark artifact detected in captured paths.',
    codeQualityRationale: 'Modular Python codebase with typed models and 7 automated test source files; unexecuted in audit.',
    docsRationale: 'Documentation detailing elevation model data inputs, setup instructions, and risk formulas; capped at 4.0 as unverified claims.',
    interviewRationale: 'Talking points on digital elevation model processing, spatial grid resolution, and hydrological runoff algorithms.',
    demoRationale: 'Local execution via Docker Compose with web dashboard.'
  },
  {
    slug: 'vibe-odds',
    name: 'vibe-odds',
    repo: 'aditya0si/vibe-odds',
    commit_sha: realEvidence['vibe-odds'].commitSha,
    url: 'https://github.com/aditya0si/vibe-odds',
    is_flagship: false,
    flagship_role: null,
    testCount: 10,
    hasCi: false,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 7.0,
    baseAi: 5.8,
    baseSystems: 6.8,
    baseProduct: 6.5,
    baseOrig: 6.8,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 6.8,
    baseDemo: 5.8,
    archId: 'EV-VIBE-ARCH',
    aiId: 'EV-VIBE-AI',
    ciId: 'EV-VIBE-MANIFEST',
    noCiId: 'EV-VIBE_ODDS-NO-CI',
    dbId: 'EV-VIBE-DB',
    manifestId: 'EV-VIBE-MANIFEST',
    testId: 'EV-VIBE_ODDS-TESTS',
    readmeId: 'EV-VIBE_ODDS-README',
    langId: 'EV-VIBE_ODDS-LANG',
    depthRationale: 'Multi-model sports betting market statistical forecasting and probability calibration pipeline.',
    aiRationale: 'Gradient boosting and logistic calibration models for probability forecasting and Kelly criterion bankroll management.',
    prodRationale: 'Local environment configuration, data extraction scripts, and dependency manifests.',
    systemsRationale: 'Statistical processing pipeline using SQLite and Parquet file persistence.',
    productRationale: 'CLI and analytical reporting interface for model backtesting and probability tracking.',
    origRationale: 'Market efficiency analysis comparing predicted odds with sportsbook market lines.',
    measurableRationale: '10 verified test source files in tests/; no empirical benchmark artifact detected in captured paths.',
    codeQualityRationale: 'Clean Python statistical packages with 10 automated test source files; unexecuted in audit.',
    docsRationale: 'README explaining calibration metrics, Brier score calculations, and bankroll policies; capped at 4.0 as unverified claims.',
    interviewRationale: 'Discussion on market microstructure, model calibration curves, and variance management.',
    demoRationale: 'Local Python execution via CLI backtesting commands.'
  },
  {
    slug: 'asic-crc-engine',
    name: 'asic-crc-engine',
    repo: 'aditya0si/asic-crc-engine',
    commit_sha: realEvidence['asic-crc-engine'].commitSha,
    url: 'https://github.com/aditya0si/asic-crc-engine',
    is_flagship: false,
    flagship_role: null,
    testCount: 2,
    hasCi: true,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    isHardware: true,
    baseDepth: 8.2,
    baseAi: 1.5,
    baseSystems: 3.0,
    baseProduct: 6.5,
    baseOrig: 8.5,
    baseCodeQuality: 6.0,
    baseDocs: 4.0,
    baseInterview: 8.5,
    baseDemo: 5.8,
    archId: 'EV-ASIC-ARCH',
    aiId: 'EV-ASIC-AI',
    ciId: 'EV-ASIC_CRC_ENGINE-CI',
    dbId: 'EV-ASIC-DB',
    manifestId: 'EV-ASIC_CRC_ENGINE-GIT',
    testId: 'EV-ASIC_CRC_ENGINE-TESTS',
    readmeId: 'EV-ASIC_CRC_ENGINE-README',
    langId: 'EV-ASIC_CRC_ENGINE-LANG',
    extraSystems: 'EV-ASIC_CRC_ENGINE-NON-WEB-API',
    depthRationale: 'Synthesizable Verilog RTL implementation of Ethernet CRC32 checksum engine with parallel LFSR polynomial calculation.',
    aiRationale: 'Pure digital hardware RTL engineering; zero machine learning or AI integration by design.',
    prodRationale: 'Hardware RTL synthesis scripts and GitHub Actions CI workflow configuration.',
    systemsRationale: 'Digital register-transfer level hardware design; non-web API architecture.',
    productRationale: 'Complete synthesizable Verilog core with dual testbenches validating hardware correctness.',
    origRationale: 'Demonstrates low-level hardware design literacy and HDL verification within an engineering portfolio.',
    measurableRationale: '2 verified Verilog testbenches in tb/ (tb_crc32.sv, tb_crc32_simple.v); no software benchmark artifact detected in captured paths.',
    codeQualityRationale: 'Clean, synthesizable SystemVerilog/Verilog code with timing assertions and dual testbenches.',
    docsRationale: 'Documentation of CRC32 polynomial matrix math, clock timing constraints, and synthesis targets; capped at 4.0 as unverified claims.',
    interviewRationale: 'Talking points on parallel LFSR vs serial CRC, setup/hold timing margins, and hardware synthesis.',
    demoRationale: 'Simulatable locally with Icarus Verilog and GTKWave waveform viewer.'
  },
  {
    slug: 'opencode-team',
    name: 'OpenCode-Team',
    repo: 'aditya0si/OpenCode-Team',
    commit_sha: realEvidence['OpenCode-Team'].commitSha,
    url: 'https://github.com/aditya0si/OpenCode-Team',
    is_flagship: false,
    flagship_role: null,
    testCount: 0,
    hasCi: true,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: true,
    baseDepth: 6.5,
    baseAi: 8.0,
    baseSystems: 6.0,
    baseProduct: 7.5,
    baseOrig: 7.5,
    baseCodeQuality: 4.0,
    baseDocs: 4.0,
    baseInterview: 7.2,
    baseDemo: 7.0,
    archId: 'EV-OCT-ARCH',
    aiId: 'EV-OCT-AI',
    ciId: 'EV-OPENCODE_TEAM-CI',
    dbId: 'EV-OCT-DB',
    manifestId: 'EV-OPENCODE_TEAM-MANIFEST',
    testId: 'EV-OPENCODE_TEAM-NO-TESTS',
    noTestId: 'EV-OPENCODE_TEAM-NO-TESTS',
    readmeId: 'EV-OPENCODE_TEAM-README',
    langId: 'EV-OPENCODE_TEAM-LANG',
    extraProduct: 'EV-OCT-NPM-PACKAGE',
    extraDocsId: 'EV-OCT-CONFLICT-LABELED',
    extraDemoId: 'EV-OCT-NPM-PACKAGE',
    depthRationale: 'TypeScript multi-agent collaboration framework coordinating code reviews, plan generation, and task breakdown.',
    aiRationale: 'Multi-agent teamwork patterns, role-specialized prompt loops, and tool orchestration.',
    prodRationale: 'Published npm package (opencode-teamwork) and GitHub Actions CI workflow configuration.',
    systemsRationale: 'Node.js CLI process execution, tool dispatcher, and local filesystem state.',
    productRationale: 'Published npm package with executable CLI commands and interactive multi-agent prompts.',
    origRationale: 'Modular agent collaboration framework focused on terminal-based pair programming workflows.',
    measurableRationale: '0 automated test source files detected in repository tree; no empirical benchmark artifact detected in captured paths.',
    codeQualityRationale: 'TypeScript source code; capped strictly at 4.0 due to complete absence of automated test suite.',
    docsRationale: 'Comprehensive README detailing slash commands, agent roles, and installation instructions; capped at 4.0 as unverified claims.',
    interviewRationale: 'Discussion on agent delegation patterns, prompt engineering, and CLI tool interfaces.',
    demoRationale: 'Directly runnable via published npm package: npm i opencode-teamwork.'
  },
  {
    slug: 'thebutterflyeffect',
    name: 'TheButterFlyEffect',
    repo: 'aditya0si/TheButterFlyEffect',
    commit_sha: realEvidence['TheButterFlyEffect'].commitSha,
    url: 'https://github.com/aditya0si/TheButterFlyEffect',
    is_flagship: false,
    flagship_role: null,
    testCount: 0,
    hasCi: false,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 6.2,
    baseAi: 7.5,
    baseSystems: 5.5,
    baseProduct: 5.5,
    baseOrig: 7.5,
    baseCodeQuality: 4.0,
    baseDocs: 4.0,
    baseInterview: 6.5,
    baseDemo: 5.5,
    archId: 'EV-TBE-ARCH',
    aiId: 'EV-TBE-AI',
    ciId: 'EV-THEBUTTERFLYEFFECT-NO-CI',
    noCiId: 'EV-THEBUTTERFLYEFFECT-NO-CI',
    dbId: 'EV-TBE-DB',
    manifestId: 'EV-TBE-MANIFEST',
    testId: 'EV-THEBUTTERFLYEFFECT-NO-TESTS',
    noTestId: 'EV-THEBUTTERFLYEFFECT-NO-TESTS',
    readmeId: 'EV-THEBUTTERFLYEFFECT-README',
    langId: 'EV-THEBUTTERFLYEFFECT-LANG',
    depthRationale: 'Autonomous agent simulation framework exploring emergent behaviors and cascading decision loops.',
    aiRationale: 'Agent swarm simulation modeling cascading state transitions and multi-agent interactions.',
    prodRationale: 'Local execution scripts and dependency requirements; no automated CI workflow.',
    systemsRationale: 'Python in-memory agent state tracking and procedural execution.',
    productRationale: 'Prototype CLI simulation tool for experimenting with agent decision trees.',
    origRationale: 'Exploration of non-deterministic cascading outcomes in simulated multi-agent environments.',
    measurableRationale: '0 automated test source files detected in repository tree; no empirical benchmark artifact detected in captured paths.',
    codeQualityRationale: 'Python simulation scripts; capped strictly at 4.0 due to absence of automated test suite.',
    docsRationale: 'README explaining simulation theory, agent states, and execution instructions; capped at 4.0 as unverified claims.',
    interviewRationale: 'Talking points on emergent agent behaviors, loop termination, and state propagation.',
    demoRationale: 'Local Python execution running simulation rounds in terminal.'
  },
  {
    slug: 'e-commerce-dashboard',
    name: 'E-commerce-Dashboard',
    repo: 'aditya0si/E-commerce-Dashboard',
    commit_sha: realEvidence['E-commerce-Dashboard'].commitSha,
    url: 'https://github.com/aditya0si/E-commerce-Dashboard',
    is_flagship: false,
    flagship_role: null,
    testCount: 1,
    hasCi: false,
    hasBenchmark: false,
    hasEvalHarness: false,
    hasExternalPackage: false,
    baseDepth: 5.5,
    baseAi: 2.0,
    baseSystems: 5.5,
    baseProduct: 6.8,
    baseOrig: 5.5,
    baseCodeQuality: 5.5,
    baseDocs: 4.0,
    baseInterview: 5.8,
    baseDemo: 6.0,
    archId: 'EV-ECOM-ARCH',
    aiId: 'EV-ECOM-AI',
    ciId: 'EV-E_COMMERCE_DASHBOARD-NO-CI',
    noCiId: 'EV-E_COMMERCE_DASHBOARD-NO-CI',
    dbId: 'EV-ECOM-DB',
    manifestId: 'EV-E_COMMERCE_DASHBOARD-MANIFEST',
    testId: 'EV-E_COMMERCE_DASHBOARD-TESTS',
    readmeId: 'EV-E_COMMERCE_DASHBOARD-README',
    langId: 'EV-E_COMMERCE_DASHBOARD-LANG',
    extraOrigId: 'EV-ECOM-ORDERS-CLAIM',
    depthRationale: 'Streamlit exploratory e-commerce analytics dashboard operating over Brazilian customer order datasets.',
    aiRationale: 'Classical data analytics and statistical reporting; zero AI or ML models.',
    prodRationale: 'Local Streamlit execution environment and requirements.txt manifest; no automated CI workflow.',
    systemsRationale: 'Pandas data frame manipulation and local CSV dataset queries.',
    productRationale: 'Multi-tab interactive dashboard with revenue breakdown, delivery maps, and customer metrics.',
    origRationale: 'Standard retail order analytics implementation over public Olist dataset.',
    measurableRationale: '1 verified test source file in tests/ (test_views.py); order volume of 99,441 orders cited as unverified README claim.',
    codeQualityRationale: 'Functional Streamlit script with basic view test; unexecuted in audit.',
    docsRationale: 'README explaining dashboard metrics, setup commands, and dataset origin; capped at 4.0 as unverified claims.',
    interviewRationale: 'Discussions on exploratory data analysis, aggregation performance, and chart selection.',
    demoRationale: 'Locally executable via streamlit run app.py command.'
  }
];

// 5. Excluded Repositories (12 meaningful repositories)
const exclusions = [
  {
    repo: 'aegis',
    full_name: 'aditya0si/aegis',
    commit_sha: realEvidence['aegis'].commitSha,
    reason: 'Security analysis prototype with single commit; unverified test suite and insufficient production artifacts.',
    disposition: 'Excluded from viable software ranking; historical security prototype.',
    evidence_ids: ['EV-AEGIS-GIT', 'EV-AEGIS-LANG', 'EV-AEGIS-MANIFEST'],
    missing_evidence: 'Automated test suite execution and continuous development history.'
  },
  {
    repo: 'pharmforge',
    full_name: 'aditya0si/pharmforge',
    commit_sha: realEvidence['pharmforge'].commitSha,
    reason: 'Pharmaceutical manufacturing pipeline with single commit; lacking active test runner integration and multi-environment deployment.',
    disposition: 'Excluded from viable software ranking; early domain prototype.',
    evidence_ids: ['EV-PHARMFORGE-GIT', 'EV-PHARMFORGE-LANG', 'EV-PHARMFORGE-MANIFEST'],
    missing_evidence: 'Empirical validation metrics and automated test execution.'
  },
  {
    repo: 'skyguard',
    full_name: 'aditya0si/skyguard',
    commit_sha: realEvidence['skyguard'].commitSha,
    reason: 'Aerospace telemetry monitoring concept; single commit history and unverified sensor simulation.',
    disposition: 'Excluded from viable software ranking; conceptual exploration.',
    evidence_ids: ['EV-SKYGUARD-GIT', 'EV-SKYGUARD-LANG', 'EV-SKYGUARD-MANIFEST'],
    missing_evidence: 'End-to-end integration tests and real-time telemetry stream benchmarks.'
  },
  {
    repo: 'stormcast',
    full_name: 'aditya0si/stormcast',
    commit_sha: realEvidence['stormcast'].commitSha,
    reason: 'Severe weather forecasting model pipeline; early prototype superseded by floodlens and bustwatch.',
    disposition: 'Excluded from viable software ranking; superseded prototype.',
    evidence_ids: ['EV-STORMCAST-GIT', 'EV-STORMCAST-LANG', 'EV-STORMCAST-MANIFEST'],
    missing_evidence: 'Continuous integration and model validation benchmarks.'
  },
  {
    repo: 'weathergpt',
    full_name: 'aditya0si/weathergpt',
    commit_sha: realEvidence['weathergpt'].commitSha,
    reason: 'Weather forecast generative assistant; tutorial-scale wrapper around weather API with minimal systems engineering depth.',
    disposition: 'Excluded from viable software ranking; basic tutorial project.',
    evidence_ids: ['EV-WEATHERGPT-GIT', 'EV-WEATHERGPT-LANG', 'EV-WEATHERGPT-MANIFEST'],
    missing_evidence: 'Non-trivial backend architecture or empirical benchmark.'
  },
  {
    repo: 'agentic_rag_system',
    full_name: 'aditya0si/agentic_rag_system',
    commit_sha: realEvidence['agentic_rag_system'].commitSha,
    reason: 'Early RAG experiment; superseded by schemeGPT and grounded-knowledge-platform production architectures.',
    disposition: 'Excluded from viable software ranking; superseded RAG prototype.',
    evidence_ids: ['EV-AGENTIC_RAG_SYSTEM-GIT', 'EV-AGENTIC_RAG_SYSTEM-LANG', 'EV-AGENTIC_RAG_SYSTEM-MANIFEST'],
    missing_evidence: 'Comprehensive evaluation harness and production deployment.'
  },
  {
    repo: 'Cyber',
    full_name: 'aditya0si/Cyber',
    commit_sha: realEvidence['Cyber'].commitSha,
    reason: 'Network security tooling scripts; lacking automated test files and structured service architecture.',
    disposition: 'Excluded from viable software ranking; script collection.',
    evidence_ids: ['EV-CYBER-GIT', 'EV-CYBER-LANG', 'EV-CYBER-MANIFEST'],
    missing_evidence: 'Automated test suite and service API contracts.'
  },
  {
    repo: 'bom-intelligence',
    full_name: 'aditya0si/bom-intelligence',
    commit_sha: realEvidence['bom-intelligence'].commitSha,
    reason: 'Bill of Materials parsing scripts; offline utility lacking service packaging and automated tests.',
    disposition: 'Excluded from viable software ranking; hardware utility script.',
    evidence_ids: ['EV-BOM_INTELLIGENCE-GIT', 'EV-BOM_INTELLIGENCE-LANG', 'EV-BOM_INTELLIGENCE-NON-WEB-API'],
    missing_evidence: 'Automated API test suite.'
  },
  {
    repo: 'HealthCareOCR',
    full_name: 'aditya0si/HealthCareOCR',
    commit_sha: realEvidence['HealthCareOCR'].commitSha,
    reason: 'Early OCR pipeline for medical records; superseded by CoverAI\'s mature document analysis and test suite.',
    disposition: 'Excluded from viable software ranking; historical prototype.',
    evidence_ids: ['EV-HEALTHCAREOCR-GIT', 'EV-HEALTHCAREOCR-LANG', 'EV-HEALTHCAREOCR-MANIFEST'],
    missing_evidence: 'End-to-end evaluation benchmark.'
  },
  {
    repo: 'pipeline_ocr',
    full_name: 'aditya0si/pipeline_ocr',
    commit_sha: realEvidence['pipeline_ocr'].commitSha,
    reason: 'Archived OCR pipeline scripts; archived repository status and superseded by active projects.',
    disposition: 'Excluded from viable software ranking; archived status.',
    evidence_ids: ['EV-PIPELINE_OCR-GIT', 'EV-PIPELINE_OCR-LANG', 'EV-PIPELINE_OCR-MANIFEST'],
    missing_evidence: 'Active development and CI pipeline.'
  },
  {
    repo: 'pipeline_pr-tb',
    full_name: 'aditya0si/pipeline_pr-tb',
    commit_sha: realEvidence['pipeline_pr-tb'].commitSha,
    reason: 'Pull request test bench automation prototype; archived repository status.',
    disposition: 'Excluded from viable software ranking; archived status.',
    evidence_ids: ['EV-PIPELINE_PR_TB-GIT', 'EV-PIPELINE_PR_TB-LANG', 'EV-PIPELINE_PR_TB-MANIFEST'],
    missing_evidence: 'Active production deployment.'
  },
  {
    repo: 'ate-fixture-lab',
    full_name: 'aditya0si/ate-fixture-lab',
    commit_sha: realEvidence['ate-fixture-lab'].commitSha,
    reason: 'Hardware automated test equipment fixture sequencer scripts; laboratory instrumentation tooling rather than a distributed software service.',
    disposition: 'Excluded from software ranking; cataloged as hardware engineering artifact.',
    evidence_ids: ['EV-ATE_FIXTURE_LAB-GIT', 'EV-ATE_FIXTURE_LAB-LANG', 'EV-ATE_FIXTURE_LAB-NON-WEB-API'],
    missing_evidence: 'Software service API contract.'
  }
];

// 6. Deterministic Category Evaluation Function
function evaluateCategory(ctx, cat) {
  let score = 0;
  let evidenceStrength = 'CODE_OBSERVED_STATIC';
  let anchorUsed = '';
  let missingEvidence = '';
  let rationale = '';
  let citedIds = [];

  switch (cat) {
    case 'engineering_depth': {
      citedIds = [ctx.archId, ...(ctx.domainIds || [])];
      score = ctx.baseDepth;
      evidenceStrength = 'CODE_OBSERVED_STATIC';
      anchorUsed = 'ARCHITECTURE_AND_CODE_COMPLEXITY_TIER';
      missingEvidence = 'Dynamic tracing or profiling in live execution environment';
      rationale = ctx.depthRationale;
      break;
    }
    case 'ai_relevance': {
      citedIds = [ctx.aiId];
      score = ctx.baseAi;
      evidenceStrength = 'DOMAIN_CLASSIFICATION';
      anchorUsed = 'AI_DOMAIN_ALIGNMENT_RUBRIC';
      missingEvidence = ctx.baseAi > 3.0 ? 'Phase 1 model inference evaluation or benchmark' : 'N/A (Non-AI project by design)';
      rationale = ctx.aiRationale;
      break;
    }
    case 'production_readiness': {
      citedIds = ctx.hasCi ? [ctx.ciId, ctx.manifestId] : [ctx.noCiId || ctx.manifestId];
      if (ctx.testCount === 0) {
        // Cap: No tests <= 5.0 production readiness
        score = Math.min(ctx.baseProduct || 4.5, 5.0);
        evidenceStrength = 'NO_TESTS_CONTAINER_ONLY';
        anchorUsed = 'NO_TESTS_PROD_READINESS_CAP_5';
        missingEvidence = 'Automated test suite to validate builds and containers';
      } else if (ctx.hasCi) {
        // Cap: CI config observed but run status absent <= 6.0
        score = 6.0;
        evidenceStrength = 'CI_CONFIG_UNEXECUTED';
        anchorUsed = 'CI_CONFIG_UNEXECUTED_CAP_6';
        missingEvidence = 'CI workflow run execution logs and verification of passing build jobs';
      } else {
        // Local docker / requirements only <= 5.5
        score = Math.min(ctx.baseProd || 5.0, 5.5);
        evidenceStrength = 'LOCAL_CONFIG_ONLY';
        anchorUsed = 'LOCAL_CONFIG_ONLY_CAP_5_5';
        missingEvidence = 'CI/CD pipeline configuration and automated build execution';
      }
      rationale = ctx.prodRationale;
      break;
    }
    case 'systems_backend': {
      citedIds = [ctx.dbId];
      if (ctx.extraSystems) citedIds.push(ctx.extraSystems);
      score = ctx.baseSystems;
      evidenceStrength = 'CODE_OBSERVED_STATIC';
      anchorUsed = 'SYSTEMS_BACKEND_COMPLEXITY_RUBRIC';
      missingEvidence = 'Production database query telemetry and concurrency benchmarks under load';
      rationale = ctx.systemsRationale;
      break;
    }
    case 'product_completeness': {
      citedIds = [ctx.manifestId];
      if (ctx.extraProduct) citedIds.push(ctx.extraProduct);
      score = ctx.baseProduct;
      evidenceStrength = 'CODE_OBSERVED_STATIC';
      anchorUsed = 'PRODUCT_SURFACE_OBSERVATION';
      missingEvidence = 'End-to-end user workflow execution in browser/CLI';
      rationale = ctx.productRationale;
      break;
    }
    case 'originality': {
      citedIds = [ctx.archId];
      if (ctx.extraOrigId) citedIds.push(ctx.extraOrigId);
      score = ctx.baseOrig;
      evidenceStrength = 'CODE_OBSERVED_STATIC';
      anchorUsed = 'ORIGINALITY_DOMAIN_RUBRIC';
      missingEvidence = 'Independent patent or novel research paper publication';
      rationale = ctx.origRationale;
      break;
    }
    case 'measurable_evidence': {
      if (ctx.hasBenchmark) {
        // Cap: Historical committed benchmark not executed in audit <= 7.0
        score = 7.0;
        citedIds = [ctx.benchmarkId];
        if (ctx.extraMeasurableId) citedIds.push(ctx.extraMeasurableId);
        evidenceStrength = 'HISTORICAL_BENCHMARK_UNEXECUTED';
        anchorUsed = 'HISTORICAL_BENCHMARK_UNEXECUTED_CAP_7';
        missingEvidence = 'Live benchmark execution in current audit environment';
      } else if (ctx.hasEvalHarness) {
        // Bespoke eval harness with unexecuted tests
        score = 6.5;
        citedIds = [ctx.evalId, ctx.testId];
        if (ctx.extraMeasurableId) citedIds.push(ctx.extraMeasurableId);
        evidenceStrength = 'EVAL_HARNESS_UNEXECUTED';
        anchorUsed = 'EVAL_HARNESS_UNEXECUTED_CAP_7';
        missingEvidence = 'Execution of evaluation scripts and recording of live score metrics';
      } else if (ctx.testCount > 0) {
        // Cap: Test files present but not executed <= 6.0
        score = ctx.testCount >= 30 ? 6.0 : (ctx.testCount >= 10 ? 5.8 : (ctx.testCount >= 5 ? 5.5 : 5.0));
        citedIds = [ctx.testId];
        if (ctx.extraMeasurableId) citedIds.push(ctx.extraMeasurableId);
        evidenceStrength = 'UNEXECUTED_TEST_FILES';
        anchorUsed = 'UNEXECUTED_TESTS_CAP_6';
        missingEvidence = 'Automated test suite execution and coverage reports in audit environment';
      } else {
        // Cap: No tests, no benchmark <= 4.0
        score = 3.5;
        citedIds = [ctx.noTestId || ctx.testId];
        if (ctx.extraMeasurableId) citedIds.push(ctx.extraMeasurableId);
        evidenceStrength = 'NO_TESTS_OR_BENCHMARKS';
        anchorUsed = 'NO_TESTS_CAP_4';
        missingEvidence = 'Automated test suite or benchmark scripts in repository tree';
      }
      rationale = ctx.measurableRationale;
      break;
    }
    case 'code_quality': {
      if (ctx.testCount === 0) {
        // Cap: No tests <= 4.0 code quality
        score = 4.0;
        citedIds = [ctx.noTestId || ctx.testId, ctx.langId];
        evidenceStrength = 'NO_TESTS';
        anchorUsed = 'NO_TESTS_CODE_QUALITY_CAP_4';
        missingEvidence = 'Automated test suite and lint/typechecking execution in CI';
      } else {
        // Cap: Test files present but not executed <= 6.0
        score = Math.min(ctx.baseCodeQuality || 6.0, 6.0);
        citedIds = [ctx.testId, ctx.langId];
        if (ctx.extraCodeQualityId) citedIds.push(ctx.extraCodeQualityId);
        evidenceStrength = 'CODE_OBSERVED_UNEXECUTED_TESTS';
        anchorUsed = 'UNEXECUTED_TESTS_CAP_6';
        missingEvidence = 'Passing test suite execution logs and linter/typecheck verification';
      }
      rationale = ctx.codeQualityRationale;
      break;
    }
    case 'docs_explainability': {
      citedIds = [ctx.readmeId];
      if (ctx.extraDocsId) citedIds.push(ctx.extraDocsId);

      // Check if evidence is solely README_CLAIM
      const citedEntries = citedIds.map(id => ledgerMap.get(id)).filter(Boolean);
      const isAllReadme = citedEntries.length > 0 && citedEntries.every(e => e.evidence_type === 'README_CLAIM');

      if (isAllReadme) {
        // Cap: README_CLAIM only category <= 4.0
        score = 4.0;
        evidenceStrength = 'README_CLAIM_ONLY';
        anchorUsed = 'README_CLAIM_ONLY_CAP_4';
        missingEvidence = 'Committed Architecture Decision Records (ADRs) or technical specification documents in tree';
      } else {
        // Has observed docs / ADRs in tree -> cap at 6.0 (tree observation)
        score = Math.min(ctx.baseDocs || 6.0, 6.0);
        evidenceStrength = 'DOCS_OBSERVED';
        anchorUsed = 'MANIFEST_TREE_OBSERVED_ONLY_CAP_6';
        missingEvidence = 'Interactive hosted API documentation (e.g. Swagger UI)';
      }
      rationale = ctx.docsRationale;
      break;
    }
    case 'interview_depth': {
      citedIds = [ctx.archId, ctx.dbId];
      score = ctx.baseInterview;
      evidenceStrength = 'CODE_OBSERVED_STATIC';
      anchorUsed = 'TECHNICAL_INTERVIEW_SURFACE_RUBRIC';
      missingEvidence = 'Live whiteboard recording or interview transcript';
      rationale = ctx.interviewRationale;
      break;
    }
    case 'demonstrability': {
      citedIds = [ctx.manifestId];
      if (ctx.extraDemoId) citedIds.push(ctx.extraDemoId);
      // Cap: No externally verified live deployment <= 7.0
      score = Math.min(ctx.baseDemo || 7.0, 7.0);
      evidenceStrength = ctx.hasExternalPackage ? 'EXTERNAL_VERIFIED' : 'LOCAL_DEMO_OR_PACKAGE';
      anchorUsed = 'NO_EXTERNAL_LIVE_DEPLOYMENT_CAP_7';
      missingEvidence = 'Independently verified live production deployment URL with active health endpoint';
      rationale = ctx.demoRationale;
      break;
    }
  }

  // Ensure rationale includes proper [Evidence: ...] citation
  if (!rationale.includes('[Evidence:')) {
    rationale += ` [Evidence: ${citedIds.join(', ')}]`;
  }

  return {
    score: Number(score.toFixed(1)),
    category_evidence_ids: citedIds,
    evidence_strength: evidenceStrength,
    anchor_used: anchorUsed,
    missing_evidence: missingEvidence,
    rationale
  };
}

// 7. Process Scored Projects with Deterministic Rule-Based Engine
const scoredProjects = projectConfigs.map(cfg => {
  const categories = {};
  const scores = {};
  const rationales = {};
  const allCategoryEvidenceIds = new Set();

  let weightedSum = 0;
  for (const [cat, w] of Object.entries(weights)) {
    const evalResult = evaluateCategory(cfg, cat);
    categories[cat] = evalResult;
    scores[cat] = evalResult.score;
    rationales[cat] = evalResult.rationale;
    weightedSum += evalResult.score * w;
    evalResult.category_evidence_ids.forEach(id => allCategoryEvidenceIds.add(id));
  }

  const totalScore = Number((weightedSum * 10).toFixed(2));

  // Cap: confidence <= 0.75 since no tests or deployments were executed/verified in current audit run
  const confidence = 0.75;

  return {
    slug: cfg.slug,
    name: cfg.name,
    repo: cfg.repo,
    commit_sha: cfg.commit_sha,
    url: cfg.url,
    eligibility_gate: 'PROVISIONAL_PENDING_EXECUTION',
    eligible_flagship: cfg.is_flagship ? 'PROVISIONAL_PENDING_EXECUTION' : 'INELIGIBLE',
    flagship_status: cfg.is_flagship ? 'PROVISIONAL_PENDING_EXECUTION' : null,
    flagship_role: cfg.flagship_role,
    confidence: confidence,
    missing_evidence: 'Phase 1 live execution: automated build execution, test suite run verification, and live load benchmarking.',
    evidence_ids: Array.from(allCategoryEvidenceIds),
    categories: categories,
    scores: scores,
    rationales: rationales,
    total_score: totalScore
  };
});

// Sort strictly descending by total_score
scoredProjects.sort((a, b) => b.total_score - a.total_score);

// 8. Assemble Complete JSON Output
const scoresOutput = {
  metadata: {
    authoritative_ledger: 'research/evidence-ledger.json',
    authoritative_evidence_source: 'research/real_repo_evidence.json',
    generated_at: new Date().toISOString(),
    scoring_version: '3.0-deterministic-anchors-unit-a3',
    weights,
    deterministic_caps: deterministicCaps,
    total_repositories_audited: 47,
    total_meaningful_repositories: 27,
    total_viable_projects_scored: scoredProjects.length,
    total_meaningful_repositories_excluded: exclusions.length,
    eligibility_gate_status: 'PROVISIONAL_PENDING_EXECUTION',
    flagships_designated: scoredProjects
      .filter(p => p.flagship_status === 'PROVISIONAL_PENDING_EXECUTION')
      .map(p => ({
        slug: p.slug,
        name: p.name,
        role: p.flagship_role,
        total_score: p.total_score,
        status: 'PROVISIONAL_PENDING_EXECUTION'
      }))
  },
  rankings: scoredProjects,
  exclusions: exclusions
};

fs.writeFileSync('docs/portfolio/project-scores.json', JSON.stringify(scoresOutput, null, 2), 'utf8');
console.log(`Generated docs/portfolio/project-scores.json with ${scoredProjects.length} scored projects and ${exclusions.length} exclusions.`);
