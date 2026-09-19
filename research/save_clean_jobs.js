import fs from 'fs';

function cleanHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<style[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'")
             .replace(/&#x27;/g, "'")
             .replace(/&nbsp;/g, ' ')
             .replace(/\s+/g, ' ');
}

// 1. Anthropic 5057647008
const antHtml = fs.readFileSync('C:/Users/oliad/.gemini/antigravity-cli/brain/aca9ece5-4ec4-4bf9-a789-39143ddb1b98/.system_generated/steps/68/content.md', 'utf8');
const antClean = cleanHtml(antHtml);
const antStart = antClean.indexOf('Applied AI Engineer, Enterprise Tech');
const antEnd = antClean.indexOf('Apply for this job');
fs.writeFileSync('research/job_dumps/clean_anthropic_5057647008.txt', antClean.slice(antStart, antEnd));

// 2. Palantir
const palHtml = fs.readFileSync('research/job_dumps/palantir.html', 'utf8');
const palClean = cleanHtml(palHtml);
const pStart = palClean.indexOf('The Role');
const pEnd = palClean.indexOf('Salary Information') !== -1 ? palClean.indexOf('Salary Information') : palClean.indexOf('Apply for this job');
fs.writeFileSync('research/job_dumps/clean_palantir_1bb19522.txt', palClean.slice(pStart, pEnd));

// 3. Databricks FDE (8432827002)
const dbFdeJson = JSON.parse(fs.readFileSync('research/job_dumps/db_8432827002.json', 'utf8'));
fs.writeFileSync('research/job_dumps/clean_databricks_8432827002.txt', cleanHtml(dbFdeJson.content));

// 4. Databricks Gateway (8468436002)
const dbGwJson = JSON.parse(fs.readFileSync('research/job_dumps/db_8468436002.json', 'utf8'));
fs.writeFileSync('research/job_dumps/clean_databricks_8468436002.txt', cleanHtml(dbGwJson.content));

// 5. Vercel SDK (5474915004)
const vSdkHtml = fs.readFileSync('research/job_dumps/vercel_sdk.html', 'utf8');
const vSdkClean = cleanHtml(vSdkHtml);
const vsStart = vSdkClean.indexOf('About the Role:');
const vsEnd = vSdkClean.indexOf('Benefits:') !== -1 ? vSdkClean.indexOf('Benefits:') : vsStart + 2000;
fs.writeFileSync('research/job_dumps/clean_vercel_5474915004.txt', vSdkClean.slice(vsStart, vsEnd));

// 6. Vercel Gateway
const vGwHtml = fs.readFileSync('research/job_dumps/vercel_gateway.html', 'utf8');
const vGwClean = cleanHtml(vGwHtml);
const vgStart = vGwClean.indexOf('About the Role:');
const vgEnd = vGwClean.indexOf('Benefits:') !== -1 ? vGwClean.indexOf('Benefits:') : vgStart + 2000;
fs.writeFileSync('research/job_dumps/clean_vercel_gateway.txt', vGwClean.slice(vgStart, vgEnd));

// 7. Cursor Product
const curHtml = fs.readFileSync('research/job_dumps/cursor_product.html', 'utf8');
const curClean = cleanHtml(curHtml);
const cStart = curClean.indexOf('About the Role');
const cEnd = curClean.indexOf('Apply for this role');
fs.writeFileSync('research/job_dumps/clean_cursor_product.txt', curClean.slice(cStart, cEnd));

console.log('Saved 7 clean text files in research/job_dumps/');
