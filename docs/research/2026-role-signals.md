# 2026 Engineering Role Signals Research

## Executive Summary
This document establishes empirical hiring expectations and technical requirements across target engineering roles for 2026: **AI Engineer**, **Forward Deployed Engineer (FDE / FDSE)**, **Backend Engineer**, **ML Systems Engineer**, **Systems / Platform Engineer**, and **AI Product Engineer**.

All observations are anchored to a target sample of 10 exact job requisitions across 7 industry-defining organizations: **Anthropic**, **OpenAI**, **Palantir**, **Databricks**, **Vercel**, **Cursor (Anysphere)**, and **Google Cloud**. Generic careers landing pages have been excluded. To ensure strict empirical provenance, this document distinguishes between postings whose full job descriptions were actively retrieved and captured on disk (7 postings across 5 organizations) and postings that were inaccessible to automated retrieval due to anti-bot protection, requisition delisting, or client-side JavaScript rendering (3 postings across 3 organizations). Quantitative signal frequencies are calculated strictly over the verified denominator of 7.

---

## 1. Methodology, Sample Size & Frequency Distribution

### 1.1 Methodology & Sample Provenance
*   **Total Target Postings**: 10 distinct job specifications across 7 tier-1 technology organizations.
*   **Verified Accessible Sample**: 7 postings across 5 organizations (**Anthropic**, **Palantir**, **Databricks**, **Vercel**, **Cursor**) where full raw text was successfully retrieved, verified, and archived to disk (`research/job_dumps/`).
*   **Inaccessible Sample (Excluded from Quantitative Denominator)**: 3 postings:
    1. *OpenAI (FDE-NYC)*: HTTP 403 Forbidden via Cloudflare bot management.
    2. *Anthropic (4985877008)*: Requisition delisted / redirected to greenhouse error (`?error=true`).
    3. *Google Cloud (104039023210570438)*: Single-Page Application (SPA) shell; job description rendered purely client-side via JavaScript, inaccessible in static HTTP fetch.
*   **Retrieval Date**: 2026-09-19.
*   **Quotation & Attribution Protocol**: Verbatim quotation marks are used exclusively where exact text was captured and verified. Inaccessible postings are paraphrased with clear attribution, marked `NOT VERIFIED`, and excluded from quantitative percentage denominators.

---

### 1.2 Observed Capability Frequency Across Verified Postings (Denominator = 7)

The table below reflects signals derived programmatically from the 7 verified job specifications (`research/verified_job_signals.json`):

| Engineering Capability Area | Observed Frequency (Verified N=7) | Percentage | Verified Primary Sources & Citations |
| :--- | :---: | :---: | :--- |
| **Distributed Systems, APIs & Cloud Services** | 7 / 7 | 100% | Anthropic (5057647008), Palantir (1bb19522), Databricks (8432827002 & 8468436002), Vercel (5474915004 & ai-gateway), Cursor (swe-product) |
| **Production LLM Orchestration & Prompting** | 7 / 7 | 100% | Anthropic (5057647008), Palantir (1bb19522), Databricks (8432827002 & 8468436002), Vercel (5474915004 & ai-gateway), Cursor (swe-product) |
| **Evaluation Frameworks, CI & Testing** | 6 / 7 | 86% | Anthropic (5057647008), Databricks (8432827002 & 8468436002), Vercel (5474915004 & ai-gateway), Cursor (swe-product) |
| **Python or TypeScript Specified** | 4 / 7 | 57% | Anthropic (5057647008), Databricks (8432827002), Vercel (5474915004 & ai-gateway) |
| ↳ *TypeScript/JavaScript Explicitly Specified* | 4 / 7 | 57% | Anthropic (5057647008), Databricks (8432827002), Vercel (5474915004 & ai-gateway) |
| ↳ *Python Explicitly Specified* | 2 / 7 | 29% | Anthropic (5057647008), Databricks (8432827002) *(Note: Databricks 8468436002 mandates Scala/Go; Palantir & Cursor do not mandate specific languages)* |
| **Tool Calling, Protocols & MCP Standards** | 4 / 7 | 57% | Anthropic (5057647008), Databricks (8468436002), Vercel (5474915004), Cursor (swe-product) |
| **Real-Time Streaming, Observability & Low Latency** | 4 / 7 | 57% | Databricks (8432827002 & 8468436002), Vercel (5474915004 & ai-gateway) |
| **Forward Deployed Client Immersion & Field Delivery** | 3 / 7 | 43% | Anthropic (5057647008), Palantir (1bb19522), Databricks (8432827002) |
| **Model Gateways, Routing, Caching & Failovers** | 2 / 7 | 29% | Databricks (8468436002), Vercel (ai-gateway) |

