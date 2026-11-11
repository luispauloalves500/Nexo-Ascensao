import { ITEMS, RARITY } from '../data/balance.js';
import { clamp } from '../utils/math.js';

export const $ = (selector,root=document)=>root.querySelector(selector);
export const safe = str => String(str).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
export const cardSlot = {arma:'Arma',armadura:'Armadura',anel:'Anel'};
export const pct = (a,b)=>Math.round(clamp(a/Math.max(1,b),0,1)*100);
export const rar = rarity=>RARITY[rarity]?.name||'Comum';
export const itemBase = item=>ITEMS.find(x=>x.id===item?.id);
