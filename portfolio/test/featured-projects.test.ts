import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Test-local module resolution hook.
// The application must use extensionless imports (tsconfig disallows ".ts"
// specifiers), but Node's ESM resolver requires an extension. This hook retries
// a failed relative resolution with TypeScript/JavaScript extensions so the real
// `lib/featured-projects.ts` module is loaded (and natively type-stripped) rather
// than a re-implementation or regex over the source.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".") || specifier.startsWith("/")) {
        for (const ext of [".ts", ".tsx", ".js", "/index.ts"]) {
          try {
            return nextResolve(specifier + ext, context);
          } catch {
            // Not resolvable with this extension; try the next candidate.
          }
        }
      }
      throw error;
    }
  },
});

console.log("------------------------------------------------------------");
console.log("RUNNING FEATURED PROJECTS PRESENTATION TESTS");
console.log("------------------------------------------------------------");

const featured = await import("../lib/featured-projects");
const data = await import("../lib/data");

const expectedOrder = [
  "schemegpt",
  "stockflow",
  "sentinel",
  "tenant-api-platform",
  "event-stream-platform",
] as const;

// Test 1: featuredSlugs — exact order, length 5, unique 5.
{
  console.log("Test 1: featuredSlugs order, length and uniqueness...");

  assert.deepEqual(
    [...featured.featuredSlugs],
    [...expectedOrder],
    "featuredSlugs must equal the required order exactly"
  );
  assert.equal(featured.featuredSlugs.length, 5, "featuredSlugs must contain exactly 5 slugs");
  assert.equal(
    new Set(featured.featuredSlugs).size,
    5,
    "featuredSlugs must be unique"
  );

  console.log("  ✓ featuredSlugs is exactly 5 unique slugs in the required order");
}

// Test 2: featuredProjects maps each slug to the existing flagship, in order.
{
  console.log("Test 2: featuredProjects maps to existing flagships...");

  assert.equal(featured.featuredProjects.length, 5, "featuredProjects must contain 5 entries");

  for (let i = 0; i < expectedOrder.length; i += 1) {
    const expectedSlug = expectedOrder[i];
    const project = featured.featuredProjects[i];

    assert.equal(project.slug, expectedSlug, `featuredProjects[${i}] must be ${expectedSlug}`);

    const original = data.flagships.find((f) => f.slug === expectedSlug);
    assert.ok(original, `Original flagship ${expectedSlug} must exist in data.ts`);
    assert.equal(
      project,
      original,
      `featuredProjects[${i}] must reference the actual flagship object from data.ts`
    );
  }

  console.log("  ✓ featuredProjects references the existing flagship objects in order");
}

// Test 3: all six original flagships remain preserved.
{
  console.log("Test 3: all six original flagships preserved...");

  const originalOrder = [
    "stockflow",
    "schemegpt",
    "sentinel",
    "mcp-from-scratch",
    "tenant-api-platform",
    "event-stream-platform",
  ];

  assert.equal(data.flagships.length, 6, "data.ts must retain all 6 original flagships");
  assert.deepEqual(
    data.flagships.map((f) => f.slug),
    originalOrder,
    "data.ts flagship slugs and order must be unchanged"
  );

  console.log("  ✓ all six original flagships preserved with unchanged order");
}

// Test 4: projectPresentation content, summaries, and source links.
{
  console.log("Test 4: projectPresentation summaries, no liveUrl, source link each...");

  const expectedSummaries: Record<string, string> = {
    schemegpt: "Find welfare-scheme guidance through hybrid retrieval and source-linked answers.",
    stockflow: "Reserve inventory safely across concurrent buyers, retries, and fulfilment workflows.",
    sentinel: "Apply schema, privacy, and grounding checks to agent completions with tracing.",
    "tenant-api-platform": "Isolate tenant data and enforce quotas in a Go service and billing API.",
    "event-stream-platform": "Ingest and process telemetry with partitioned consumers and dead-letter routing.",
  };

  for (const slug of expectedOrder) {
    const presentation = featured.projectPresentation[slug];
    assert.ok(presentation, `projectPresentation must include ${slug}`);

    assert.equal(
      presentation.summary,
      expectedSummaries[slug],
      `projectPresentation.${slug}.summary must match the approved copy`
    );
    assert.ok(
      presentation.summary.length <= 140,
      `projectPresentation.${slug}.summary must be <= 140 characters`
    );
    assert.ok(
      !("liveUrl" in presentation),
      `projectPresentation.${slug} must not define a liveUrl`
    );

    const project = data.flagships.find((f) => f.slug === slug);
    assert.ok(project, `Flagship ${slug} must exist to carry a source link`);
    const sourceLink = project.links.find((l) => l.label === "SOURCE");
    assert.ok(sourceLink, `Flagship ${slug} must expose a SOURCE link`);
    assert.match(
      sourceLink.href,
      /^https:\/\/github\.com\/aditya0si\/[^/]+$/,
      `Flagship ${slug} SOURCE link must point to its repository`
    );
  }

  console.log("  ✓ summaries approved, within 140 chars, no liveUrl, and each has a source link");
}

console.log("------------------------------------------------------------");
console.log("Featured selection: PASS.");
console.log("------------------------------------------------------------");
