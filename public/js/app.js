import { currentRoute,onRouteChange,navigate } from './router.js';
import { getView } from './views.js';
import { shellHeader,bindHeader,setMeta,bindRouteButtons,toast } from './ui.js';
import { store } from './store.js';
import { ambient } from './audio.js';

const app=document.querySelector('#app');let cleanup=null;let deferredInstall=null;
function applySettings(){const s=store.get().settings;document.body.classList.toggle('high-contrast',!!s.highContrast);document.body.classList.toggle('reduce-effects',!!s.reduceEffects)}
function render(){cleanup?.();cleanup=null;const route=currentRoute();const view=getView(route);app.innerHTML=`${view.noShell?'':shellHeader()}${view.html}`;if(!view.noShell)bindHeader();bindRouteButtons(app);setMeta(view.title);applySettings();store.update(s=>{s.lastRoute=route;return s});const result=view.mount?.();if(typeof result==='function')cleanup=result;document.querySelector('#app-main')?.focus?.({preventScroll:true})}
function networkUpdate(){const el=document.querySelector('#network-status');const online=navigator.onLine;el.textContent=online?'Conexión recuperada':'Sin conexión · modo local';el.className=`network-status show ${online?'':'offline'}`;setTimeout(()=>el.classList.remove('show'),online?2200:5000)}
window.addEventListener('online',networkUpdate);window.addEventListener('offline',networkUpdate);onRouteChange(render);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;showInstall()});
function showInstall(){if(document.querySelector('.install-banner')||!deferredInstall)return;const el=document.createElement('div');el.className='install-banner';el.innerHTML='<span class="brand-mark">Ø</span><p><strong>Instalar SØD</strong><br><span class="muted">Abrí el ecosistema como una aplicación.</span></p><button class="btn btn-small btn-primary" data-install>Instalar</button><button class="icon-button" data-dismiss aria-label="Cerrar">✕</button>';document.body.append(el);el.querySelector('[data-dismiss]').onclick=()=>el.remove();el.querySelector('[data-install]').onclick=async()=>{await deferredInstall.prompt();const choice=await deferredInstall.userChoice;deferredInstall=null;el.remove();if(choice.outcome==='accepted')toast('SØD instalado')}}
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
if(store.get().settings.audio)document.addEventListener('pointerdown',()=>ambient.start(store.get().settings.ambientVolume),{once:true});
render();
