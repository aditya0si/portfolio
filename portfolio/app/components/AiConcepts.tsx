"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { aiConcepts, type AiConcept } from "@/lib/concepts";

export default function AiConcepts() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Extract categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(aiConcepts.map((c) => c.category)));
    return ["ALL", ...unique];
  }, []);

  // Filtered concepts based on active category
  const filteredConcepts = useMemo(() => {
    if (selectedCategory === "ALL") return aiConcepts;
    return aiConcepts.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  // Handle category switch safely
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  const total = filteredConcepts.length;
  const safeIndex = total > 0 ? (currentIndex >= 0 && currentIndex < total ? currentIndex : 0) : 0;
  const currentConcept: AiConcept = filteredConcepts[safeIndex] ?? filteredConcepts[0];

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => {
      const validPrev = prev >= 0 && prev < total ? prev : 0;
      return (validPrev + 1) % total;
    });
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => {
      const validPrev = prev >= 0 && prev < total ? prev : 0;
      return (validPrev - 1 + total) % total;
    });
  }, [total]);

  // Keyboard navigation when user is not typing in an input or using modifier keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If there is only 1 concept (or none), navigation is inactive — leave native arrow behavior intact
      if (total <= 1) {
        return;
      }

      // Never intercept browser shortcut combinations (Alt+Left for back, Cmd+Left, Ctrl, Shift)
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
      }

      // Ignore if user is inside an input, textarea, select, contenteditable, or role=textbox/slider/tab
      const target = e.target instanceof Element ? e.target : null;
      if (
        target &&
        (target.closest(
          "input, textarea, select, [contenteditable='true'], [role='textbox'], [role='slider'], [role='tab'], [role='combobox'], [role='spinbutton']"
        ) ||
          (target as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, total]);

  if (!currentConcept) return null;

  const currentNumber = String(safeIndex + 1).padStart(2, "0");
  const totalNumber = String(total).padStart(2, "0");
  const progressPercent = total > 0 ? ((safeIndex + 1) / total) * 100 : 0;

  return (
    <div className="w-full">
      {/* Category filter pills */}
      <div
        className="mb-8 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter AI concepts by category"
      >
        <span className="mono-label mr-2 hidden sm:inline">FILTER:</span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count =
            cat === "ALL"
              ? aiConcepts.length
              : aiConcepts.filter((c) => c.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              aria-pressed={isActive}
              className={`font-mono text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border transition-colors ${
                isActive
                  ? "border-accent bg-accent text-bg font-semibold"
                  : "border-line text-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {cat} [{count}]
            </button>
          );
        })}
      </div>

      {/* Main Concept Card (1 Topic at a time) */}
      <article
        className="border border-line bg-surface p-5 sm:p-8 lg:p-10 transition-all duration-200"
        aria-label={`Concept ${currentNumber} of ${totalNumber}: ${currentConcept.title}`}
      >
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-mono text-xs font-semibold text-accent">
              [{currentNumber}/{totalNumber}]
            </span>
            <span className="chip text-ink2">{currentConcept.category}</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {currentConcept.readTime}
          </span>
        </div>

        {/* Card Body — Live Region for assistive tech */}
        <div
          className="py-6 sm:py-8"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">
            Concept {currentNumber} of {totalNumber}: {currentConcept.category}.
          </span>
          <h3 className="font-display text-2xl font-medium tracking-[-0.01em] text-ink sm:text-3xl lg:text-4xl">
            {currentConcept.title}
          </h3>

          <p className="mt-4 text-base font-medium leading-relaxed text-ink sm:text-lg">
            {currentConcept.summary}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink2 sm:text-base">
            {currentConcept.explanation}
          </p>

          {/* Practical Engineering Takeaway */}
          <div className="mt-6 border border-line bg-bg p-4 sm:p-5">
            <p className="mono-label text-accent mb-2 flex items-center gap-1.5 font-semibold">
              <span aria-hidden>▸</span> PRODUCTION TAKEAWAY
            </p>
            <p className="font-mono text-xs sm:text-[13px] leading-relaxed text-ink2">
              {currentConcept.takeaway}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap items-center gap-1.5">
            <span className="mono-label mr-2">TOPICS:</span>
            {currentConcept.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Progress Hairline + Controls */}
        <div className="border-t border-line pt-6">
          {/* Progress bar hairline */}
          <div className="mb-6 h-[2px] w-full bg-line overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-label="Concept progress"
              aria-valuenow={safeIndex + 1}
              aria-valuemin={1}
              aria-valuemax={total || 1}
              aria-valuetext={`Concept ${safeIndex + 1} of ${total}`}
            />
          </div>

          {/* Action buttons & keyboard hint */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={total <= 1}
                className="btn-ghost px-4 py-2.5 sm:px-6 sm:py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-line-strong disabled:hover:text-ink"
                aria-label="Previous concept"
              >
                ← PREV
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={total <= 1}
                className="btn-primary px-4 py-2.5 sm:px-6 sm:py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink disabled:hover:text-bg"
                aria-label="Next concept"
              >
                NEXT CONCEPT →
              </button>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              <span className="hidden sm:inline">KEYBOARD: [← / →]</span>
              <span>
                {currentNumber} OF {totalNumber}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
