export interface AiConcept {
  id: string;
  index: string;
  title: string;
  category:
    | "AGENTIC ARCHITECTURE"
    | "INFERENCE & SERVING"
    | "RAG & RETRIEVAL"
    | "EVALS & SAFETY"
    | "TRAINING & ALIGNMENT";
  readTime: string;
  summary: string;
  explanation: string;
  takeaway: string;
  tags: string[];
}

export const aiConcepts: AiConcept[] = [
  {
    id: "test-time-compute",
    index: "01",
    title: "Test-Time Compute (TTC) & Reasoning Scaling",
    category: "INFERENCE & SERVING",
    readTime: "90s read",
    summary:
      "Trading inference latency and token spend for correctness instead of scaling pre-training FLOPs.",
    explanation:
      "Traditional scaling laws (Kaplan, Chinchilla) focused on parameter count and training token volume. Test-Time Compute (TTC) shifts the compute budget to runtime. Through techniques like search over thought branches (MCTS, beam search), sequential refinement loops, or dynamic token allocation (like OpenAI o1/o3), models explore multiple reasoning trajectories, backtrack on invalid intermediate steps, and self-verify before outputting a final answer.",
    takeaway:
      "For hard deterministic tasks (code synthesis, mathematical proofs, complex workflow orchestration), spending 5x tokens on inference often yields accuracy jumps that would otherwise require a 10x larger model.",
    tags: ["Reasoning", "Search Over CoT", "o1/o3", "Inference Scaling"],
  },
  {
    id: "mcp",
    index: "02",
    title: "Model Context Protocol (MCP)",
    category: "AGENTIC ARCHITECTURE",
    readTime: "75s read",
    summary:
      "An open, JSON-RPC 2.0 based protocol standardizing how LLMs interface with tools, memory, and data sources.",
    explanation:
      "Before MCP, every agent framework (LangChain, CrewAI, AutoGen) built bespoke tool abstraction layers, leading to brittle M×N integration debt. Anthropic's Model Context Protocol standardizes this into an open client-server architecture over stdio or SSE. An LLM agent acts as an MCP client querying decoupled MCP servers that expose typed tools, resources, and prompt templates.",
    takeaway:
      "Decouples model execution from data access. You can write an MCP server for your Postgres DB or internal API once, and any MCP-compliant agent can securely inspect schemas and invoke functions without custom glue code.",
    tags: ["Anthropic", "JSON-RPC", "Tool Calling", "Interoperability"],
  },
  {
    id: "speculative-decoding",
    index: "03",
    title: "Speculative Decoding & Draft Models",
    category: "INFERENCE & SERVING",
    readTime: "80s read",
    summary:
      "Accelerating autoregressive token generation by verifying draft tokens in parallel on the target model.",
    explanation:
      "Autoregressive generation is memory-bandwidth bound: generating N tokens requires N forward passes through model weights. Speculative decoding uses a tiny, fast 'draft model' (or speculative heads like Medusa) to generate candidate tokens in rapid bursts. The large target model then runs a single forward pass over all candidate tokens simultaneously, accepting the prefix that matches its probability distribution.",
    takeaway:
      "Delivers a 2x to 3x reduction in latency with zero loss in output quality or mathematical distribution shift, fundamentally cutting GPU memory bandwidth bottlenecks in production inference.",
    tags: ["vLLM", "Speculative Heads", "Latency", "Memory Bandwidth"],
  },
  {
    id: "ragas-faithfulness",
    index: "04",
    title: "RAG Triad & Faithfulness Evals",
    category: "RAG & RETRIEVAL",
    readTime: "90s read",
    summary:
      "Deconstructing RAG quality into three quantifiable vectors: Context Relevance, Groundedness (Faithfulness), and Answer Relevance.",
    explanation:
      "Offline RAG benchmarks cannot rely on fuzzy human inspection. The RAG Triad standardizes evaluation into: (1) Context Precision (did retrieval return clean, noise-free chunks?), (2) Faithfulness (can every factual claim in the generated answer be directly inferred from the retrieved chunks?), and (3) Answer Relevance (does the answer address the original prompt without drift?). Frameworks like RAGAS execute automated LLM-as-a-judge scoring on these specific margins.",
    takeaway:
      "Never optimize RAG as a black box. If faithfulness drops, fix hallucination or prompt grounding. If answer relevance drops, inspect re-ranking and retrieval recall.",
    tags: ["RAGAS", "LLM-as-a-Judge", "Grounding", "Metrics"],
  },
  {
    id: "kv-cache-paged-attention",
    index: "05",
    title: "KV Cache & PagedAttention",
    category: "INFERENCE & SERVING",
    readTime: "85s read",
    summary:
      "Eliminating GPU VRAM fragmentation during multi-turn LLM serving through virtual memory paging.",
    explanation:
      "During autoregressive inference, Key and Value vectors for all past tokens must be preserved in GPU memory (the KV cache) to avoid recomputing self-attention. Naive systems allocate contiguous memory based on maximum sequence length, resulting in 60-80% memory waste from internal and external fragmentation. PagedAttention (popularized by vLLM) partitions the KV cache into fixed-size physical blocks managed via a lookup table, mirroring OS virtual memory.",
    takeaway:
      "Increases serving concurrency (concurrent batch size) by 2x to 4x on identical GPU hardware without degrading token generation speed or attention precision.",
    tags: ["vLLM", "PagedAttention", "VRAM", "Throughput"],
  },
  {
    id: "context-caching",
    index: "06",
    title: "Context Caching & Prompt Prefix Sharing",
    category: "INFERENCE & SERVING",
    readTime: "75s read",
    summary:
      "Reusing pre-computed KV cache states across requests that share long common system prompts or documents.",
    explanation:
      "When applications inject large system prompts, extensive API schemas, or multi-hundred-page PDF embeddings into every request, the model spends redundant compute running the prefill phase on identical tokens. Context caching stores the computed KV cache of static token prefixes in server memory or SSD. Subsequent requests matching the prefix bypass the prefill phase entirely.",
    takeaway:
      "Drastically reduces Time-to-First-Token (TTFT) and cuts token input costs by up to 50-75% when building multi-turn agents or document analysis tools.",
    tags: ["TTFT", "Prefix Caching", "Cost Optimization", "Prefill"],
  },
  {
    id: "grammar-constrained-decoding",
    index: "07",
    title: "Grammar-Constrained Decoding & Structured Outputs",
    category: "AGENTIC ARCHITECTURE",
    readTime: "80s read",
    summary:
      "Enforcing strict JSON Schema compliance at the token logit level during sampling, guaranteeing valid syntax.",
    explanation:
      "Prompting an LLM to 'respond only in JSON' fails under edge cases with missing quotes, trailing commas, or markdown wrapping. Constrained decoding compiles a JSON Schema or context-free grammar (CFG) into a Finite State Machine (FSM). At each step of generation, tokens that violate the grammar are masked with -inf in the logits before softmax, making invalid syntax mathematically impossible to sample.",
    takeaway:
      "Eliminates output parsing retries and Pydantic validation failures in agent pipelines. Shipped via tools like Outlines, Guidance, and native provider Structured Outputs APIs.",
    tags: ["Outlines", "JSON Schema", "Logit Masking", "Determinism"],
  },
  {
    id: "agent-routing-supervisors",
    index: "08",
    title: "Agent Routing & Supervisor Architectures",
    category: "AGENTIC ARCHITECTURE",
    readTime: "85s read",
    summary:
      "Replacing brittle autonomous agent swarms with deterministic state machines and hierarchical supervisor nodes.",
    explanation:
      "Free-form multi-agent loops often degrade into infinite conversation cycles and compounding error cascades. Modern production architectures (like LangGraph or statecharts) use a designated Supervisor node or intent classifier that acts as a router. The supervisor inspects incoming state, dispatches work to isolated specialized sub-agents with narrow tool sets, and validates their structured output before routing to the next step.",
    takeaway:
      "Keep agent execution graphs acyclic or bounded by deterministic checkpoint gates. Modularity and state validation beat open-ended autonomy every time.",
    tags: ["LangGraph", "State Machines", "Supervisors", "Robustness"],
  },
  {
    id: "guardrails-self-correction",
    index: "09",
    title: "Guardrails & Self-Correction Feedback Loops",
    category: "EVALS & SAFETY",
    readTime: "80s read",
    summary:
      "Active defensive layers that intercept inputs and outputs for PII, prompt injections, and factual ground truth.",
    explanation:
      "Guardrails operate as programmable policy filters wrapped around LLM invocation boundaries. An input guardrail sanitizes jailbreak patterns and PII before hitting model tokens. An output guardrail validates schema invariants, brand guidelines, and hallucinated entity citations. When a failure trigger trips, instead of throwing a generic 500, a corrective loop feeds the validation error back to the model with specific repair instructions.",
    takeaway:
      "Treat LLM outputs as untrusted user input. Pair deterministic regex/heuristic scanners for low-latency checks with fast SLM judges for semantic boundaries.",
    tags: ["NeMo Guardrails", "Security", "Self-Correction", "Defense"],
  },
  {
    id: "dpo-vs-rlhf",
    index: "10",
    title: "Direct Preference Optimization (DPO) vs. RLHF",
    category: "TRAINING & ALIGNMENT",
    readTime: "90s read",
    summary:
      "Aligning LLMs with human preferences directly on preference pairs without training an unstable reward model.",
    explanation:
      "Traditional Reinforcement Learning from Human Feedback (RLHF via PPO) requires training a separate reward model, sampling completions during training, and balancing fragile hyperparameter dynamics. DPO derives an analytical formulation that maps the reward function directly to the optimal policy. This allows direct optimization of the language model weights on binary (chosen vs. rejected) prompt completions using standard cross-entropy loss.",
    takeaway:
      "Significantly simpler, faster, and more numerically stable than PPO. DPO and its variants (KTO, ORPO) have become the default standard for open-weight post-training alignment.",
    tags: ["Alignment", "RLHF", "DPO", "Post-Training"],
  },
];

