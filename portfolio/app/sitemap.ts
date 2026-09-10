import type { MetadataRoute } from "next";
import { profile, flagships } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.site, changeFrequency: "monthly", priority: 1 },
    ...flagships.map((p) => ({
      url: `${profile.site}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
