import Reveal from "./components/Reveal";
import Marquee from "./components/Marquee";
import GitHubLive from "./components/GitHubLive";
import AiConcepts from "./components/AiConcepts";
import ProductsCatalog from "./components/ProductsCatalog";
import ConceptualSystems from "./components/ConceptualSystems";
import {
  profile,
  evidence,
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
              <span>PORTFOLIO — 2026 · SYSTEMS & AGENT ARCHITECTURES</span>
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
              Systems-first engineering across{" "}
              <span className="text-accent">agent architectures</span>, guardrails,
              and backend pipelines.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink2 sm:text-lg">
              {profile.sub}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#products" className="btn-primary">
                View products ↓
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

      {/* ============ PRODUCTS ============ */}
      <section id="products" className="scroll-mt-14">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="01"
            label="PRODUCTS"
            title="Engineering Product Candidates."
            note="Five provisional candidates selected for complementary role coverage. Each card separates source observations, executed checks, historical artifacts, and unresolved verification."
          />
          <ProductsCatalog />
        </div>
      </section>

      {/* ============ CONCEPTUAL SYSTEMS (R&D) ============ */}
      <section id="systems" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="02"
            label="CONCEPTUAL SYSTEMS (R&D)"
            title="Future Systems Architecture."
            note="Architectural proposals addressing verified matrix gaps in inference economics, real-time drift, and distributed consensus. All entries are explicitly labeled FUTURE / UNBUILT R&D."
          />
          <Reveal>
            <ConceptualSystems />
          </Reveal>
        </div>
      </section>

      {/* ============ STACK / CAPABILITIES ============ */}
      <section id="stack" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="03"
            label="STACK"
            title="Tools I reach for."
            note="Grouped from repository manifests and code observations; presence does not imply production operation or expert-level proficiency."
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
            note="Bite-sized engineering breakdowns on the modern AI/LLM stack. One concept at a time, distilled for systems reality."
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
            note="The repositories beyond the provisional flagships — AI and systems projects ranked first, newest pushes after that. Live from the GitHub API; falls back to a cached snapshot."
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
                  {education.period}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {education.short}
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
              Open to software engineering and systems engineering roles. If your
              team builds reliable agent platforms, streaming backends, or evaluation
              infrastructure, let&rsquo;s connect.
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
