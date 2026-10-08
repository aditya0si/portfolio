import { toolLogos } from "@/lib/tools";

export default function ToolsGrid() {
  return (
    <ul className="flex flex-wrap gap-3">
      {toolLogos.map((tool) => (
        <li key={tool.name}>
          <a
            href={tool.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`${tool.name} — opens official source`}
            aria-label={`${tool.name}. Opens the official ${tool.name} source.`}
            className={`flex h-11 w-11 items-center justify-center border border-line transition-colors hover:border-line-strong focus-visible:border-accent ${
              tool.background === "dark" ? "bg-[#0d0d0f]" : "bg-white"
            }`}
          >
            <img
              src={tool.src}
              alt={tool.alt}
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
              className="h-7 w-7 object-contain"
            />
            <span className="sr-only">{tool.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
