import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerHooks } from "node:module";

// Focused regression for the runtime review fixes (task 5). It pins the exact
// runtime findings that were observed in .hermes/briefs/simple-runtime-proof.json:
// the Home heading order, the missing /contact h1, the obsolete contact index,
// the visible tools provenance note, and the incorrect samjho limitation.
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const read = (relative: string) =>
  fs.readFileSync(path.join(root, relative), "utf-8");
const exists = (relative: string) => fs.existsSync(path.join(root, relative));

console.log("------------------------------------------------------------");
console.log("RUNNING RUNTIME REVIEW FIX REGRESSION TESTS");
console.log("------------------------------------------------------------");

// Test 1: the contributions calendar top heading is an h2 so it never precedes
// the page's first h2 with an h3 (the axe heading-order finding).
{
  console.log("Test 1: contributions calendar top heading is h2...");

  const calendar = read("app/components/ContributionsCalendar.tsx");
  assert.match(calendar, /<h2\b/, "calendar top heading must be an h2");
  assert.ok(
    !/<h3\b/.test(calendar),
    "calendar must not introduce the out-of-order h3",
  );

  console.log("  OK calendar heading starts at h2 (contributes to h1 -> h2 order)");
}

// Test 2: ContactInfo takes an optional headingLevel typed h1/h2 and defaults
// to h2 so Home keeps its existing semantics.
{
  console.log("Test 2: ContactInfo exposes an optional headingLevel defaulting to h2...");

  const contact = read("app/components/ContactInfo.tsx");
  assert.match(contact, /headingLevel/, "ContactInfo must accept headingLevel");
  assert.match(
    contact,
    /headingLevel\s*=\s*"h2"/,
    'headingLevel must default to "h2"',
  );
  assert.match(
    contact,
    /headingLevel\??:\s*"h1"\s*\|\s*"h2"/,
    'headingLevel must be typed as "h1" | "h2"',
  );

  console.log("  OK headingLevel is typed h1/h2 and defaults to h2");
}

// Test 3: /contact requests an h1 (it has no other h1) while Home keeps the
// default h2 (Home already owns the hero h1).
{
  console.log("Test 3: /contact passes h1, Home keeps the default h2...");

  const contactPage = read("app/contact/page.tsx");
  assert.match(
    contactPage,
    /<ContactInfo\s+headingLevel="h1"\s*\/>/,
    '/contact must render <ContactInfo headingLevel="h1" />',
  );

  const homePage = read("app/page.tsx");
  assert.match(
    homePage,
    /<ContactInfo\s*\/>/,
    "Home must keep the default h2 ContactInfo heading",
  );

  console.log("  OK /contact is h1 (page-has-heading-one) and Home stays h2");
}

// Test 4: the contact copy is a single concise open-roles line and the obsolete
// [07] sequence index is gone.
{
  console.log("Test 4: concise contact copy without the obsolete [07] index...");

  const contact = read("app/components/ContactInfo.tsx");
  assert.ok(
    !contact.includes("[07]"),
    "contact label must not keep the obsolete [07] index",
  );
  assert.ok(
    !/agent platforms|streaming backends|evaluation infrastructure/i.test(contact),
    "the verbose infrastructure pitch must be removed",
  );
  assert.match(
    contact,
    /Open to software engineering and systems engineering roles\./,
    "contact copy must stay a single open-roles line",
  );

  console.log("  OK contact copy is one concise open-roles line");
}

// Test 5: the tools provenance paragraph is no longer rendered on Home, while
// public/tools/SOURCES.md remains the authoritative provenance record.
{
  console.log("Test 5: tools provenance paragraph removed from Home...");

  const homePage = read("app/page.tsx");
  assert.ok(
    !homePage.includes("provenance and licenses are recorded"),
    "Home must not render the provenance paragraph",
  );
  assert.ok(
    exists("public/tools/SOURCES.md"),
    "public/tools/SOURCES.md must remain the provenance record",
  );

  console.log("  OK provenance paragraph dropped from Home, SOURCES.md retained");
}

// Test 6: the samjho limitation states the exact corrected behaviour — the
// syllabus and animations run in the frontend, only Q&A quizzes need the API.
{
  console.log("Test 6: samjho limitation states the corrected behaviour...");

  const manifest = await import("../lib/featured-frontends");
  const samjho = manifest.featuredFrontends.find((f) => f.slug === "samjho");
  assert.ok(samjho, "samjho must remain in the manifest");
  assert.equal(
    samjho.limitation,
    "Questions and quizzes require the undeployed API; syllabus and animations work.",
    "samjho limitation must be the corrected, exact copy",
  );

  console.log("  OK samjho limitation corrected");
}

// Test 7: the hero keeps the short bio (no regression from the review fixes).
{
  console.log("Test 7: hero keeps the short profile.headline bio...");

  const homePage = read("app/page.tsx");
  assert.ok(
    homePage.includes("{profile.headline}"),
    "hero must keep the short profile.headline bio",
  );

  console.log("  OK short hero bio preserved");
}

console.log("------------------------------------------------------------");
console.log("Runtime review fixes: PASS.");
console.log("------------------------------------------------------------");
