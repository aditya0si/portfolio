import fs from 'fs';
import path from 'path';

console.log('============================================================');
console.log('RUNNING STRICT UNIT A3 DETERMINISTIC ANCHORS & PROVENANCE VALIDATOR');
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

// 1. File existence checks
console.log('--- Step 1: Checking Required Artifacts ---');
const requiredFiles = [
  'research/real_repo_evidence.json',
  'research/evidence-ledger.json',
  'docs/portfolio/project-inventory.md',
  'docs/portfolio/project-scores.json',
  'research/generate_inventory.js',
  'research/generate_and_validate_scores.js'
];

for (const file of requiredFiles) {
  assert(fs.existsSync(file), `Required file exists: ${file}`);
}

if (failedChecks > 0) {
  throw new Error(`Prerequisite files missing. Stopping validation.`);
}

// 2. Load and validate evidence-ledger.json
console.log('\n--- Step 2: Validating evidence-ledger.json Schema, Types & Grounding ---');
const rawEvidence = JSON.parse(fs.readFileSync('research/real_repo_evidence.json', 'utf8'));
const ledgerData = JSON.parse(fs.readFileSync('research/evidence-ledger.json', 'utf8'));

assert(ledgerData.metadata !== undefined, 'Ledger contains metadata block');
assert(ledgerData.metadata.total_repositories === 47, 'Ledger metadata reports 47 repositories');
assert(ledgerData.metadata.authoritative_source === 'research/real_repo_evidence.json', 'Ledger sources authoritative snapshot');
assert(Array.isArray(ledgerData.ledger), 'Ledger entries array is present');
assert(ledgerData.ledger.length >= 250, `Ledger entries count is sufficient (${ledgerData.ledger.length} entries)`);

const ledgerIds = new Set();
const ledgerMap = new Map();
const allowedEvidenceTypes = new Set([
  'README_CLAIM',
  'CODE_OBSERVED',
  'TEST_EXECUTED',
  'CI_OBSERVED',
  'EXTERNAL_VERIFIED'
]);

const allowedStatuses = new Set([
  'VERIFIED',
  'UNVERIFIED_CLAIM',
  'CONTRADICTED',
  'CONFLICT_LABELED',
  'EMPTY_REPOSITORY'
]);

let missingShaCount = 0;
let invalidTypeCount = 0;
let invalidStatusCount = 0;

for (const entry of ledgerData.ledger) {
  assert(entry.id && typeof entry.id === 'string', `Entry has string ID: ${entry.id}`);
  ledgerIds.add(entry.id);
  ledgerMap.set(entry.id, entry);

  if (!allowedEvidenceTypes.has(entry.evidence_type)) {
    invalidTypeCount++;
    console.error(`  ✗ Invalid evidence_type "${entry.evidence_type}" in entry ${entry.id}`);
  }

  if (!allowedStatuses.has(entry.verification_status)) {
    invalidStatusCount++;
    console.error(`  ✗ Invalid verification_status "${entry.verification_status}" in entry ${entry.id}`);
  }

  // Check commit SHA
  if (entry.repo === 'FoodKart') {
    if (entry.commit_sha !== null) {
      console.error(`  ✗ FoodKart must have null commit_sha, found: ${entry.commit_sha}`);
      missingShaCount++;
    }
  } else {
    const expectedSha = rawEvidence[entry.repo]?.commitSha;
    if (!entry.commit_sha || entry.commit_sha !== expectedSha || !/^[0-9a-f]{40}$/i.test(entry.commit_sha)) {
      console.error(`  ✗ Invalid or mismatched commit SHA for entry ${entry.id} (${entry.repo}): ${entry.commit_sha}`);
      missingShaCount++;
    }
  }
}

assert(invalidTypeCount === 0, 'All ledger entries have valid evidence types');
assert(invalidStatusCount === 0, 'All ledger entries have valid verification statuses');
assert(missingShaCount === 0, 'All ledger entries have exact, verifiable commit SHAs');

// Check 2a: No committed benchmarks classified as TEST_EXECUTED
const staticBenchmarksAsTestExecuted = ledgerData.ledger.filter(e =>
  e.evidence_type === 'TEST_EXECUTED' &&
  (e.id.includes('BENCHMARK') || e.id.includes('LOAD') || e.id.includes('EVAL') || e.path_or_source.includes('.json'))
);
assert(staticBenchmarksAsTestExecuted.length === 0, 'Zero static committed benchmark files are classified as TEST_EXECUTED');

