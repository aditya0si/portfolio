// Presentation manifest for the featured public frontends surfaced on Home.
//
// These three deployments are the only public frontends that clear the
// "genuinely useful" bar: a real, navigable interface rather than an empty
// dashboard or a login-only shell. DevAtlas ships a real frontend but renders
// no data, and StockFlow is gated behind a backend sign-in, so both are
// deliberately excluded rather than padded with fabricated content.
//
// Each record links a verified HTTPS deployment, a locally captured homepage
// screenshot (copied from the audit evidence, never synthesised), the exact
// technology names, the local logo assets from lib/tools.ts, a <= 140 character
// summary, and an honest limitation describing what is not callable.

import { toolLogos, type ToolLogo } from "./tools";

export type FeaturedFrontend = {
  slug: string;
  name: string;
  url: string;
  sourceUrl: string;
  screenshot: string;
  technologies: string[];
  logos: ToolLogo[];
  summary: string;
  limitation: string;
};

const logosFor = (names: string[]): ToolLogo[] =>
  names.map((name) => {
    const logo = toolLogos.find((entry) => entry.name === name);
    if (!logo) {
      throw new Error(`Featured frontend technology missing a local logo: ${name}`);
    }
    return logo;
  });

const records: Omit<FeaturedFrontend, "logos">[] = [
  {
    slug: "schemegpt",
    name: "SchemeGPT",
    url: "https://schemegpt-web.vercel.app",
    sourceUrl: "https://github.com/aditya0si/schemeGPT",
    screenshot: "/projects/schemegpt-homepage.png",
    technologies: ["Next.js", "React", "TypeScript", "Python", "PostgreSQL"],
    summary:
      "Welfare-scheme guidance with hybrid retrieval and source-linked answers.",
    limitation:
      "Live answering API is explicitly offline; retrieval cannot be called here.",
  },
  {
    slug: "samjho",
    name: "samjho",
    url: "https://samjho-adityasinghprojects.vercel.app",
    sourceUrl: "https://github.com/aditya0si/samjho",
    screenshot: "/projects/samjho-homepage.png",
    technologies: ["Next.js", "React", "TypeScript", "Python"],
    summary:
      "Study companion pairing a syllabus with interactive animated explanations.",
    limitation:
      "Questions and quizzes require the undeployed API; syllabus and animations work.",
  },
  {
    slug: "coverai",
    name: "CoverAI",
    url: "https://cover-ai-web.vercel.app",
    sourceUrl: "https://github.com/aditya0si/CoverAI",
    screenshot: "/projects/coverai-homepage.png",
    technologies: ["Next.js", "React", "TypeScript", "Python"],
    summary: "Insurance copilot interface for policy Q&A and claims triage.",
    limitation: "Backend not verified; this is the frontend interface only.",
  },
];

export const featuredFrontends: FeaturedFrontend[] = records.map((record) => ({
  ...record,
  logos: logosFor(record.technologies),
}));
