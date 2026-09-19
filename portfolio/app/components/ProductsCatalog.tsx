"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import Flow from "./Flow";
import { flagships, type RoleCategory, type Flagship } from "@/lib/data";

const ROLES: RoleCategory[] = [
  "ALL",
  "AI ENGINEER",
  "FORWARD DEPLOYED",
  "BACKEND/SYSTEMS",
];

export default function ProductsCatalog() {
  const [selectedRole, setSelectedRole] = useState<RoleCategory>("ALL");
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filtered =
    selectedRole === "ALL"
      ? flagships
      : flagships.filter((p) => p.roles.includes(selectedRole));

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % ROLES.length;
      buttonRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + ROLES.length) % ROLES.length;
      buttonRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttonRefs.current[ROLES.length - 1]?.focus();
    }
  };

  return (
    <div>
      {/* Role Filter Pills */}
      <div className="mb-10 flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter products by target role">
        {ROLES.map((role, idx) => {
          const active = selectedRole === role;
          return (
            <button
              key={role}
              ref={(el) => {
                buttonRefs.current[idx] = el;
              }}
              data-role-filter={role}
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setSelectedRole(role)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`rounded-none border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                active
                  ? "border-accent bg-accent/10 font-medium text-accent shadow-sm"
                  : "border-line bg-bg text-muted hover:border-ink2 hover:text-ink"
              }`}
            >
              {role}
              <span className="ml-1.5 text-[10px] font-semibold">
                ({role === "ALL" ? flagships.length : flagships.filter((p) => p.roles.includes(role)).length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Cards */}
      <div className="space-y-12">
        {filtered.map((project: Flagship) => (
          <article
            key={project.slug}
            data-product-card={project.slug}
            className="border-t border-line py-12 sm:py-14"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="font-mono text-[12px] text-accent">
                  {project.index}
                </span>
                <h3 className="font-display text-3xl font-medium tracking-[-0.01em] sm:text-4xl">
                  {project.name}
                </h3>
                <span
                  data-product-status
                  className="chip border-accent/40 font-mono text-[10px] text-accent"
                >
                  {project.status}
                </span>
              </div>

              <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em]">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {link.label} ↗
                  </a>
                ))}
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-ink transition-colors hover:text-accent"
                >
                  DOSSIER →
                </Link>
              </div>
            </div>

            {/* Evidence & Execution State Banner */}
            <div className="mt-4 rounded-none border border-line bg-surface/60 p-3.5 font-mono text-[11px] text-muted">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-accent font-semibold">[EXECUTION STATUS]</span>
                <span className="text-ink2">{project.executionState}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-accent font-semibold">[EVIDENCE ID]</span>
                <a
                  href={project.evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-line underline-offset-2 hover:text-accent"
                >
                  {project.evidenceId} ↗
                </a>
                <span className="text-line">|</span>
                <span className="text-muted">{project.evidenceStrength}</span>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink2 sm:text-lg">
              {project.tagline}
            </p>

            <div className="mt-8 grid gap-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="mono-label mb-2">PROBLEM</p>
                <p className="text-sm leading-relaxed text-muted">
                  {project.problem}
                </p>
                <p className="mono-label mb-2 mt-6">WHAT WAS BUILT</p>
                <ul className="space-y-2">
                  {project.built.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-ink2"
                    >
                      <span aria-hidden className="mt-0.5 text-accent">
                        ▸
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mono-label mb-2 mt-6">ENGINEERING HIGHLIGHTS</p>
                <ul className="space-y-2">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-ink2"
                    >
                      <span aria-hidden className="mt-0.5 font-mono text-[11px] text-accent">
                        ▪
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-5">
                <p className="mono-label mb-2">STACK</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="mono-label mb-3 mt-6">BY THE NUMBERS</p>
                <div className="grid grid-cols-2 gap-px border border-line bg-line">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="bg-bg p-3.5">
                      <p className="font-mono text-lg text-ink">
                        {metric.value}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Flow steps={project.flow} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
