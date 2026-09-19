import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, "..", "lib", "data.ts");
const dataContent = fs.readFileSync(dataFilePath, "utf-8");

const layoutFilePath = path.join(__dirname, "..", "app", "layout.tsx");
const layoutContent = fs.readFileSync(layoutFilePath, "utf-8");

console.log("------------------------------------------------------------");
console.log("RUNNING PROGRAMMATIC TESTS FOR EVIDENCE RECONCILIATION & DATA");
console.log("------------------------------------------------------------");

// Test 1: Stale & Unsupported Claims Absence
{
  console.log("Test 1: Absence of unsupported/stale claims in data.ts and layout.tsx...");

  const forbiddenStrings = [
    { pattern: /\bIBM\b/i, desc: "IBM biography claims" },
    { pattern: /\bHCL\b/i, desc: "HCL biography claims" },
    { pattern: /survive production/i, desc: "Unqualified 'survive production' hype" },
    { pattern: /PRODUCTION RAG/i, desc: "Unqualified 'PRODUCTION RAG' status" },
    { pattern: /Next\.js 15/i, desc: "Stale Next.js 15 claim (actual is Next.js 16)" },
    { pattern: /<180ms/i, desc: "Unverified Sentinel <180ms latency claim" },
    { pattern: /\b60\+\b/i, desc: "Stale Sentinel 60+ test count (actual verified is 62 passed)" },
    { pattern: /100%/i, desc: "Unsubstantiated 100% claims" },
    { pattern: /SIH 2026/i, desc: "Unverified SIH 2026 status" },
    { pattern: /Smart India Hackathon 2026/i, desc: "Unverified Smart India Hackathon 2026 claim" },
    { pattern: /RAGAS offline evaluation suite runs as a CI gate/i, desc: "Unverified RAGAS in CI gate claim" },
    { pattern: /RAGAS.*EVAL GATE IN CI/i, desc: "Stale RAGAS CI gate metric" },
  ];

  for (const { pattern, desc } of forbiddenStrings) {
    assert.ok(
      !pattern.test(dataContent),
      `Forbidden claim detected in data.ts: ${desc}`
    );
    assert.ok(
      !pattern.test(layoutContent),
      `Forbidden claim detected in layout.tsx: ${desc}`
    );
  }

  console.log("  ✓ All unsupported claims verified absent");
}

// Test 2: Provisional Products Catalog Integrity (Exactly 5 Products)
{
  console.log("Test 2: Exactly 5 provisional product candidates with required statuses...");

  const expectedSlugs = [
    "schemegpt",
    "sentinel",
    "mcp-from-scratch",
    "tenant-api-platform",
    "event-stream-platform",
  ];

  // Extract flagship slugs
  const slugMatches = [...dataContent.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]);
  assert.equal(slugMatches.length, 5, `Expected exactly 5 flagship products, got ${slugMatches.length}`);
  assert.deepEqual(slugMatches, expectedSlugs, "Flagship slugs do not match expected audit candidates");

  // Verify status mentions candidate/provisional and execution state
  for (const slug of expectedSlugs) {
    const slugIndex = dataContent.indexOf(`slug: "${slug}"`);
    assert.ok(slugIndex !== -1, `Missing slug: ${slug}`);
    const chunk = dataContent.slice(slugIndex, slugIndex + 800);
    assert.ok(
      /candidate|provisional/i.test(chunk),
      `Product ${slug} status must explicitly mention candidate or provisional`
    );
  }

  console.log("  ✓ 5 provisional products verified with explicit candidate status");
}

// Test 3: Verified Execution Facts Surfaced
{
  console.log("Test 3: Surfacing verified execution test facts...");

  // schemeGPT 71 pytest passed
  assert.ok(/71\s*(passed|tests passed|pytest)/i.test(dataContent), "schemeGPT must cite 71 passed pytest tests");

  // Sentinel 62 pytest passed
  assert.ok(/62\s*(passed|tests passed|pytest)/i.test(dataContent), "Sentinel must cite 62 passed pytest tests");

  // MCP 29 pytest passed
  assert.ok(/29\s*(passed|tests passed|pytest)/i.test(dataContent), "mcp-from-scratch must cite 29 passed pytest tests");

  // tenant-api-platform full database-backed suite passed
  assert.ok(
    /full Go suite passed[\s\S]{0,160}PostgreSQL and Redis/i.test(dataContent),
    "tenant-api-platform must cite the Docker-backed database suite"
  );

  // event-stream-platform Docker integration passed 86 tests
  assert.ok(/86(?:-test)? Go suite/i.test(dataContent), "event-stream-platform must cite the 86-test Go suite");
  assert.ok(/Compose smoke test passed/i.test(dataContent), "event-stream-platform must cite the Compose smoke-test result");

  console.log("  ✓ Verified execution facts verified");
}