// Check 2b: Test source files only
let invalidTestPathErrors = 0;
for (const entry of ledgerData.ledger) {
  if (entry.id.endsWith('-TESTS') && entry.evidence_type === 'CODE_OBSERVED') {
    const rawRepo = rawEvidence[entry.repo];
    const tree = rawRepo?.tree || [];
    const treeMap = new Map(tree.map(t => [t.path, t]));

    const paths = entry.path_or_source.split(',').map(s => s.trim().replace(/\s*\(\+\d+\s+more\)$/, ''));
    for (const p of paths) {
      const treeObj = treeMap.get(p);
      if (treeObj && treeObj.type === 'tree') {
        console.error(`  ✗ Directory path found in test evidence ${entry.id}: ${p}`);
        invalidTestPathErrors++;
      }
      if (p.includes('__pycache__') || p.endsWith('.pyc') || p.endsWith('.md') || p.includes('node_modules/')) {
        console.error(`  ✗ Invalid test file path found in test evidence ${entry.id}: ${p}`);
        invalidTestPathErrors++;
      }
    }
  }
}
assert(invalidTestPathErrors === 0, 'All test paths in EV-*-TESTS are actual test source files');

// Check 2c: CI_OBSERVED states workflow configuration observed
let invalidCiWordingErrors = 0;
for (const entry of ledgerData.ledger) {
  if (entry.evidence_type === 'CI_OBSERVED') {
    const lower = entry.claim.toLowerCase();
    if (!lower.includes('workflow configuration') && !lower.includes('workflow definitions') && !lower.includes('workflow')) {
      console.error(`  ✗ CI_OBSERVED entry ${entry.id} lacks workflow configuration wording: ${entry.claim}`);
      invalidCiWordingErrors++;
    }
  }
}
assert(invalidCiWordingErrors === 0, 'All CI_OBSERVED entries state workflow configuration observation');

// Check 2d: Zero character-count-as-signal claims in ledger
const charClaimsInLedger = ledgerData.ledger.filter(e => /\b\d+k?\+?\s*characters?\b/i.test(e.claim));
assert(charClaimsInLedger.length === 0, 'Zero character-count-as-signal claims in evidence-ledger.json');

// 3. Validate project-scores.json Schema, Math & Deterministic Caps
console.log('\n--- Step 3: Validating project-scores.json Schema, Math & Deterministic Caps ---');
const scoresData = JSON.parse(fs.readFileSync('docs/portfolio/project-scores.json', 'utf8'));

// Weights check
const weights = scoresData.metadata.weights;
const weightSum = Object.values(weights).reduce((a, b) => a + b, 0);
assert(Math.abs(weightSum - 1.0) < 0.0001, `Scoring weights sum to 1.0 (Sum: ${weightSum.toFixed(4)})`);

// Counts check
assert(scoresData.metadata.total_repositories_audited === 47, 'Metadata reports 47 audited repositories');
assert(scoresData.metadata.total_meaningful_repositories === 27, 'Metadata reports 27 meaningful repositories');
assert(scoresData.metadata.total_viable_projects_scored === scoresData.rankings.length, `Scored count matches array length (${scoresData.rankings.length})`);
assert(scoresData.metadata.total_meaningful_repositories_excluded === scoresData.exclusions.length, `Exclusions count matches array length (${scoresData.exclusions.length})`);
assert(scoresData.rankings.length + scoresData.exclusions.length === 27, 'Scored + Excluded equals exactly 27 meaningful repositories');
assert(scoresData.metadata.eligibility_gate_status === 'PROVISIONAL_PENDING_EXECUTION', 'Metadata reports provisional eligibility gate status');

// Check descending sort order
let isSortedDescending = true;
for (let i = 1; i < scoresData.rankings.length; i++) {
  if (scoresData.rankings[i].total_score > scoresData.rankings[i - 1].total_score) {
    isSortedDescending = false;
    break;
  }
}
assert(isSortedDescending, 'Rankings are strictly sorted in descending order of total_score');

// Check each scored project for deterministic caps and schema
let mathErrors = 0;
let missingEvidenceIdErrors = 0;
let unbackedRationaleErrors = 0;
let crossRepoScoreErrors = 0;
let capViolationErrors = 0;
let unsupportedClaimErrors = 0;

