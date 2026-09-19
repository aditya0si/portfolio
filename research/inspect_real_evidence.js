import { execSync } from 'child_process';
import fs from 'fs';

let raw = fs.readFileSync('research/all_repos.json', 'utf8').replace(/^\uFEFF/, '');
const repos = JSON.parse(raw);

console.log(`Starting hardened inspection of real evidence across ${repos.length} repos...`);

const OUT_PATH = 'research/real_repo_evidence.json';
let evidence = {};
if (fs.existsSync(OUT_PATH)) {
  try {
    evidence = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
    console.log(`Resuming from ${Object.keys(evidence).length} already-inspected repos.`);
  } catch (e) {
    evidence = {};
  }
}

for (const [idx, r] of repos.entries()) {
  const name = r.name;
  if (evidence[name] && evidence[name].commitSha && !evidence[name].error) {
    console.log(`[${idx + 1}/${repos.length}] Skipping ${name} (already recorded).`);
    continue;
  }

  console.log(`[${idx + 1}/${repos.length}] Deeply inspecting ${name}...`);
  const item = {
    name,
    url: r.url || `https://github.com/aditya0si/${name}`,
    isPrivate: r.isPrivate,
    isArchived: r.isArchived,
    isFork: r.isFork,
    description: r.description || '',
    defaultBranch: r.defaultBranchRef?.name || 'main',
    pushedAt: r.pushedAt || null,
    commitSha: null,
    commitTimestamp: null,
    languages: {},
    tree: [],
    treeCount: 0,
    workflows: [],
    manifests: {},
    testFiles: [],
    benchmarkFiles: [],
    adrFiles: [],
    readme: '',
    apiErrors: {},
  };

  // 1. Commit SHA & Timestamp
  try {
    const commitRaw = execSync(`gh api repos/aditya0si/${name}/commits/HEAD --jq "{sha: .sha, date: .commit.committer.date}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 15000
    });
    const parsed = JSON.parse(commitRaw);
    item.commitSha = parsed.sha;
    item.commitTimestamp = parsed.date;
  } catch (e) {
    item.apiErrors.commit = e.message;
  }

  // 2. Languages
  try {
    const langRaw = execSync(`gh api repos/aditya0si/${name}/languages`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 10000
    });
    item.languages = JSON.parse(langRaw);
  } catch (e) {
    item.apiErrors.languages = e.message;
  }

  // 3. Recursive Tree
  try {
    const treeRaw = execSync(`gh api repos/aditya0si/${name}/git/trees/HEAD?recursive=1`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 15 * 1024 * 1024,
      timeout: 20000
    });
    const parsedTree = JSON.parse(treeRaw);
    const treeList = (parsedTree.tree || []).map(t => ({ path: t.path, type: t.type, size: t.size }));
    item.tree = treeList;
    item.treeCount = treeList.length;

    // Categorize paths
    for (const t of treeList) {
      const p = t.path;
      const lower = p.toLowerCase();
      if (lower.startsWith('.github/workflows/') && (lower.endsWith('.yml') || lower.endsWith('.yaml'))) {
        item.workflows.push(p);
      }
      if (lower.includes('test') || lower.includes('spec') || lower.endsWith('_test.go')) {
        item.testFiles.push(p);
      }
      if (lower.includes('bench') || lower.includes('load') || lower.includes('k6') || lower.includes('perf')) {
        item.benchmarkFiles.push(p);
      }
      if (lower.includes('adr-') || lower.includes('docs/adr/')) {
        item.adrFiles.push(p);
      }
    }
  } catch (e) {
    item.apiErrors.tree = e.message;
  }

  // 4. Key Manifests to fetch if in tree
  const targetManifests = [
    'go.mod', 'go.sum', 'package.json', 'web/package.json',
    'requirements.txt', 'requirements-eval.txt', 'pyproject.toml',
    'Cargo.toml', 'Dockerfile', 'docker-compose.yml', 'docker-compose.yaml',
    'Makefile', 'load/results.json', 'load/ingest-results.json',
    'load/e2e-results.json', 'load/sse-results.json'
  ];

  for (const tm of targetManifests) {
    if (item.tree.some(t => t.path === tm)) {
      try {
        const fileRaw = execSync(`gh api repos/aditya0si/${name}/contents/${tm} --jq .content`, {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: 10000
        });
        const decoded = Buffer.from(fileRaw.trim(), 'base64').toString('utf8');
        item.manifests[tm] = decoded;
      } catch (e) {
        item.apiErrors[`manifest_${tm}`] = e.message;
      }
    }
  }

  // 5. README
  try {
    const readmeRaw = execSync(`gh api repos/aditya0si/${name}/readme --jq .content`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 10000
    });
    item.readme = Buffer.from(readmeRaw.trim(), 'base64').toString('utf8');
  } catch (e) {
    item.apiErrors.readme = e.message;
  }

  evidence[name] = item;
  // Progressively write to disk so no data is lost
  fs.writeFileSync(OUT_PATH, JSON.stringify(evidence, null, 2), 'utf8');
}

console.log(`Inspection complete. All ${Object.keys(evidence).length} repositories saved to ${OUT_PATH}`);
