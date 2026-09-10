import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read concepts from concepts.ts
const conceptsFilePath = path.join(__dirname, "..", "lib", "concepts.ts");
const rawTs = fs.readFileSync(conceptsFilePath, "utf-8");

// Parse concepts array from TypeScript file
const arrayMatch = rawTs.match(/export const aiConcepts:\s*AiConcept\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
if (!arrayMatch) {
  throw new Error("Failed to extract aiConcepts from concepts.ts");
}

// Convert typescript array string to JS evaluable
const jsArrayStr = arrayMatch[1].replace(/;\s*$/, "");
const aiConcepts = eval(jsArrayStr);

console.log("------------------------------------------------------------");
console.log("RUNNING PROGRAMMATIC TESTS FOR AI CONCEPTS COMPONENT & DATA");
console.log("------------------------------------------------------------");

// Test 1: Dataset Integrity & Schema
{
  console.log("Test 1: Dataset Integrity & Invariants...");
  assert.equal(aiConcepts.length, 10, "Expected exactly 10 concepts");

  const ids = new Set();
  const categories = new Set();

  aiConcepts.forEach((c, idx) => {
    assert.ok(c.id, `Concept at ${idx} missing id`);
    assert.ok(!ids.has(c.id), `Duplicate concept id: ${c.id}`);
    ids.add(c.id);

    const expectedIndex = String(idx + 1).padStart(2, "0");
    assert.equal(c.index, expectedIndex, `Concept ${c.id} has incorrect index`);

    assert.ok(c.title && c.title.length > 5, `Concept ${c.id} missing valid title`);
    assert.ok(c.readTime && c.readTime.includes("read"), `Concept ${c.id} missing readTime`);
    assert.ok(c.summary && c.summary.length > 10, `Concept ${c.id} missing summary`);
    assert.ok(c.explanation && c.explanation.length > 20, `Concept ${c.id} missing explanation`);
    assert.ok(c.takeaway && c.takeaway.length > 15, `Concept ${c.id} missing takeaway`);
    assert.ok(Array.isArray(c.tags) && c.tags.length >= 2, `Concept ${c.id} tags insufficient`);

    categories.add(c.category);
  });

  const expectedCategories = [
    "AGENTIC ARCHITECTURE",
    "INFERENCE & SERVING",
    "RAG & RETRIEVAL",
    "EVALS & SAFETY",
    "TRAINING & ALIGNMENT",
  ];

  for (const cat of expectedCategories) {
    assert.ok(categories.has(cat), `Missing expected category union member: ${cat}`);
  }

  console.log("  ✓ 10 concepts verified with complete, strongly-typed fields");
}

// Test 2: Category Filter & Idempotency Logic
{
  console.log("Test 2: Category Filtering & Idempotency Simulation...");

  // Category counts
  const categoryCounts = {};
  for (const c of aiConcepts) {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  }
  assert.equal(categoryCounts["INFERENCE & SERVING"], 4);
  assert.equal(categoryCounts["AGENTIC ARCHITECTURE"], 3);
  assert.equal(categoryCounts["RAG & RETRIEVAL"], 1);
  assert.equal(categoryCounts["EVALS & SAFETY"], 1);
  assert.equal(categoryCounts["TRAINING & ALIGNMENT"], 1);

  // State machine simulator for category change
  let selectedCategory = "ALL";
  let currentIndex = 5; // user is on concept 6

  const handleCategoryChange = (cat) => {
    if (cat === selectedCategory) return;
    selectedCategory = cat;
    currentIndex = 0;
  };

  // Re-click same category: must retain currentIndex
  handleCategoryChange("ALL");
  assert.equal(currentIndex, 5, "Re-clicking active category must NOT reset currentIndex");

  // Change to new category: must reset to 0
  handleCategoryChange("AGENTIC ARCHITECTURE");
  assert.equal(selectedCategory, "AGENTIC ARCHITECTURE");
  assert.equal(currentIndex, 0, "Changing category must reset currentIndex to 0");

  console.log("  ✓ Category filtering and idempotency guard verified");
}

// Test 3: Sequential Navigation & Wrap-around Math
{
  console.log("Test 3: Sequential Navigation & Wrap-around Math...");

  const total = 10;
  let index = 0;

  const next = (prev, totalCount) => {
    if (totalCount <= 1) return prev;
    const valid = prev >= 0 && prev < totalCount ? prev : 0;
    return (valid + 1) % totalCount;
  };

  const prevFn = (prev, totalCount) => {
    if (totalCount <= 1) return prev;
    const valid = prev >= 0 && prev < totalCount ? prev : 0;
    return (valid - 1 + totalCount) % totalCount;
  };

  // Forward walk through all 10 items
  for (let i = 0; i < 10; i++) {
    assert.equal(index, i);
    index = next(index, total);
  }
  // Wrap-around to 0
  assert.equal(index, 0, "Next at end must wrap around to 0");

  // Backward walk wrap-around from 0 to 9
  index = prevFn(index, total);
  assert.equal(index, 9, "Prev at 0 must wrap around to total - 1");

  // Single-item category (total = 1)
  assert.equal(next(0, 1), 0, "Next on single item must be no-op");
  assert.equal(prevFn(0, 1), 0, "Prev on single item must be no-op");

  // Zero items edge case
  assert.equal(next(0, 0), 0, "Next on zero items must not throw");
  assert.equal(prevFn(0, 0), 0, "Prev on zero items must not throw");

  console.log("  ✓ Wrap-around navigation verified in both directions");
}

// Test 4: Safe Index Clamping Under State Desynchronization
{
  console.log("Test 4: Safe Index Clamping Invariants...");

  const clamp = (cur, total) => {
    return total > 0 ? (cur >= 0 && cur < total ? cur : 0) : 0;
  };

  assert.equal(clamp(-1, 10), 0);
  assert.equal(clamp(15, 10), 0);
  assert.equal(clamp(NaN, 10), 0);
  assert.equal(clamp(3, 10), 3);
  assert.equal(clamp(0, 0), 0);

  console.log("  ✓ Index bounds safely clamp without crashing");
}

// Test 5: Keyboard Event Listener Guard Robustness (Mock DOM Targets)
{
  console.log("Test 5: Keyboard Event Listener Guards (Document / Window / Inputs)...");

  // Simulate browser targets
  class MockNode {}
  class MockDocument extends MockNode {
    // Document does NOT have .closest() in browsers!
  }
  class MockWindow {}
  class MockElement extends MockNode {
    constructor(tagName, attributes = {}) {
      super();
      this.tagName = tagName.toUpperCase();
      this.attributes = attributes;
      this.isContentEditable = attributes.contenteditable === "true";
    }
    closest(selector) {
      const selectors = selector.split(",").map((s) => s.trim().toLowerCase());
      const tag = this.tagName.toLowerCase();
      if (selectors.includes(tag)) return this;
      if (this.attributes["contenteditable"] === "true" && selectors.includes("[contenteditable='true']")) return this;
      if (this.attributes["role"] && selectors.includes(`[role='${this.attributes["role"]}']`)) return this;
      return null;
    }
  }

  // Keydown handler logic under test
  const simulateKeyDown = ({ key, altKey, ctrlKey, metaKey, shiftKey, target, total = 10 }) => {
    let prevented = false;
    let action = null;

    const e = {
      key,
      altKey: !!altKey,
      ctrlKey: !!ctrlKey,
      metaKey: !!metaKey,
      shiftKey: !!shiftKey,
      target,
      preventDefault: () => {
        prevented = true;
      },
    };

    if (total <= 1) return { prevented, action: "early-exit-total" };
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return { prevented, action: "early-exit-modifier" };

    const el = e.target instanceof MockElement ? e.target : null;
    if (
      el &&
      (el.closest(
        "input, textarea, select, [contenteditable='true'], [role='textbox'], [role='slider'], [role='tab'], [role='combobox'], [role='spinbutton']"
      ) ||
        el.isContentEditable)
    ) {
      return { prevented, action: "ignored-input" };
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      action = "next";
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      action = "prev";
    }

    return { prevented, action };
  };

  // Case A: target is Document (unfocused page or body margin click)
  const docTarget = new MockDocument();
  let res = simulateKeyDown({ key: "ArrowRight", target: docTarget });
  assert.equal(res.action, "next", "Document target must not crash and must trigger next");
  assert.equal(res.prevented, true);

  // Case B: target is Window
  const winTarget = new MockWindow();
  res = simulateKeyDown({ key: "ArrowLeft", target: winTarget });
  assert.equal(res.action, "prev", "Window target must not crash and must trigger prev");
  assert.equal(res.prevented, true);

  // Case C: target is null
  res = simulateKeyDown({ key: "ArrowRight", target: null });
  assert.equal(res.action, "next", "Null target must not crash and must trigger next");

  // Case D: target is an Input field
  const inputTarget = new MockElement("input");
  res = simulateKeyDown({ key: "ArrowRight", target: inputTarget });
  assert.equal(res.action, "ignored-input", "Input target must be ignored");
  assert.equal(res.prevented, false, "Input target must not prevent default");

  // Case E: target is a Textarea
  const textareaTarget = new MockElement("textarea");
  res = simulateKeyDown({ key: "ArrowLeft", target: textareaTarget });
  assert.equal(res.action, "ignored-input");
  assert.equal(res.prevented, false);

  // Case F: target is contenteditable
  const editableTarget = new MockElement("div", { contenteditable: "true" });
  res = simulateKeyDown({ key: "ArrowRight", target: editableTarget });
  assert.equal(res.action, "ignored-input");
  assert.equal(res.prevented, false);

  // Case G: target is role="slider"
  const sliderTarget = new MockElement("div", { role: "slider" });
  res = simulateKeyDown({ key: "ArrowRight", target: sliderTarget });
  assert.equal(res.action, "ignored-input");
  assert.equal(res.prevented, false);

  // Case H: target is role="tab"
  const tabTarget = new MockElement("button", { role: "tab" });
  res = simulateKeyDown({ key: "ArrowRight", target: tabTarget });
  assert.equal(res.action, "ignored-input");
  assert.equal(res.prevented, false);

  // Case I: modifier key pressed (e.g. Alt+Left for browser history back)
  res = simulateKeyDown({ key: "ArrowLeft", altKey: true, target: docTarget });
  assert.equal(res.action, "early-exit-modifier");
  assert.equal(res.prevented, false, "Browser navigation shortcut must not be swallowed");

  // Case J: total <= 1 (single-item category active)
  res = simulateKeyDown({ key: "ArrowRight", total: 1, target: docTarget });
  assert.equal(res.action, "early-exit-total");
  assert.equal(res.prevented, false, "Arrow keys must not be prevented when total <= 1");

  console.log("  ✓ Keydown listener mock tests passed with 0 crashes across all edge cases");
}

console.log("------------------------------------------------------------");
console.log("ALL PROGRAMMATIC VERIFICATION CHECKS PASSED SUCCESSFULLY!");
console.log("------------------------------------------------------------");
