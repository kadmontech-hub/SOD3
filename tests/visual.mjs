import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const manifest=JSON.parse(await readFile(new URL('../public/assets/sod-visual/manifest.json',import.meta.url),'utf8'));
assert.equal(manifest.length,68,'All 68 source visuals must be represented');
assert.equal(new Set(manifest.map(x=>x.id)).size,68,'Visual IDs must be unique');
assert.equal(new Set(manifest.map(x=>x.file)).size,68,'Visual paths must be unique');
const winners=['SOD-VIS-014','SOD-VIS-038','SOD-VIS-039','SOD-VIS-046','SOD-VIS-052','SOD-VIS-062','SOD-VIS-063'];
for(const id of winners) assert.ok(manifest.some(x=>x.id===id&&['winner','active'].includes(x.status)),`${id} must be active`);
let total=0;let max=0;
for(const item of manifest){
  const file=new URL(`../public${item.file}`,import.meta.url);
  const info=await stat(file);
  total+=info.size;max=Math.max(max,info.size);
  assert.ok(info.size>0,`${item.id} is empty`);
  assert.ok(info.size<100*1024*1024,`${item.id} exceeds GitHub single-file ceiling`);
  assert.ok(item.width>0&&item.height>0,`${item.id} lacks dimensions`);
}
console.log(`Visual tests passed: ${manifest.length} assets, ${(total/1024/1024).toFixed(1)} MB source set, max ${(max/1024/1024).toFixed(1)} MB`);
