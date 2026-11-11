import { initialCharacter } from './Progression.js';
import { ATTRIBUTES, ITEMS, RARITY, VERSION } from '../data/balance.js';
import { clamp } from '../utils/math.js';

const KEY = 'nexo.ascensao.save.v1';
const SETTINGS_KEY = 'nexo.ascensao.settings.v1';
export const DEFAULT_SETTINGS = {quality:'auto',fps:60,masterVolume:0.65,showDamage:true,showHints:true,shake:true,autoSave:true};

export class SaveSystem {
  constructor(){this.lastError='';}
  hasSave(){try{return !!localStorage.getItem(KEY);}catch{return false;}}
  read(){
    try{
      const raw=JSON.parse(localStorage.getItem(KEY));
      return raw?.data ? this.sanitize(raw.data) : null;
    }catch(e){this.lastError=String(e);return null;}
  }
  sanitize(raw){
    const base=initialCharacter();
    if(!raw || typeof raw!=='object') return base;
    const c={...base,...raw};
    for(const f of ['level','xp','points','gold','essence','kills','bossKills','gateLevel','gateClears','seed','shadowCount']){
      c[f]=Number.isFinite(raw[f])?clamp(Math.floor(raw[f]),0,100000000):base[f];
    }
    c.level=clamp(c.level,1,60);c.points=clamp(c.points,0,300);
    c.attributes={};
    for (const k of ATTRIBUTES)c.attributes[k]=clamp(Math.floor(Number(raw.attributes?.[k])||5),1,99);
    c.inventory=Array.isArray(raw.inventory)?raw.inventory.filter(it=>
      it && typeof it.uid==='string' && /^[a-zA-Z0-9_-]{1,120}$/.test(it.uid) && ITEMS.some(x=>x.id===it.id) && RARITY[it.rarity]
    ).slice(0,60).map(it=>({...it,level:clamp(Math.floor(Number(it.level)||1),1,60),plus:clamp(Math.floor(Number(it.plus)||0),0,10)})) : base.inventory;
    if(!c.inventory.length)c.inventory=base.inventory;
    c.equipped={};
    for(const slot of ['arma','armadura','anel']){
      const uid=raw.equipped?.[slot];
      c.equipped[slot]=c.inventory.find(i=>i.uid===uid && ITEMS.find(t=>t.id===i.id)?.slot===slot)?.uid||null;
    }
    c.questClaimed=Array.isArray(raw.questClaimed)?raw.questClaimed.filter(x=>typeof x==='string').slice(0,100):[];
    c.achievements=Array.isArray(raw.achievements)?raw.achievements.filter(x=>typeof x==='string').slice(0,100):[];
    c.shadowUnlocked=!!raw.shadowUnlocked;
    c.currentZone=['expanse','gate'].includes(raw.currentZone)?raw.currentZone:'expanse';
    return c;
  }
  write(data){
    try {localStorage.setItem(KEY,JSON.stringify({version:VERSION,date:Date.now(),data})); this.lastError='';return true;}
    catch(e){this.lastError=String(e);return false;}
  }
  clear(){try{localStorage.removeItem(KEY);}catch{/* armazenamento bloqueado */}}
  export(data){
    const json=JSON.stringify({version:VERSION,date:new Date().toISOString(),data},null,2);
    const blob=new Blob([json],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`nexo-save-${Date.now()}.json`;
    a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  async import(file){
    if(!file || file.size>500000)throw new Error('Arquivo de save muito grande ou inválido.');
    const raw=JSON.parse(await file.text());
    if(!raw?.data || typeof raw.data!=='object')throw new Error('Save não reconhecido.');
    return this.sanitize(raw.data);
  }
  getSettings(){
    try{
      const raw={...DEFAULT_SETTINGS,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')};
      return {
        quality:['auto','low','medium','high'].includes(raw.quality)?raw.quality:'auto',
        fps:[30,60].includes(Number(raw.fps))?Number(raw.fps):60,
        masterVolume:clamp(Number(raw.masterVolume)||0,0,1),
        showDamage:raw.showDamage!==false,showHints:raw.showHints!==false,
        shake:raw.shake!==false,autoSave:raw.autoSave!==false
      };
    }catch{return {...DEFAULT_SETTINGS};}
  }
  saveSettings(s){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));}catch{/* storage bloqueado */}}
}
