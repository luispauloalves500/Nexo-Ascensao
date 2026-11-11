import { ATTRIBUTES, ATTRIBUTE_LABELS, SKILLS } from '../../data/balance.js';
import { calcStats, rankForLevel, xpForNext } from '../../systems/Progression.js';
import { QUESTS, questProgress } from '../../systems/Quests.js';
import { formatNumber } from '../../utils/math.js';
import { pct } from '../format.js';

export function renderAttributes(){
    const c=this.game.character,s=calcStats(c),next=xpForNext(c.level);
    return `<div class="attribute-layout"><div><div class="section-caption">CAÇADOR · RANK ${rankForLevel(c.level)}</div><div class="big-level">${c.level}<span> / 60</span></div><p>EXP ${formatNumber(c.xp)} / ${formatNumber(next)}</p>
      <div class="progress-track"><span style="width:${pct(c.xp,next)}%"></span></div><div class="points-badge">${c.points} pontos livres</div>
      <div class="attribute-list">${ATTRIBUTES.map(k=>`<div class="attribute-row"><span>${ATTRIBUTE_LABELS[k]}</span><b>${c.attributes[k]}</b><button data-action="attribute" data-key="${k}" ${c.points<=0||c.attributes[k]>=99?'disabled':''}>+1</button></div>`).join('')}</div>
      <p class="muted">+5 pontos distribuíveis a cada nível. Equipamentos adicionam bônus separados.</p></div>
      <div class="derived-stats"><div class="section-caption">STATUS DE COMBATE</div>
      ${[['Dano corpo a corpo',Math.round(s.damage)],['Vida máxima',Math.round(s.maxHp)],['Mana máxima',Math.round(s.maxMp)],['Defesa',s.armor],['Chance crítica',Math.round(s.crit*100)+'%'],['Velocidade',s.move.toFixed(1)],['Limite de Ecos',s.shadowCapacity],['Arma equipada',c.equipped.arma?'Sim':'Não']].map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('')}
      <div class="system-message">SISTEMA // Força amplia dano; Agilidade altera mobilidade; Vitalidade aumenta PV/defesa; Inteligência melhora mana; Percepção eleva críticos.</div></div></div>`;
  }

export function renderAbilities(){
    const c=this.game.character;
    return `<div class="ability-list">${SKILLS.map((s,i)=>`<div class="ability-entry"><div class="ability-icon">${['✧','◈','➤','♥'][i]}</div><div><h3>${s.name} <small>[${s.key}]</small></h3><p>${s.desc}</p><span>Mana ${s.cost} · Recarga ${s.cooldown}s</span></div><div class="skill-lock ${c.level>=s.unlock?'ready':''}">${c.level>=s.unlock?'LIBERADO':`NV ${s.unlock}`}</div></div>`).join('')}
      <div class="ability-entry"><div class="ability-icon">♟</div><div><h3>Vínculo dos Ecos <small>[R]</small></h3><p>Invoca aliados que perseguem criaturas, protegem o caçador e causam dano. É obtido após derrotar o primeiro Arconte.</p><span>35 mana por invocação · ${this.game.shadows.length} / ${this.game.stats.shadowCapacity} ecos</span></div><div class="skill-lock ${c.shadowUnlocked?'ready':''}">${c.shadowUnlocked?'LIBERADO':'SELADO'}</div></div>
      <p class="muted">O protótipo tem 4 técnicas jogáveis. Árvores de talentos, runas de habilidades e especializações estão especificadas no GDD.</p></div>`;
  }

export function renderJournal(){
    const c=this.game.character;
    return `<div class="journal-list">${QUESTS.map(q=>{const prog=questProgress(c,q),done=c.questClaimed.includes(q.id),can=prog>=q.required&&!done;
      return `<div class="quest-entry"><div><small>${done?'CONCLUÍDA':can?'RECOMPENSA DISPONÍVEL':'ATIVA'}</small><h3>${q.name}</h3><p>${q.description}</p><div class="quest-progressbar"><span style="width:${pct(prog,q.required)}%"></span></div><p>${prog} / ${q.required}</p></div><div class="quest-rewards"><span>◆ ${q.gold}</span><span>✧ ${q.essence}</span><span>EXP ${q.xp}</span><button class="btn btn-primary" data-action="claim-quest" data-id="${q.id}" ${can?'':'disabled'}>${done?'Coletada':can?'Resgatar':'Em andamento'}</button></div></div>`;}).join('')}</div>`;
  }
