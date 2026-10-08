import Reveal from "./components/Reveal";
import FeaturedFrontends from "./components/FeaturedFrontends";
import ContributionsCalendar from "./components/ContributionsCalendar";
import ContactInfo from "./components/ContactInfo";
import ToolsGrid from "./components/ToolsGrid";
import { profile } from "@/lib/data";

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
            <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
              ADITYA SINGH
              <span className="cursor-blink text-accent">▮</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink2 sm:text-lg">
              {profile.headline}
            </p>
          </Reveal>

          <Reveal delay={180}>
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
        </div>
      </section>

      {/* ============ GITHUB CONTRIBUTIONS ============ */}
      <section id="contributions" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <ContributionsCalendar />
        </div>
      </section>

      {/* ============ STACK ============ */}
      <section id="stack" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="01"
            label="STACK"
            title="Tools I reach for."
          />
          <Reveal>
            <ToolsGrid />
          </Reveal>
        </div>
      </section>

      {/* ============ PRODUCTS ============ */}
      <section id="products" className="scroll-mt-14 border-t border-line">
        <div className="mx-auto max-w-sheet px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeader
            index="02"
            label="PROJECTS"
            title="Featured projects"
          />
          <FeaturedFrontends />
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <ContactInfo />
    </>
  );
}
