import { GATE_RANKS, SKILLS, VERSION } from '../data/balance.js';
import { rankForLevel, xpForNext } from '../systems/Progression.js';
import { QUESTS, questProgress } from '../systems/Quests.js';
import { $, safe, pct } from './format.js';
import { renderInventory } from './views/InventoryView.js';
import { renderAttributes, renderAbilities, renderJournal } from './views/ProgressView.js';
import { renderMap } from './views/WorldView.js';
import { renderPause, renderSettings, renderDeath, renderCredits } from './views/SystemView.js';
import { formatNumber } from '../utils/math.js';


export class UI {
  constructor(game){
    this.game=game;this.root=$('#ui-root');this.panel=null;this.panelOrigin='playing';this.selectedUid=null;
    this.filter='todos';this.sort='raridade';this.toastTimers=[];this.activeTitle=true;
    this.root.innerHTML=`
      <div class="screen-haze" aria-hidden="true"></div>
      <section class="title-screen" id="title-screen">
        <div class="title-constellation">✧ &nbsp; N E X O &nbsp; ✧</div>
        <div class="title-content">
          <span class="eyebrow">PROTOCOLO DO DESPERTAR · VERSÃO ${VERSION}</span>
          <h1>NEXO <span>ASCENSÃO</span></h1>
          <p>O poder tem um preço. A fenda escolheu você.</p>
          <div class="title-actions">
            <button class="btn btn-primary" data-action="continue" id="continue-btn">Continuar jornada <span>↗</span></button>
            <button class="btn btn-outline" data-action="new">Novo despertar</button>
            <button class="btn btn-ghost" data-action="settings">Configurações</button>
            <button class="btn btn-ghost" data-action="credits">Créditos</button>
          </div>
        </div>
        <div class="title-side">E C O S &nbsp; D O &nbsp; V A Z I O <span>// 01</span></div>
        <div class="title-footer">RPG DE AÇÃO 3D ORIGINAL · CONTROLES POR TECLADO, MOUSE E TOQUE</div>
      </section>
      <div id="hud" class="hud" hidden>
        <div class="hud-top">
          <section class="player-card glass">
            <div class="avatar">✧<span class="avatar-rank" id="rank-label">E</span></div>
            <div class="player-vitals">
              <div class="hud-name-line"><strong>ANDARILHO</strong><span id="level-label">NV 1</span></div>
              <div class="stat-row hp"><div id="hp-fill" class="stat-fill"></div><span id="hp-label">PV</span></div>
              <div class="stat-row mp"><div id="mp-fill" class="stat-fill"></div><span id="mp-label">PM</span></div>
              <div class="stat-row sp"><div id="sp-fill" class="stat-fill"></div><span id="sp-label">VIGOR</span></div>
              <div class="xp-row"><div id="xp-fill"></div></div>
            </div>
          </section>
          <section class="zone-card glass"><small id="zone-kicker">TERRITÓRIO ABERTO</small><b id="zone-label">Planície das Cinzas</b><span id="zone-extra">Portal E · Incursão liberada</span></section>
          <section class="quest-card glass"><small>MISSÃO ATIVA</small><strong id="quest-label">O primeiro despertar</strong><span id="quest-progress">0 / 5 eliminados</span></section>
          <section class="map-card glass"><canvas width="148" height="148" id="minimap" aria-label="Minimapa"></canvas><span>RADAR DE FENDA</span></section>
        </div>
        <div class="hud-left">
          <div class="toast-stack" id="toast-stack" aria-live="polite"></div>
          <div class="hud-controls glass">WASD mover · Clique atacar · Shift correr<br/>1–4 habilidades · R invocar · E interagir<br/>I mochila · C atributos · J missões · Esc pausa</div>
        </div>
        <div class="hud-bottom">
          <div class="hud-currency glass"><span class="gold-dot">◆</span> <b id="gold-label">0</b><span class="essence-dot">✧</span> <b id="essence-label">0</b></div>
          <div class="ability-bar glass" id="ability-bar"></div>
          <div class="hud-quick"><button data-action="panel" data-panel="inventory" title="Inventário (I)">▣ <span>I</span></button><button data-action="panel" data-panel="attributes" title="Atributos (C)">✦ <span>C</span></button><button data-action="pause" title="Pause (Esc)">Ⅱ <span>Esc</span></button></div>
        </div>
        <div id="interact-prompt" class="interact-prompt glass" hidden><kbd>E</kbd><span id="interact-text">Investigar portal</span></div>
        <div id="touch-controls" class="touch-controls">
          <div class="move-joystick" id="move-joystick"><div class="joystick-thumb"></div></div>
          <div class="touch-actions"><button data-touch="KeyR">ECO</button><button data-touch="KeyE">E</button><button data-touch="Digit1">1</button><button data-touch="Digit2">2</button><button data-touch="Digit3">3</button><button data-touch="Digit4">4</button><button class="touch-hit" data-touch="MouseLeft">ATK</button><button data-touch="Escape">Ⅱ</button></div>
        </div>
      </div>
      <div id="overlay" class="overlay" hidden><div class="overlay-backdrop" data-action="close"></div><div class="overlay-frame" role="dialog" aria-modal="true" aria-label="Menu do jogo"><div class="panel-head"><div><small>PROTOCOLO DE CONTROLE</small><h2 id="panel-title">MENU</h2></div><button class="icon-btn" data-action="close" aria-label="Fechar menu">×</button></div><div id="panel-body" class="panel-body"></div></div></div>
      <input id="save-import" type="file" accept=".json,application/json" hidden />
    `;
    this.root.addEventListener('click',e=>this.onAction(e));
    this.root.addEventListener('change',e=>this.onChange(e));
    this.root.addEventListener('input',e=>this.onInput(e));
    $('#save-import',this.root).addEventListener('change',e=>this.importFile(e));
    this.game.input.attachMobile(this.root);
    this.showTitle();
  }
  showTitle(){
    $('#title-screen',this.root).hidden=false;$('#hud',this.root).hidden=true;$('#overlay',this.root).hidden=true;
    this.panel=null;this.activeTitle=true;$('#continue-btn',this.root).disabled=!this.game.saves.hasSave();
  }
  showGame(){
    $('#title-screen',this.root).hidden=true;$('#hud',this.root).hidden=false;$('#overlay',this.root).hidden=true;
    this.activeTitle=false;this.panel=null;this.renderSkills();
    const hints=$('.hud-controls',this.root);if(hints)hints.hidden=!this.game.settings.showHints;
    this.refreshHUD();
  }
  toast(message,kind='neutral'){
    const stack=$('#toast-stack',this.root);if(!stack)return;
    const el=document.createElement('div');el.className=`toast toast-${kind}`;el.textContent=message;
    stack.prepend(el);while(stack.children.length>4)stack.lastChild.remove();
    setTimeout(()=>el.remove(),3100);
  }
  popupDamage(worldPosition,value,isCrit=false){
    if(!this.game.settings.showDamage)return;
    const v=worldPosition.clone();v.y+=2.7;v.project(this.game.camera);
    if(v.z>1||v.z< -1)return;
    const el=document.createElement('span');el.className=`damage-number${isCrit?' crit':''}`;
    el.textContent=`${isCrit?'✦ ':''}${formatNumber(value)}`;
    el.style.left=`${(v.x*.5+.5)*100}%`;el.style.top=`${(-v.y*.5+.5)*100}%`;
    this.root.append(el);setTimeout(()=>el.remove(),850);
  }
  setPanel(name,fromTitle=false){
    this.panel=name;this.panelOrigin=fromTitle?'title':'playing';
    if(!fromTitle && this.game.state!=='dead')this.game.state='paused';
    $('#overlay',this.root).hidden=false;
    $('#panel-title',this.root).textContent=({pause:'JOGO PAUSADO',inventory:'INVENTÁRIO',attributes:'ATRIBUTOS',skills:'HABILIDADES',journal:'MISSÕES',settings:'CONFIGURAÇÕES',map:'MAPA E FENDAS',credits:'CRÉDITOS',death:'CAÇADOR DERROTADO'})[name]||'MENU';
    this.renderPanel();
  }
  closePanel(){
    if(this.game.state==='dead')return;
    $('#overlay',this.root).hidden=true;this.panel=null;
    if(this.game.state==='paused')this.game.state='playing';
    this.game.input.clear();
  }
  onAction(e){
    const b=e.target.closest('[data-action]');if(!b)return;
    const a=b.dataset.action,g=this.game,c=g.character;
    if(a==='continue')g.start(false);
    if(a==='new'){
      if(g.saves.hasSave()&&!window.confirm('Começar do zero? O progresso salvo atual será substituído.'))return;
      g.start(true);
    }
    if(a==='credits')this.setPanel('credits',g.state==='title');
    if(a==='settings')this.setPanel('settings',g.state==='title');
    if(a==='panel')this.setPanel(b.dataset.panel);
    if(a==='pause')this.setPanel('pause');
    if(a==='close')this.closePanel();
    if(a==='resume')this.closePanel();
    if(a==='revive')g.revive();
    if(a==='save'){g.save();this.toast('Progresso salvo','good');}
    if(a==='quit'){g.save();g.toTitle();}
    if(a==='tab')this.setPanel(b.dataset.tab);
    if(a==='ability')b.dataset.id==='basic'?g.combat.basic():g.combat.use(b.dataset.id);
    if(a==='summon')g.summon();
    if(a==='interact')g.interact();
    if(a==='select-item'){this.selectedUid=b.dataset.uid;this.renderPanel();}
    if(a==='filter-items'){this.filter=b.dataset.filter;this.renderPanel();}
    if(a==='equip-item'){g.equip(b.dataset.uid);this.renderPanel();}
    if(a==='unequip'){g.unequip(b.dataset.slot);this.renderPanel();}
    if(a==='upgrade-item'){g.upgrade(b.dataset.uid);this.renderPanel();}
    if(a==='dismantle-item'){
      const item=c.inventory.find(i=>i.uid===b.dataset.uid);
      if(item && ['raro','epico','lendario'].includes(item.rarity) && !window.confirm('Desmontar este item raro? A operação não pode ser desfeita.'))return;
      g.dismantle(b.dataset.uid);this.renderPanel();
    }
    if(a==='attribute'){g.allocate(b.dataset.key);this.renderPanel();}
    if(a==='claim-quest'){g.claimQuest(b.dataset.id);this.renderPanel();}
    if(a==='export'){g.saves.export(c);this.toast('Arquivo de save exportado','good');}
    if(a==='import')$('#save-import',this.root).click();
  }
  onChange(e){
    const k=e.target.dataset.setting;
    if(!k)return;
    let val=e.target.type==='checkbox'?e.target.checked:e.target.value;
    if(e.target.type==='range')val=Number(val);
    if(k==='fps')val=Number(val);
    this.game.setSetting(k,val);
    if(k==='quality')this.toast('Qualidade aplicada','good');
  }
  onInput(e){
    if(e.target.dataset.setting==='masterVolume'){
      const v=$('#volume-value',this.root);if(v)v.textContent=`${Math.round(Number(e.target.value)*100)}%`;
    }
  }
  async importFile(e){
    const file=e.target.files?.[0];if(!file)return;
    try{
      const c=await this.game.saves.import(file);
      if(!window.confirm('Importar este arquivo e substituir seu progresso atual?'))return;
      this.game.saves.write(c);this.game.start(false);this.toast('Progresso importado','good');
    }catch(err){this.toast(`Importação falhou: ${err.message}`,'bad');}
    finally{e.target.value='';}
  }
  renderSkills(){
    $('#ability-bar',this.root).innerHTML=`<button class="slot main-attack" data-action="ability" data-id="basic"><span class="slot-glyph">⚔</span><small>CLIQUE</small><b>ATAQUE</b></button>`+
    SKILLS.map((s,i)=>`<button class="slot skill-slot" data-action="ability" data-id="${s.id}" title="${safe(s.desc)}"><span class="slot-glyph">${['✧','◈','➤','♥'][i]}</span><small>${s.key}</small><b>${safe(s.name)}</b><span class="cooldown-layer" id="cool-${s.id}"></span></button>`).join('')+
    `<button class="slot summon-slot" data-action="summon"><span class="slot-glyph">♟</span><small>R</small><b>INVOCAR</b></button>`;
  }
  refreshHUD(){
    if(this.game.state==='title')return;
    const g=this.game,c=g.character,p=g.player,s=g.stats;
    const vals=[['hp',p.health,s.maxHp],['mp',p.mana,s.maxMp],['sp',p.stamina,s.maxStamina]];
    for(const [key,cur,max] of vals){$(`#${key}-fill`,this.root).style.width=pct(cur,max)+'%';$(`#${key}-label`,this.root).textContent=`${Math.ceil(cur)} / ${Math.ceil(max)}`;}
    $('#level-label',this.root).textContent=`NV ${c.level}`;
    $('#rank-label',this.root).textContent=rankForLevel(c.level);
    $('#xp-fill',this.root).style.width=pct(c.xp,xpForNext(c.level))+'%';
    $('#gold-label',this.root).textContent=formatNumber(c.gold);
    $('#essence-label',this.root).textContent=formatNumber(c.essence);
    $('#zone-kicker',this.root).textContent=g.mode==='gate'?'INSTÂNCIA ATIVA':'TERRITÓRIO ABERTO';
    $('#zone-label',this.root).textContent=g.mode==='gate'?'Ruptura do Arconte':'Planície das Cinzas';
    $('#zone-extra',this.root).textContent=g.mode==='gate'?`Onda ${Math.min(8,g.spawns.gateKills)}/8 · Grau ${GATE_RANKS[Math.min(5,Math.floor((c.gateLevel-1)/4))]}`:`Incursões vencidas ${c.gateClears} · Rank ${rankForLevel(c.level)}`;
    const q=QUESTS.find(q=>!c.questClaimed.includes(q.id));
    $('#quest-label',this.root).textContent=q?.name||'Todos os contratos concluídos';
    $('#quest-progress',this.root).textContent=q?`${questProgress(c,q)} / ${q.required} · J: recompensas`:'Novas missões em atos futuros';
    const near=g.world.portalDistance(p.position.x,p.position.z)<5;
    $('#interact-prompt',this.root).hidden=!near;
    if(near)$('#interact-text',this.root).textContent=g.mode==='gate'?'E: sair da masmorra':'E: entrar na fenda';
    for(const skill of SKILLS){
      const element=$(`#cool-${skill.id}`,this.root);if(!element)continue;
      const cool=g.combat.cooldowns[skill.id]||0;
      element.textContent=c.level<skill.unlock?`NV ${skill.unlock}`:cool>0?`${cool.toFixed(1)}s`:'';
      element.classList.toggle('cooling',cool>0||c.level<skill.unlock);
      element.parentElement.classList.toggle('locked',c.level<skill.unlock);
    }
  }
  drawMinimap(){
    if(this.game.state==='title')return;
    const canvas=$('#minimap',this.root),ctx=canvas.getContext('2d');
    const {width:w,height:h}=canvas,p=this.game.player.position;
    ctx.clearRect(0,0,w,h);ctx.fillStyle='#0a101c';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#25364a';ctx.lineWidth=1;
    for(let i=-2;i<=2;i++){const o=w/2+i*29;ctx.beginPath();ctx.moveTo(o,0);ctx.lineTo(o,h);ctx.moveTo(0,o);ctx.lineTo(w,o);ctx.stroke();}
    const mark=(x,z,r,color)=>{const px=w/2+(x-p.x)*2.2,py=h/2+(z-p.z)*2.2;
      if(px<2||px>w-2||py<2||py>h-2)return;
      ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();};
    mark(this.game.world.portal.position.x,this.game.world.portal.position.z,5,'#9e84ee');
    for(const enemy of this.game.enemies)if(enemy.active)mark(enemy.position.x,enemy.position.z,enemy.type==='boss'?5:2.7,'#f0778e');
    for(const shadow of this.game.shadows)if(!shadow.dead)mark(shadow.position.x,shadow.position.z,2.5,'#8b78ff');
    mark(p.x,p.z,4.2,'#9febf4');
    ctx.strokeStyle='#83e9f8';ctx.strokeRect(1,1,w-2,h-2);
  }
  renderPanel(){
    const name=this.panel,body=$('#panel-body',this.root);
    if(!name)return;
    const tabs=['inventory','attributes','skills','journal','map','settings'];
    const nav=name==='pause'||name==='credits'||name==='death'||this.panelOrigin==='title'?'':`<nav class="panel-nav">${tabs.map(k=>`<button class="${k===name?'active':''}" data-action="tab" data-tab="${k}">${({inventory:'Mochila',attributes:'Atributos',skills:'Técnicas',journal:'Missões',map:'Fendas',settings:'Opções'})[k]}</button>`).join('')}</nav>`;
    let content='';
    if(name==='pause')content=renderPause.call(this);
    if(name==='inventory')content=renderInventory.call(this);
    if(name==='attributes')content=renderAttributes.call(this);
    if(name==='skills')content=renderAbilities.call(this);
    if(name==='journal')content=renderJournal.call(this);
    if(name==='map')content=renderMap.call(this);
    if(name==='settings')content=renderSettings.call(this);
    if(name==='credits')content=renderCredits.call(this);
    if(name==='death')content=renderDeath.call(this);
    body.innerHTML=nav+content;
  }

}
