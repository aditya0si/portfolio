import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Test-local module resolution hook so the real `lib/featured-frontends.ts`
// module is loaded (and natively type-stripped) rather than re-implemented.
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

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, "..", "public");

console.log("------------------------------------------------------------");
console.log("RUNNING FEATURED FRONTENDS PRESENTATION TESTS");
console.log("------------------------------------------------------------");

const manifest = await import("../lib/featured-frontends");
const tools = await import("../lib/tools");

const expected = [
  {
    slug: "schemegpt",
    name: "SchemeGPT",
    url: "https://schemegpt-web.vercel.app",
    sourceUrl: "https://github.com/aditya0si/schemeGPT",
    technologies: ["Next.js", "React", "TypeScript", "Python", "PostgreSQL"],
    limitationFragment: "offline",
  },
  {
    slug: "samjho",
    name: "samjho",
    url: "https://samjho-adityasinghprojects.vercel.app",
    sourceUrl: "https://github.com/aditya0si/samjho",
    technologies: ["Next.js", "React", "TypeScript", "Python"],
    limitationFragment: "undeployed",
  },
  {
    slug: "coverai",
    name: "CoverAI",
    url: "https://cover-ai-web.vercel.app",
    sourceUrl: "https://github.com/aditya0si/CoverAI",
    technologies: ["Next.js", "React", "TypeScript", "Python"],
    limitationFragment: "frontend",
  },
] as const;

// Test 1: exactly three records, in the approved order.
{
  console.log("Test 1: exactly three featured frontends in approved order...");

  assert.equal(
    manifest.featuredFrontends.length,
    3,
    "featuredFrontends must contain exactly 3 records",
  );
  assert.deepEqual(
    manifest.featuredFrontends.map((f) => f.slug),
    expected.map((e) => e.slug),
    "featuredFrontends slugs must match the approved order",
  );

  console.log("  OK exactly 3 records: schemegpt, samjho, coverai");
}

// Test 2: verified URLs are exact and HTTPS.
{
  console.log("Test 2: verified live URLs...");

  for (const item of expected) {
    const record = manifest.featuredFrontends.find((f) => f.slug === item.slug);
    assert.ok(record, `featuredFrontends must include ${item.slug}`);
    assert.equal(
      record.url,
      item.url,
      `${item.slug} URL must be the verified deployment`,
    );
    assert.match(
      record.url,
      /^https:\/\//,
      `${item.slug} URL must be HTTPS`,
    );
  }

  console.log("  OK all three verified HTTPS deployment URLs are exact");
}

// Test 3: each screenshot is a real asset copied into public/projects.
{
  console.log("Test 3: screenshot assets exist on disk...");

  const seen = new Set<string>();
  for (const item of expected) {
    const record = manifest.featuredFrontends.find((f) => f.slug === item.slug);
    assert.ok(record, `featuredFrontends must include ${item.slug}`);

    assert.ok(
      record.screenshot.startsWith("/projects/"),
      `${item.slug} screenshot must live under /projects/`,
    );
    assert.ok(
      record.screenshot.endsWith(".png"),
      `${item.slug} screenshot must be a PNG`,
    );
    assert.ok(
      !seen.has(record.screenshot),
      `${item.slug} screenshot must be unique`,
    );
    seen.add(record.screenshot);

    const assetPath = path.join(publicDir, record.screenshot);
    assert.ok(
      fs.existsSync(assetPath),
      `${item.slug} screenshot asset ${record.screenshot} must exist on disk`,
    );
    assert.ok(
      fs.statSync(assetPath).size > 1024,
      `${item.slug} screenshot must be a non-empty captured image`,
    );
  }

  console.log("  OK all three screenshots exist in public/projects");
}

// Test 4: technologies use the exact supplied names and resolve to local logos.
{
  console.log("Test 4: technologies and local tool logos...");

  const known = new Set(tools.toolLogos.map((logo) => logo.name));

  for (const item of expected) {
    const record = manifest.featuredFrontends.find((f) => f.slug === item.slug);
    assert.ok(record, `featuredFrontends must include ${item.slug}`);

    assert.deepEqual(
      record.technologies,
      [...item.technologies],
      `${item.slug} technologies must use the exact supplied names`,
    );

    assert.equal(
      record.logos.length,
      item.technologies.length,
      `${item.slug} must resolve one local logo per technology`,
    );

    for (const logo of record.logos) {
      assert.ok(
        known.has(logo.name),
        `${item.slug} logo ${logo.name} must come from lib/tools.ts`,
      );
      assert.ok(
        logo.src.startsWith("/tools/"),
        `${item.slug} logo ${logo.name} must point at a local /tools asset`,
      );
    }
  }

  console.log("  OK exact tech names mapped to local lib/tools.ts logos");
}

// Test 5: concise summaries and an explicit honest limitation on every card.
{
  console.log("Test 5: <=140 char summaries and honest limitations...");

  for (const item of expected) {
    const record = manifest.featuredFrontends.find((f) => f.slug === item.slug);
    assert.ok(record, `featuredFrontends must include ${item.slug}`);

    assert.equal(typeof record.summary, "string");
    assert.ok(record.summary.length > 0, `${item.slug} summary must not be empty`);
    assert.ok(
      record.summary.length <= 140,
      `${item.slug} summary must be <= 140 characters`,
    );

    assert.equal(typeof record.limitation, "string");
    assert.ok(
      record.limitation.length > 0,
      `${item.slug} must document a limitation`,
    );
    assert.ok(
      record.limitation.toLowerCase().includes(item.limitationFragment),
      `${item.slug} limitation must mention "${item.limitationFragment}"`,
    );
  }

  console.log("  OK summaries concise and limitations honest on every card");
}

// Test 6: every record exposes a verified HTTPS source repository, and the
// FrontendCard renders an accessible new-tab "Source code" anchor for it.
{
  console.log("Test 6: verified source repositories and accessible source anchor...");

  const cardSource = fs.readFileSync(
    path.join(here, "..", "app", "components", "FrontendCard.tsx"),
    "utf-8",
  );

  for (const item of expected) {
    const record = manifest.featuredFrontends.find((f) => f.slug === item.slug);
    assert.ok(record, `featuredFrontends must include ${item.slug}`);

    assert.equal(
      record.sourceUrl,
      item.sourceUrl,
      `${item.slug} sourceUrl must be the verified repository`,
    );
    assert.match(
      record.sourceUrl,
      /^https:\/\/github\.com\/aditya0si\/[^/]+$/,
      `${item.slug} sourceUrl must be a verified https GitHub repository`,
    );
  }

  assert.match(
    cardSource,
    /frontend\.sourceUrl/,
    "FrontendCard must render the manifest sourceUrl",
  );
  assert.match(
    cardSource,
    /Source code/,
    "FrontendCard must render a visible Source code label",
  );
  assert.match(
    cardSource,
    /target="_blank"/,
    "the source anchor must open in a new tab",
  );
  assert.match(
    cardSource,
    /rel="noopener noreferrer"/,
    "the source anchor must be safely opened",
  );

  console.log("  OK verified repo URLs and accessible Source code anchors");
}

console.log("------------------------------------------------------------");
console.log("Featured frontends: PASS.");
console.log("------------------------------------------------------------");
