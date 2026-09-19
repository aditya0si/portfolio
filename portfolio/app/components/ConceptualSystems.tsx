import { conceptualSystems, type ConceptualSystem } from "@/lib/conceptual-systems";

export default function ConceptualSystems() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {conceptualSystems.map((concept: ConceptualSystem) => (
        <article
          key={concept.id}
          data-concept-card={concept.id}
          className="flex flex-col justify-between border border-line bg-surface/40 p-6 sm:p-8"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {concept.domain}
              </span>
              <span
                data-unbuilt-badge
                className="border border-accent/60 bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent"
              >
                {concept.status}
              </span>
            </div>

            <h3 className="mt-3 font-display text-2xl font-medium sm:text-3xl">
              {concept.name}
            </h3>

            <div className="mt-2 rounded border border-line/60 bg-bg p-2 font-mono text-[11px] text-muted">
              <span className="font-semibold text-accent">SIGNAL ADDRESSED:</span>{" "}
              <span className="text-ink2">{concept.signal}</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink2">
              {concept.description}
            </p>

            <div className="mt-6">
              <p className="mono-label mb-2">PROPOSED ARCHITECTURE</p>
              <ul className="space-y-1.5">
                {concept.architecture.map((item) => (
                  <li key={item} className="flex gap-2 text-xs leading-relaxed text-muted">
                    <span aria-hidden className="text-accent">
                      ▸
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="mono-label mb-2">FAILURE SURFACE & DETECTION</p>
              <ul className="space-y-1.5">
                {concept.failureModes.map((mode) => (
                  <li key={mode} className="flex gap-2 text-xs leading-relaxed text-muted">
                    <span aria-hidden className="text-accent">
                      ▪
                    </span>
                    {mode}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
              <div>
                <span className="text-muted">FORMULA: </span>
                <span className="text-ink2">{concept.metrics.formula}</span>
              </div>
              <div>
                <span className="text-muted">ConceptValue: </span>
                <span className="font-bold text-accent">
                  {concept.metrics.conceptValue.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {concept.tags.map((tag) => (
                <span key={tag} className="chip text-[9px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
