import fs from 'fs';
import path from 'path';

console.log('============================================================');
console.log('RUNNING PHASE 1 STRATEGY DOCUMENTS & FACTUAL INTEGRITY VALIDATOR (UNIT B2)');
console.log('============================================================\n');

let totalChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`  ✗ FAIL: ${message}`);
    failedChecks++;
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
}

// 1. Check existence of all Phase 1 files
console.log('--- Step 1: Checking Required Phase 1 Documents ---');
const phase1Files = [
  'docs/research/2026-role-signals.md',
  'docs/portfolio/role-signal-matrix.md',
  'docs/portfolio/INITIAL-AUDIT.md',
  'docs/decisions/ADR-001-information-architecture-and-design-direction.md',
  '.agent/MASTER_STATE.md',
  '.agent/ROADMAP.md',
  '.agent/DECISIONS.md',
  '.agent/KNOWN_ISSUES.md',
  '.agent/EXPERIMENTS.md',
  '.agent/METRICS.md',
  '.agent/NEXT_ACTIONS.md',
  'qna.md',
  'docs/portfolio/project-scores.json',
  'research/evidence-ledger.json',
  'research/verified_job_signals.json'
];

for (const file of phase1Files) {
  assert(fs.existsSync(file), `Document exists: ${file}`);
}

if (failedChecks > 0) {
  throw new Error(`Prerequisite files missing. Stopping validation.`);
}

// Load authoritative data
const scoresData = JSON.parse(fs.readFileSync('docs/portfolio/project-scores.json', 'utf8'));
const ledgerData = JSON.parse(fs.readFileSync('research/evidence-ledger.json', 'utf8'));
const jobSignalsData = JSON.parse(fs.readFileSync('research/verified_job_signals.json', 'utf8'));
const validEvidenceIds = new Set(ledgerData.ledger.map(e => e.id));

// 1b. Dynamic Ledger Count Validation
console.log('\n--- Step 1b: Validating Evidence Ledger Exact Count ---');
assert(ledgerData.metadata && ledgerData.metadata.total_evidence_entries === 449, `evidence-ledger.json metadata total_evidence_entries is 449 (found ${ledgerData.metadata?.total_evidence_entries})`);
assert(ledgerData.ledger.length === 449, `evidence-ledger.json contains exactly 449 entries (found ${ledgerData.ledger.length})`);

const initialAuditContent = fs.readFileSync('docs/portfolio/INITIAL-AUDIT.md', 'utf8');
assert(/449 distinct evidence records/i.test(initialAuditContent), 'INITIAL-AUDIT.md cites exactly 449 distinct evidence records');
assert(!/\b446\b/i.test(initialAuditContent), 'INITIAL-AUDIT.md has no stale references to 446');

// 2. Strict check for stale scores in markdown files
console.log('\n--- Step 2: Validating Absence of Stale/Fabricated Scores ---');
const staleScorePatterns = [
  /\b94\.03\b/,
  /\b93\.82\b/,
  /\b93\.63\b/,
  /\b92\.90\b/,
  /\b92\.80\b/,
  /\b92\.52\b/,
  /\b85\.64\b/,
  /\b85\.34\b/,
  /\b85\.12\b/,
  /\b972\.0\b/,
  /\b921\.6\b/,
  /\b833\.1\b/,
  /\b822\.8\b/,
  /\b806\.4\b/,
  /\b630\.0\b/
];

const auditedDocFiles = [
  'docs/research/2026-role-signals.md',
  'docs/portfolio/role-signal-matrix.md',
  'docs/portfolio/INITIAL-AUDIT.md',
  'docs/decisions/ADR-001-information-architecture-and-design-direction.md',
  '.agent/MASTER_STATE.md',
  '.agent/ROADMAP.md',
  '.agent/DECISIONS.md',
  '.agent/KNOWN_ISSUES.md',
  '.agent/EXPERIMENTS.md',
  '.agent/METRICS.md',
  '.agent/NEXT_ACTIONS.md',
  'qna.md'
];

for (const f of auditedDocFiles) {
  const content = fs.readFileSync(f, 'utf8');
  for (const pat of staleScorePatterns) {
    const match = content.match(pat);
    assert(!match, `No stale score pattern ${pat} in ${f}`);
  }
}

