import { ATTRIBUTE_LABELS, RARITY } from '../../data/balance.js';
import { upgradeCost } from '../../systems/Progression.js';
import { formatNumber } from '../../utils/math.js';
import { safe, cardSlot, rar, itemBase } from '../format.js';

export function renderInventory(){
    const c=this.game.character,options=['todos','arma','armadura','anel'];
    const filtered=c.inventory.filter(it=>this.filter==='todos'||itemBase(it)?.slot===this.filter);
    const order={comum:0,incomum:1,raro:2,epico:3,lendario:4};
    filtered.sort((a,b)=>order[b.rarity]-order[a.rarity]||b.level-a.level||b.plus-a.plus);
    const selected= filtered.find(it=>it.uid===this.selectedUid) || filtered[0];
    this.selectedUid=selected?.uid||null;
    const base=itemBase(selected),equipSlot=base?.slot;
    const equipped=selected&&c.equipped[equipSlot]===selected.uid;
    const cost=selected?upgradeCost(selected):null;
    return `<div class="inventory-layout">
      <div class="inv-left">
        <div class="section-caption">EQUIPAMENTOS ATIVOS</div>
        <div class="equipment-slots">${Object.entries(cardSlot).map(([slot,label])=>{
          const it=c.inventory.find(x=>x.uid===c.equipped[slot]);const item=itemBase(it);
          return `<div class="equip-row"><span class="equip-icon">${slot==='arma'?'⚔':slot==='armadura'?'⬡':'◉'}</span><div><small>${label}</small><b>${item?safe(item.name):'Vazio'}</b></div>${it?`<button data-action="unequip" data-slot="${slot}" title="Desequipar">×</button>`:''}</div>`;
        }).join('')}</div>
        <div class="resource-box"><span>◆ ${formatNumber(c.gold)} ouro</span><span>✧ ${formatNumber(c.essence)} essência</span></div>
        <div class="section-caption">MOCHILA · ${c.inventory.length} / 60</div>
        <div class="filter-row">${options.map(k=>`<button class="${k===this.filter?'active':''}" data-action="filter-items" data-filter="${k}">${({todos:'Tudo',arma:'Armas',armadura:'Armaduras',anel:'Anéis'})[k]}</button>`).join('')}</div>
        <div class="item-grid">${filtered.map(it=>{const b=itemBase(it);return `<button class="item-tile${selected?.uid===it.uid?' selected':''}${Object.values(c.equipped).includes(it.uid)?' is-equipped':''}" data-action="select-item" data-uid="${safe(it.uid)}" style="--rarity:${RARITY[it.rarity].color}" title="${safe(b.name)}"><span>✧</span><small>+${it.plus}</small><b>NV ${it.level}</b></button>`;}).join('') || '<p class="muted">Sem itens nesta categoria.</p>'}</div>
      </div>
      <div class="inv-detail">${selected?`<div class="detail-icon" style="--rarity:${RARITY[selected.rarity].color}">✧</div>
        <div class="rarity-tag" style="color:${RARITY[selected.rarity].color}">${rar(selected.rarity).toUpperCase()} · NV ${selected.level} · +${selected.plus}</div>
        <h3>${safe(base.name)}</h3><p>${safe(base.description)}</p>
        <div class="detail-stats"><div><span>Categoria</span><b>${cardSlot[equipSlot]}</b></div><div><span>Poder base</span><b>${Math.round((base.base+(selected.level-1)*2+selected.plus*4)*RARITY[selected.rarity].mult)}</b></div><div><span>Bônus</span><b>${Object.entries(base.stats).map(([k,v])=>`${ATTRIBUTE_LABELS[k]} +${Math.round(v*RARITY[selected.rarity].mult)}`).join(', ')}</b></div></div>
        <button class="btn btn-primary" data-action="equip-item" data-uid="${safe(selected.uid)}" ${equipped?'disabled':''}>${equipped?'Equipado':'Equipar item'}</button>
        <button class="btn btn-outline" data-action="upgrade-item" data-uid="${safe(selected.uid)}" ${(selected.plus>=10||c.gold<cost.gold||c.essence<cost.essence)?'disabled':''}>Aprimorar · ◆ ${cost.gold} + ✧ ${cost.essence}</button>
        <button class="btn btn-ghost danger" data-action="dismantle-item" data-uid="${safe(selected.uid)}" ${equipped?'disabled':''}>Desmontar por essência</button>
        <small class="muted">Aprimoramento garantido até +10; desmontagem não pode ser desfeita.</small>`:'<p>Sem item selecionado.</p>'}</div>
    </div>`;
  }
