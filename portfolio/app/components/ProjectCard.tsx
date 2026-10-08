import Link from "next/link";
import type { Flagship } from "@/lib/data";
import { projectPresentation } from "@/lib/featured-projects";

export default function ProjectCard({ project }: { project: Flagship }) {
  const presentation = projectPresentation[project.slug];
  const summary = presentation?.summary ?? project.tagline;
  const liveUrl = presentation?.liveUrl;
  const sourceLink = project.links.find((link) => link.label === "SOURCE");
  const ciLink = project.links.find((link) => link.label === "CI");

  return (
    <article data-product-card={project.slug} className="project-card">
      <h3 className="font-display text-2xl font-medium">{project.name}</h3>

      <p data-product-status className="text-sm text-muted">
        Project candidate
      </p>

      <p className="text-sm text-ink2">{summary}</p>

      <ul
        aria-label={`${project.name} tech stack`}
        className="flex flex-wrap gap-2"
      >
        {project.stack.map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted">
        {liveUrl ? "Live demo linked" : "Live demo not linked"}
      </p>

      <div className="flex flex-wrap gap-3">
        {sourceLink ? (
          <a
            href={sourceLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link text-sm"
          >
            Source ↗
          </a>
        ) : null}
        <Link
          href={`/projects/${project.slug}`}
          className="project-link text-sm"
        >
          Case study →
        </Link>
        {ciLink ? (
          <a
            href={ciLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link text-sm"
          >
            CI ↗
          </a>
        ) : null}
        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link text-sm"
          >
            Live demo ↗
          </a>
        ) : null}
      </div>

      <details className="text-sm text-muted">
        <summary className="project-link cursor-pointer text-sm">
          Verification details
        </summary>
        <p>{project.executionState}</p>
        <p>
          <a
            href={project.evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link text-sm"
          >
            {project.evidenceId} ↗
          </a>
        </p>
        <p>{project.evidenceStrength}</p>
      </details>
    </article>
  );
}
