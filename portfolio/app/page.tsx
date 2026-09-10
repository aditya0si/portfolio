import Link from "next/link";
import Reveal from "./components/Reveal";
import Marquee from "./components/Marquee";
import Flow from "./components/Flow";
import GitHubLive from "./components/GitHubLive";
import AiConcepts from "./components/AiConcepts";
import {
  profile,
  evidence,
  flagships,
  experience,
  capabilities,
  education,
} from "@/lib/data";

function SectionHeader({
  index,
  label,
  title,
  note,
}: {
  index: string;
  label: string;
  title: string;
  note?: string;
}) {
  return (
    <Reveal className="mb-12 sm:mb-16">
      <p className="mono-label mb-4">
        <span className="text-accent">[{index}]</span> {label}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
          {title}
        </h2>
        {note && <p className="max-w-sm text-sm text-muted">{note}</p>}
      </div>
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="blueprint-bg">
        <div className="mx-auto max-w-sheet px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
          <Reveal>
            <div className="mb-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              <span>PORTFOLIO — 2026 · AGENTIC SYSTEMS</span>
              <span className="hidden items-center gap-2 sm:flex">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                OPEN TO WORK
              </span>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
              ADITYA SINGH
              <span className="cursor-blink text-accent">▮</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-6 max-w-3xl font-display text-[clamp(1.35rem,3vw,2.25rem)] font-medium leading-snug">
              I build{" "}
              <span className="text-accent">agentic AI systems</span> that
              survive production.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink2 sm:text-lg">
              {profile.sub}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn-primary">
                View work ↓
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                GitHub ↗
              </a>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div
              className="mt-14 flex flex-wrap"
              aria-label="Credibility snapshot"
            >
              {evidence.map((item) => (
                <div
                  key={item.k}
                  className="-mb-px -mr-px border border-line px-4 py-3 sm:px-5"
                >
                  <p className="font-mono text-sm font-medium text-accent">
                    {item.k}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {item.v}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee />

      {/* ============ FEATURED WORK ============ */}
      <section id="work" className="scroll-mt-14">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="01"
            label="FEATURED WORK"
            title="Systems, not slides."
            note="Four builds that show the full arc — infrastructure, production RAG, protocol internals, published tooling. Every claim links back to source."
          />

          <div>
            {flagships.map((project, i) => (
              <Reveal key={project.slug}>
                <article className="border-t border-line py-12 sm:py-14">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="font-mono text-[12px] text-accent">
                        {project.index}
                      </span>
                      <h3 className="font-display text-3xl font-medium tracking-[-0.01em] sm:text-4xl">
                        {project.name}
                      </h3>
                      <span className="chip">{project.status}</span>
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

                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink2 sm:text-lg">
                    {project.tagline}
                  </p>

                  <div className="mt-8 grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-7">
                      <p className="mono-label mb-2">PROBLEM</p>
                      <p className="text-sm leading-relaxed text-muted">
                        {project.problem}
                      </p>
                      <p className="mono-label mb-2 mt-6">WHAT I BUILT</p>
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCE ============ */}
      <section id="experience" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="02"
            label="EXPERIENCE"
            title="Where I've shipped."
            note="Two internships, both building AI systems on real data — not shadowing."
          />

          <div>
            {experience.map((job) => (
              <Reveal key={job.company}>
                <article className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-3">
                    <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink">
                      {job.period}
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {job.location}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="font-display text-2xl font-medium sm:text-3xl">
                        {job.company}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                        {job.role}
                      </span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {job.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm leading-relaxed text-ink2 sm:text-base"
                        >
                          <span aria-hidden className="mt-0.5 text-accent">
                            ▸
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STACK ============ */}
      <section id="stack" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="03"
            label="STACK"
            title="Tools I reach for."
            note="Grouped by what I've actually shipped with — everything above appears in the projects and internships on this page."
          />

          <Reveal>
            <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((cap) => (
                <div key={cap.group} className="bg-bg p-6">
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {cap.group}
                  </p>
                  <ul className="space-y-1.5">
                    {cap.items.map((item) => (
                      <li key={item} className="text-sm text-ink2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ AI FIELD NOTES ============ */}
      <section id="concepts" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="04"
            label="AI FIELD NOTES"
            title="Concepts & Mechanics."
            note="Bite-sized engineering breakdowns on the modern AI/LLM stack. One concept at a time, distilled for production reality."
          />
          <Reveal>
            <AiConcepts />
          </Reveal>
        </div>
      </section>

      {/* ============ GITHUB ============ */}
      <section id="github" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="05"
            label="GITHUB"
            title="Everything else, live."
            note="The repos beyond the flagships — AI and agent systems ranked first, newest pushes after that. Live from the GitHub API; falls back to a cached snapshot."
          />
          <Reveal>
            <GitHubLive />
          </Reveal>
        </div>
      </section>

      {/* ============ EDUCATION ============ */}
      <section id="education" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader index="06" label="EDUCATION" title="MIT Manipal." />
          <Reveal>
            <article className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink">
                  2023 — 2027
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  EXPECTED
                </p>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-2xl font-medium sm:text-3xl">
                  {education.degree}
                </h3>
                <ul className="mt-4 space-y-2">
                  {education.lines.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-sm leading-relaxed text-ink2 sm:text-base"
                    >
                      <span aria-hidden className="mt-0.5 text-accent">
                        ▸
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-20 sm:px-8 sm:py-32">
          <Reveal>
            <p className="mono-label mb-6">
              <span className="text-accent">[07]</span> CONTACT
            </p>
            <h2 className="font-display text-[clamp(2.75rem,9vw,7rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
              LET&rsquo;S BUILD
              <span className="cursor-blink text-accent">▮</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink2 sm:text-lg">
              Open to software engineering and AI engineering internships — and
              the occasional hard problem. If your team ships LLM systems and
              cares about what happens after the demo, we&rsquo;ll get along.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="btn-primary">
                Email me
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                LinkedIn ↗
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                GitHub ↗
              </a>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              FASTEST ROUTE: {profile.email}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
