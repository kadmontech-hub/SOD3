import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public');
const output = path.join(root, 'dist');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const required = [
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'sw.js',
  'js/app.js',
  'js/views.js',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
];

for (const file of required) {
  await stat(path.join(output, file));
}

console.log(`SØD build complete: ${output}`);