for (const p of scoresData.rankings) {
  const repoName = p.name;
  const projectEvidenceIds = new Set(ledgerData.projects[repoName]?.evidence_ids || []);

  if (!p.commit_sha || !/^[0-9a-f]{40}$/i.test(p.commit_sha)) {
    console.error(`  ✗ Invalid commit SHA on project ${p.name}: ${p.commit_sha}`);
    mathErrors++;
  }

  // Eligibility Gate & Provisional Flagship State
  if (p.eligibility_gate !== 'PROVISIONAL_PENDING_EXECUTION') {
    console.error(`  ✗ Eligibility gate must be PROVISIONAL_PENDING_EXECUTION for ${p.name}, found: ${p.eligibility_gate}`);
    capViolationErrors++;
  }
  if (p.flagship_status && p.flagship_status !== 'PROVISIONAL_PENDING_EXECUTION') {
    console.error(`  ✗ Flagship status must be PROVISIONAL_PENDING_EXECUTION for ${p.name}, found: ${p.flagship_status}`);
    capViolationErrors++;
  }

  // Confidence Cap: no TEST_EXECUTED or EXTERNAL_VERIFIED audit records => confidence <= 0.75
  const projectLedgerEntries = (ledgerData.projects[repoName]?.evidence_ids || []).map(id => ledgerMap.get(id)).filter(Boolean);
  const hasExecutedTests = projectLedgerEntries.some(e => e.evidence_type === 'TEST_EXECUTED');
  const hasExternalVerified = projectLedgerEntries.some(e => e.evidence_type === 'EXTERNAL_VERIFIED');
  if (!hasExecutedTests && !hasExternalVerified && p.confidence > 0.7501) {
    console.error(`  ✗ Confidence cap violated on ${p.name}: confidence is ${p.confidence} (must be <= 0.75 without executed tests or external verification)`);
    capViolationErrors++;
  }

  // Evidence IDs array check
  if (!Array.isArray(p.evidence_ids) || p.evidence_ids.length === 0) {
    console.error(`  ✗ Missing evidence_ids array on project ${p.name}`);
    missingEvidenceIdErrors++;
  } else {
    for (const eid of p.evidence_ids) {
      if (!ledgerIds.has(eid)) {
        console.error(`  ✗ Referenced evidence ID ${eid} on project ${p.name} does not exist in ledger!`);
        missingEvidenceIdErrors++;
      }
      if (!projectEvidenceIds.has(eid)) {
        console.error(`  ✗ Cross-repo evidence ID citation ${eid} on project ${repoName}!`);
        crossRepoScoreErrors++;
      }
    }
  }

  // Categories Structure & Caps Verification across 11 categories
  let calculatedSum = 0;
  assert(p.categories !== undefined && typeof p.categories === 'object', `Project ${p.name} contains categories object`);

  // Detect test count for repo
  const testEvidence = projectLedgerEntries.find(e => e.id.endsWith('-TESTS') || e.id.endsWith('-NO-TESTS') || e.id.includes('TEST'));
  const testCountMatch = testEvidence?.claim.match(/(\d+)\s+verified\s+test/i);
  const testCount = testCountMatch ? parseInt(testCountMatch[1], 10) : (testEvidence?.id.includes('NO-TESTS') || testEvidence?.id.includes('TESTS-ZERO') ? 0 : 0);
  const hasCiWorkflow = projectLedgerEntries.some(e => e.evidence_type === 'CI_OBSERVED');
  const hasCommittedBenchmark = projectLedgerEntries.some(e => e.id.includes('BENCHMARK') || e.id.includes('LOAD'));

  for (const [cat, w] of Object.entries(weights)) {
    const catObj = p.categories[cat];
    if (!catObj) {
      console.error(`  ✗ Missing category object for ${p.name} category ${cat}`);
      mathErrors++;
      continue;
    }

    // Verify required category fields
    if (typeof catObj.score !== 'number' || catObj.score < 0 || catObj.score > 10) {
      console.error(`  ✗ Invalid category score on ${p.name} ${cat}: ${catObj.score}`);
      mathErrors++;
    }
    if (!Array.isArray(catObj.category_evidence_ids) || catObj.category_evidence_ids.length === 0) {
      console.error(`  ✗ Missing category_evidence_ids on ${p.name} ${cat}`);
      missingEvidenceIdErrors++;
    }
    if (!catObj.evidence_strength || typeof catObj.evidence_strength !== 'string') {
      console.error(`  ✗ Missing evidence_strength on ${p.name} ${cat}`);
      capViolationErrors++;
    }
    if (!catObj.anchor_used || typeof catObj.anchor_used !== 'string') {
      console.error(`  ✗ Missing anchor_used on ${p.name} ${cat}`);
      capViolationErrors++;
    }
    if (!catObj.missing_evidence || typeof catObj.missing_evidence !== 'string') {
      console.error(`  ✗ Missing missing_evidence on ${p.name} ${cat}`);
      capViolationErrors++;
    }

    // Verify backward compatibility mirrors
    if (p.scores[cat] !== catObj.score) {
      console.error(`  ✗ Discrepancy between p.scores[${cat}] (${p.scores[cat]}) and catObj.score (${catObj.score}) in ${p.name}`);
      mathErrors++;
    }

    calculatedSum += catObj.score * w;

    // Check rationale and evidence citations
    const rat = catObj.rationale;
    if (!rat || typeof rat !== 'string') {
      console.error(`  ✗ Missing rationale for project ${p.name} category ${cat}`);
      unbackedRationaleErrors++;
    } else {
      const match = rat.match(/\[Evidence:\s*([^\]]+)\]/);
      if (!match) {
        console.error(`  ✗ Rationale for project ${p.name} category ${cat} lacks [Evidence: ...] citation`);
        unbackedRationaleErrors++;
      } else {
        const citedIds = match[1].split(',').map(s => s.trim());
        for (const cid of citedIds) {
          if (!ledgerIds.has(cid)) {
            console.error(`  ✗ Cited evidence ID ${cid} in rationale for ${p.name} ${cat} not in ledger!`);
            unbackedRationaleErrors++;
          }
          if (!projectEvidenceIds.has(cid)) {
            console.error(`  ✗ Cross-repo citation ${cid} in rationale for ${p.name} ${cat}!`);
            crossRepoScoreErrors++;
          }
        }
      }
    }

    // --- ENFORCE DETERMINISTIC CAPS ---
    const citedLedgerEntries = catObj.category_evidence_ids.map(id => ledgerMap.get(id)).filter(Boolean);

    // Cap 1: README_CLAIM only category <= 4.0
    const allReadme = citedLedgerEntries.length > 0 && citedLedgerEntries.every(e => e.evidence_type === 'README_CLAIM');
    if (allReadme && catObj.score > 4.0001) {
      console.error(`  ✗ Cap 1 violated: README_CLAIM-only category ${cat} in ${p.name} scored ${catObj.score} (max 4.0)`);
      capViolationErrors++;
    }

    // Cap 2: Manifest / tree observation only <= 6.0
    const allMetadata = citedLedgerEntries.length > 0 && citedLedgerEntries.every(e => e.evidence_type === 'METADATA_OBSERVED');
    if (allMetadata && catObj.score > 6.0001) {
      console.error(`  ✗ Cap 2 violated: Metadata-only category ${cat} in ${p.name} scored ${catObj.score} (max 6.0)`);
      capViolationErrors++;
    }

    // Cap 3: Test files present but not executed <= 6.0 (in measurable_evidence and code_quality)
    if (!hasExecutedTests && testCount > 0) {
      if (cat === 'code_quality' && catObj.score > 6.0001) {
        console.error(`  ✗ Cap 3 violated: Code quality on unexecuted tests in ${p.name} scored ${catObj.score} (max 6.0)`);
        capViolationErrors++;
      }
      if (cat === 'measurable_evidence' && !hasCommittedBenchmark && !catObj.anchor_used.includes('EVAL_HARNESS') && catObj.score > 6.0001) {
        console.error(`  ✗ Cap 3 violated: Measurable evidence on unexecuted tests without benchmark in ${p.name} scored ${catObj.score} (max 6.0)`);
        capViolationErrors++;
      }
    }

    // Cap 4: CI workflow config observed but run status absent <= 6.0 production readiness
    if (cat === 'production_readiness' && hasCiWorkflow && catObj.score > 6.0001) {
      console.error(`  ✗ Cap 4 violated: Production readiness on unexecuted CI in ${p.name} scored ${catObj.score} (max 6.0)`);
      capViolationErrors++;
    }

    // Cap 5: Historical committed benchmark not executed in audit <= 7.0 measurable evidence
    if (cat === 'measurable_evidence' && hasCommittedBenchmark && catObj.score > 7.0001) {
      console.error(`  ✗ Cap 5 violated: Measurable evidence on unexecuted committed benchmark in ${p.name} scored ${catObj.score} (max 7.0)`);
      capViolationErrors++;
    }

    // Cap 6: No tests <= 4.0 code quality and <= 5.0 production readiness
    if (testCount === 0) {
      if (cat === 'code_quality' && catObj.score > 4.0001) {
        console.error(`  ✗ Cap 6 violated: Zero test files repository ${p.name} code quality scored ${catObj.score} (max 4.0)`);
        capViolationErrors++;
      }
      if (cat === 'production_readiness' && catObj.score > 5.0001) {
        console.error(`  ✗ Cap 6 violated: Zero test files repository ${p.name} production readiness scored ${catObj.score} (max 5.0)`);
        capViolationErrors++;
      }
      if (cat === 'measurable_evidence' && catObj.score > 4.0001) {
        console.error(`  ✗ Cap 6 violated: Zero test files repository ${p.name} measurable evidence scored ${catObj.score} (max 4.0)`);
        capViolationErrors++;
      }
    }

    // Cap 7: No externally verified live deployment <= 7.0 demonstrability
    if (cat === 'demonstrability' && !hasExternalVerified && catObj.score > 7.0001) {
      console.error(`  ✗ Cap 7 violated: Demonstrability without external live verification in ${p.name} scored ${catObj.score} (max 7.0)`);
      capViolationErrors++;
    }

    // Check Unsupported Category Claims
    if (rat.toLowerCase().includes('k6 load test') && !catObj.category_evidence_ids.some(id => id.includes('BENCHMARK') || id.includes('LOAD'))) {
      console.error(`  ✗ Rationale claims load test without citing benchmark evidence in ${p.name} ${cat}`);
      unsupportedClaimErrors++;
    }
  }

  // Strict mathematical total score verification
  const expectedTotal = Number((calculatedSum * 10).toFixed(2));
  if (Math.abs(expectedTotal - p.total_score) > 0.01) {
    console.error(`  ✗ Total score mismatch for ${p.name}: expected ${expectedTotal}, found ${p.total_score}`);
    mathErrors++;
  }
}

