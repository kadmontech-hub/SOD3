class AmbientEngine{
  constructor(){this.ctx=null;this.master=null;this.nodes=[];this.enabled=false;this.volume=.35}
  async start(volume=this.volume){
    if(this.enabled)return;this.volume=volume;
    const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
    this.ctx=this.ctx||new AudioCtx();await this.ctx.resume();
    this.master=this.ctx.createGain();this.master.gain.value=.0001;this.master.connect(this.ctx.destination);
    const freqs=[55,82.4,110];
    freqs.forEach((freq,i)=>{const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();const filter=this.ctx.createBiquadFilter();osc.type=i===1?'triangle':'sine';osc.frequency.value=freq;filter.type='lowpass';filter.frequency.value=240;gain.gain.value=[.11,.05,.025][i];osc.connect(filter).connect(gain).connect(this.master);osc.start();this.nodes.push(osc,gain,filter)});
    this.master.gain.exponentialRampToValueAtTime(Math.max(.001,this.volume*.12),this.ctx.currentTime+1.4);this.enabled=true;
  }
  stop(){if(!this.ctx||!this.master)return;this.master.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+.5);setTimeout(()=>{this.nodes.forEach(n=>{try{n.stop?.()}catch{};try{n.disconnect?.()}catch{}});this.nodes=[];this.enabled=false},600)}
  setVolume(value){this.volume=value;if(this.master&&this.ctx)this.master.gain.setTargetAtTime(Math.max(.001,value*.12),this.ctx.currentTime,.08)}
  tone(freq=440,duration=.08){if(!this.ctx||!this.enabled)return;const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.04,this.ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+duration);osc.connect(gain).connect(this.master);osc.start();osc.stop(this.ctx.currentTime+duration)}
}
export const ambient=new AmbientEngine();