---

### 1.3 Source-by-Signal Appendix (Complete 10-Posting Audit)

This matrix maps every individual job posting against all audited capabilities based strictly on captured evidence:

| Requisition ID & Org | Retrieval Status | Py/TS Mandate | Distributed & Cloud APIs | LLM Orchestration | Eval & Testing | Tool Calling & MCP | Gateway & Failover | Forward Deployed | Streaming & Latency |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Anthropic** (5057647008) | **VERIFIED** (200 OK) | YES | YES | YES | YES | YES | NOT STATED | YES | NOT STATED |
| **Anthropic** (4985877008) | **NOT VERIFIED** (Delisted) | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] |
| **OpenAI** (fde-nyc) | **NOT VERIFIED** (HTTP 403) | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] |
| **Palantir** (1bb19522) | **VERIFIED** (200 OK) | NOT STATED | YES | YES | NOT STATED | NOT STATED | NOT STATED | YES | NOT STATED |
| **Databricks** (8432827002) | **VERIFIED** (200 OK) | YES | YES | YES | YES | NOT STATED | NOT STATED | YES | YES |
| **Databricks** (8468436002) | **VERIFIED** (200 OK) | NO (Scala/Go) | YES | YES | YES | YES | YES | NOT STATED | YES |
| **Vercel** (5474915004) | **VERIFIED** (200 OK) | YES (TS/JS) | YES | YES | YES | YES | NOT STATED | NOT STATED | YES |
| **Vercel** (ai-gateway) | **VERIFIED** (200 OK) | YES (TS/JS) | YES | YES | YES | NOT STATED | YES | NOT STATED | YES |
| **Cursor** (swe-product) | **VERIFIED** (200 OK) | NOT STATED | YES | YES | YES | YES | NOT STATED | NOT STATED | NOT STATED |
| **Google Cloud** (1040390232) | **NOT VERIFIED** (SPA Shell) | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] | [N/A] |

*Legend: `[N/A]` indicates the posting was inaccessible to automated extraction and is excluded from the quantitative denominator (N=7).*

---

## 2. Role-by-Role Observed Signals vs. Interpretations

### 2.1 AI Engineer / Applied AI Engineer

