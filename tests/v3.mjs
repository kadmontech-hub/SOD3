import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [views, styles, content, store, ui, pkg] = await Promise.all([
  readFile(new URL('../public/js/views.js', import.meta.url), 'utf8'),
  readFile(new URL('../public/styles.css', import.meta.url), 'utf8'),
  readFile(new URL('../public/js/content.js', import.meta.url), 'utf8'),
  readFile(new URL('../public/js/store.js', import.meta.url), 'utf8'),
  readFile(new URL('../public/js/ui.js', import.meta.url), 'utf8'),
  readFile(new URL('../package.json', import.meta.url), 'utf8'),
]);

assert.match(pkg, /"version": "3\.0\.[01]"/);
assert.match(views, /function transformationView/);
assert.match(views, /if\(route==='\/experiencia'\)return transformationView\(\)/);
assert.match(views, /La Semilla ya existía/);
assert.match(views, /No se crea un Código si no hubo transición/);
assert.match(views, /linkedSeedIds:\[data\.seed\.id\]/);
assert.match(views, /class="elements-sanctuary"/);
assert.match(views, /PLACEHOLDER VISUAL/);
assert.match(views, /class="hub-need-dock"/);
assert.match(styles, /SØD VISUAL MVP V3/);
assert.match(styles, /\.force-gates/);
assert.match(styles, /\.transformation-world/);
assert.match(content, /visual:'\/assets\/sod-visual\/048\.png'/);
assert.match(content, /placeholder:true/);
assert.match(store, /seedStates:\{\}/);
assert.match(ui, /world-nav-v3/);
console.log('V3 product mockup tests passed: spatial Hub, monumental Elements 33, functional transformation cycle and placeholder registry hooks');
