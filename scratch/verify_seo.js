import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of list) {
    if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'scratch') continue;
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (ent.isFile() && ent.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(rootDir);
console.log(`Auditing ${htmlFiles.length} HTML files...`);

let issuesFound = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(rootDir, file);

  // 1. Check <title>
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1];
    if (title.includes('&amp;')) {
      console.error(`❌ [${relPath}] <title> contains '&amp;': "${title}"`);
      issuesFound++;
    }
  }

  // 2. Check meta description
  const metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  if (metaDescMatch) {
    const desc = metaDescMatch[1];
    if (desc.includes('&amp;')) {
      console.error(`❌ [${relPath}] meta description contains '&amp;': "${desc.slice(0, 80)}..."`);
      issuesFound++;
    }
  }

  // 3. Check og:title and og:description
  const ogTitleMatch = content.match(/<meta\s+property=["']og:title["']\s+content=["']([\s\S]*?)["']/i);
  if (ogTitleMatch && ogTitleMatch[1].includes('&amp;')) {
    console.error(`❌ [${relPath}] og:title contains '&amp;': "${ogTitleMatch[1]}"`);
    issuesFound++;
  }
  const ogDescMatch = content.match(/<meta\s+property=["']og:description["']\s+content=["']([\s\S]*?)["']/i);
  if (ogDescMatch && ogDescMatch[1].includes('&amp;')) {
    console.error(`❌ [${relPath}] og:description contains '&amp;': "${ogDescMatch[1].slice(0, 80)}..."`);
    issuesFound++;
  }

  // 4. Check twitter tags
  const twTitleMatch = content.match(/<meta\s+name=["']twitter:title["']\s+content=["']([\s\S]*?)["']/i);
  if (twTitleMatch && twTitleMatch[1].includes('&amp;')) {
    console.error(`❌ [${relPath}] twitter:title contains '&amp;': "${twTitleMatch[1]}"`);
    issuesFound++;
  }

  // 5. Check all alt attributes
  const altRegex = /alt=["']([\s\S]*?)["']/gi;
  let match;
  while ((match = altRegex.exec(content)) !== null) {
    const altVal = match[1];
    if (altVal.includes('&amp;')) {
      console.error(`❌ [${relPath}] alt attribute contains '&amp;': "${altVal}"`);
      issuesFound++;
    }
    if (altVal.trim() === '') {
      // Check if it's purely decorative
      console.warn(`⚠️ [${relPath}] empty alt attribute found: alt=""`);
    }
  }

  // 6. Check JSON-LD structured data
  const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let jMatch;
  while ((jMatch = jsonLdRegex.exec(content)) !== null) {
    const jsonStr = jMatch[1];
    if (jsonStr.includes('&amp;')) {
      console.error(`❌ [${relPath}] JSON-LD script contains literal '&amp;'!`);
      issuesFound++;
    }
    try {
      JSON.parse(jsonStr);
    } catch (e) {
      console.error(`❌ [${relPath}] JSON-LD script failed to parse as valid JSON:`, e.message);
      issuesFound++;
    }
  }
}

if (issuesFound === 0) {
  console.log(`\n🎉 PERFECT! All ${htmlFiles.length} HTML files verified: 0 &amp; glitches in title, meta, alt, or JSON-LD!`);
} else {
  console.error(`\nFound ${issuesFound} issues.`);
}