// 3. Strict check for obsolete/fabricated technologies and claims
console.log('\n--- Step 3: Checking Absence of Obsolete & Fabricated Claims ---');
const forbiddenClaimPatterns = [
  { pat: /Next\.js 15|Next 15/i, label: 'Next.js 15 claim' },
  { pat: /\bSarama\b/i, label: 'Sarama Kafka client claim' },
  { pat: /\bTimescale\b|\bTimescaleDB\b/i, label: 'TimescaleDB claim' },
  { pat: /\bClickHouse\b/i, label: 'ClickHouse claim' },
  { pat: /60\+ (unit |automated )?tests/i, label: '60+ Sentinel tests claim' },
  { pat: /14 (repositories|repos).*active.*(workflows|ci)/i, label: '14 active CI repos claim' },
  { pat: /RAGAS evaluation.*in CI|RAGAS evaluation suites running as automated/i, label: 'RAGAS-as-executed in CI claim' },
  { pat: /hospital pilot deployed|Ex-IBM|Ex-HCL/i, label: 'Unverified IBM/HCL claims' },
  { pat: /top 1%|top-1%/i, label: 'Top-1% hype language' },
  { pat: /0 layout shifts|0ms CLS|zero dynamic client-side layout shifts/i, label: 'Build=0 CLS / Zero layout shifts claim' },
  { pat: /all repository audits confirmed that no production API keys/i, label: 'Fake security scan claim' },
  { pat: /rockstar|ninja|10x engineer|guru/i, label: 'Tech bro hype language' },
  { pat: /5\/5 test suites/i, label: '5/5 test suites claim (must be 1 Node test script with 5 checks)' },
  { pat: /SIH 2026 finalist|Smart India Hackathon 2026 finalist|SIH finalist/i, label: 'SIH finalist claim' },
  { pat: /100% original authorship/i, label: '100% original authorship claim' },
  { pat: /authentic repositories authored by/i, label: 'Authentic authored assertion' },
  { pat: /shipped production projects|shipped code/i, label: 'Unverified shipped/production claim' }
];

for (const f of auditedDocFiles) {
  const content = fs.readFileSync(f, 'utf8');
  for (const { pat, label } of forbiddenClaimPatterns) {
    const match = content.match(pat);
    assert(!match, `Absence of "${label}" in ${f}`);
  }
}

// 3b. Validate absence of Neo4j in GKP across docs
console.log('\n--- Step 3b: Validating GKP Architecture (No Neo4j) ---');
const gkpDocs = [
  'docs/portfolio/INITIAL-AUDIT.md',
  'docs/portfolio/role-signal-matrix.md',
  'docs/research/2026-role-signals.md'
];

for (const f of gkpDocs) {
  const content = fs.readFileSync(f, 'utf8');
  assert(!/grounded-knowledge-platform.*Neo4j|Neo4j.*grounded-knowledge-platform/i.test(content),
    `No Neo4j reference for grounded-knowledge-platform in ${f}`);
}

assert(/grounded-knowledge-platform.*pgvector/i.test(initialAuditContent),
  'INITIAL-AUDIT.md grounds grounded-knowledge-platform in PostgreSQL / pgvector');

// 3c. Validate strict test-source counts in INITIAL-AUDIT.md and role-signal-matrix.md
console.log('\n--- Step 3c: Validating Strict Test-Source Counts ---');
const strictTestCounts = [
  { name: 'schemeGPT', count: 20, old: 26 },
  { name: 'Sentinel', count: 7, old: 8 },
  { name: 'mcp-from-scratch', count: 5, old: 12 },
  { name: 'DevAtlas', count: 40, old: 66 },
  { name: 'CoverAI', count: 13, old: 16 },
  { name: 'grounded-knowledge-platform', count: 7, old: 9 },
  { name: 'tenant-api-platform', count: 33, old: 37 },
  { name: 'event-stream-platform', count: 16, old: 20 },
  { name: 'bustwatch', count: 6, old: 8 },
  { name: 'floodlens', count: 7, old: 10 },
  { name: 'OpenCode-Team', count: 0, old: 1 }
];

