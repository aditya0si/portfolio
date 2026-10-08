// Curated presentation layer over the audited flagships in data.ts.
// The five featured slugs are the only selections surfaced by the featured
// components; every summary below is constrained to <= 140 characters.

import { flagships, type Flagship } from "./data";

export const featuredSlugs = [
  "schemegpt",
  "stockflow",
  "sentinel",
  "tenant-api-platform",
  "event-stream-platform",
] as const;

export type FeaturedSlug = (typeof featuredSlugs)[number];

export const featuredProjects: Flagship[] = featuredSlugs.map((slug) => {
  const project = flagships.find((flagship) => flagship.slug === slug);
  if (!project) {
    throw new Error(`Featured project slug missing from flagships: ${slug}`);
  }
  return project;
});

export const projectPresentation: Record<string, { summary: string; liveUrl?: string }> = {
  schemegpt: {
    summary: "Find welfare-scheme guidance through hybrid retrieval and source-linked answers.",
  },
  stockflow: {
    summary: "Reserve inventory safely across concurrent buyers, retries, and fulfilment workflows.",
  },
  sentinel: {
    summary: "Apply schema, privacy, and grounding checks to agent completions with tracing.",
  },
  "tenant-api-platform": {
    summary: "Isolate tenant data and enforce quotas in a Go service and billing API.",
  },
  "event-stream-platform": {
    summary: "Ingest and process telemetry with partitioned consumers and dead-letter routing.",
  },
};
