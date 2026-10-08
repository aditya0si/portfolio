import { profile } from "@/lib/data";
import Reveal from "./Reveal";

type ContactInfoProps = {
  headingLevel?: "h1" | "h2";
};

export default function ContactInfo({ headingLevel = "h2" }: ContactInfoProps) {
  const Heading = headingLevel;

  return (
    <section id="contact" className="scroll-mt-14 border-t border-line">
      <div className="mx-auto max-w-sheet px-5 py-20 sm:px-8 sm:py-32">
        <Reveal>
          <p className="mono-label mb-6">CONTACT</p>
          <Heading className="font-display text-[clamp(2.75rem,9vw,7rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
            LET&rsquo;S BUILD
            <span className="cursor-blink text-accent">▮</span>
          </Heading>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink2 sm:text-lg">
            Open to software engineering and systems engineering roles.
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
  );
}
