import { SKILLS } from '../data/balance.js';
import { clamp, distance2 } from '../utils/math.js';

export class Combat {
  constructor(game){this.game=game;this.cooldowns={};this.attackCooldown=0;this.combo=0;this.comboWindow=0;}
  update(dt){
    this.attackCooldown=Math.max(0,this.attackCooldown-dt);
    this.comboWindow=Math.max(0,this.comboWindow-dt);
    if(!this.comboWindow)this.combo=0;
    for(const k of Object.keys(this.cooldowns))this.cooldowns[k]=Math.max(0,this.cooldowns[k]-dt);
  }
  strike(radius,damage,stagger=0,arc=Math.PI*1.7){
    const g=this.game,p=g.player.position;
    let hit=0;let crits=0;
    for(const enemy of g.enemies){
      if(!enemy.active||distance2(enemy.position,p)>radius+enemy.radius*.35)continue;
      const angle=Math.atan2(-(enemy.position.x-p.x),-(enemy.position.z-p.z));
      const facing=Math.atan2(Math.sin(angle+g.player.visual.rotation.y),Math.cos(angle+g.player.visual.rotation.y));
      if(Math.abs(facing)>arc/2)continue;
      const crit=Math.random()<g.stats.crit;
      const value=Math.round(damage*(crit?1.7:1)*(0.93+Math.random()*.14));
      g.damageEnemy(enemy,value,crit);hit++;if(crit)crits++;
      if(stagger)enemy.stun=Math.max(enemy.stun,stagger);
    }
    if(hit>0)g.ui.toast(`${hit} acerto${hit!==1?'s':''}${crits?' · CRÍTICO':''}`,'combat');
    g.effects.attackRing(p,0x7de5fa,radius);
    return hit;
  }
  basic(){
    const g=this.game;
    if(g.state!=='playing'||this.attackCooldown>0||g.player.stamina<5)return false;
    g.player.stamina-=5;
    this.combo=this.comboWindow>0?(this.combo+1)%3:0;
    this.comboWindow=.9;
    this.attackCooldown=this.combo===2?.49:.34;
    g.player.attack();
    this.strike(this.combo===2?3.8:3.15,g.stats.damage*(this.combo===2?1.55:1+.2*this.combo),.13);
    return true;
  }
  use(id){
    const g=this.game,skill=SKILLS.find(s=>s.id===id);
    if(!skill||g.state!=='playing')return false;
    if(g.character.level<skill.unlock){g.ui.toast(`Desbloqueia no nível ${skill.unlock}`);return false;}
    if(this.cooldowns[id]>0)return false;
    if(g.player.mana<skill.cost){g.ui.toast('Mana insuficiente');return false;}
    g.player.mana-=skill.cost;this.cooldowns[id]=skill.cooldown;
    if(id==='corte'){
      g.player.attack();this.strike(4.6,g.stats.damage*1.85,.35);
      g.effects.burst(g.player.position,0x6aebff,8);
    }
    if(id==='ruptura'){
      for(const enemy of g.enemies)if(enemy.active&&distance2(enemy.position,g.player.position)<6.5){
        g.damageEnemy(enemy,Math.round(g.stats.damage*2.4),false);enemy.stun=Math.max(enemy.stun,1.1);
      }
      g.effects.attackRing(g.player.position,0xa67bff,6.5);
    }
    if(id==='passo'){
      const angle=g.player.visual.rotation.y;
      const dx=-Math.sin(angle),dz=-Math.cos(angle);
      for(let step=0;step<10;step++){
        const x=g.player.position.x+dx*.55,z=g.player.position.z+dz*.55;
        if(!g.world.isFree(x,z,.45))break;
        g.player.position.set(x,0,z);
      }
      g.player.invuln=.38;this.strike(3,g.stats.damage*1.4,.25);
      g.effects.burst(g.player.position,0x8073ef,8);
    }
    if(id==='dreno'){
      const hits=this.strike(4.1,g.stats.damage*1.1,.2);
      if(hits){g.player.health=clamp(g.player.health+hits*(13+g.stats.attrs.inteligencia*.9),0,g.stats.maxHp);}
    }
    g.ui.refreshHUD();return true;
  }
}
