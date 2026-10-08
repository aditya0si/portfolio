import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerHooks } from "node:module";

// Focused regression for the real, locally-sourced Tools logos component (task 3).
// It loads the REAL lib/tools.ts manifest and asserts that every referenced asset
// physically exists on disk, that excluded technologies never appear, that the
// accessible component is wired into Home #stack, and that provenance is recorded.
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
const size = (relative: string) => fs.statSync(path.join(root, relative)).size;

// Technologies the brief explicitly excludes from the tools grid.
const EXCLUDED = [
  "opentelemetry",
  "jaeger",
  "prometheus",
  "linux",
  "redpanda",
  "kafka",
  "franz-go",
  "franz_go",
  "json-rpc",
  "jsonrpc",
  "sse",
  "rest api",
];

const REQUIRED_AGENT_TOOLS = ["Codex", "Hermes", "Claude Code", "OpenCode"];

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`  ok ${passed + failed} ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`  x  ${passed + failed} ${name}`);
    console.error(error);
  }
}

console.log("------------------------------------------------------------");
console.log("RUNNING REAL TOOLS LOGOS TESTS");
console.log("------------------------------------------------------------");

type ToolLogo = {
  name: string;
  category: string;
  src: string;
  alt: string;
  sourceUrl: string;
  license: string;
  background: string;
};

let toolLogos: ToolLogo[] = [];
let importError: unknown = null;
try {
  const toolsModule = await import("../lib/tools");
  toolLogos = toolsModule.toolLogos as ToolLogo[];
} catch (error) {
  importError = error;
}

// Test 1: the manifest imports and is a non-empty, unique set.
test("lib/tools.ts exposes a non-empty, uniquely named manifest", () => {
  if (importError) throw importError;
  assert.ok(Array.isArray(toolLogos), "toolLogos must be an array");
  assert.ok(
    toolLogos.length >= 16,
    `expected at least 16 real tool logos, found ${toolLogos.length}`,
  );
  const names = toolLogos.map((t) => t.name);
  assert.equal(
    new Set(names).size,
    names.length,
    "tool names must be unique",
  );
});

// Test 2: the four agent CLI tools sourced from official repos are present.
test("manifest includes Codex, Hermes, Claude Code and OpenCode", () => {
  if (importError) throw importError;
  for (const required of REQUIRED_AGENT_TOOLS) {
    assert.ok(
      toolLogos.some((t) => t.name === required),
      `manifest must include the real ${required} mark`,
    );
  }
});

// Test 2b: the genuine LangChain, LangGraph and Express marks are present with
// their exact official provenance (never redrawn, never repurposed).
test("manifest includes LangChain, LangGraph and Express with exact sources", () => {
  if (importError) throw importError;
  const exact: Array<{ name: string; src: string; sourceUrl: string }> = [
    {
      name: "LangChain",
      src: "/tools/langchain.svg",
      sourceUrl:
        "https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/6a994264a64b3afcdd880f66_LangChain_OSS%20Lockup_light%201.svg",
    },
    {
      name: "LangGraph",
      src: "/tools/langgraph.svg",
      sourceUrl:
        "https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/6a994264a64b3afcdd880f6b_LangGraph_OSS%20Lockup_light%201.svg",
    },
    {
      name: "Express",
      src: "/tools/express.svg",
      sourceUrl:
        "https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg",
    },
  ];
  for (const entry of exact) {
    const logo = toolLogos.find((t) => t.name === entry.name);
    assert.ok(logo, `manifest must include the genuine ${entry.name} mark`);
    assert.equal(logo.src, entry.src, `${entry.name} must use its local asset`);
    assert.equal(
      logo.sourceUrl,
      entry.sourceUrl,
      `${entry.name} must cite its exact official source`,
    );
    assert.ok(
      exists(path.join("public", entry.src)),
      `${entry.src} must physically exist on disk`,
    );
  }
});

// Test 3: every referenced asset exists locally with real bytes.
test("every logo asset physically exists under public/tools", () => {
  if (importError) throw importError;
  for (const tool of toolLogos) {
    assert.match(
      tool.src,
      /^\/tools\/[a-z0-9-]+\.(svg|png)$/,
      `${tool.name} src must be a local /tools asset`,
    );
    const relative = path.join("public", tool.src);
    assert.ok(exists(relative), `${tool.src} must exist on disk`);
    assert.ok(size(relative) > 0, `${tool.src} must not be empty`);
  }
});

// Test 4: excluded technologies never appear as tool names.
test("excluded technologies are absent from the manifest", () => {
  if (importError) throw importError;
  const haystack = toolLogos
    .map((t) => t.name.toLowerCase())
    .join("|");
  for (const term of EXCLUDED) {
    assert.ok(
      !haystack.includes(term),
      `tools grid must not include excluded technology "${term}"`,
    );
  }
});

// Test 5: every logo carries provenance, license and an accessible label.
test("every logo records an https source, license and alt label", () => {
  if (importError) throw importError;
  for (const tool of toolLogos) {
    assert.match(tool.sourceUrl, /^https:\/\//, `${tool.name} needs an https source`);
    assert.ok(tool.license.length > 0, `${tool.name} needs a license note`);
    assert.ok(tool.alt.length > 0, `${tool.name} needs an alt label`);
    assert.ok(
      tool.background === "light" || tool.background === "dark",
      `${tool.name} needs a light/dark contrast wrapper`,
    );
  }
});

// Test 6: the component renders accessible links, labels and tooltips.
test("ToolsGrid component exposes accessible labels, titles and images", () => {
  const source = read("app/components/ToolsGrid.tsx");
  assert.match(source, /toolLogos/, "component must render the real manifest");
  assert.match(source, /<img/, "component must render real image assets");
  assert.match(source, /alt=/, "images need alt text");
  assert.match(source, /title=/, "links need a title tooltip");
  assert.match(source, /aria-label=/, "links need an accessible label");
  assert.match(source, /href=/, "each logo must link to its official source");
});

// Test 7: Home #stack renders the grid and no longer shows the placeholder.
test("Home #stack renders ToolsGrid and drops the placeholder copy", () => {
  const home = read("app/page.tsx");
  assert.ok(
    !home.includes("Tool logos coming next"),
    "placeholder copy must be removed",
  );
  assert.match(home, /<ToolsGrid\s*\/>/, "Home must render <ToolsGrid />");
  assert.match(
    home,
    /import ToolsGrid from "\.\/components\/ToolsGrid"/,
    "Home must import the ToolsGrid component",
  );
  assert.ok(home.includes('id="stack"'), "the #stack section must remain");
});

// Test 8: provenance documentation records every official source URL.
test("public/tools/SOURCES.md records provenance for every asset", () => {
  const relative = "public/tools/SOURCES.md";
  assert.ok(exists(relative), "public/tools/SOURCES.md must exist");
  const doc = read(relative);
  if (importError) throw importError;
  for (const tool of toolLogos) {
    assert.ok(
      doc.includes(tool.sourceUrl),
      `SOURCES.md must record the source URL for ${tool.name}`,
    );
    assert.ok(
      doc.includes(tool.src.replace("/tools/", "")),
      `SOURCES.md must record the asset filename for ${tool.name}`,
    );
  }
});

// Test 9: the Codex mark is the shared OpenAI brand mark, not the CLI splash.
test("Codex uses the shared OpenAI mark and the CLI splash asset is gone", () => {
  if (importError) throw importError;
  const codex = toolLogos.find((t) => t.name === "Codex");
  assert.ok(codex, "manifest must include Codex");
  assert.equal(
    codex.src,
    "/tools/codex.svg",
    "Codex must use the local codex.svg mark",
  );
  assert.equal(
    codex.sourceUrl,
    "https://developers.openai.com/favicon.svg",
    "Codex must cite the official OpenAI favicon",
  );
  assert.equal(
    codex.alt,
    "OpenAI mark for Codex",
    "Codex alt must name the shared OpenAI mark",
  );
  assert.ok(
    !/splash/i.test(`${codex.alt} ${codex.license}`),
    "Codex provenance must not describe the old CLI splash",
  );
  assert.ok(
    /openai/i.test(codex.license),
    "Codex license must name the shared OpenAI brand mark",
  );
  assert.ok(
    exists("public/tools/codex.svg"),
    "public/tools/codex.svg must exist",
  );
  assert.ok(
    !exists("public/tools/codex.png"),
    "the unused CLI splash asset codex.png must be deleted",
  );

  const manifest = read("lib/tools.ts");
  assert.ok(
    !manifest.includes("codex-cli-splash.png"),
    "lib/tools.ts must not reference the Codex CLI splash",
  );
  const sources = read("public/tools/SOURCES.md");
  assert.ok(
    !sources.includes("codex-cli-splash.png") && !sources.includes("codex.png"),
    "SOURCES.md must not reference the removed CLI splash",
  );
  assert.ok(
    sources.includes("https://developers.openai.com/favicon.svg"),
    "SOURCES.md must cite the shared OpenAI brand mark source",
  );
});

// Test 10: ToolsGrid is a compact, inline-wrapping mark strip (no category rows).
test("ToolsGrid is a compact inline-wrapping grid without category rows", () => {
  const source = read("app/components/ToolsGrid.tsx");
  assert.match(source, /toolLogos/, "component must render the manifest");
  assert.match(source, /\.map\(/, "component must render each mark inline");
  assert.match(source, /flex-wrap/, "marks must wrap inline");
  assert.match(source, /h-11/, "marks must sit in an 11 (44px) box");
  assert.match(source, /w-11/, "marks must sit in an 11 (44px) box");
  assert.match(source, /sr-only/, "marks must keep a visually-hidden name");
  assert.ok(
    !source.includes("CATEGORY_ORDER"),
    "category grouping must be gone from the compact strip",
  );
  assert.ok(
    !/license/.test(source),
    "license text must not render in the compact strip",
  );
});

console.log("------------------------------------------------------------");
console.log(`Real tools logos: ${passed} passed, ${failed} failed.`);
console.log("------------------------------------------------------------");

if (failed > 0) {
  process.exitCode = 1;
}
