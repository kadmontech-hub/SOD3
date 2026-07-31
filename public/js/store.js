const KEY='sod-ecosystem-state-v1';
const defaults={
  profile:{name:'Explorador Ø',email:'',mode:'guest'},
  onboarding:{completed:false,intention:'claridad',audio:false,motion:true,quality:'auto',gyro:false},
  settings:{audio:false,motion:true,quality:'auto',gyro:false,highContrast:false,reduceEffects:false,ambientVolume:.35},
  journey:{completedDays:[],startedAt:null},
  collection:{seeds:[],pieces:[],seedStates:{}},
  transformation:{lastCompletedAt:null,before:'',after:'',seedId:null},
  codes:[],
  dialogue:[],
  lastRoute:'/'
};
let state=load();
const listeners=new Set();
function load(){try{return merge(defaults,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{return structuredClone(defaults)}}
function merge(base,custom){const out=structuredClone(base);for(const [k,v] of Object.entries(custom||{})){out[k]=(v&&typeof v==='object'&&!Array.isArray(v)&&base[k])?merge(base[k],v):v}return out}
function persist(){localStorage.setItem(KEY,JSON.stringify(state));listeners.forEach(fn=>fn(state))}
export const store={
  get:()=>state,
  set(patch){state=merge(state,patch);persist();return state},
  update(fn){state=fn(structuredClone(state));persist();return state},
  reset(){state=structuredClone(defaults);persist()},
  subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
};
