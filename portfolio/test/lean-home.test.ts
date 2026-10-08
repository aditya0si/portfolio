import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Source-level regression for the approved concise Home composition (task 2).
// Reads the real Home page source rather than re-implementing it so the test
// fails loudly if the removed sections or the oversized hero ever return.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "..", "app");
const read = (relative: string) =>
  fs.readFileSync(path.join(appDir, relative), "utf-8");
const exists = (relative: string) => fs.existsSync(path.join(appDir, relative));

const home = read("page.tsx");

const indexOf = (needle: string) => {
  const at = home.indexOf(needle);
  assert.ok(at >= 0, `Home must render ${JSON.stringify(needle)}`);
  return at;
};

console.log("------------------------------------------------------------");
console.log("RUNNING LEAN HOME COMPOSITION REGRESSION TESTS");
console.log("------------------------------------------------------------");

// Test 1: noisy sections, imports and inline content are removed from Home.
{
  console.log("Test 1: noisy Home sections, imports and content are gone...");

  const removed = [
    "Marquee",
    "GitHubLive",
    "AiConcepts",
    "ConceptualSystems",
    "Future Systems Architecture",
    "Concepts & Mechanics",
    "capabilities",
    "education",
    "evidence",
  ];

  for (const token of removed) {
    assert.ok(
      !home.includes(token),
      `Home must no longer reference ${JSON.stringify(token)}`,
    );
  }

  console.log("  OK marquee, live repo noise, R&D, conceptual and verbose blocks removed");
}

// Test 2: approved sections are present.
{
  console.log("Test 2: concise hero, contributions, tools heading, products, contact...");

  for (const token of [
    "ADITYA SINGH",
    "{profile.headline}",
    "ContributionsCalendar",
    "Tools I reach for",
    "FeaturedFrontends",
    "ContactInfo",
  ]) {
    assert.ok(
      home.includes(token),
      `Home must include ${JSON.stringify(token)}`,
    );
  }

  assert.match(
    home,
    /<FeaturedFrontends\s*\/>/,
    "Home must render the featured frontends section",
  );
  assert.match(
    home,
    /<ContactInfo\s*\/>/,
    "Home must end with the shared ContactInfo component",
  );
  assert.match(
    home,
    /<ContributionsCalendar\s*\/>/,
    "Home must render contributions directly near the bio",
  );

  console.log("  OK all approved elements are present");
}

// Test 3: composition order — identity/bio, contributions, tools heading,
// products, contact.
{
  console.log("Test 3: approved composition order...");

  const order = [
    indexOf("ADITYA SINGH"),
    indexOf("{profile.headline}"),
    indexOf("<ContributionsCalendar"),
    indexOf("Tools I reach for"),
    indexOf("<FeaturedFrontends"),
    indexOf("<ContactInfo"),
  ];

  for (let i = 1; i < order.length; i += 1) {
    assert.ok(
      order[i] > order[i - 1],
      `Home section ${i} must appear after section ${i - 1}`,
    );
  }

  console.log("  OK identity → bio → contributions → tools → products → contact");
}

// Test 4: hero is short — no oversized clamp, no verbose hero paragraphs.
{
  console.log("Test 4: hero is concise with a 3rem maximum...");

  assert.ok(
    !home.includes("7.5rem"),
    "hero must not keep the oversized 7.5rem clamp",
  );
  assert.match(
    home,
    /font-display text-\[clamp\([^\]]*3rem\)\]/,
    "hero heading must clamp to a maximum of 3rem",
  );
  assert.ok(
    !home.includes("{profile.sub}"),
    "hero must not render the verbose profile.sub paragraph",
  );

  console.log("  OK hero caps at 3rem with a single bio line");
}

// Test 5: removed component files and dossier evidence are not deleted.
{
  console.log("Test 5: original component files and dossier routes preserved...");

  for (const file of [
    "components/Marquee.tsx",
    "components/GitHubLive.tsx",
    "components/AiConcepts.tsx",
    "components/ConceptualSystems.tsx",
    "components/ContributionsCalendar.tsx",
    "components/ProductsCatalog.tsx",
    "components/ContactInfo.tsx",
    "projects/[slug]/page.tsx",
  ]) {
    assert.ok(exists(file), `${file} must be preserved on disk`);
  }

  console.log("  OK component library and dossier route preserved");
}

console.log("------------------------------------------------------------");
console.log("Lean Home composition: PASS.");
console.log("------------------------------------------------------------");