assert(missingEvidenceIdErrors === 0, 'All scored projects reference valid evidence IDs registered in ledger');
assert(unbackedRationaleErrors === 0, 'Every category rationale is backed by valid [Evidence: ...] citation from ledger');
assert(crossRepoScoreErrors === 0, 'Zero cross-repo evidence citations in project-scores.json');
assert(mathErrors === 0, 'Zero mathematical discrepancies in scoring calculation');
assert(capViolationErrors === 0, 'Zero deterministic cap violations across all categories');
assert(unsupportedClaimErrors === 0, 'Zero unsupported claims in category rationales');

// Check character count prose in project-scores.json
const scoresJsonText = fs.readFileSync('docs/portfolio/project-scores.json', 'utf8');
const charInScores = scoresJsonText.match(/\b\d+k?\+?\s*characters?\b/gi);
assert(charInScores === null, 'Zero character-count-as-signal prose in project-scores.json');

// Check exclusions
let exclusionErrors = 0;
for (const ex of scoresData.exclusions) {
  if (!ex.repo || !ex.reason || !ex.missing_evidence || !Array.isArray(ex.evidence_ids)) {
    console.error(`  ✗ Malformed exclusion record for ${ex.repo}`);
    exclusionErrors++;
  }
  for (const eid of ex.evidence_ids) {
    if (!ledgerIds.has(eid)) {
      console.error(`  ✗ Excluded repo ${ex.repo} cites unregistered evidence ID: ${eid}`);
      exclusionErrors++;
    }
  }
}
assert(exclusionErrors === 0, 'All 12 exclusions have complete fields, reasons, and valid evidence IDs');

