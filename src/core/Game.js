import * as THREE from 'three';
import { World } from '../world/World.js';
import { Player } from '../entities/Player.js';
import { Shadow } from '../entities/Shadow.js';
import { Input } from '../input/Input.js';
import { UI } from '../ui/UI.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { Combat } from '../systems/Combat.js';
import { Spawns } from '../systems/Spawns.js';
import { Effects } from '../systems/Effects.js';
import { calcStats, createDrop, dismantle, gainXp, initialCharacter, spendPoint, upgradeItem } from '../systems/Progression.js';
import { ITEMS } from '../data/balance.js';
import { QUESTS, questAvailable } from '../systems/Quests.js';
import { clamp, distance2 } from '../utils/math.js';

const GROUND=new THREE.Plane(new THREE.Vector3(0,1,0),0);
const AIM_VECTOR=new THREE.Vector2();
const AIM_POINT=new THREE.Vector3();
const FIXED_STEP=1/60;

export class Game {
  constructor(host){
    this.host=host;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(59,1,.1,170);
    this.camera.position.set(12,8,20);
    this.renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.25;
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.host.appendChild(this.renderer.domElement);
    this.raycaster=new THREE.Raycaster();
    this.input=new Input(this.renderer.domElement);
    this.saves=new SaveSystem();
    this.settings=this.saves.getSettings();
    this.character=initialCharacter();this.stats=calcStats(this.character);
    this.world=new World(this.scene);
    this.player=new Player(this.scene);
    this.effects=new Effects(this.scene);
    this.enemies=[];this.shadows=[];
    this.spawns=new Spawns(this);
    this.combat=new Combat(this);
    this.mode='expanse';this.state='title';this.time=0;this.lastFrame=0;this.lastRendered=0;this.accumulated=0;
    this.hudTimer=0;this.mapTimer=0;this.saveTimer=0;this.gateCleared=false;
    this.ui=new UI(this);
    this.setSetting('quality',this.settings.quality,false);
    window.addEventListener('resize',()=>this.resize());
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden&&this.state==='playing')this.ui.setPanel('pause');
      this.lastRendered=performance.now();
    });
    this.resize();
    const loading=document.querySelector('#loading');
    if(loading){loading.style.opacity='0';setTimeout(()=>loading.remove(),450);}
    this.renderer.setAnimationLoop(t=>this.frame(t));
  }
  resize(){
    const w=window.innerWidth,h=window.innerHeight;
    this.camera.aspect=w/Math.max(1,h);this.camera.updateProjectionMatrix();
    this.renderer.setSize(w,h,false);
  }
  setSetting(key,value,persist=true){
    this.settings[key]=value;
    if(key==='quality'){
      if(this.world)this.world.detail=value;
      const dpr=window.devicePixelRatio||1;
      const isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||window.innerWidth<750;
      const limits={low:.85,medium:1.15,high:1.6,auto:isMobile?1:1.3};
      this.resolutionTarget=Math.min(dpr,limits[value]||1.15);
      this.pixelRatio=this.resolutionTarget;
      this.renderer.setPixelRatio(this.pixelRatio);
      this.renderer.setSize(window.innerWidth,window.innerHeight,false);
    }
    if(key==='showHints'){
      const controls=document.querySelector('.hud-controls');if(controls)controls.hidden=!value;
    }
    if(persist)this.saves.saveSettings(this.settings);
  }
  frame(now){
    const minFrame=1000/(this.settings.fps||60);
    if(now-this.lastRendered<minFrame-1.8)return;
    const elapsed=this.lastRendered?Math.min(.08,(now-this.lastRendered)/1000):1/60;
    this.lastRendered=now;this.time+=elapsed;
    if(this.state==='paused'||(this.state==='title'&&this.ui.panel)){
      if(this.input.consume('Escape')||this.input.consume('KeyP'))this.ui.closePanel();
    }
    if(this.state==='playing'){
      this.accumulated+=elapsed;
      let steps=0;
      while(this.accumulated>=FIXED_STEP&&steps<4){
        this.update(FIXED_STEP);this.accumulated-=FIXED_STEP;steps++;
      }
      if(steps===4)this.accumulated=0;
    }else if(this.state==='title'){
      this.world.portalRing.rotation.z=Math.sin(now*.0005)*.035;
    }
    this.updateCamera(elapsed);
    this.renderer.render(this.scene,this.camera);
    this.performanceGovernor(elapsed);
  }
  performanceGovernor(dt){
    if(this.settings.quality!=='auto'||this.settings.fps===30)return;
    this._perfSum=(this._perfSum||0)+dt;
    this._perfFrames=(this._perfFrames||0)+1;
    if(this._perfSum<5)return;
    const fps=this._perfFrames/this._perfSum;
    const want=fps<45?Math.max(.7,this.pixelRatio-.11):fps>58?Math.min(this.resolutionTarget,this.pixelRatio+.045):this.pixelRatio;
    if(Math.abs(want-this.pixelRatio)>.01){this.pixelRatio=want;this.renderer.setPixelRatio(want);this.resize();}
    this._perfSum=0;this._perfFrames=0;
  }
  updateCamera(dt){
    let desired,target;
    if(this.state==='title'){
      desired=new THREE.Vector3(7.6+Math.sin(this.time*.1)*2,8.2,11.6);
      target=new THREE.Vector3(-6.5,2.4,-8.6);
    }else{
      const p=this.player.position;
      const z=Math.max(0.6,1+this.input.zoom*.11);
      desired=new THREE.Vector3(p.x+8.2*z,p.y+8.0*z,p.z+10*z);
      target=new THREE.Vector3(p.x,p.y+1.5,p.z);
    }
    this.camera.position.lerp(desired,Math.min(1,dt*6));
    this.camera.lookAt(target);
  }
  update(dt){
    const g=this;
    this.inputCommands();
    if(this.state!=='playing')return;
    const movement=this.input.movement();
    this.player.move(dt,movement,this.input,this.world,this.stats);
    if(this.input.mouse.inside){
      AIM_VECTOR.set(this.input.mouse.x,this.input.mouse.y);
      this.raycaster.setFromCamera(AIM_VECTOR,this.camera);
      if(this.raycaster.ray.intersectPlane(GROUND,AIM_POINT)){
        const d=Math.hypot(AIM_POINT.x-this.player.position.x,AIM_POINT.z-this.player.position.z);
        if(d>.75)this.player.face(AIM_POINT.x,AIM_POINT.z);
      }
    }
    this.player.restore(dt,this.stats);
    this.world.update(dt,this.time,this.player.position);
    this.combat.update(dt);
    this.spawns.update(dt);
    for(const enemy of this.enemies)enemy.update(dt,g);
    for(let i=this.shadows.length-1;i>=0;i--){
      const shadow=this.shadows[i];
      if(shadow.dead){shadow.dispose();this.shadows.splice(i,1);}
      else shadow.update(dt,g);
    }
    this.effects.update(dt);
    this.hudTimer+=dt;this.mapTimer+=dt;this.saveTimer+=dt;
    if(this.hudTimer>.12){this.hudTimer=0;this.ui.refreshHUD();}
    if(this.mapTimer>.28){this.mapTimer=0;this.ui.drawMinimap();}
    if(this.saveTimer>=45){this.saveTimer=0;if(this.settings.autoSave)this.save();}
    if(this.player.health<=0)this.die();
  }
  inputCommands(){
    const consume=k=>this.input.consume(k);
    if(this.state==='title')return this.input.clear();
    if(consume('Escape')||consume('KeyP')){
      if(this.state==='playing')this.ui.setPanel('pause');
      else if(this.state==='paused')this.ui.closePanel();
      return;
    }
    if(this.state!=='playing')return this.input.clear();
    for(const [k,panel] of [['KeyI','inventory'],['KeyC','attributes'],['KeyJ','journal'],['KeyK','skills'],['KeyM','map']]){
      if(consume(k)){this.ui.setPanel(panel);return;}
    }
    if(consume('MouseLeft'))this.combat.basic();
    for(const [k,id] of [['Digit1','corte'],['Digit2','ruptura'],['Digit3','passo'],['Digit4','dreno']])if(consume(k))this.combat.use(id);
    if(consume('KeyR'))this.summon();
    if(consume('KeyE'))this.interact();
  }
  start(newGame=false){
    this.character=newGame?initialCharacter():(this.saves.read()||initialCharacter());
    this.stats=calcStats(this.character);
    this.mode=this.character.currentZone||'expanse';
    this.world.setMode(this.mode);
    this.spawns.reset();this.clearShadows();this.gateCleared=false;
    this.player.position.set(0,0,5);this.player.fill(this.stats);
    this.player.visual.rotation.y=0;
    this.combat.cooldowns={};this.combat.attackCooldown=0;
    this.state='playing';this.input.clear();this.accumulated=0;this.time=0;this.lastRendered=performance.now();
    this.hudTimer=0;this.mapTimer=0;this.saveTimer=0;
    this.ui.showGame();
    this.ui.toast(newGame?'Você despertou. Cace as criaturas da planície.':'Bem-vindo de volta, caçador.','important');
    this.save();
  }
  toTitle(){
    this.spawns.reset();this.clearShadows();this.mode='expanse';this.world.setMode('expanse');
    this.player.position.set(0,0,5);this.state='title';this.input.clear();this.ui.showTitle();
  }
  save(){
    if(this.state==='title')return false;
    this.character.savedAt=Date.now();this.character.currentZone=this.mode;
    const ok=this.saves.write(this.character);
    if(!ok)this.ui.toast('Não foi possível salvar. Verifique armazenamento do navegador.','bad');
    return ok;
  }
  clearShadows(){for(const s of this.shadows)s.dispose();this.shadows=[];}
  refreshStats(preserveRatio=true){
    const old=this.stats;
    const hpRatio=this.player.health/Math.max(1,old.maxHp),mpRatio=this.player.mana/Math.max(1,old.maxMp);
    this.stats=calcStats(this.character);
    if(preserveRatio){this.player.health=clamp(hpRatio*this.stats.maxHp,0,this.stats.maxHp);this.player.mana=clamp(mpRatio*this.stats.maxMp,0,this.stats.maxMp);}
    else this.player.fill(this.stats);
    this.ui.refreshHUD();
  }
  addXp(amount){
    const n=gainXp(this.character,amount);
    if(n){this.refreshStats(false);this.ui.toast(`SUBIU ${n} NÍVEL${n>1?'IS':''} · +${n*5} PONTOS`,'important');this.effects.burst(this.player.position,0xe5d57f,16);this.save();}
  }
  equip(uid){
    const item=this.character.inventory.find(i=>i.uid===uid),base=ITEMS.find(i=>i.id===item?.id);
    if(!item||!base)return;
    this.character.equipped[base.slot]=uid;this.refreshStats();this.ui.toast(`${base.name} equipado`,'good');this.save();
  }
  unequip(slot){
    if(!['arma','armadura','anel'].includes(slot))return;
    this.character.equipped[slot]=null;this.refreshStats();this.save();
  }
  upgrade(uid){
    if(!upgradeItem(this.character,uid)){this.ui.toast('Recursos insuficientes ou nível máximo','bad');return;}
    this.refreshStats();this.ui.toast('Aprimoramento realizado (+1)','good');this.save();
  }
  dismantle(uid){
    if(!dismantle(this.character,uid)){this.ui.toast('Não é possível desmontar item equipado','bad');return;}
    this.ui.toast('Item convertido em essência','good');this.ui.selectedUid=null;this.save();
  }
  allocate(k){
    if(!spendPoint(this.character,k))return;
    this.refreshStats();this.save();
  }
  claimQuest(id){
    const q=QUESTS.find(q=>q.id===id);
    if(!q||!questAvailable(this.character,q))return;
    this.character.questClaimed.push(q.id);
    this.character.gold+=q.gold;this.character.essence+=q.essence;this.addXp(q.xp);
    this.ui.toast(`Missão concluída · +${q.gold} ouro`, 'good');this.save();
  }
  summon(){
    const c=this.character;
    if(!c.shadowUnlocked){this.ui.toast('Os Ecos despertam após a primeira fenda','bad');return;}
    if(this.shadows.filter(s=>!s.dead).length>=this.stats.shadowCapacity){this.ui.toast('Limite de Ecos atingido');return;}
    if(this.player.mana<35){this.ui.toast('Necessários 35 pontos de mana');return;}
    this.player.mana-=35;
    const active=this.shadows.filter(s=>!s.dead);
    const shadow=new Shadow(this.scene,active.length);
    shadow.position.set(this.player.position.x+(Math.random()-.5)*2,0,this.player.position.z+(Math.random()-.5)*2);
    this.shadows.push(shadow);c.shadowCount++;
    this.effects.burst(shadow.position,0x9b85fc,10);
    this.ui.toast('ECO VINCULADO · Uma sombra respondeu','important');
    this.save();
  }
  pickEnemyTarget(enemy){
    let target=this.player,nearest=distance2(enemy.position,this.player.position);
    for(const s of this.shadows){if(s.dead)continue;const d=distance2(enemy.position,s.position);if(d<nearest&&d<7.5){nearest=d;target=s;}}
    return target;
  }
  hitTarget(target,value,source){
    if(target===this.player){
      if(this.player.damage(value)){
        this.effects.burst(this.player.position,0xff6588,5);
        this.ui.popupDamage(this.player.position,value,false);
        if(this.player.health<this.stats.maxHp*.28)this.ui.toast('PV baixo! Recue ou use Dreno Vital.','bad');
      }
    }else target.damage(value);
  }
  damageEnemy(enemy,value,crit=false,source='CAÇADOR'){
    if(!enemy.active)return;
    this.ui.popupDamage(enemy.position,value,crit);
    this.effects.burst(enemy.position,crit?0xffd47a:0x78f0e8,crit?8:4);
    const died=enemy.damage(value,.04);
    if(died)this.enemyKilled(enemy);
  }
  enemyKilled(enemy){
    const c=this.character;
    enemy.remove();this.spawns.pool.push(enemy);this.spawns.onKill(enemy);
    c.kills++;
    const xp=enemy.def.xp*(1+Math.max(0,enemy.level-1)*.18);
    const gold=enemy.def.gold+Math.max(0,enemy.level-1)*2;
    c.gold+=Math.round(gold);c.essence+=Math.round(2+enemy.level*.5+(enemy.type==='boss'?45:0));
    this.addXp(Math.round(xp));
    if((enemy.type==='boss'||Math.random()<.25)&&c.inventory.length<60){
      const item=createDrop(enemy.type,Math.random,c.level);
      if(enemy.type==='boss'&&['comum','incomum','raro'].includes(item.rarity))item.rarity='epico';
      c.inventory.push(item);this.ui.toast(`ITEM ${item.rarity.toUpperCase()} ENCONTRADO`,'good');
    }else if(c.inventory.length>=60){c.gold+=15;this.ui.toast('Mochila cheia · +15 ouro convertido');}
    if(enemy.type==='boss'){
      c.bossKills++;c.gateClears++;c.gateLevel=Math.min(24,c.gateLevel+1);
      this.gateCleared=true;
      if(!c.shadowUnlocked){c.shadowUnlocked=true;this.ui.toast('PODER LIBERADO: VÍNCULO DOS ECOS (R)','important');}
      this.ui.toast('ARCONTE DERROTADO! RETORNE PELO PORTAL (E)','important');
      this.effects.burst(enemy.position,0x9877ff,22);this.save();
    }
    if(c.kills===5)this.ui.toast('Missão pronta! Pressione J para resgatar.','good');
  }
  interact(){
    if(this.world.portalDistance(this.player.position.x,this.player.position.z)>5)return;
    if(this.mode==='expanse')this.enterGate();
    else this.exitGate();
  }
  enterGate(){
    this.spawns.reset();
    this.mode='gate';this.character.currentZone='gate';this.gateCleared=false;
    this.world.setMode('gate');this.player.position.set(0,0,6);
    this.player.fill(this.stats);
    this.ui.toast('FENDA ABERTA · Elimine oito criaturas e enfrente o Arconte','important');
    this.save();
  }
  exitGate(){
    if(!this.gateCleared)this.ui.toast('Incursão abandonada. Sem recompensa de conclusão.','bad');
    this.spawns.reset();
    this.mode='expanse';this.character.currentZone='expanse';
    this.world.setMode('expanse');this.player.position.set(0,0,6);
    this.player.fill(this.stats);this.clearShadows();
    this.ui.toast('Você retornou à planície. Recursos salvos.','good');this.save();
  }
  die(){
    if(this.state!=='playing')return;
    this.state='dead';this.input.clear();this.ui.setPanel('death');
  }
  revive(){
    this.character.gold=Math.floor(this.character.gold*.90);
    this.character.currentZone='expanse';this.mode='expanse';
    this.spawns.reset();this.clearShadows();this.world.setMode('expanse');
    this.player.position.set(0,0,5);this.player.fill(this.stats);
    this.state='playing';this.ui.closePanel();this.ui.toast('Você retornou, mas perdeu 10% do ouro.','bad');this.save();
  }
}
