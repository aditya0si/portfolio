import fs from 'fs';

function cleanHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<style[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&quot;/g, '\"')
             .replace(/&#39;/g, "'")
             .replace(/&nbsp;/g, ' ')
             .replace(/\s+/g, ' ');
}

// Palantir
const palHtml = fs.readFileSync('research/job_dumps/palantir.html', 'utf8');
const palClean = cleanHtml(palHtml);
console.log('=== PALANTIR ===');
const pStart = palClean.indexOf('The Role');
const pEnd = palClean.indexOf('Salary Information') !== -1 ? palClean.indexOf('Salary Information') : palClean.indexOf('Apply for this job');
console.log(palClean.slice(pStart, pEnd));

// Databricks 8432827002
const dbFdeJson = JSON.parse(fs.readFileSync('research/job_dumps/db_8432827002.json', 'utf8'));
console.log('\n=== DATABRICKS FDE (8432827002) ===');
console.log(cleanHtml(dbFdeJson.content));

// Databricks 8468436002
const dbGwJson = JSON.parse(fs.readFileSync('research/job_dumps/db_8468436002.json', 'utf8'));
console.log('\n=== DATABRICKS GATEWAY (8468436002) ===');
console.log(cleanHtml(dbGwJson.content));

// Vercel SDK
const vSdkHtml = fs.readFileSync('research/job_dumps/vercel_sdk.html', 'utf8');
const vSdkClean = cleanHtml(vSdkHtml);
console.log('\n=== VERCEL SDK ===');
const vsStart = vSdkClean.indexOf('About the Role:');
const vsEnd = vSdkClean.indexOf('Benefits:') !== -1 ? vSdkClean.indexOf('Benefits:') : vsStart + 2000;
console.log(vSdkClean.slice(vsStart, vsEnd));

// Vercel Gateway
const vGwHtml = fs.readFileSync('research/job_dumps/vercel_gateway.html', 'utf8');
const vGwClean = cleanHtml(vGwHtml);
console.log('\n=== VERCEL GATEWAY ===');
const vgStart = vGwClean.indexOf('About the Role:');
const vgEnd = vGwClean.indexOf('Benefits:') !== -1 ? vGwClean.indexOf('Benefits:') : vgStart + 2000;
console.log(vGwClean.slice(vgStart, vgEnd));

// Cursor
const curHtml = fs.readFileSync('research/job_dumps/cursor_product.html', 'utf8');
const curClean = cleanHtml(curHtml);
console.log('\n=== CURSOR PRODUCT ===');
const cStart = curClean.indexOf('About the Role');
console.log(curClean.slice(cStart, cStart + 1500));