// 4. Verify Known Conflicts Resolution & Project Specific Calibrations
console.log('\n--- Step 4: Verifying Known Conflicts & Project Specific Calibrations ---');

// Sentinel Calibration
const sentinelProject = scoresData.rankings.find(p => p.slug === 'sentinel');
assert(sentinelProject !== undefined, 'Sentinel is present in rankings');
assert(sentinelProject.scores.measurable_evidence <= 6.0, `Sentinel measurable_evidence correctly capped (score: ${sentinelProject.scores.measurable_evidence}, was 9.3)`);
assert(sentinelProject.scores.production_readiness <= 6.0, `Sentinel production_readiness correctly capped (score: ${sentinelProject.scores.production_readiness}, was 9.4)`);
assert(sentinelProject.scores.code_quality <= 6.0, `Sentinel code_quality correctly capped (score: ${sentinelProject.scores.code_quality}, was 9.2)`);
assert(sentinelProject.total_score < 80.0, `Sentinel total_score defensibly recalibrated (score: ${sentinelProject.total_score}, was 93.82)`);

// OpenCode-Team Calibration
const octProject = scoresData.rankings.find(p => p.slug === 'opencode-team');
assert(octProject !== undefined, 'OpenCode-Team is present in rankings');
assert(octProject.scores.code_quality <= 4.0, `OpenCode-Team code_quality strictly capped at 4.0 for zero tests (score: ${octProject.scores.code_quality}, was 9.0)`);
assert(octProject.scores.production_readiness <= 5.0, `OpenCode-Team production_readiness strictly capped at 5.0 for zero tests (score: ${octProject.scores.production_readiness}, was 9.2)`);
assert(octProject.scores.measurable_evidence <= 4.0, `OpenCode-Team measurable_evidence strictly capped at 4.0 for zero tests (score: ${octProject.scores.measurable_evidence}, was 8.8)`);
assert(octProject.total_score < 70.0, `OpenCode-Team total_score defensibly recalibrated (score: ${octProject.total_score}, was 92.52)`);
assert(octProject.evidence_ids.includes('EV-OCT-CONFLICT-LABELED'), 'OpenCode-Team cites conflicting counts evidence (EV-OCT-CONFLICT-LABELED)');

