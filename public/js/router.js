const listeners=new Set();
export function navigate(path,{replace=false}={}){if(location.pathname===path)return;history[replace?'replaceState':'pushState']({},'',path);window.scrollTo(0,0);emit()}
export function currentRoute(){if(location.protocol==='file:')return (location.hash.replace(/^#/,'')||'/').replace(/\/+$/,'')||'/';return location.pathname.replace(/\/+$/,'')||'/'}
function emit(){listeners.forEach(fn=>fn(currentRoute()))}
export function onRouteChange(fn){listeners.add(fn);return()=>listeners.delete(fn)}
window.addEventListener('popstate',emit);
document.addEventListener('click',event=>{const link=event.target.closest('a[data-link]');if(!link)return;if(link.origin!==location.origin)return;event.preventDefault();navigate(link.pathname)});
