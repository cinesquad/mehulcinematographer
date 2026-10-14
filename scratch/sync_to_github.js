import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const resolvedDest = '/Users/joy/Documents/GitHub/mehulcinematographer';

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  const files = fs.readdirSync(source);
  for (const file of files) {
    if (file === '.DS_Store' || file === 'Thumbs.db') continue;
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

const excludedNames = new Set([
  'admin', 'data', 'scripts', 'node_modules', 'package.json',
  'package-lock.json', 'start-admin.command', 'AGENTS.md',
  'IDEA.md', 'design.md', 'README.md', 'scratch'
]);

const essentialItems = [
  'index.html', '404.html', 'sitemap.xml', 'video-sitemap.xml',
  'robots.txt', '_redirects', '_headers', '_astro', 'media',
  'portfolio', 'video', 'blog', 'advertising-films',
  'industrial-corporate-films', 'music-videos', 'services',
  'corporate-shoots', 'commercial-shoots', 'architecture-shoots',
  'real-estate-shoots', 'product-shoots', 'about', 'clients', 'contact'
];

const itemsToExport = new Set(essentialItems);
const rootEntries = fs.readdirSync(rootDir);
for (const entry of rootEntries) {
  if (entry.startsWith('.') && entry !== '.well-known') continue;
  if (excludedNames.has(entry)) continue;
  if (entry.endsWith('.md') || entry.endsWith('.backup')) continue;
  itemsToExport.add(entry);
}

let copiedCount = 0;
for (const item of itemsToExport) {
  const srcPath = path.join(rootDir, item);
  const dstPath = path.join(resolvedDest, item);
  if (fs.existsSync(srcPath)) {
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderRecursiveSync(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
    copiedCount++;
  }
}

console.log(`Successfully synced ${copiedCount} clean assets to ${resolvedDest}`);