for (const { name, count } of strictTestCounts) {
  // Check row in table: | **name** | ... | count |
  const tableRegex = new RegExp(`\\*\\*${name}\\*\\*.*\\|\\s*${count}\\s*\\|`, 'i');
  assert(tableRegex.test(initialAuditContent), `INITIAL-AUDIT.md cites strict test count ${count} for ${name}`);
}

// Check role-signal-matrix.md testing row
const matrixContent = fs.readFileSync('docs/portfolio/role-signal-matrix.md', 'utf8');
assert(/40 test files in `DevAtlas`/i.test(matrixContent), 'role-signal-matrix.md cites 40 tests in DevAtlas');
assert(/20 test files in `schemeGPT`/i.test(matrixContent), 'role-signal-matrix.md cites 20 tests in schemeGPT');
assert(/5 in `mcp-from-scratch`/i.test(matrixContent), 'role-signal-matrix.md cites 5 tests in mcp-from-scratch');
assert(/7 in `Sentinel`/i.test(matrixContent), 'role-signal-matrix.md cites 7 tests in Sentinel');

// 4. Validate exact job posting URLs and signal frequencies in 2026-role-signals.md
console.log('\n--- Step 4: Validating Exact Job Posting Signals & Methodology ---');
const roleSignalsContent = fs.readFileSync('docs/research/2026-role-signals.md', 'utf8');

const requiredJobUrls = [
  'https://openai.com/careers/forward-deployed-engineer-(fde)-nyc-new-york-city/',
  'https://anthropic.com/careers/jobs/5057647008',
  'https://anthropic.com/careers/jobs/4985877008',
  'https://jobs.lever.co/palantir/1bb19522-3936-4adc-9ced-c3df8b5900b9',
  'https://databricks.com/company/careers/open-positions/job?gh_jid=8432827002',
  'https://databricks.com/company/careers/open-positions/job?gh_jid=8468436002',
  'https://vercel.com/careers/software-engineer-ai-sdk-5474915004',
  'https://vercel.com/careers/software-engineer-ai-gateway',
  'https://cursor.com/careers/software-engineer-product',
  'https://careers.google.com/jobs/results/104039023210570438-ai-engineer'
];

for (const url of requiredJobUrls) {
  assert(roleSignalsContent.includes(url), `Role signals cites exact posting URL: ${url}`);
}

// Ensure no bare landing page URLs exist as sources
const landingPagePatterns = [
  /https:\/\/openai\.com\/careers(?![^\s\)\]]+)/i,
  /https:\/\/anthropic\.com\/careers(?![^\s\)\]]+)/i,
  /https:\/\/www\.palantir\.com\/careers(?![^\s\)\]]+)/i,
  /https:\/\/stripe\.com\/jobs/i,
  /https:\/\/boards\.greenhouse\.io\/scaleai/i
];

for (const pat of landingPagePatterns) {
  assert(!pat.test(roleSignalsContent), `No bare landing page citation matching ${pat}`);
}

assert(/7.*tier-1.*organizations/i.test(roleSignalsContent) || /7 industry-defining organizations/i.test(roleSignalsContent),
  'Role signals reports 7 target organizations');
assert(/Denominator = 7/i.test(roleSignalsContent) || /Verified N=7/i.test(roleSignalsContent),
  'Role signals uses verified accessible denominator of 7');

// Check frequency table matches verified_job_signals.json
for (const item of jobSignalsData.frequency_summary) {
  const freqRowRegex = new RegExp(`${item.count}\\s*/\\s*${item.denominator}\\s*\\|\\s*${item.pct}`, 'i');
  assert(freqRowRegex.test(roleSignalsContent),
    `Role signals frequency table matches verified signal for "${item.signal}": ${item.count}/${item.denominator} (${item.pct})`);
}

// Check presence of Source-by-Signal Appendix Table
assert(/Source-by-Signal Appendix/i.test(roleSignalsContent), 'Role signals contains Source-by-Signal Appendix');
assert(/Anthropic.*5057647008.*VERIFIED/i.test(roleSignalsContent), 'Appendix records Anthropic 5057647008 as VERIFIED');
assert(/Anthropic.*4985877008.*NOT VERIFIED/i.test(roleSignalsContent), 'Appendix records Anthropic 4985877008 as NOT VERIFIED');
assert(/OpenAI.*fde-nyc.*NOT VERIFIED/i.test(roleSignalsContent), 'Appendix records OpenAI as NOT VERIFIED (HTTP 403)');
assert(/Google Cloud.*1040390232.*NOT VERIFIED/i.test(roleSignalsContent), 'Appendix records Google Cloud as NOT VERIFIED (SPA)');