// Test 4: Role Filters Deterministic Support
{
  console.log("Test 4: Role tagging presence on all products...");

  const roles = ["AI ENGINEER", "FORWARD DEPLOYED", "BACKEND/SYSTEMS"];
  for (const role of roles) {
    assert.ok(dataContent.includes(role), `data.ts must support role filter: ${role}`);
  }

  console.log("  ✓ Role tags present on products");
}

// Test 5: Conceptual Systems (R&D) Sourced from INITIAL-AUDIT
{
  console.log("Test 5: Conceptual systems sourcing & 'FUTURE / UNBUILT' labeling...");

  const conceptualSystemsFile = path.join(__dirname, "..", "lib", "conceptual-systems.ts");
  assert.ok(fs.existsSync(conceptualSystemsFile), "conceptual-systems.ts must exist");
  const conceptContent = fs.readFileSync(conceptualSystemsFile, "utf-8");

  const expectedConcepts = [
    "Aether-Gateway",
    "Chronos-Drift",
    "KVCache-Router",
    "Chaos-Agent",
    "Raft-KV-Mesh",
  ];

  for (const name of expectedConcepts) {
    assert.ok(conceptContent.includes(name), `Missing conceptual system: ${name}`);
  }

  // All must be labeled FUTURE / UNBUILT
  const unbuiltMatches = conceptContent.match(/FUTURE\s*\/\s*UNBUILT/g) || [];
  assert.ok(unbuiltMatches.length >= 5, "All conceptual systems must be labeled FUTURE / UNBUILT");

  // Verify ConceptValue formula fields present
  assert.ok(conceptContent.includes("conceptValue"), "Concepts must calculate and display conceptValue");

  console.log("  ✓ Conceptual systems verified");
}

// Test 6: Unsupported Experience Section Removed
{
  console.log("Test 6: Unsupported experience section removal...");

  // Must not have experience exported with unverified IBM/HCL details
  assert.ok(
    !/company:\s*["']IBM["']/i.test(dataContent),
    "data.ts must not contain unverified IBM experience entry"
  );
  assert.ok(
    !/company:\s*["']HCL/i.test(dataContent),
    "data.ts must not contain unverified HCL experience entry"
  );

  console.log("  ✓ Unsupported experience entries removed");
}

// Test 7: Evidence links are immutable and execution qualifiers stay honest
{
  console.log("Test 7: Immutable evidence links and execution qualifiers...");

  const evidenceUrls = [...dataContent.matchAll(/evidenceUrl:\s*["']([^"']+)["']/g)].map((m) => m[1]);
  assert.equal(evidenceUrls.length, 5, "Every product must expose one immutable evidence URL");
  for (const url of evidenceUrls) {
    assert.match(url, /^https:\/\/github\.com\/aditya0si\/[^/]+\/(?:blob|tree)\/[0-9a-f]{40}\//, `Evidence URL is not commit-pinned: ${url}`);
  }

  assert.ok(
    !/RLS (?:tenant isolation )?verified/i.test(dataContent),
    "RLS must not be reduced to an unsupported generic verified claim; cite the database-backed suite instead"
  );
  assert.ok(
    !dataContent.includes("SKIP_DB_TESTS=1"),
    "Tenant execution status must not retain the superseded DB-skip claim"
  );
  assert.ok(
    !/integration(?: tests?)? (?:are )?(?:service-gated|blocked)/i.test(dataContent),
    "Event Stream execution status must not retain the superseded integration-blocked claim"
  );
  assert.ok(
    /historical committed[\s\S]{0,220}not reproduced/i.test(dataContent),
    "Historical benchmark artifacts must be labeled as not reproduced"
  );

  console.log("  ✓ Evidence links and execution qualifiers verified");
}

console.log("------------------------------------------------------------");
console.log("ALL EVIDENCE RECONCILIATION DATA CHECKS PASSED!");
console.log("------------------------------------------------------------");