// Automated build-time and SSR dataset contract assertions
if (typeof window === "undefined") {
  const ids = new Set(aiConcepts.map((c) => c.id));
  if (ids.size !== 10 || aiConcepts.length !== 10) {
    throw new Error(`aiConcepts must have exactly 10 unique concepts, found ${aiConcepts.length}`);
  }
  const REQUIRED_CATEGORIES = [
    "AGENTIC ARCHITECTURE",
    "INFERENCE & SERVING",
    "RAG & RETRIEVAL",
    "EVALS & SAFETY",
    "TRAINING & ALIGNMENT",
  ] as const;
  for (const cat of REQUIRED_CATEGORIES) {
    if (!aiConcepts.some((c) => c.category === cat)) {
      throw new Error(`Missing required category: ${cat}`);
    }
  }
  for (let idx = 0; idx < aiConcepts.length; idx++) {
    const c = aiConcepts[idx];
    const expectedIndex = String(idx + 1).padStart(2, "0");
    if (c.index !== expectedIndex) {
      throw new Error(`Expected index ${expectedIndex} for concept ${c.id}, got ${c.index}`);
    }
    if (!c.id || !c.title || !c.summary || !c.explanation || !c.takeaway || !c.readTime) {
      throw new Error(`Concept ${c.id} is missing required text fields`);
    }
    if (!Array.isArray(c.tags) || c.tags.length === 0) {
      throw new Error(`Concept ${c.id} must have at least one tag`);
    }
  }
}

