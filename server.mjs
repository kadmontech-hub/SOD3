import http from 'node:http';
import { readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
try {
  const envText=readFileSync(path.join(__dirname,'.env'),'utf8');
  for(const line of envText.split(/\r?\n/)){const trimmed=line.trim();if(!trimmed||trimmed.startsWith('#')||!trimmed.includes('='))continue;const index=trimmed.indexOf('=');const key=trimmed.slice(0,index).trim();const value=trimmed.slice(index+1).trim().replace(/^['\"]|['\"]$/g,'');if(!process.env[key])process.env[key]=value}
} catch {}
const publicDir=path.join(__dirname,'public');
const dataFile=path.resolve(__dirname,process.env.SOD_DATA_FILE||'data/store.json');
const port=Number(process.env.PORT||4173);const host=process.env.HOST||'127.0.0.1';
const rate=new Map();
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'};
const headers={
  'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=(), gyroscope=(self), accelerometer=(self)','Cross-Origin-Opener-Policy':'same-origin','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; media-src 'self'; worker-src 'self'; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
};
function send(res,status,body,type='application/json; charset=utf-8',extra={}){res.writeHead(status,{...headers,'Content-Type':type,'Cache-Control':type.includes('text/html')?'no-cache':'public, max-age=300',...extra});res.end(body)}
function json(res,status,data){send(res,status,JSON.stringify(data),mime['.json'])}
function sanitize(value,max=5000){return String(value??'').replace(/[<>]/g,'').trim().slice(0,max)}
async function readStore(){try{return JSON.parse(await readFile(dataFile,'utf8'))}catch{return{reflections:[],adminContent:{},users:[]}}}
async function saveStore(data){await mkdir(path.dirname(dataFile),{recursive:true});await writeFile(dataFile,JSON.stringify(data,null,2))}
async function body(req){return await new Promise((resolve,reject)=>{let raw='';req.on('data',c=>{raw+=c;if(raw.length>100_000){reject(new Error('Payload demasiado grande'));req.destroy()}});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(new Error('JSON inválido'))}});req.on('error',reject)})}
function limited(req,key='general',limit=40,windowMs=60_000){const ip=req.socket.remoteAddress||'local';const id=`${ip}:${key}`;const now=Date.now();const entry=rate.get(id)||{count:0,reset:now+windowMs};if(now>entry.reset){entry.count=0;entry.reset=now+windowMs}entry.count++;rate.set(id,entry);return entry.count>limit}
function dialogueReply(message){const m=message.toLowerCase();let core='Antes de buscar una respuesta, distinguí qué ocurrió, qué interpretaste y qué decisión está disponible ahora.';if(/miedo|ansiedad|angustia/.test(m))core='No voy a convertir lo que sentís en una falla. Nombrá la sensación, localizala en el cuerpo y reducí la próxima decisión a un paso seguro y reversible.';else if(/propósito|rumbo|dirección/.test(m))core='El propósito rara vez aparece como una frase perfecta. Se vuelve visible en aquello que elegís sostener incluso cuando nadie te observa.';else if(/hábito|disciplina|constancia/.test(m))core='No empieces exigiendo una identidad nueva. Diseñá una repetición tan pequeña que el entorno pueda recordártela.';else if(/decidir|decisión|elegir/.test(m))core='Toda decisión distribuye energía. Preguntá qué opción produce información nueva y qué costo estás dispuesto a aceptar.';else if(/claridad|confund/.test(m))core='La claridad comienza separando capas: hecho verificable, interpretación, emoción, necesidad y acción.';return `${core}\n\nPregunta de integración: ¿qué acción de menos de diez minutos haría visible esta comprensión hoy?`}

async function handleApi(req,res,url){
  if(url.pathname==='/api/health'&&req.method==='GET')return json(res,200,{ok:true,name:'SØD Ecosystem API',time:new Date().toISOString()});
  if(url.pathname==='/api/state'&&req.method==='GET'){const s=await readStore();return json(res,200,{adminContent:s.adminContent,counts:{reflections:s.reflections.length}})}
  if(url.pathname==='/api/reflections'&&req.method==='GET'){const s=await readStore();return json(res,200,{items:s.reflections.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))})}
  if(url.pathname==='/api/reflections'&&req.method==='POST'){
    if(limited(req,'reflection',30))return json(res,429,{error:'Demasiadas solicitudes'});const input=await body(req);const text=sanitize(input.text,6000);if(text.length<2)return json(res,400,{error:'Escribí una reflexión válida'});const now=new Date().toISOString();const item={id:crypto.randomUUID(),title:sanitize(input.title,120)||'Registro sin título',text,tags:Array.isArray(input.tags)?input.tags.map(x=>sanitize(x,30)).slice(0,8):[],createdAt:now,updatedAt:now};const s=await readStore();s.reflections.push(item);await saveStore(s);return json(res,201,{item})
  }
  const reflectionMatch=url.pathname.match(/^\/api\/reflections\/([\w-]+)$/);
  if(reflectionMatch&&req.method==='PUT'){const input=await body(req);const s=await readStore();const item=s.reflections.find(x=>x.id===reflectionMatch[1]);if(!item)return json(res,404,{error:'Registro no encontrado'});item.title=sanitize(input.title,120)||item.title;item.text=sanitize(input.text,6000)||item.text;item.updatedAt=new Date().toISOString();await saveStore(s);return json(res,200,{item})}
  if(reflectionMatch&&req.method==='DELETE'){const s=await readStore();const before=s.reflections.length;s.reflections=s.reflections.filter(x=>x.id!==reflectionMatch[1]);if(before===s.reflections.length)return json(res,404,{error:'Registro no encontrado'});await saveStore(s);return json(res,200,{ok:true})}
  if(url.pathname==='/api/dialogue'&&req.method==='POST'){if(limited(req,'dialogue',20))return json(res,429,{error:'Pausa un momento antes de continuar'});const input=await body(req);const message=sanitize(input.message,2000);if(message.length<2)return json(res,400,{error:'La pregunta está vacía'});return json(res,200,{id:crypto.randomUUID(),reply:dialogueReply(message),mode:'scripted',disclaimer:'SØD ofrece reflexión guiada; no reemplaza asistencia médica, psicológica, legal o profesional.'})}
  if(url.pathname==='/api/admin/content'&&req.method==='GET'){const s=await readStore();return json(res,200,{content:s.adminContent})}
  if(url.pathname==='/api/admin/content'&&req.method==='PUT'){const input=await body(req);const s=await readStore();s.adminContent={dailyMessage:sanitize(input.dailyMessage,1200),dailyKey:sanitize(input.dailyKey,180),announcement:sanitize(input.announcement,500)};await saveStore(s);return json(res,200,{content:s.adminContent})}
  return json(res,404,{error:'API route no encontrada'});
}

async function serveFile(req,res,url){
  let pathname=decodeURIComponent(url.pathname);let filePath=path.join(publicDir,pathname==='/'?'index.html':pathname);
  if(!filePath.startsWith(publicDir))return send(res,403,'Forbidden','text/plain');
  try{const s=await stat(filePath);if(s.isDirectory())filePath=path.join(filePath,'index.html');const ext=path.extname(filePath);const data=await readFile(filePath);return send(res,200,data,mime[ext]||'application/octet-stream',ext==='.html'?{}:{'Cache-Control':'public, max-age=86400'})}catch{
    if(req.method==='GET'&&!path.extname(pathname)){const data=await readFile(path.join(publicDir,'index.html'));return send(res,200,data,mime['.html'])}
    return send(res,404,'Not found','text/plain; charset=utf-8')
  }
}

const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);if(url.pathname.startsWith('/api/'))return await handleApi(req,res,url);return await serveFile(req,res,url)}catch(error){console.error(error);return json(res,500,{error:'Error interno controlado'})}});
server.listen(port,host,()=>console.log(`SØD Ecosystem running at http://${host}:${port}`));
