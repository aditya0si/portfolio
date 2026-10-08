"use client";

import { useState, useRef } from "react";
import { type RoleCategory } from "@/lib/data";
import { featuredProjects } from "@/lib/featured-projects";
import ProjectCard from "./ProjectCard";

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
      ? featuredProjects
      : featuredProjects.filter((p) => p.roles.includes(selectedRole));

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
              className={`min-h-11 rounded-none border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                active
                  ? "border-accent bg-accent/10 font-medium text-accent shadow-sm"
                  : "border-line bg-bg text-muted hover:border-ink2 hover:text-ink"
              }`}
            >
              {role}
              <span className="ml-1.5 text-[10px] font-semibold">
                ({role === "ALL" ? featuredProjects.length : featuredProjects.filter((p) => p.roles.includes(role)).length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Cards */}
      <div className="project-grid">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
