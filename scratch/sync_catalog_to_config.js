import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { servicesCatalog as defaultCatalog } from '../scripts/services-builder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const siteConfigFile = path.join(rootDir, 'data', 'site-config.json');

const siteConfig = JSON.parse(fs.readFileSync(siteConfigFile, 'utf8'));

// Format catalog without functions (projectMatcher) for JSON storage
const serializableCatalog = defaultCatalog.map(svc => {
  const { projectMatcher, ...rest } = svc;
  return rest;
});

siteConfig.servicesCatalog = serializableCatalog;

fs.writeFileSync(siteConfigFile, JSON.stringify(siteConfig, null, 2), 'utf8');
console.log('Successfully updated site-config.json with full servicesCatalog!');
