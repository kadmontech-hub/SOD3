import { universes } from './content.js';
import { ambient } from './audio.js';

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const normAngle=a=>{while(a>180)a-=360;while(a<-180)a+=360;return a};
const rad=d=>d*Math.PI/180;

export class HubScene{
  constructor(canvas,{settings,onSelect,onHover,onOrb,onQuality}={}){
    this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.settings=settings||{};this.onSelect=onSelect;this.onHover=onHover;this.onOrb=onOrb;this.onQuality=onQuality;
    this.yaw=0;this.pitch=0;this.targetYaw=0;this.targetPitch=0;this.dragging=false;this.pointer={x:0,y:0};this.hovered=null;this.running=true;this.last=performance.now();this.fps=[];this.gyroEnabled=false;this.baseOrientation=null;
    this.hotspots=universes.map((u,i)=>({...u,yaw:-160+i*40,pitch:i%3===0?3:i%3===1?-5:0}));
    this.bg=new Image();this.bg.decoding='async';this.bg.src='/assets/sod-visual/014.png';
    this.stars=this.makeStars(this.chooseParticleCount());this.bind();this.resize();this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(canvas);this.frame=requestAnimationFrame(t=>this.render(t));
  }
  chooseParticleCount(){const q=this.settings.quality||'auto';if(q==='low')return 90;if(q==='high')return 360;const memory=navigator.deviceMemory||4;return memory<=2?100:memory>=8?320:210}
  makeStars(count){return Array.from({length:count},(_,i)=>({yaw:Math.random()*360-180,pitch:Math.random()*120-60,size:Math.random()*1.7+.3,alpha:Math.random()*.75+.15,phase:Math.random()*Math.PI*2,color:i%13===0?'139,92,255':i%9===0?'0,217,255':'220,240,255'}))}
  bind(){
    this.down=e=>{this.dragging=true;this.canvas.setPointerCapture?.(e.pointerId);this.lastX=e.clientX;this.lastY=e.clientY};
    this.move=e=>{const r=this.canvas.getBoundingClientRect();this.pointer={x:e.clientX-r.left,y:e.clientY-r.top};if(this.dragging){const dx=e.clientX-this.lastX,dy=e.clientY-this.lastY;this.targetYaw-=dx*.15;this.targetPitch=clamp(this.targetPitch-dy*.12,-60,60);this.lastX=e.clientX;this.lastY=e.clientY}else this.updateHover()};
    this.up=e=>{const moved=Math.hypot(e.clientX-(this.lastX||e.clientX),e.clientY-(this.lastY||e.clientY));this.dragging=false;this.canvas.releasePointerCapture?.(e.pointerId);if(moved<5)this.activateAt(this.pointer.x,this.pointer.y)};
    this.wheel=e=>{e.preventDefault();this.targetPitch=clamp(this.targetPitch+e.deltaY*.02,-60,60)};
    this.key=e=>{if(!this.canvas.matches(':focus'))return;const step=e.shiftKey?12:5;if(e.key==='ArrowLeft')this.targetYaw-=step;if(e.key==='ArrowRight')this.targetYaw+=step;if(e.key==='ArrowUp')this.targetPitch=clamp(this.targetPitch+step,-60,60);if(e.key==='ArrowDown')this.targetPitch=clamp(this.targetPitch-step,-60,60);if((e.key==='Enter'||e.key===' ')&&this.hovered)this.select(this.hovered)};
    this.canvas.addEventListener('pointerdown',this.down);this.canvas.addEventListener('pointermove',this.move);this.canvas.addEventListener('pointerup',this.up);this.canvas.addEventListener('pointercancel',this.up);this.canvas.addEventListener('wheel',this.wheel,{passive:false});this.canvas.addEventListener('keydown',this.key);
    this.orientation=e=>{if(!this.gyroEnabled||e.alpha==null)return;if(!this.baseOrientation)this.baseOrientation={alpha:e.alpha,beta:e.beta||0};this.targetYaw=normAngle((e.alpha-this.baseOrientation.alpha)*-1);this.targetPitch=clamp((e.beta||0)-this.baseOrientation.beta,-45,45)};
  }
  resize(){const r=this.canvas.getBoundingClientRect();const dpr=clamp(devicePixelRatio||1,1,this.settings.quality==='high'?2:1.5);this.canvas.width=Math.max(1,Math.round(r.width*dpr));this.canvas.height=Math.max(1,Math.round(r.height*dpr));this.ctx.setTransform(dpr,0,0,dpr,0,0);this.w=r.width;this.h=r.height;this.dpr=dpr}
  setSettings(settings){this.settings={...this.settings,...settings};this.stars=this.makeStars(this.chooseParticleCount());this.resize()}
  async enableGyro(){if(typeof DeviceOrientationEvent==='undefined')return false;if(typeof DeviceOrientationEvent.requestPermission==='function'){const result=await DeviceOrientationEvent.requestPermission();if(result!=='granted')return false}this.gyroEnabled=true;window.addEventListener('deviceorientation',this.orientation);return true}
  disableGyro(){this.gyroEnabled=false;this.baseOrientation=null;window.removeEventListener('deviceorientation',this.orientation)}
  recenter(){this.targetYaw=0;this.targetPitch=0;this.baseOrientation=null}
  focus(slug){const h=this.hotspots.find(x=>x.slug===slug);if(h){this.targetYaw=h.yaw;this.targetPitch=h.pitch}}
  project(yaw,pitch){const rel=normAngle(yaw-this.yaw);if(Math.abs(rel)>92)return null;const f=Math.min(this.w,this.h)*.62;const x=this.w/2+Math.tan(rad(rel))*f;const y=this.h/2-Math.tan(rad(pitch-this.pitch))*f;const depth=Math.cos(rad(rel));return{x,y,depth,rel}}
  updateHover(){let candidate=null,min=Infinity;for(const h of this.hotspots){const p=this.project(h.yaw,h.pitch);if(!p)continue;const d=Math.hypot(this.pointer.x-p.x,this.pointer.y-p.y);if(d<48&&d<min){candidate=h;min=d}}const orbD=Math.hypot(this.pointer.x-this.w/2,this.pointer.y-this.h/2);if(orbD<82)candidate={slug:'__orb',title:'Hablar con SØD'};if(candidate?.slug!==this.hovered?.slug){this.hovered=candidate;this.onHover?.(candidate)}}
  activateAt(x,y){const orbD=Math.hypot(x-this.w/2,y-this.h/2);if(orbD<92){ambient.tone(520,.14);this.onOrb?.();return}let candidate=null,min=Infinity;for(const h of this.hotspots){const p=this.project(h.yaw,h.pitch);if(!p)continue;const d=Math.hypot(x-p.x,y-p.y);if(d<56&&d<min){candidate=h;min=d}}if(candidate)this.select(candidate)}
  select(h){ambient.tone(660,.12);this.onSelect?.(h)}
  drawBackground(t){
    const c=this.ctx,w=this.w,h=this.h;
    c.fillStyle='#01040a';c.fillRect(0,0,w,h);
    if(this.bg.complete&&this.bg.naturalWidth){
      const scale=Math.max(w/this.bg.naturalWidth,h/this.bg.naturalHeight)*1.08;
      const dw=this.bg.naturalWidth*scale,dh=this.bg.naturalHeight*scale;
      const panX=(normAngle(this.yaw)/180)*(dw-w)*.42;
      const panY=(this.pitch/60)*(dh-h)*.28;
      c.save();c.globalAlpha=.98;c.drawImage(this.bg,(w-dw)/2-panX,(h-dh)/2+panY,dw,dh);c.restore();
      const shade=c.createLinearGradient(0,0,0,h);shade.addColorStop(0,'rgba(1,4,10,.18)');shade.addColorStop(.55,'rgba(1,4,10,.02)');shade.addColorStop(1,'rgba(1,4,10,.58)');c.fillStyle=shade;c.fillRect(0,0,w,h);
    }else{
      const g=c.createRadialGradient(w*.5,h*.42,0,w*.5,h*.5,Math.max(w,h)*.8);g.addColorStop(0,'#0a2141');g.addColorStop(.35,'#071323');g.addColorStop(1,'#01040a');c.fillStyle=g;c.fillRect(0,0,w,h);
    }
    const reduced=this.settings.motion===false||matchMedia('(prefers-reduced-motion: reduce)').matches;
    for(const s of this.stars){const p=this.project(s.yaw,s.pitch);if(!p)continue;const pulse=reduced?1:(.7+.3*Math.sin(t*.0012+s.phase));c.fillStyle=`rgba(${s.color},${s.alpha*pulse*p.depth*.62})`;c.beginPath();c.arc(p.x,p.y,s.size*(.5+p.depth),0,Math.PI*2);c.fill()}
  }

