#!/usr/bin/env node

/**
 * Reconcile GitHub Actions evidence for every repository snapshot.
 * A workflow file is configuration only; this script records actual runs at
 * each audited commit SHA without promoting missing runs to success.
 */
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const evidencePath = path.join(__dirname, "real_repo_evidence.json");
const outputPath = path.join(__dirname, "ci-reconciliation.json");
const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8"));

const repositories = [];
for (const [key, repo] of Object.entries(evidence)) {
  const name = repo.name || key;
  const commitSha = repo.commitSha || null;
  const workflowFiles = Array.isArray(repo.tree)
    ? repo.tree.filter((entry) => entry.type === "blob" && entry.path.startsWith(".github/workflows/"))
        .map((entry) => entry.path)
    : [];

  if (!commitSha) {
    repositories.push({ name, commit_sha: null, workflow_files: workflowFiles, status: "missing_audited_sha", runs: [] });
    continue;
  }

  const result = spawnSync(
    "gh",
    ["run", "list", "--repo", `aditya0si/${name}`, "--commit", commitSha, "--limit", "20", "--json", "databaseId,name,workflowName,status,conclusion,headSha,url,event,createdAt,updatedAt"],
    { cwd: root, encoding: "utf8", shell: process.platform === "win32" }
  );

  if (result.status !== 0) {
    repositories.push({
      name,
      commit_sha: commitSha,
      workflow_files: workflowFiles,
      status: "query_error",
      error: (result.stderr || result.stdout || "unknown gh error").trim(),
      runs: [],
    });
    continue;
  }

  const runs = JSON.parse(result.stdout || "[]");
  const hasSuccess = runs.some((run) => run.conclusion === "success" && run.headSha === commitSha);
  repositories.push({
    name,
    commit_sha: commitSha,
    workflow_files: workflowFiles,
    status: hasSuccess ? "successful_run_at_audited_sha" : runs.length ? "runs_observed_without_success" : "no_runs_at_audited_sha",
    runs,
  });
}

const counts = repositories.reduce((acc, repo) => {
  acc[repo.status] = (acc[repo.status] || 0) + 1;
  return acc;
}, {});

const output = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  scope: "GitHub Actions runs queried at the 47 immutable SHAs in real_repo_evidence.json",
  caveat: "A workflow file is configuration observed, not a successful run. Empty results remain no_runs_at_audited_sha.",
  counts,
  repositories,
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ output: path.relative(root, outputPath), repositories: repositories.length, counts }, null, 2));