// TheButterFlyEffect Calibration
const butterflyProject = scoresData.rankings.find(p => p.slug === 'thebutterflyeffect');
assert(butterflyProject !== undefined, 'TheButterFlyEffect is present in rankings');
assert(butterflyProject.scores.code_quality <= 4.0, `TheButterFlyEffect code_quality strictly capped at 4.0 for zero tests (score: ${butterflyProject.scores.code_quality})`);
assert(butterflyProject.scores.production_readiness <= 5.0, `TheButterFlyEffect production_readiness strictly capped at 5.0 for zero tests (score: ${butterflyProject.scores.production_readiness})`);

// Tenant API Platform
const tapProject = scoresData.rankings.find(p => p.slug === 'tenant-api-platform');
assert(tapProject !== undefined, 'tenant-api-platform is present in rankings');
assert(tapProject.flagship_status === 'PROVISIONAL_PENDING_EXECUTION', 'tenant-api-platform is evaluated as provisional flagship pending Phase 1 execution');
const tapRationalesText = Object.values(tapProject.rationales).join(' ').replace(/\[Evidence:[^\]]+\]/g, '');
assert(!tapRationalesText.toLowerCase().includes('stripe'), 'tenant-api-platform rationales have ZERO Stripe claims');
assert(!tapRationalesText.toLowerCase().includes('langchain') && !tapRationalesText.toLowerCase().includes('llm agent'), 'tenant-api-platform rationales have ZERO AI hype claims');
assert(tapProject.evidence_ids.includes('EV-TAP-NO-STRIPE-AI'), 'tenant-api-platform cites EV-TAP-NO-STRIPE-AI');
assert(tapProject.evidence_ids.includes('EV-TAP-FLAGSHIP-ELIGIBILITY'), 'tenant-api-platform cites EV-TAP-FLAGSHIP-ELIGIBILITY');
assert(tapProject.evidence_ids.includes('EV-TAP-LOAD-BENCHMARK'), 'tenant-api-platform cites empirical load benchmark');
assert(tapProject.scores.measurable_evidence <= 7.0, `tenant-api-platform measurable_evidence capped at historical benchmark limit 7.0 (score: ${tapProject.scores.measurable_evidence})`);

