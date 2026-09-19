import fs from 'fs';

const postings = [
  {
    id: 'anthropic-5057647008',
    org: 'Anthropic',
    role: 'Applied AI Engineer, Enterprise Tech',
    url: 'https://anthropic.com/careers/jobs/5057647008',
    file: 'research/job_dumps/clean_anthropic_5057647008.txt',
    status: 'VERIFIED',
    python: 'YES', // "proficiency in Python or TypeScript"
    typescript: 'YES', // "proficiency in Python or TypeScript"
    python_or_ts: 'YES',
    distributed_cloud_apis: 'YES', // "Claude API", "deployment at scale"
    llm_orchestration_prompting: 'YES', // "advanced prompt engineering, agent development"
    eval_frameworks_testing: 'YES', // "developing evaluation frameworks", "evaluation suites"
    tool_calling_mcp: 'YES', // "MCP"
    gateway_routing_caching: 'NOT STATED',
    forward_deployed_client: 'YES', // "technical advisor to Enterprise Technology companies", "technical discovery through successful deployment", "Forward Deployed Engineer"
    streaming_observability_latency: 'NOT STATED'
  },
  {
    id: 'anthropic-4985877008',
    org: 'Anthropic',
    role: 'Forward Deployed Engineer',
    url: 'https://anthropic.com/careers/jobs/4985877008',
    file: null,
    status: 'NOT VERIFIED (Delisted / redirected to error)',
    python: 'NOT VERIFIED',
    typescript: 'NOT VERIFIED',
    python_or_ts: 'NOT VERIFIED',
    distributed_cloud_apis: 'NOT VERIFIED',
    llm_orchestration_prompting: 'NOT VERIFIED',
    eval_frameworks_testing: 'NOT VERIFIED',
    tool_calling_mcp: 'NOT VERIFIED',
    gateway_routing_caching: 'NOT VERIFIED',
    forward_deployed_client: 'NOT VERIFIED',
    streaming_observability_latency: 'NOT VERIFIED'
  },
  {
    id: 'openai-fde-nyc',
    org: 'OpenAI',
    role: 'Forward Deployed Engineer (FDE), NYC',
    url: 'https://openai.com/careers/forward-deployed-engineer-(fde)-nyc-new-york-city/',
    file: null,
    status: 'NOT VERIFIED (HTTP 403 Cloudflare bot protection)',
    python: 'NOT VERIFIED',
    typescript: 'NOT VERIFIED',
    python_or_ts: 'NOT VERIFIED',
    distributed_cloud_apis: 'NOT VERIFIED',
    llm_orchestration_prompting: 'NOT VERIFIED',
    eval_frameworks_testing: 'NOT VERIFIED',
    tool_calling_mcp: 'NOT VERIFIED',
    gateway_routing_caching: 'NOT VERIFIED',
    forward_deployed_client: 'NOT VERIFIED',
    streaming_observability_latency: 'NOT VERIFIED'
  },
  {
    id: 'palantir-1bb19522',
    org: 'Palantir',
    role: 'Forward Deployed Software Engineer (FDSE)',
    url: 'https://jobs.lever.co/palantir/1bb19522-3936-4adc-9ced-c3df8b5900b9',
    file: 'research/job_dumps/clean_palantir_1bb19522.txt',
    status: 'VERIFIED',
    python: 'NOT STATED',
    typescript: 'NOT STATED',
    python_or_ts: 'NOT STATED',
    distributed_cloud_apis: 'YES', // "cloud infrastructure", "storage systems", "massive-scale data"
    llm_orchestration_prompting: 'YES', // "solutions that leverage business-critical data and the latest advancements in AI"
    eval_frameworks_testing: 'NOT STATED',
    tool_calling_mcp: 'NOT STATED',
    gateway_routing_caching: 'NOT STATED',
    forward_deployed_client: 'YES', // "Forward Deployed Software Engineer", "embedding talented engineers directly with our customers"
    streaming_observability_latency: 'NOT STATED'
  },
  {
    id: 'databricks-8432827002',
    org: 'Databricks',
    role: 'Forward Deployed Engineer (FDE)',
    url: 'https://databricks.com/company/careers/open-positions/job?gh_jid=8432827002',
    file: 'research/job_dumps/clean_databricks_8432827002.txt',
    status: 'VERIFIED',
    python: 'YES', // "Comfortable writing code in either Python, Scala, JavaScript/TypeScript"
    typescript: 'YES', // "JavaScript/TypeScript"
    python_or_ts: 'YES',
    distributed_cloud_apis: 'YES', // "distributed computing with Apache Spark", "Cloud ecosystems (AWS, Azure, GCP)"
    llm_orchestration_prompting: 'YES', // "ML/AI models and AI APIs", "data ingestion and ML/AI model integration"
    eval_frameworks_testing: 'YES', // "CI/CD for production deployments", "measurable outcomes"
    tool_calling_mcp: 'NOT STATED',
    gateway_routing_caching: 'NOT STATED',
    forward_deployed_client: 'YES', // "Forward Deployed Engineer", "Customer Immersion: Embed with customer teams"
    streaming_observability_latency: 'YES' // "batch and streaming data", "performant production"
  },
  {
    id: 'databricks-8468436002',
    org: 'Databricks',
    role: 'Staff Backend Software Engineer, Unity AI Gateway',
    url: 'https://databricks.com/company/careers/open-positions/job?gh_jid=8468436002',
    file: 'research/job_dumps/clean_databricks_8468436002.txt',
    status: 'VERIFIED',
    python: 'NOT STATED', // requires "Scala, or Go"
    typescript: 'NOT STATED',
    python_or_ts: 'NO (Requires Scala or Go)',
    distributed_cloud_apis: 'YES', // "distributed systems, high-throughput APIs, or cloud-native infrastructure"
    llm_orchestration_prompting: 'YES', // "control plane that every AI request at Databricks passes through: partner and self-hosted models, agents"
    eval_frameworks_testing: 'YES', // "deployment pipelines, and system observability"
    tool_calling_mcp: 'YES', // "MCP servers"
    gateway_routing_caching: 'YES', // "Unity AI Gateway", "routing layer that picks the right model... quality, cost, latency, availability, and remaining budget"
    forward_deployed_client: 'NOT STATED',
    streaming_observability_latency: 'YES' // "Improve reliability, latency, and efficiency", "system observability", "real-time serving"
  },
  {
    id: 'vercel-5474915004',
    org: 'Vercel',
    role: 'Software Engineer, AI SDK',
    url: 'https://vercel.com/careers/software-engineer-ai-sdk-5474915004',
    file: 'research/job_dumps/clean_vercel_5474915004.txt',
    status: 'VERIFIED',
    python: 'NOT STATED',
    typescript: 'YES', // "Strong proficiency in JavaScript/TypeScript"
    python_or_ts: 'YES',
    distributed_cloud_apis: 'YES', // "integrates seamlessly with our deployment platform"
    llm_orchestration_prompting: 'YES', // "toolkit for building AI-native products and agents"
    eval_frameworks_testing: 'YES', // "Conduct comprehensive testing to ensure the reliability and stability of the SDK"
    tool_calling_mcp: 'YES', // "toolkit for building AI-native products and agents"
    gateway_routing_caching: 'NOT STATED',
    forward_deployed_client: 'NOT STATED',
    streaming_observability_latency: 'YES' // "meets high-performance standards", "low-latency"
  },
  {
    id: 'vercel-ai-gateway',
    org: 'Vercel',
    role: 'Software Engineer, AI Gateway',
    url: 'https://vercel.com/careers/software-engineer-ai-gateway',
    file: 'research/job_dumps/clean_vercel_gateway.txt',
    status: 'VERIFIED',
    python: 'NOT STATED',
    typescript: 'YES', // "Strong proficiency in JavaScript/TypeScript"
    python_or_ts: 'YES',
    distributed_cloud_apis: 'YES', // "backend development, APIs, and cloud infrastructure", "distributed systems"
    llm_orchestration_prompting: 'YES', // "unified API for accessing hundreds of AI models from multiple providers"
    eval_frameworks_testing: 'YES', // "thorough testing to ensure low-latency responses and stability"
    tool_calling_mcp: 'NOT STATED',
    gateway_routing_caching: 'YES', // "AI Gateway platform", "rate limiting, intelligent failovers", "automatic fallbacks during outages", "caching, failovers"
    forward_deployed_client: 'NOT STATED',
    streaming_observability_latency: 'YES' // "low-latency systems", "analytics for usage insights"
  },
  {
    id: 'cursor-swe-product',
    org: 'Cursor (Anysphere)',
    role: 'Software Engineer, Product',
    url: 'https://cursor.com/careers/software-engineer-product',
    file: 'research/job_dumps/clean_cursor_product.txt',
    status: 'VERIFIED',
    python: 'NOT STATED',
    typescript: 'NOT STATED',
    python_or_ts: 'NOT STATED',
    distributed_cloud_apis: 'YES', // "editor", "shipping code", "cloud"
    llm_orchestration_prompting: 'YES', // "taste for models", "PRs of AI-generated code", "sub-agents, memories"
    eval_frameworks_testing: 'YES', // "Running experiments and A/B tests on millions of users to push the frontier of agent quality"
    tool_calling_mcp: 'YES', // "sub-agents, memories, and PR retrieval", "AI bug detection"
    gateway_routing_caching: 'NOT STATED',
    forward_deployed_client: 'NOT STATED',
    streaming_observability_latency: 'NOT STATED'
  },
  {
    id: 'google-104039023210570438',
    org: 'Google Cloud',
    role: 'AI Engineer, Google Cloud',
    url: 'https://careers.google.com/jobs/results/104039023210570438-ai-engineer',
    file: null,
    status: 'NOT VERIFIED (Client-side JS SPA; text inaccessible in static fetch)',
    python: 'NOT VERIFIED',
    typescript: 'NOT VERIFIED',
    python_or_ts: 'NOT VERIFIED',
    distributed_cloud_apis: 'NOT VERIFIED',
    llm_orchestration_prompting: 'NOT VERIFIED',
    eval_frameworks_testing: 'NOT VERIFIED',
    tool_calling_mcp: 'NOT VERIFIED',
    gateway_routing_caching: 'NOT VERIFIED',
    forward_deployed_client: 'NOT VERIFIED',
    streaming_observability_latency: 'NOT VERIFIED'
  }
];