  drawOrb(t){
    const c=this.ctx,x=this.w/2,y=this.h/2;const reduced=this.settings.motion===false||matchMedia('(prefers-reduced-motion: reduce)').matches;const breathe=reduced?1:1+Math.sin(t*.00145)*.045;const r=Math.min(108,Math.max(66,this.w*.058))*breathe;
    c.save();c.translate(x,y);
    const halo=c.createRadialGradient(0,0,r*.1,0,0,r*2.5);halo.addColorStop(0,'rgba(180,247,255,.22)');halo.addColorStop(.28,'rgba(0,217,255,.11)');halo.addColorStop(.58,'rgba(36,124,255,.04)');halo.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=halo;c.beginPath();c.arc(0,0,r*2.5,0,Math.PI*2);c.fill();
    for(let i=0;i<5;i++){const angle=(reduced?0:t*(.00013+i*.000025))+(i*Math.PI/5);c.save();c.rotate(angle);c.scale(1,0.55+i*.055);c.beginPath();c.arc(0,0,r*(1.25+i*.13),0,Math.PI*2);c.strokeStyle=`rgba(${i%2?'139,92,255':'0,217,255'},${.24-i*.028})`;c.lineWidth=i===0?1.8:1;c.setLineDash(i%2?[5,13]:[]);c.stroke();c.restore()}
    const shell=c.createRadialGradient(-r*.3,-r*.34,r*.04,0,0,r);shell.addColorStop(0,'#f7ffff');shell.addColorStop(.055,'#8ef4ff');shell.addColorStop(.24,'#1fb8eb');shell.addColorStop(.48,'#155aa9');shell.addColorStop(.7,'#111e48');shell.addColorStop(1,'#01030a');c.fillStyle=shell;c.shadowColor='rgba(0,217,255,.68)';c.shadowBlur=48;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();c.shadowBlur=0;
    c.globalCompositeOperation='screen';for(let i=0;i<18;i++){const a=(Math.PI*2/18)*i+(reduced?0:t*.00018);const rr=r*(.25+(i%5)*.14);const px=Math.cos(a)*rr,py=Math.sin(a)*rr*.76;c.fillStyle=`rgba(180,247,255,${.18+(i%3)*.08})`;c.beginPath();c.arc(px,py,1+(i%4)*.55,0,Math.PI*2);c.fill()}c.globalCompositeOperation='source-over';
    c.strokeStyle='rgba(220,252,255,.68)';c.lineWidth=1.2;c.beginPath();for(let i=0;i<9;i++){const a=rad(i*40+(reduced?0:t*.011));const rr=r*(1.16+(i%3)*.07);const px=Math.cos(a)*rr,py=Math.sin(a)*rr*.78;i?c.lineTo(px,py):c.moveTo(px,py)}c.closePath();c.stroke();
    c.fillStyle='white';c.font=`300 ${r*.82}px system-ui`;c.textAlign='center';c.textBaseline='middle';c.shadowColor='rgba(255,255,255,.9)';c.shadowBlur=24;c.fillText('Ø',0,1);c.shadowBlur=0;
    c.restore()
  }
  drawHotspots(t){
    const c=this.ctx;for(const h of this.hotspots){const p=this.project(h.yaw,h.pitch);if(!p||p.x<-100||p.x>this.w+100)continue;const active=this.hovered?.slug===h.slug;const r=active?23:18;c.save();c.globalAlpha=clamp(p.depth,.25,1);c.translate(p.x,p.y);c.fillStyle=h.color+'22';c.strokeStyle=active?h.color:h.color+'99';c.lineWidth=active?2:1;c.beginPath();c.arc(0,0,r+(Math.sin(t*.002+h.yaw)*2),0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#fff';c.font='700 17px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(h.icon,0,0);c.font='700 12px system-ui';c.fillText(h.title,0,40);c.restore()}
  }
  render(t){if(!this.running)return;const dt=Math.min(40,t-this.last);this.last=t;const smooth=this.settings.motion===false?1:.09;this.yaw+=normAngle(this.targetYaw-this.yaw)*smooth;this.pitch+=(this.targetPitch-this.pitch)*smooth;this.drawBackground(t);this.drawHotspots(t);this.drawOrb(t);this.updateHover();this.fps.push(1000/Math.max(dt,1));if(this.fps.length===120){const avg=this.fps.reduce((a,b)=>a+b,0)/this.fps.length;this.onQuality?.(avg);this.fps=[]}this.frame=requestAnimationFrame(x=>this.render(x))}
  destroy(){this.running=false;cancelAnimationFrame(this.frame);this.ro?.disconnect();this.disableGyro();this.canvas.removeEventListener('pointerdown',this.down);this.canvas.removeEventListener('pointermove',this.move);this.canvas.removeEventListener('pointerup',this.up);this.canvas.removeEventListener('pointercancel',this.up);this.canvas.removeEventListener('wheel',this.wheel);this.canvas.removeEventListener('keydown',this.key)}
}