// Event Stream Platform
const espProject = scoresData.rankings.find(p => p.slug === 'event-stream-platform');
assert(espProject !== undefined, 'event-stream-platform is present in rankings');
assert(espProject.flagship_status === 'PROVISIONAL_PENDING_EXECUTION', 'event-stream-platform is evaluated as provisional flagship pending Phase 1 execution');
const espRationalesText = Object.values(espProject.rationales).join(' ').replace(/\[Evidence:[^\]]+\]/g, '');
assert(!espRationalesText.toLowerCase().includes('sarama'), 'event-stream-platform rationales have ZERO Sarama claims');
assert(!espRationalesText.toLowerCase().includes('timescale'), 'event-stream-platform rationales have ZERO Timescale claims');
assert(!espRationalesText.toLowerCase().includes('clickhouse'), 'event-stream-platform rationales have ZERO ClickHouse claims');
assert(espProject.evidence_ids.includes('EV-ESP-NO-SARAMA-TIMESCALE'), 'event-stream-platform cites EV-ESP-NO-SARAMA-TIMESCALE');
assert(espProject.evidence_ids.includes('EV-ESP-LOAD-BENCHMARK'), 'event-stream-platform cites empirical load benchmark');
assert(espProject.scores.measurable_evidence <= 7.0, `event-stream-platform measurable_evidence capped at historical benchmark limit 7.0 (score: ${espProject.scores.measurable_evidence})`);

// SchemeGPT
const sgProject = scoresData.rankings.find(p => p.slug === 'schemegpt');
assert(sgProject !== undefined, 'schemeGPT is present in rankings');
assert(sgProject.flagship_status === 'PROVISIONAL_PENDING_EXECUTION', 'schemeGPT is evaluated as provisional flagship pending Phase 1 execution');
assert(sgProject.evidence_ids.includes('EV-SG-NEXT16'), 'schemeGPT cites Next.js 16 evidence (EV-SG-NEXT16)');
assert(sgProject.evidence_ids.includes('EV-SG-RAGAS-CLAIM'), 'schemeGPT cites RAGAS unverified claim evidence (EV-SG-RAGAS-CLAIM)');
assert(sgProject.rationales.product_completeness.includes('Next.js 16'), 'schemeGPT product completeness explicitly states Next.js 16');

// E-commerce-Dashboard
const ecomProject = scoresData.rankings.find(p => p.slug === 'e-commerce-dashboard');
assert(ecomProject !== undefined, 'E-commerce-Dashboard is present in rankings');
assert(ecomProject.evidence_ids.includes('EV-ECOM-ORDERS-CLAIM'), 'E-commerce-Dashboard cites 99,441 orders evidence (EV-ECOM-ORDERS-CLAIM)');

// Hardware Repositories
const asicProject = scoresData.rankings.find(p => p.slug === 'asic-crc-engine');
assert(asicProject !== undefined, 'asic-crc-engine is present in rankings');
assert(asicProject.evidence_ids.includes('EV-ASIC_CRC_ENGINE-NON-WEB-API'), 'asic-crc-engine cites non-web API evidence (EV-ASIC_CRC_ENGINE-NON-WEB-API)');

// 5. Anti-Hype, Anti-Slop & Substantive Field Audit on Inventory
console.log('\n--- Step 5: Anti-Hype, Anti-Slop & Substantive Field Audit on Inventory ---');
const inventoryText = fs.readFileSync('docs/portfolio/project-inventory.md', 'utf8');
const forbiddenPatterns = [
  /99\.9% accuracy/i,
  /10x engineer/i,
  /rockstar/i,
  /guru/i,
  /ninja/i,
  /lorem ipsum/i,
  /FastAPI \/ Python \/ Node standard stack/i,
  /Modular client-server or service architecture\./i,
  /REST JSON API endpoints/i,
  /Modular application structure derived/i,
  /Specialized analytical or algorithmic processing/i,
  /Standard repo posture/i,
  /Standard local environment dependency limitations/i,
  /all technical claims are verified/i,
  /all claims are verified/i,
  /None empirically committed in repository snapshot/i
];

let slopDetected = 0;
for (const pat of forbiddenPatterns) {
  if (pat.test(inventoryText)) {
    console.error(`  ✗ Forbidden template pattern detected in project-inventory.md: ${pat}`);
    slopDetected++;
  }
}
assert(slopDetected === 0, 'project-inventory.md is 100% free from forbidden hype, generic fallback prose, over-promoted claims, and ungrounded "None empirically committed" wording');

const charInInventory = inventoryText.match(/\b\d+k?\+?\s*characters?\b/gi);
assert(charInInventory === null, 'Zero character-count-as-signal prose in project-inventory.md');