// Check dumping of verified text files
for (const posting of jobSignalsData.postings) {
  if (posting.status === 'VERIFIED') {
    assert(fs.existsSync(posting.file), `Raw dump text file exists on disk: ${posting.file}`);
  }
}

// 5. Validate INITIAL-AUDIT.md mandated sections and contents
console.log('\n--- Step 5: Validating INITIAL-AUDIT.md Mandated Sections & Structure ---');
const mandatedSections = [
  'Current Portfolio Assessment',
  'GitHub Inventory Summary',
  'Strongest Existing Projects',
  'Weak Projects',
  'Flagship Ranking',
  'Role Coverage',
  'Missing Engineering Signals',
  'Recommended Conceptual Systems',
  'Portfolio Architecture Proposal',
  'Technical Debt',
  'Deployment State',
  'Security Concerns',
  'Immediate Priorities',
  'Roadmap'
];

for (const sec of mandatedSections) {
  assert(initialAuditContent.includes(sec), `INITIAL-AUDIT.md contains mandated section: "${sec}"`);
}

// Check separation of 47 metadata snapshots vs 27 deep records
assert(/47.*metadata.*snapshots/i.test(initialAuditContent) || /47.*snapshots.*27.*deep/i.test(initialAuditContent),
  'INITIAL-AUDIT.md distinguishes 47 metadata/tree snapshots from 27 deep evidence records');

// Check event-stream vs tenant-api tradeoff
assert(/event-stream.*tenant-api.*tradeoff/i.test(initialAuditContent) || /Tradeoff.*tenant-api.*event-stream/i.test(initialAuditContent),
  'INITIAL-AUDIT.md explicitly discusses event-stream-platform vs tenant-api-platform tradeoff');

// Check transparent 1-5 ConceptValue inputs
assert(/ConceptValue =/i.test(initialAuditContent), 'INITIAL-AUDIT.md specifies ConceptValue formula');
assert(/\(1-5\)/i.test(initialAuditContent), 'INITIAL-AUDIT.md specifies transparent 1-5 input scale for ConceptValue');
assert(/FUTURE \/ UNBUILT/i.test(initialAuditContent), 'INITIAL-AUDIT.md explicitly labels conceptual systems as FUTURE / UNBUILT');

// 6. Validate role-signal-matrix.md 35-capability coverage
console.log('\n--- Step 6: Validating 35 MASTER Mission Capabilities in role-signal-matrix.md ---');
const masterCapabilities = [
  'Algorithms',
  'API',
  'Backend',
  'DB / SQL / Postgres',
  'Caching',
  'Queues',
  'Async',
  'Concurrency',
  'Distributed Systems',
  'System Design',
  'Scale',
  'Fault Tolerance',
  'Observability / Logging / Metrics / Tracing',
  'Testing',
  'CI/CD',
  'Containers / Cloud',
  'Security / Auth',
  'Performance',
  'Frontend / A11y / Responsive / State',
  'AI APIs / LLM',
  'RAG / Embeddings',
  'Evals',
  'Agents',
  'Tools (Tool Calling / MCP)',
  'Structured Output',
  'Prompts',
  'Routing',
  'Safety (Guardrails / Defenses)',
  'ML Observability',
  'Data Pipelines',
  'Dev Tooling',
  'Git',
  'Docs',
  'Product Judgment',
  'Independent Execution'
];

for (const cap of masterCapabilities) {
  assert(matrixContent.includes(cap), `Role matrix covers MASTER mission capability: "${cap}"`);
}

// Check for UNKNOWN execution ratings
assert(/UNKNOWN/i.test(matrixContent), 'Role matrix contains explicit UNKNOWN execution ratings where runtime execution is absent');

// Check evidence IDs cited in role matrix
const citedEvidenceMatches = matrixContent.match(/EV-[A-Z0-9_-]+/g) || [];
assert(citedEvidenceMatches.length >= 35, `Role matrix cites substantial evidence IDs (found ${citedEvidenceMatches.length})`);

