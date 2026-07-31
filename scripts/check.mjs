import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
const roots=["public/js","api","lib","scripts","tests"];
const files=["server.mjs"];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else if(/\.(m?js)$/.test(e.name))files.push(p)}}
for(const r of roots)await walk(r);
for(const f of files){const result=spawnSync(process.execPath,["--check",f],{stdio:"inherit"});if(result.status!==0)process.exit(result.status||1)}
console.log(`Syntax validated: ${files.length} JavaScript modules`);
