import fs from 'fs';

function clean(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<style[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&quot;/g, '\"')
             .replace(/&nbsp;/g, ' ')
             .replace(/\s+/g, ' ');
}

// 1. Anthropic 5057647008
const antHtml = fs.readFileSync('C:/Users/oliad/.gemini/antigravity-cli/brain/aca9ece5-4ec4-4bf9-a789-39143ddb1b98/.system_generated/steps/68/content.md', 'utf8');
const antText = clean(antHtml);

console.log('=== Anthropic 5057647008 ===');
const antIdx = antText.indexOf('Applied AI Engineer, Enterprise Tech');
console.log(antText.slice(antIdx, antIdx + 1500));

// 2. Palantir
console.log('\n=== Palantir 1bb19522 ===');
const palText = clean(fs.readFileSync('research/job_dumps/palantir.html', 'utf8'));
const palIdx = palText.indexOf('Forward Deployed Software Engineer');
console.log(palText.slice(palIdx, palIdx + 1500));

// 3. Databricks FDE
console.log('\n=== Databricks FDE 8432827002 ===');
const dbFdeText = clean(fs.readFileSync('research/job_dumps/databricks_fde.html', 'utf8'));
const dbFdeIdx = dbFdeText.indexOf('Forward Deployed Engineer');
console.log(dbFdeText.slice(dbFdeIdx, dbFdeIdx + 1500));

// 4. Databricks Gateway
console.log('\n=== Databricks Gateway 8468436002 ===');
const dbGwText = clean(fs.readFileSync('research/job_dumps/databricks_gateway.html', 'utf8'));
const dbGwIdx = dbGwText.indexOf('Staff Backend Software Engineer');
console.log(dbGwText.slice(dbGwIdx, dbGwIdx + 1500));

// 5. Vercel SDK
console.log('\n=== Vercel SDK 5474915004 ===');
const vSdkText = clean(fs.readFileSync('research/job_dumps/vercel_sdk.html', 'utf8'));
const vSdkIdx = vSdkText.indexOf('Software Engineer, AI SDK');
console.log(vSdkText.slice(vSdkIdx, vSdkIdx + 1500));

// 6. Vercel Gateway
console.log('\n=== Vercel Gateway ===');
const vGwText = clean(fs.readFileSync('research/job_dumps/vercel_gateway.html', 'utf8'));
const vGwIdx = vGwText.indexOf('Software Engineer, AI Gateway');
console.log(vGwText.slice(vGwIdx, vGwIdx + 1500));

// 7. Cursor
console.log('\n=== Cursor Product ===');
const curText = clean(fs.readFileSync('research/job_dumps/cursor_product.html', 'utf8'));
const curIdx = curText.indexOf('Software Engineer, Product');
console.log(curText.slice(curIdx, curIdx + 1500));

// 8. Google
console.log('\n=== Google AI ===');
const googText = clean(fs.readFileSync('research/job_dumps/google_ai.html', 'utf8'));
const googIdx = googText.indexOf('AI Engineer, Google Cloud');
console.log(googText.slice(googIdx, googIdx + 1500));