let invalidMatrixEvidenceCount = 0;
for (const eid of citedEvidenceMatches) {
  if (!validEvidenceIds.has(eid)) {
    invalidMatrixEvidenceCount++;
    console.error(`  ✗ Invalid Evidence ID in role matrix: ${eid}`);
  }
}
assert(invalidMatrixEvidenceCount === 0, 'All Evidence IDs cited in role-signal-matrix.md exist in evidence-ledger.json');

// 7. Validate ADR-001 three IAs and persona reviews
console.log('\n--- Step 7: Validating ADR-001 Structure & Review Rigor ---');
const adrContent = fs.readFileSync('docs/decisions/ADR-001-information-architecture-and-design-direction.md', 'utf8');

assert(adrContent.includes('Direction A'), 'ADR-001 includes Direction A');
assert(adrContent.includes('Direction B'), 'ADR-001 includes Direction B');
assert(adrContent.includes('Direction C'), 'ADR-001 includes Direction C');
assert(/Recruiter Review/i.test(adrContent), 'ADR-001 includes Recruiter Review');
assert(/Staff.*Engineer Review/i.test(adrContent), 'ADR-001 includes Staff Engineer Review');
assert(/Designer Review/i.test(adrContent), 'ADR-001 includes Designer Review');
assert(/Decision & Rationale/i.test(adrContent), 'ADR-001 includes Decision & Rationale');

// 8. Validate qna.md protocol
console.log('\n--- Step 8: Validating qna.md Non-Internet Protocol ---');
const qnaContent = fs.readFileSync('qna.md', 'utf8');

assert(/Blocking Questions \(0[–-]3\)/i.test(qnaContent), 'qna.md contains Blocking Questions section');
assert(/None \(0\)/i.test(qnaContent), 'qna.md reports zero blocking questions');
assert(!/flagship/i.test(qnaContent.split('## Non-Internet')[1] || ''), 'qna.md does not ask about ordinary engineering flagship choices');

// 9. Validate Phase 1 status across .agent files
console.log('\n--- Step 9: Validating Phase 1 VERIFIED-PARTIAL Status in .agent/ ---');
const masterStateContent = fs.readFileSync('.agent/MASTER_STATE.md', 'utf8');
const nextActionsContent = fs.readFileSync('.agent/NEXT_ACTIONS.md', 'utf8');

assert(/VERIFIED-PARTIAL|DRAFT/i.test(masterStateContent), 'MASTER_STATE.md marks Phase 1 as VERIFIED-PARTIAL / DRAFT');
assert(/VERIFIED-PARTIAL|DRAFT/i.test(nextActionsContent), 'NEXT_ACTIONS.md marks Phase 1 as VERIFIED-PARTIAL / DRAFT');
assert(/Unresolved Execution/i.test(masterStateContent), 'MASTER_STATE.md records unresolved execution/security/live checks');

// 10. Check consistency with project-scores.json
console.log('\n--- Step 10: Validating Consistency with project-scores.json ---');
const metricsContent = fs.readFileSync('.agent/METRICS.md', 'utf8');

const topScore = scoresData.rankings[0];
assert(metricsContent.includes(topScore.total_score.toString()), `METRICS.md cites top score ${topScore.total_score}`);
assert(initialAuditContent.includes(topScore.total_score.toString()), `INITIAL-AUDIT.md cites top score ${topScore.total_score}`);

const sentinelScore = scoresData.rankings.find(r => r.name === 'Sentinel');
assert(initialAuditContent.includes(sentinelScore.total_score.toString()), `INITIAL-AUDIT.md cites Sentinel score ${sentinelScore.total_score}`);
assert(metricsContent.includes(sentinelScore.total_score.toString()), `METRICS.md cites Sentinel score ${sentinelScore.total_score}`);

console.log('\n============================================================');
if (failedChecks > 0) {
  console.error(`VALIDATION FAILED: ${failedChecks} checks failed out of ${totalChecks}`);
  process.exit(1);
} else {
  console.log(`ALL ${totalChecks} STRATEGY DOCUMENT VALIDATION CHECKS PASSED!`);
  console.log('============================================================\n');
  process.exit(0);
}
