import { execSync } from 'child_process';
import fs from 'fs';

let raw = fs.readFileSync('research/repo_details.json', 'utf8');
const repos = JSON.parse(raw);

const deepInspect = [
  'schemeGPT', 'Sentinel', 'mcp-from-scratch', 'OpenCode-Team',
  'grounded-knowledge-platform', 'event-stream-platform', 'tenant-api-platform',
  'CoverAI', 'DevAtlas', 'TheButterFlyEffect', 'aegis', 'pharmforge',
  'skyguard', 'bustwatch', 'floodlens', 'E-commerce-Dashboard', 'vibe-odds'
];

const results = {};

for (const name of deepInspect) {
  try {
    const readmeOut = execSync(`gh api repos/aditya0si/${name}/readme --jq .content`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const decoded = Buffer.from(readmeOut.trim(), 'base64').toString('utf8');
    results[name] = {
      readme: decoded,
    };
  } catch (e) {
    results[name] = { readme: 'NONE' };
  }

  try {
    const treeOut = execSync(`gh api repos/aditya0si/${name}/git/trees/HEAD?recursive=1`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const tree = JSON.parse(treeOut);
    results[name].files = (tree.tree || []).map(t => t.path);
  } catch (e) {
    results[name].files = [];
  }
}

fs.writeFileSync('research/deep_inspect.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Deep inspection complete for', deepInspect.length, 'projects.');
