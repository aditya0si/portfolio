import fs from 'fs';

let data = fs.readFileSync('research/all_repos.json', 'utf8');
if (data.charCodeAt(0) === 0xFEFF) data = data.slice(1);
const repos = JSON.parse(data);

console.log('Total repositories:', repos.length);
repos.forEach((r, idx) => {
  console.log(`${idx + 1}. ${r.name} | Priv: ${r.isPrivate} | Fork: ${r.isFork} | Arch: ${r.isArchived} | Stars: ${r.stargazerCount} | Pushed: ${r.pushedAt?.slice(0, 10)} | Desc: ${(r.description || '').slice(0, 50)}`);
});