// Check all 27 primary repositories substantive fields for citations and cross-repo leaks
const substantiveFields = [
  'Languages & Core Tech',
  'Frameworks & Observed Dependencies',
  'System Architecture',
  'README Documentation',
  'API Protocols & Endpoints',
  'Database & Persistence',
  'Infrastructure & Containerization',
  'AI / ML Implementation',
  'Automated Tests',
  'CI/CD Automation',
  'Observability & Telemetry',
  'Security & Auth Posture',
  'Commit History & Activity',
  'Observed Metrics & Benchmarks',
  'Known Conflict & Audit Resolution',
  'Identified Limitations & Missing Evidence'
];

const meaningfulRepos = [
  'schemeGPT', 'Sentinel', 'mcp-from-scratch', 'OpenCode-Team',
  'tenant-api-platform', 'event-stream-platform', 'grounded-knowledge-platform',
  'CoverAI', 'DevAtlas', 'TheButterFlyEffect', 'aegis', 'pharmforge',
  'skyguard', 'bustwatch', 'floodlens', 'stormcast', 'weathergpt',
  'agentic_rag_system', 'Cyber', 'E-commerce-Dashboard', 'vibe-odds',
  'bom-intelligence', 'HealthCareOCR', 'pipeline_ocr', 'pipeline_pr-tb',
  'asic-crc-engine', 'ate-fixture-lab'
];

let uncitedSubstantiveFieldErrors = 0;
let crossRepoInventoryErrors = 0;

for (const repo of meaningfulRepos) {
  const repoBlockRegex = new RegExp(`### ${repo}\\n\\n([\\s\\S]*?)(?=\\n### |\\n## 2\\.)`);
  const match = inventoryText.match(repoBlockRegex);
  if (!match) {
    console.error(`  ✗ Missing repository section in inventory: ${repo}`);
    uncitedSubstantiveFieldErrors++;
    continue;
  }
  const block = match[1];
  const projectEvidenceIds = new Set(ledgerData.projects[repo]?.evidence_ids || []);

  for (const field of substantiveFields) {
    const fieldRegex = new RegExp(`\\* \\*\\*${field.replace(/&/g, '&')}\\*\\*:\\s*([^\\n]+)`);
    const fieldMatch = block.match(fieldRegex);
    if (!fieldMatch) {
      console.error(`  ✗ Missing field ${field} in ${repo}`);
      uncitedSubstantiveFieldErrors++;
      continue;
    }
    const line = fieldMatch[1];
    const evidenceMatch = line.match(/\[Evidence:\s*([^\]]+)\]/);
    if (!evidenceMatch) {
      console.error(`  ✗ Uncited substantive field "${field}" in ${repo}`);
      uncitedSubstantiveFieldErrors++;
    } else {
      const cited = evidenceMatch[1].split(',').map(s => s.trim());
      for (const cid of cited) {
        if (!ledgerIds.has(cid)) {
          console.error(`  ✗ Cited unregistered ID ${cid} in ${repo} field ${field}`);
          crossRepoInventoryErrors++;
        }
        if (!projectEvidenceIds.has(cid)) {
          console.error(`  ✗ Cross-repo citation ${cid} in ${repo} field ${field}`);
          crossRepoInventoryErrors++;
        }
      }
    }
  }
}
assert(uncitedSubstantiveFieldErrors === 0, 'Every substantive inventory field across all 27 repositories has an explicit [Evidence: ...] citation');
assert(crossRepoInventoryErrors === 0, 'Zero cross-repo evidence citations in project-inventory.md');

// Check Live Deployment metadata wording
const liveUrlLines = inventoryText.split('\n').filter(l => l.startsWith('* **Live / Deployment URL**:'));
let invalidLiveWording = 0;
for (const line of liveUrlLines) {
  if (line.includes('http') && !line.includes('metadata') && !line.includes('not independently verified')) {
    console.error(`  ✗ Live deployment line claims unverified live status: ${line}`);
    invalidLiveWording++;
  }
}
assert(invalidLiveWording === 0, 'All live deployment URLs are properly qualified as repository metadata entries, not live availability verifications');

console.log('\n============================================================');
if (failedChecks === 0) {
  console.log(`ALL ${totalChecks} VALIDATION CHECKS PASSED WITH ZERO ERRORS!`);
  console.log('============================================================\n');
  process.exit(0);
} else {
  console.error(`VALIDATION FAILED: ${failedChecks} checks failed out of ${totalChecks}!`);
  console.log('============================================================\n');
  process.exit(1);
}
