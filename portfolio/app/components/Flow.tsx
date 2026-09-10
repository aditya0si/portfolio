export default function Flow({
  steps,
  label = "PIPELINE",
}: {
  steps: readonly string[];
  label?: string;
}) {
  return (
    <div>
      <p className="mono-label mb-3">{label}</p>
      <div
        className="flex flex-wrap items-center gap-x-2 gap-y-2"
        aria-label="System pipeline, left to right"
      >
        {steps.map((step, i) => (
          <span key={step} className="flex items-center gap-x-2">
            {i > 0 && (
              <span aria-hidden className="font-mono text-[11px] text-accent">
                →
              </span>
            )}
            <span className="schematic-box">{step}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
