import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "../../components/Reveal";
import Flow from "../../components/Flow";
import { flagships } from "@/lib/data";

export function generateStaticParams() {
  return flagships.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = flagships.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — ${project.status}`,
    description: project.tagline,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = flagships.find((p) => p.slug === slug);
  if (!project) notFound();

  const next = flagships[(flagships.indexOf(project) + 1) % flagships.length];

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-sheet px-5 py-14 sm:px-8 sm:py-20">
        <Link
          href="/#products"
          className="mono-label inline-block transition-colors hover:text-accent"
        >
          ← ALL PRODUCTS
        </Link>

        <Reveal className="mt-10">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="font-mono text-[13px] text-accent">
              {project.index}
            </span>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
              {project.name}
            </h1>
            <span className="chip border-accent/40 font-mono text-[11px] text-accent">
              {project.status}
            </span>
          </div>

          {/* Evidence & Execution State Banner */}
          <div className="mt-5 rounded border border-line bg-surface/60 p-4 font-mono text-[12px] text-muted">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-accent">[EXECUTION STATUS]</span>
              <span className="text-ink2">{project.executionState}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-accent">[EVIDENCE ID]</span>
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

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink2 sm:text-xl">
            {project.tagline}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={i === 0 ? "btn-primary" : "btn-ghost"}
              >
                {link.label === "SOURCE" ? "View source repository" : link.label} ↗
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-14 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <section aria-label="Problem">
                <p className="mono-label mb-3">PROBLEM</p>
                <p className="text-base leading-relaxed text-ink2">
                  {project.problem}
                </p>
              </section>

              <section aria-label="What was built" className="mt-10">
                <p className="mono-label mb-3">WHAT WAS BUILT</p>
                <ul className="space-y-3">
                  {project.built.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-base leading-relaxed text-ink2"
                    >
                      <span aria-hidden className="mt-0.5 text-accent">
                        ▸
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-label="Engineering highlights" className="mt-10">
                <p className="mono-label mb-3">ENGINEERING HIGHLIGHTS</p>
                <ul className="space-y-3">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-base leading-relaxed text-ink2"
                    >
                      <span aria-hidden className="mt-0.5 font-mono text-[11px] text-accent">
                        ▪
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="md:col-span-5">
              <section aria-label="Architecture">
                <Flow steps={project.flow} label="ARCHITECTURE" />
              </section>

              <section aria-label="By the numbers" className="mt-10">
                <p className="mono-label mb-3">BY THE NUMBERS</p>
                <div className="grid grid-cols-2 gap-px border border-line bg-line">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="bg-bg p-4">
                      <p className="font-mono text-xl text-ink">
                        {metric.value}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section aria-label="Stack" className="mt-10">
                <p className="mono-label mb-3">STACK</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </Reveal>

        <Reveal>
          <Link
            href={`/projects/${next.slug}`}
            className="group mt-20 flex items-baseline justify-between gap-6 border-t border-line pt-10"
          >
            <div>
              <p className="mono-label mb-2">NEXT DOSSIER</p>
              <p className="font-display text-3xl font-medium transition-colors group-hover:text-accent sm:text-4xl">
                {next.name}
              </p>
            </div>
            <span
              aria-hidden
              className="font-mono text-xl text-muted transition-all group-hover:translate-x-1 group-hover:text-accent"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
