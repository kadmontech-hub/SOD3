import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { writeFile, rm } from 'node:fs/promises';
const port=4279;const temp='./data/test-store.json';
await writeFile(new URL('../data/test-store.json',import.meta.url),JSON.stringify({reflections:[],adminContent:{dailyMessage:'Test',dailyKey:'TEST',announcement:''},users:[]}));
const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port),HOST:'127.0.0.1',SOD_DATA_FILE:temp},stdio:'pipe'});
try{
  await wait(400);
  const health=await fetch(`http://127.0.0.1:${port}/api/health`).then(r=>r.json());assert.equal(health.ok,true);
  const home=await fetch(`http://127.0.0.1:${port}/`).then(r=>r.text());assert.match(home,/SØD Ecosystem/);
  const deepResponse=await fetch(`http://127.0.0.1:${port}/elementos/eter/33`);assert.equal(deepResponse.status,200);assert.match(await deepResponse.text(),/id="app"/);
  const created=await fetch(`http://127.0.0.1:${port}/api/reflections`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:'Prueba',text:'Una reflexión comprobable.'})}).then(r=>r.json());assert.ok(created.item.id);
  const list=await fetch(`http://127.0.0.1:${port}/api/reflections`).then(r=>r.json());assert.equal(list.items.length,1);
  const updated=await fetch(`http://127.0.0.1:${port}/api/reflections/${created.item.id}`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({title:'Actualizada',text:'Nuevo texto'})}).then(r=>r.json());assert.equal(updated.item.title,'Actualizada');
  const removed=await fetch(`http://127.0.0.1:${port}/api/reflections/${created.item.id}`,{method:'DELETE'}).then(r=>r.json());assert.equal(removed.ok,true);
  const dialogue=await fetch(`http://127.0.0.1:${port}/api/dialogue`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:'Necesito claridad para decidir'})}).then(r=>r.json());assert.match(dialogue.reply,/claridad|decisión/i);
  console.log('API smoke tests passed');
}finally{child.kill('SIGTERM');await wait(100);await rm(new URL('../data/test-store.json',import.meta.url),{force:true})}
