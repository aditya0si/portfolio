// Sourced strictly from docs/portfolio/INITIAL-AUDIT.md Section 8 (ConceptValue Table)
// All systems are explicitly designated as FUTURE / UNBUILT / CONCEPTUAL R&D.

export type ConceptualSystem = {
  id: string;
  name: string;
  status: "FUTURE / UNBUILT";
  domain: string;
  signal: string;
  description: string;
  architecture: string[];
  failureModes: string[];
  metrics: {
    roleDemand: number;
    missingSignal: number;
    demonstrability: number;
    technicalDepth: number;
    buildCost: number;
    formula: string;
    conceptValue: number;
  };
  tags: string[];
};

export const conceptualSystems: ConceptualSystem[] = [
  {
    id: "aether-gateway",
    name: "Aether-Gateway",
    status: "FUTURE / UNBUILT",
    domain: "Enterprise MCP Proxy",
    signal: "Multi-tenant MCP auth, tool RBAC, audit logging",
    description:
      "Enterprise-grade mediation proxy for fleets of Model Context Protocol (MCP) servers, enforcing granular tool role-based access control (RBAC), per-agent credential isolation, and tamper-evident audit trails.",
    architecture: [
      "Dynamic tool capability filtering based on caller identity tokens and session scopes",
      "Cryptographically signed audit logs capturing full JSON-RPC payload hashes and execution latencies",
      "Fail-closed mediation interceptor terminating malformed or unauthorized tool calls before upstream dispatch",
    ],
    failureModes: [
      "Upstream server timeout propagation under heavy tool-call fanout",
      "Permission cache desynchronization during dynamic policy updates",
    ],
    metrics: {
      roleDemand: 5,
      missingSignal: 4,
      demonstrability: 4,
      technicalDepth: 4,
      buildCost: 3,
      formula: "(5 × 4 × 4 × 4) ÷ 3",
      conceptValue: 106.67,
    },
    tags: ["MCP", "RBAC", "Proxy", "Security", "Audit Logging"],
  },
  {
    id: "chronos-drift",
    name: "Chronos-Drift",
    status: "FUTURE / UNBUILT",
    domain: "Streaming Observability",
    signal: "Real-time token drift & embedding anomaly monitoring",
    description:
      "Continuous streaming observability layer that tracks distributional drift and semantic anomalies across real-time LLM inference streams without relying on batch offline evaluations.",
    architecture: [
      "Sliding-window Kolmogorov-Smirnov and Maximum Mean Discrepancy (MMD) tests over live token distributions",
      "Streaming projection engine detecting semantic embedding centroid drift relative to a golden baseline",
      "Prometheus metric exporter emitting drift severity scores and triggering automated pipeline fallback",
    ],
    failureModes: [
      "High false-positive alarm rates during legitimate domain shifts or user demographic changes",
      "Memory overhead of long sliding-window embedding buffer retention",
    ],
    metrics: {
      roleDemand: 4,
      missingSignal: 4,
      demonstrability: 4,
      technicalDepth: 4,
      buildCost: 3,
      formula: "(4 × 4 × 4 × 4) ÷ 3",
      conceptValue: 85.33,
    },
    tags: ["Observability", "Drift Detection", "Embeddings", "Prometheus", "Streaming"],
  },
  {
    id: "kvcache-router",
    name: "KVCache-Router",
    status: "FUTURE / UNBUILT",
    domain: "ML Systems / Inference",
    signal: "Semantic prefix caching & Radix Tree KV cache routing",
    description:
      "Inference-layer traffic router that minimizes Time-to-First-Token (TTFT) and GPU memory consumption by routing prompts to backend engine replicas with warm KV-cache prefix hits.",
    architecture: [
      "Radix Tree token-prefix index matching incoming system prompts against distributed worker cache states",
      "Dynamic cost-aware load balancer trading off cache locality against worker queue depths",
      "Zero-copy cache eviction coordinator synchronizing prefix invalidations across engine instances",
    ],
    failureModes: [
      "Cache thrashing under diverse, unshared prompt prefixes degrading throughput below random round-robin",
      "Stale cache hit routing if worker evictions fail to broadcast synchronously",
    ],
    metrics: {
      roleDemand: 5,
      missingSignal: 5,
      demonstrability: 3,
      technicalDepth: 5,
      buildCost: 4,
      formula: "(5 × 5 × 3 × 5) ÷ 4",
      conceptValue: 93.75,
    },
    tags: ["ML Systems", "KV-Cache", "Radix Tree", "Inference", "Routing"],
  },
  {
    id: "chaos-agent",
    name: "Chaos-Agent",
    status: "FUTURE / UNBUILT",
    domain: "AI Safety / Red Teaming",
    signal: "Adversarial prompt fuzzing & agent sandbox testing",
    description:
      "Autonomous red-teaming harness designed to stress-test agentic systems through automated multi-turn adversarial prompt injections, privilege escalation simulations, and tool abuse probes in isolated sandboxes.",
    architecture: [
      "Evolutionary fuzzing engine generating semantic jailbreak mutations and multi-turn indirect prompt injections",
      "Air-gapped execution sandbox executing simulated file operations, shell calls, and network requests",
      "Automated compliance grader scoring defense rate against OWASP LLM Top-10 benchmarks",
    ],
    failureModes: [
      "Fuzzer convergence on degenerate non-grammatical inputs that fail to model realistic adversary behavior",
      "Sandbox escape attempts during unconstrained agent tool execution simulations",
    ],
    metrics: {
      roleDemand: 4,
      missingSignal: 4,
      demonstrability: 4,
      technicalDepth: 4,
      buildCost: 2,
      formula: "(4 × 4 × 4 × 4) ÷ 2",
      conceptValue: 128.0,
    },
    tags: ["Red Teaming", "AI Safety", "Fuzzing", "OWASP", "Sandbox"],
  },
  {
    id: "raft-kv-mesh",
    name: "Raft-KV-Mesh",
    status: "FUTURE / UNBUILT",
    domain: "Distributed Systems",
    signal: "Raft consensus key-value store with linearizable reads",
    description:
      "Distributed, linearizable key-value store implementing the Raft consensus algorithm from scratch in Go, providing atomic state synchronization and split-brain tolerance for distributed agent coordination.",
    architecture: [
      "Core Raft state machine managing leader election, log replication, and heartbeat intervals",
      "ReadIndex protocol implementation guaranteeing linearizable read consistency without log append overhead",
      "WAL (Write-Ahead Logging) engine with snapshotting and log compaction to prevent disk saturation",
    ],
    failureModes: [
      "Cascading leader elections during transient asymmetric network partitions",
      "Snapshot transfer starvation when slow followers fail to catch up with high write throughput",
    ],
    metrics: {
      roleDemand: 4,
      missingSignal: 5,
      demonstrability: 3,
      technicalDepth: 5,
      buildCost: 4,
      formula: "(4 × 5 × 3 × 5) ÷ 4",
      conceptValue: 75.0,
    },
    tags: ["Distributed Systems", "Raft", "Consensus", "Go", "Linearizable"],
  },
];