// Verify that text files actually exist for VERIFIED ones
for (const p of postings) {
  if (p.file) {
    const content = fs.readFileSync(p.file, 'utf8');
    p.captured_bytes = content.length;
  }
}

const verifiedPostings = postings.filter(p => p.status === 'VERIFIED');
const denominator = verifiedPostings.length;

console.log('Total Postings Audited:', postings.length);
console.log('Verified Accessible Postings (Denominator):', denominator);

const signals = [
  { key: 'python_or_ts', label: 'Python or TypeScript Specified' },
  { key: 'python', label: 'Python Explicitly Specified' },
  { key: 'typescript', label: 'TypeScript/JavaScript Explicitly Specified' },
  { key: 'distributed_cloud_apis', label: 'Distributed Systems, APIs & Cloud Services' },
  { key: 'llm_orchestration_prompting', label: 'Production LLM Orchestration & Prompting' },
  { key: 'eval_frameworks_testing', label: 'Evaluation Frameworks, CI & Testing' },
  { key: 'tool_calling_mcp', label: 'Tool Calling, Protocols & MCP Standards' },
  { key: 'gateway_routing_caching', label: 'Model Gateways, Routing, Caching & Failovers' },
  { key: 'forward_deployed_client', label: 'Forward Deployed Client Immersion & Field Delivery' },
  { key: 'streaming_observability_latency', label: 'Real-Time Streaming, Observability & Low Latency' }
];

console.log('\n--- COMPUTED FREQUENCIES (Denominator = ' + denominator + ') ---');
const summary = [];
for (const s of signals) {
  const count = verifiedPostings.filter(p => p[s.key] === 'YES').length;
  const pct = Math.round((count / denominator) * 100);
  summary.push({ signal: s.label, count, denominator, pct: pct + '%' });
  console.log(`${s.label}: ${count} / ${denominator} (${pct}%)`);
}

fs.writeFileSync('research/verified_job_signals.json', JSON.stringify({
  metadata: {
    total_postings: postings.length,
    total_organizations: 7,
    verified_accessible_postings: denominator,
    verified_organizations: new Set(verifiedPostings.map(p => p.org)).size,
    audit_date: '2026-09-19'
  },
  postings,
  frequency_summary: summary
}, null, 2));

console.log('\nWrote research/verified_job_signals.json');
