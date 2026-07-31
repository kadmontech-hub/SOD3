import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import health from '../api/health.mjs';
import dialogue from '../api/dialogue.mjs';

const healthResponse = await health(new Request('https://example.test/api/health'));
assert.equal(healthResponse.status, 200);
assert.equal((await healthResponse.json()).ok, true);

const dialogueResponse = await dialogue(new Request('https://example.test/api/dialogue', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ message: 'Necesito claridad para decidir' }),
}));
assert.equal(dialogueResponse.status, 200);
assert.match((await dialogueResponse.json()).reply, /claridad|decisión/i);

const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
assert.equal(config.outputDirectory, 'dist');
await stat(new URL('../dist/index.html', import.meta.url));
console.log('Vercel deployment tests passed');
