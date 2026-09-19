import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

let raw = fs.readFileSync('research/all_repos.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const repos = JSON.parse(raw);

console.log(`Analyzing ${repos.length} repositories...`);

const repoDetails = [];

for (const [idx, r] of repos.entries()) {
  const repoName = r.name;
  console.log(`[${idx + 1}/${repos.length}] Inspecting ${repoName}...`);

  const item = {
    name: repoName,
    url: r.url || `https://github.com/aditya0si/${repoName}`,
    isPrivate: r.isPrivate,
    isFork: r.isFork,
    isArchived: r.isArchived,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    pushedAt: r.pushedAt,
    description: r.description || '',
    homepageUrl: r.homepageUrl || '',
    stargazerCount: r.stargazerCount || 0,
    forkCount: r.forkCount || 0,
    defaultBranch: r.defaultBranchRef?.name || 'main',
    languages: {},
    rootFiles: [],
    workflows: [],
    hasTests: false,
    testPaths: [],
    hasCi: false,
    hasDocker: false,
    readmeSnippet: '',
    error: null,
  };

  // If archived / private / empty, we still inspect if possible
  try {
    // 1. Languages
    const langOut = execSync(`gh api repos/aditya0si/${repoName}/languages`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    item.languages = JSON.parse(langOut);
  } catch (e) {
    // ignore
  }

  try {
    // 2. Contents
    const contentsOut = execSync(`gh api repos/aditya0si/${repoName}/contents`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const contents = JSON.parse(contentsOut);
    if (Array.isArray(contents)) {
      item.rootFiles = contents.map(c => ({ name: c.name, type: c.type, size: c.size }));
      item.hasDocker = contents.some(c => c.name.toLowerCase().includes('docker'));
    }
  } catch (e) {
    // could be empty repo
  }

  try {
    // 3. Workflows
    const wfOut = execSync(`gh api repos/aditya0si/${repoName}/contents/.github/workflows`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const wfs = JSON.parse(wfOut);
    if (Array.isArray(wfs)) {
      item.workflows = wfs.map(w => w.name);
      item.hasCi = wfs.length > 0;
    }
  } catch (e) {
    // no workflows
  }

  try {
    // 4. README
    const readmeOut = execSync(`gh api repos/aditya0si/${repoName}/readme --jq .content`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const decoded = Buffer.from(readmeOut.trim(), 'base64').toString('utf8');
    item.readmeSnippet = decoded.slice(0, 1500);
    item.fullReadmeLength = decoded.length;
  } catch (e) {
    // no readme
  }

  // 5. Check tests in rootFiles or tree
  const rootFileNames = item.rootFiles.map(f => f.name.toLowerCase());
  const testIndicators = ['test', 'tests', 'test.py', 'test.js', 'test.ts', 'pytest.ini', 'jest.config.js', 'vitest.config.ts', '__tests__'];
  for (const ti of testIndicators) {
    if (rootFileNames.includes(ti)) {
      item.hasTests = true;
      item.testPaths.push(ti);
    }
  }

  repoDetails.push(item);
}

fs.writeFileSync('research/repo_details.json', JSON.stringify(repoDetails, null, 2), 'utf8');
console.log('Finished inspecting all repos. Output written to research/repo_details.json');