#### Primary Sources & Retrieval Status
1.  **Anthropic — Applied AI Engineer, Enterprise Tech**
    *   *Exact Requisition URL*: [https://anthropic.com/careers/jobs/5057647008](https://anthropic.com/careers/jobs/5057647008)
    *   *Status*: Active live posting verified and captured on disk (`research/job_dumps/clean_anthropic_5057647008.txt`).
2.  **Google Cloud — AI Engineer, Google Cloud**
    *   *Exact Requisition URL*: [https://careers.google.com/jobs/results/104039023210570438-ai-engineer](https://careers.google.com/jobs/results/104039023210570438-ai-engineer)
    *   *Status*: **NOT VERIFIED** via static fetch (Client-side JavaScript Single Page Application; HTML response contains app shell without body text. Excluded from quantitative denominator).

#### Observed Direct Requirements & Synthesized Field Signals
*   **Anthropic (5057647008) [VERIFIED PRIMARY SOURCE]**:
    *   "Production experience with LLMs, including advanced prompt engineering, agent development and frameworks, evaluation frameworks, transcript analysis, MCP, and deployment at scale."
    *   "Strong programming skills with proficiency in Python or TypeScript and experience building production applications."
    *   "Advising on architecture design decisions, developing evaluation frameworks, and guiding customers through the most cutting-edge implementation patterns for LLMs."
    *   "Influence technical architecture decisions and customer product strategy by developing customized pilots, prototypes, and evaluation suites."
    *   "Create scalable public and internal assets documenting the latest LLM prompting, eval, agentic, and architecture techniques."
*   **Google Cloud (104039023210570438) [UNVERIFIED PARAPHRASE / SECONDARY ATTRIBUTION]**:
    *   *Note: Text unverified via static scraper due to SPA rendering; paraphrased from secondary career portal summaries without direct quotation:*
    *   Public job indexes state that Google Cloud AI Engineers typically design customer machine learning solutions, develop chat and voice integrations, build API glue code across general-purpose languages (Python, Java, Go, or Node.js), and serve as field technical feedback loops into Cloud AI engineering teams.

#### Strategic Interpretation for Portfolio
*   **Anti-Slop Imperative**: Uncalibrated wrapper scripts around third-party APIs with zero evaluation harness or test assertions carry negative technical signal.
*   **Required Signal Demonstrations**:
    *   Must showcase deterministic evaluation harnesses with multi-metric grading (e.g., exact quote attribution, JSON schema assertions, step count bounds).
    *   Must demonstrate wire-protocol understanding of the Model Context Protocol (MCP) and agentic tool-use loops rather than high-level abstractions alone.

---

### 2.2 Forward Deployed Engineer (FDE / FDSE)

#### Primary Sources & Retrieval Status
1.  **Palantir — Forward Deployed Software Engineer (FDSE)**
    *   *Exact Requisition URL*: [https://jobs.lever.co/palantir/1bb19522-3936-4adc-9ced-c3df8b5900b9](https://jobs.lever.co/palantir/1bb19522-3936-4adc-9ced-c3df8b5900b9)
    *   *Status*: Active live posting verified and captured on disk (`research/job_dumps/clean_palantir_1bb19522.txt`).
2.  **Databricks — Forward Deployed Engineer (FDE)**
    *   *Exact Requisition URL*: [https://databricks.com/company/careers/open-positions/job?gh_jid=8432827002](https://databricks.com/company/careers/open-positions/job?gh_jid=8432827002)
    *   *Status*: Active live posting verified and captured on disk (`research/job_dumps/clean_databricks_8432827002.txt`).
3.  **OpenAI — Forward Deployed Engineer (FDE), NYC**
    *   *Exact Requisition URL*: [https://openai.com/careers/forward-deployed-engineer-(fde)-nyc-new-york-city/](https://openai.com/careers/forward-deployed-engineer-(fde)-nyc-new-york-city/)
    *   *Status*: **NOT VERIFIED** via direct fetch (Returned HTTP 403 Forbidden via Cloudflare bot management; excluded from quantitative denominator).
4.  **Anthropic — Forward Deployed Engineer**
    *   *Exact Requisition URL*: [https://anthropic.com/careers/jobs/4985877008](https://anthropic.com/careers/jobs/4985877008)
    *   *Status*: **NOT VERIFIED** (Requisition 4985877008 delisted / redirected to Greenhouse error parameter as of audit date; excluded from quantitative denominator).

#### Observed Direct Requirements & Synthesized Field Signals
*   **Palantir (1bb19522) [VERIFIED PRIMARY SOURCE]**:
    *   "Wrangling massive-scale data and using AI to accelerate and enhance critical operations."
    *   "Developing custom applications tailored to customer needs."
    *   "Engaging directly with customer stakeholders, from technical teams to executives."
    *   "Shaping team strategy and driving projects from ideation to deployment, increasing your pain threshold to deliver real value."
    *   "A highly analytical mindset and eagerness to solve technical problems with data structures, storage systems, cloud infrastructure, front-end frameworks, and other technical tools."
*   **Databricks (8432827002) [VERIFIED PRIMARY SOURCE]**:
    *   "Design and deployment of performant production end-to-end data architectures and applications that combine data pipelines, ML/AI models, and user-facing interfaces."
    *   "Deep experience with distributed computing with Apache Spark and knowledge of runtime internals; comfortable writing code in either Python, Scala, JavaScript/TypeScript."
    *   "Working knowledge of MLOps, ML/AI models and AI APIs."
    *   "Contribute accelerators, frameworks, and best practices that scale impact across accounts and influence the product roadmap."
*   **OpenAI (FDE-NYC) [UNVERIFIED PARAPHRASE / SECONDARY ATTRIBUTION]**:
    *   *Note: Direct fetch blocked by HTTP 403; paraphrased from secondary industry summaries without direct quotation:*
    *   Secondary career postings characterize OpenAI FDEs as deploying frontier models into complex customer environments, engineering full-stack production prototypes, diagnosing deployment failures, and channeling operational findings back to frontier research teams.

#### Strategic Interpretation for Portfolio
*   **High-Agency Full-Stack Execution**: FDE roles demand engineers who operate across the entire stack: data ingestion, database modeling, API services, and user interfaces.
*   **Handling Unstructured Domain Messiness**: Portfolio case studies must highlight messy data ingestion, real-world data pipelines (e.g. FloodLens spatial grid handling, BustWatch transit delay clustering, SchemeGPT welfare document matching), and error handling under ambiguous requirements.

---

### 2.3 Backend & ML Systems Engineer (AI Infrastructure / Gateway)

#### Primary Sources & Retrieval Status
1.  **Databricks — Staff Backend Software Engineer, Unity AI Gateway**
    *   *Exact Requisition URL*: [https://databricks.com/company/careers/open-positions/job?gh_jid=8468436002](https://databricks.com/company/careers/open-positions/job?gh_jid=8468436002)
    *   *Status*: Active live posting verified and captured on disk (`research/job_dumps/clean_databricks_8468436002.txt`).
2.  **Vercel — Software Engineer, AI Gateway**
    *   *Exact Requisition URL*: [https://vercel.com/careers/software-engineer-ai-gateway](https://vercel.com/careers/software-engineer-ai-gateway)
    *   *Status*: Active live posting verified and captured on disk (`research/job_dumps/clean_vercel_gateway.txt`).

#### Observed Direct Requirements
*   **Databricks (8468436002) [VERIFIED PRIMARY SOURCE]**:
    *   "Build the control plane that every AI request at Databricks passes through: partner and self-hosted models, agents, coding assistants, and MCP servers. It enforces budgets, routes each request to the right model, and applies guardrails inline."
    *   "Build the routing layer that picks the right model for each request across quality, cost, latency, availability, and remaining budget."
    *   "8+ years of experience in backend or infrastructure engineering; strong programming skills in Scala or Go."
    *   "Experience with distributed systems, high-throughput APIs, or cloud-native infrastructure; familiarity with service-oriented architecture, deployment pipelines, and system observability."
*   **Vercel (ai-gateway) [VERIFIED PRIMARY SOURCE]**:
    *   "Provides a unified API for accessing hundreds of AI models from multiple providers... build reliable, low-latency systems that handle rate limiting, intelligent failovers, and seamless integrations."
    *   "Ensuring production-ready reliability for AI workloads, including automatic fallbacks during outages and consistent performance across providers like OpenAI, Anthropic, Google, and more."
    *   "Strong proficiency in JavaScript/TypeScript and experience with backend development, APIs, and cloud infrastructure; experience with high-throughput services (rate limiting, caching, failovers)."

#### Strategic Interpretation for Portfolio
*   **Systems Engineering Independence**: Candidates must demonstrate backend systems competence independent of simple LLM API calls.
*   **Gateway Mechanics**: Evidence of building validation proxies, rate limiters, token budget routers, and failover mechanisms (e.g. `Sentinel`'s validation proxy and multi-provider failover routing; `tenant-api-platform`'s Redis token bucket rate limiting and PostgreSQL Row-Level Security).

---

### 2.4 AI Product Engineer & Developer Tooling

#### Primary Sources & Retrieval Status
1.  **Vercel — Software Engineer, AI SDK**
    *   *Exact Requisition URL*: [https://vercel.com/careers/software-engineer-ai-sdk-5474915004](https://vercel.com/careers/software-engineer-ai-sdk-5474915004)
    *   *Status*: Active live posting verified and captured on disk (`research/job_dumps/clean_vercel_5474915004.txt`).
2.  **Cursor (Anysphere) — Software Engineer, Product**
    *   *Exact Requisition URL*: [https://cursor.com/careers/software-engineer-product](https://cursor.com/careers/software-engineer-product)
    *   *Status*: Active live posting verified and captured on disk (`research/job_dumps/clean_cursor_product.txt`).

#### Observed Direct Requirements
*   **Vercel (5474915004) [VERIFIED PRIMARY SOURCE]**:
    *   "Developing and enhancing our TypeScript toolkit for building AI-native products and agents... create a best-in-class SDK that enables millions of developers worldwide to build AI-powered applications."
    *   "Write clean, efficient, and well-documented code. Conduct comprehensive testing to ensure the reliability and stability of the SDK."
    *   "Engage with the open-source community, participate in discussions, and contribute to related projects."
    *   "5+ years of relevant experience; strong proficiency in JavaScript/TypeScript and modern frontend development tools."
*   **Cursor (swe-product) [VERIFIED PRIMARY SOURCE]**:
    *   "Product engineers create the software we ship to our users, in particular our editor. You blend excellent engineering with a taste for models and design."
    *   "Inventing new interfaces and UX for reviewing PRs of AI-generated code."
    *   "Sprinting for two weeks to build a new product vertical from scratch (e.g., AI bug detection)."
    *   "Running experiments and A/B tests on millions of users to push the frontier of agent quality - ex sub-agents, memories, and PR retrieval."

#### Strategic Interpretation for Portfolio
*   **Tooling & Protocol Literacy**: Building developer tools, CLI utilities, npm libraries, and protocol handlers (e.g., `mcp-from-scratch` JSON-RPC codec and `OpenCode-Team` npm CLI package `opencode-teamwork`) provides proof of developer tooling capabilities.
*   **Product Polish & UX Sensibility**: Clean streaming state handling, accessible UI components, keyboard-driven navigation, and layout stability (avoiding jarring layout shifts via pre-allocated dimensions).

---

## 3. Key 2026 Industry Paradigm Shifts

| Architectural Domain | 2023–2024 Era (Obsolete Signals) | 2026 Production Standard (Current Signals) |
| :--- | :--- | :--- |
| **Retrieval (RAG)** | Naive cosine similarity over top-k chunks with default LangChain splitters. | Hybrid dense + sparse (PostgreSQL `pgvector` + `tsvector` FTS) with Reciprocal Rank Fusion (RRF), cross-encoder re-ranking, and exact substring citation verification. |
| **Model Interfacing** | Raw string concatenation into unstructured prompt templates. | Strict structured outputs (Pydantic / Zod JSON schemas), model routing layers, rate limit enforcement, and automatic provider failovers. |
| **Agent Architecture** | Unbounded autonomous while-loops that hallucinate and burn API credits. | Constrained DAG workflows with topological sorting, worktree isolation, strict per-agent token budgets, and deterministic evaluation checkpoints. |
| **Protocol Standards** | Custom proprietary webhook glue code. | Model Context Protocol (MCP) compliance over stdio and HTTP/SSE transports with JSON-RPC 2.0 error handling. |
| **Quality & Evaluation** | Manual console skimming and subjective vibe checks. | Multi-grader evaluation harnesses, golden evaluation datasets, exact quote checks, schema conformance gates, and automated test suites. |
| **Observability** | Ad-hoc `console.log` and `print()` statements. | OpenTelemetry spans, Jaeger distributed traces, Prometheus metrics endpoints, and embedding drift monitoring. |

---

## 4. Complete Verification & Citation Index

Every hiring signal cited in this document is anchored to an exact requisition URL with recorded retrieval status:

1.  **Anthropic — Applied AI Engineer, Enterprise Tech**
    `https://anthropic.com/careers/jobs/5057647008`
    *Status*: **VERIFIED** (200 OK via Greenhouse; text captured in `research/job_dumps/clean_anthropic_5057647008.txt`; included in quantitative denominator).
2.  **Anthropic — Forward Deployed Engineer**
    `https://anthropic.com/careers/jobs/4985877008`
    *Status*: **NOT VERIFIED** (Requisition delisted / redirected to greenhouse error parameter `?error=true`; excluded from quantitative denominator).
3.  **OpenAI — Forward Deployed Engineer (FDE), NYC**
    `https://openai.com/careers/forward-deployed-engineer-(fde)-nyc-new-york-city/`
    *Status*: **NOT VERIFIED** (HTTP 403 Forbidden via Cloudflare bot management; excluded from quantitative denominator).
4.  **Palantir — Forward Deployed Software Engineer (FDSE)**
    `https://jobs.lever.co/palantir/1bb19522-3936-4adc-9ced-c3df8b5900b9`
    *Status*: **VERIFIED** (200 OK via Lever ATS; text captured in `research/job_dumps/clean_palantir_1bb19522.txt`; included in quantitative denominator).
5.  **Databricks — Forward Deployed Engineer (FDE)**
    `https://databricks.com/company/careers/open-positions/job?gh_jid=8432827002`
    *Status*: **VERIFIED** (200 OK via Greenhouse API; text captured in `research/job_dumps/clean_databricks_8432827002.txt`; included in quantitative denominator).
6.  **Databricks — Staff Backend Software Engineer, Unity AI Gateway**
    `https://databricks.com/company/careers/open-positions/job?gh_jid=8468436002`
    *Status*: **VERIFIED** (200 OK via Greenhouse API; text captured in `research/job_dumps/clean_databricks_8468436002.txt`; included in quantitative denominator).
7.  **Vercel — Software Engineer, AI SDK**
    `https://vercel.com/careers/software-engineer-ai-sdk-5474915004`
    *Status*: **VERIFIED** (200 OK via Vercel Careers; text captured in `research/job_dumps/clean_vercel_5474915004.txt`; included in quantitative denominator).
8.  **Vercel — Software Engineer, AI Gateway**
    `https://vercel.com/careers/software-engineer-ai-gateway`
    *Status*: **VERIFIED** (200 OK via Vercel Careers; text captured in `research/job_dumps/clean_vercel_gateway.txt`; included in quantitative denominator).
9.  **Cursor (Anysphere) — Software Engineer, Product**
    `https://cursor.com/careers/software-engineer-product`
    *Status*: **VERIFIED** (200 OK via Cursor Careers; text captured in `research/job_dumps/clean_cursor_product.txt`; included in quantitative denominator).
10. **Google Cloud — AI Engineer, Google Cloud**
    `https://careers.google.com/jobs/results/104039023210570438-ai-engineer`
    *Status*: **NOT VERIFIED** (Single-Page Application shell; job description rendered client-side via JavaScript, inaccessible in static HTTP fetch; excluded from quantitative denominator).
