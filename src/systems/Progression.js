import { ATTRIBUTES, ITEMS, RARITY } from '../data/balance.js';
import { clamp } from '../utils/math.js';

export const xpForNext = level => Math.round(75 * Math.pow(level,1.56));
export const initialCharacter = () => ({
  level:1,xp:0,points:0,attributes:{forca:5,agilidade:5,vitalidade:5,inteligencia:5,percepcao:5},
  gold:150,essence:24,inventory:[{uid:'starter-blade',id:'lamina-fenda',rarity:'comum',level:1,plus:0}],
  equipped:{arma:'starter-blade',armadura:null,anel:null},
  kills:0,bossKills:0,gateLevel:1,gateClears:0,shadowUnlocked:false,shadowCount:0,
  currentZone:'expanse',seed:1731,questClaimed:[],achievements:[],savedAt:0
});
export const calcStats = (c) => {
  const attrs = {...c.attributes};
  let weapon=0, armor=0,ring=0;
  const slots = ['arma','armadura','anel'];
  for (const slot of slots) {
    const it = c.inventory.find(x=>x.uid===c.equipped[slot]);
    const base = ITEMS.find(x=>x.id===it?.id);
    if (!it || !base) continue;
    const power = (base.base + (it.level-1)*2 + it.plus*4)*RARITY[it.rarity].mult;
    if (slot==='arma') weapon += power;
    else if(slot==='armadura') armor += power;
    else ring += power;
    for(const [a,v] of Object.entries(base.stats)) attrs[a] += Math.round(v * RARITY[it.rarity].mult);
  }
  return {
    attrs,
    maxHp: 85 + attrs.vitalidade*11 + (c.level-1)*7 + armor,
    maxMp: 42 + attrs.inteligencia*8 + ring,
    maxStamina: 75 + attrs.agilidade*3,
    damage: 10 + attrs.forca*2.4 + weapon + attrs.agilidade*.5,
    armor: Math.round(armor*.35 + attrs.vitalidade*.7),
    crit:clamp(.03 + attrs.percepcao*.009,0,.4),
    move:4.5 + attrs.agilidade*.045,
    shadowCapacity: Math.min(8,1+Math.floor((c.level-1)/6)),
  };
};
export const gainXp = (c, amount) => {
  let levels=0;
  c.xp+=Math.max(0,amount);
  while(c.level<60 && c.xp>=xpForNext(c.level)) {
    c.xp-=xpForNext(c.level);c.level++;c.points+=5;levels++;
  }
  if(c.level>=60) c.xp=0;
  return levels;
};
export const spendPoint = (c,key) => {
  if(!ATTRIBUTES.includes(key)||c.points<=0||c.attributes[key]>=99)return false;
  c.points--;c.attributes[key]++;return true;
};
export const rankForLevel = level => level>=51?'S':level>=39?'A':level>=27?'B':level>=16?'C':level>=7?'D':'E';
export const upgradeCost = item => ({gold:Math.round(45*(item.plus+1)**1.75),essence:Math.round(7*(item.plus+1)**1.35)});
export const upgradeItem = (c,uid) => {
  const it=c.inventory.find(x=>x.uid===uid);
  if(!it||it.plus>=10)return false;
  const cost=upgradeCost(it);
  if(c.gold<cost.gold||c.essence<cost.essence)return false;
  c.gold-=cost.gold;c.essence-=cost.essence;it.plus++;return true;
};
export const createDrop = (type, rng, level) => {
  const roll=rng();
  const rarity=roll<.015?'lendario':roll<.08?'epico':roll<.26?'raro':roll<.59?'incomum':'comum';
  const base=ITEMS[Math.floor(rng()*ITEMS.length)];
  return {uid:`item-${Math.floor(rng()*1e9).toString(36)}-${Date.now().toString(36)}`,id:base.id,rarity,level:clamp(level+Math.floor(rng()*3)-1,1,60),plus:0};
};
export const dismantle = (c,uid) => {
  const ix=c.inventory.findIndex(x=>x.uid===uid);
  if(ix<0||Object.values(c.equipped).includes(uid)) return false;
  const item=c.inventory[ix];
  c.essence += Math.round(4 + Math.round(item.level*.75 + item.plus*3)*RARITY[item.rarity].mult);
  c.inventory.splice(ix,1);return true;
};
