"use client";

import { useEffect, useState } from "react";
import { fallbackRepos, flagships, profile } from "@/lib/data";

type Repo = {
  name: string;
  description: string;
  language: string | null;
  pushed: string;
  url: string;
};

const FEATURED = new Set(flagships.map((f) => f.repo.toLowerCase()));
const PERIODIC = new Set(["aditya0si", "portfolio", "claw-code"]);

// Curate toward the site's AI-systems narrative: AI/agent repos rank first,
// then by recency. Everything remains one click away on the GitHub profile.
const AI_RE =
  /(rag|agent|llm|mcp|ocr|eval|graph|prompt|\bnlp\b|gpt|langgraph|langchain|guardrail|bot|vision|\bai\b)/i;
const isAiRepo = (r: { name: string; description: string }) =>
  AI_RE.test(r.name) || AI_RE.test(r.description);

export default function GitHubLive() {
  const [repos, setRepos] = useState<Repo[]>(fallbackRepos as unknown as Repo[]);
  const [count, setCount] = useState<number | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const own = data.filter(
          (r: any) => !r.fork && !PERIODIC.has(r.name.toLowerCase())
        );
        const rest: Repo[] = own
          .filter((r: any) => !FEATURED.has(r.name.toLowerCase()))
          .map((r: any) => ({
            name: r.name,
            description: r.description || "—",
            language: r.language,
            pushed: (r.pushed_at as string).slice(0, 10),
            url: r.html_url,
          }))
          .sort(
            (a: Repo, b: Repo) =>
              Number(isAiRepo(b)) - Number(isAiRepo(a)) ||
              Date.parse(b.pushed) - Date.parse(a.pushed)
          )
          .slice(0, 8);
        if (cancelled || rest.length === 0) return;
        setRepos(rest);
        setCount(own.length);
        setLive(true);
      } catch {
        // offline or rate-limited — cached snapshot stays
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="mono-label">
          {live ? "LIVE FROM GITHUB API — AI SYSTEMS FIRST" : "CACHED SNAPSHOT"}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {count ?? 38} PUBLIC REPOS · EXCLUDING FEATURED
        </p>
      </div>

      <ul className="border-t border-line">
        {repos.map((repo) => (
          <li key={repo.name} className="border-b border-line">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-4 transition-colors md:grid-cols-[13rem_1fr_6rem_6.5rem_auto]"
            >
              <span className="font-mono text-[13px] text-ink transition-colors group-hover:text-accent">
                {repo.name}
              </span>
              <span className="col-span-2 text-sm text-muted md:col-span-1 md:truncate">
                {repo.description}
              </span>
              <span className="hidden font-mono text-[11px] text-muted md:block">
                {repo.language ?? "—"}
              </span>
              <span className="hidden text-right font-mono text-[11px] tabular-nums text-muted md:block">
                {repo.pushed}
              </span>
              <span
                aria-hidden
                className="font-mono text-[12px] text-muted transition-all group-hover:-translate-y-0.5 group-hover:text-accent"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          ALL REPOSITORIES ↗
        </a>
      </div>
    </div>
  );
}
