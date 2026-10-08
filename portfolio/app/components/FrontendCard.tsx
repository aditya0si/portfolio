import Image from "next/image";
import { Code2, Globe } from "lucide-react";
import type { FeaturedFrontend } from "@/lib/featured-frontends";

export default function FrontendCard({ frontend }: { frontend: FeaturedFrontend }) {
  return (
    <article data-frontend-card={frontend.slug} className="project-card">
      <div className="overflow-hidden border border-line bg-surface">
        <Image
          src={frontend.screenshot}
          alt={`${frontend.name} homepage`}
          width={1440}
          height={960}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl font-medium">{frontend.name}</h3>
        <div className="flex items-center gap-4">
          <a
            href={frontend.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${frontend.name} live site in a new tab`}
            className="project-link"
          >
            <Globe aria-hidden="true" className="h-5 w-5" />
          </a>
          <a
            href={frontend.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${frontend.name} source code in a new tab`}
            data-source-link={frontend.slug}
            className="project-link flex items-center gap-1.5 text-sm"
          >
            <Code2 aria-hidden="true" className="h-4 w-4" />
            Source code
          </a>
        </div>
      </div>

      <p className="text-sm text-ink2">{frontend.summary}</p>

      <ul
        aria-label={`${frontend.name} technologies`}
        className="flex flex-wrap gap-2"
      >
        {frontend.logos.map((logo) => (
          <li key={logo.name} className="chip flex items-center gap-1.5">
            <Image
              src={logo.src}
              alt=""
              aria-hidden="true"
              width={14}
              height={14}
            />
            {logo.name}
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted">{frontend.limitation}</p>
    </article>
  );
}
