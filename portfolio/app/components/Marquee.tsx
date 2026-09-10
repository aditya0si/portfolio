import { marqueeItems } from "@/lib/data";

export default function Marquee() {
  const row = (ariaHidden: boolean) => (
    <span
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
    >
      {marqueeItems.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-4">{item}</span>
          <span className="text-accent">▮</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="marquee overflow-hidden border-y border-line py-2.5">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
