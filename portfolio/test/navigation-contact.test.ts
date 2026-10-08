import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerHooks } from "node:module";

// Same test-local resolver hook used by the other presentation suites: the app
// source uses extensionless imports, Node's ESM resolver needs an extension.
// Retry relative specifiers with TypeScript/JavaScript extensions so the real
// `lib/data.ts` module is loaded and natively type-stripped.
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.join(__dirname, "..", "app");
const read = (relative: string) =>
  fs.readFileSync(path.join(appDir, relative), "utf-8");
const exists = (relative: string) =>
  fs.existsSync(path.join(appDir, relative));

console.log("------------------------------------------------------------");
console.log("RUNNING NAVIGATION / ROUTES / SHARED CONTACT REGRESSION TESTS");
console.log("------------------------------------------------------------");

// Test 1: shared HUD nav is exactly Home / About / Contact with real routes.
{
  console.log("Test 1: shared nav has exactly Home / About / Contact routes...");

  const hud = read("components/Hud.tsx");
  const navMatch = hud.match(/const NAV[^=]*=\s*(\[[\s\S]*?\]);/);
  assert.ok(navMatch, "Hud.tsx must declare a NAV array");

  const entries = [...navMatch[1].matchAll(/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g)].map(
    (m) => [m[1], m[2]],
  );

  assert.deepEqual(
    entries,
    [
      ["Home", "/"],
      ["About", "/about"],
      ["Contact", "/contact"],
    ],
    "nav must be exactly Home / About / Contact with routes / /about /contact",
  );

  for (const anchor of ["#products", "#systems", "#stack", "#concepts", "#github", "#contact"]) {
    assert.ok(
      !entries.some(([, href]) => href === anchor),
      `nav must no longer expose the section anchor ${anchor}`,
    );
  }

  console.log("  OK nav is exactly Home / About / Contact");
}

// Test 2: both routes exist as real Next.js pages.
{
  console.log("Test 2: /about and /contact are real routes...");

  assert.ok(exists(path.join("about", "page.tsx")), "app/about/page.tsx must exist");
  assert.ok(
    exists(path.join("contact", "page.tsx")),
    "app/contact/page.tsx must exist",
  );

  console.log("  OK /about and /contact pages exist");
}

// Test 3: one identical shared contact component is reused by Home and /contact.
{
  console.log("Test 3: shared contact component reused by Home and /contact...");

  assert.ok(
    exists(path.join("components", "ContactInfo.tsx")),
    "app/components/ContactInfo.tsx must exist",
  );

  const home = read("page.tsx");
  const contact = read(path.join("contact", "page.tsx"));

  assert.match(
    home,
    /from\s+["']\.\/components\/ContactInfo["']/,
    "Home must import the shared ContactInfo component",
  );
  assert.match(
    home,
    /<ContactInfo\s*\/>/,
    "Home must render the shared ContactInfo component",
  );

  assert.match(
    contact,
    /from\s+["']\.\.\/components\/ContactInfo["']/,
    "/contact must import the same ContactInfo component",
  );
  assert.match(
    contact,
    /<ContactInfo\b[^>]*\/>/,
    "/contact must render the same ContactInfo component (optionally with headingLevel)",
  );

  console.log("  OK Home and /contact render the same ContactInfo component");
}

// Test 4: the shared component carries the full, identical contact info.
{
  console.log("Test 4: shared component carries the real contact info...");

  const shared = read(path.join("components", "ContactInfo.tsx"));

  assert.match(shared, /id="contact"/, "shared contact section must keep id=contact");
  assert.match(
    shared,
    /mailto:\$\{profile\.email\}/,
    "shared contact must link the real email",
  );
  assert.match(shared, /profile\.linkedin/, "shared contact must link LinkedIn");
  assert.match(shared, /profile\.github/, "shared contact must link GitHub");
  assert.match(shared, /LET&rsquo;S BUILD|LET'S BUILD/, "shared contact keeps the CTA heading");

  // The Home page must no longer inline a duplicate of the contact block.
  const home = read("page.tsx");
  assert.ok(
    !/id="contact"/.test(home),
    "Home must not inline the contact section; it comes from ContactInfo",
  );

  console.log("  OK shared contact info is complete and not duplicated on Home");
}

// Test 5: dossier routes and audited evidence are preserved.
{
  console.log("Test 5: dossier routes and audited evidence preserved...");

  assert.ok(
    exists(path.join("projects", "[slug]", "page.tsx")),
    "app/projects/[slug]/page.tsx dossier route must be preserved",
  );

  const data = await import("../lib/data");
  assert.equal(data.flagships.length, 6, "all six flagships must remain");
  assert.deepEqual(
    data.flagships.map((f) => f.slug),
    [
      "stockflow",
      "schemegpt",
      "sentinel",
      "mcp-from-scratch",
      "tenant-api-platform",
      "event-stream-platform",
    ],
    "flagship slugs and order must be unchanged",
  );

  console.log("  OK dossier route and all six audited records preserved");
}

console.log("------------------------------------------------------------");
console.log("Navigation / routes / shared contact: PASS.");
console.log("------------------------------------------------------------");
