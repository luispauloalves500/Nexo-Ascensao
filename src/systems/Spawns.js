import { ENEMY_TYPES } from '../data/balance.js';
import { distance2 } from '../utils/math.js';
import { Enemy } from '../entities/Enemy.js';

export class Spawns {
  constructor(game){this.game=game;this.pool=[];this.timer=0;this.gateKills=0;this.bossSpawned=false;this.spawnedInGate=0;}
  reset(){
    const known=new Set(this.pool);
    for(const e of this.game.enemies){
      e.remove();if(!known.has(e)){this.pool.push(e);known.add(e);}
    }
    this.game.enemies.length=0;
    this.timer=0;this.gateKills=0;this.spawnedInGate=0;this.bossSpawned=false;
  }
  create(type,x,z){
    const g=this.game;
    let enemy=this.pool.pop();
    if(enemy)enemy.configure(type,g.character.level+Math.max(0,g.character.gateLevel-1));
    else enemy=new Enemy(g.scene,type,g.character.level+Math.max(0,g.character.gateLevel-1));
    enemy.spawn(x,z);g.enemies.push(enemy);return enemy;
  }
  summon(type,min=14,max=26){
    const g=this.game,p=g.player.position;
    for(let t=0;t<18;t++){
      const theta=Math.random()*Math.PI*2,r=min+Math.random()*(max-min);
      const x=p.x+Math.sin(theta)*r,z=p.z+Math.cos(theta)*r;
      if(!g.world.isFree(x,z,1.2) || g.world.portalDistance(x,z)<7)continue;
      this.create(type,x,z);return true;
    }
    return false;
  }
  update(dt){
    const g=this.game;
    this.timer-=dt;
    if(this.timer>0)return;
    this.timer=1.3;
    g.enemies=g.enemies.filter(e=>e.active);
    if(g.mode==='expanse'){
      while(g.enemies.length<Math.min(12,7+Math.floor(g.character.level/8))){
        const r=Math.random(),type=r<.52?'errante':r<.82?'espectro':'vigia';
        if(!this.summon(type))break;
      }
    }else if(!this.bossSpawned){
      if(this.gateKills>=8){
        this.bossSpawned=true;this.create('boss',0,-22);g.ui.toast('O ARCONTE DESPERTOU','important');
      }else{
        while(g.enemies.length<Math.min(5,8-this.gateKills)){
          const type=Math.random()<.35?'vigia':'espectro';
          if(!this.summon(type,10,21))break;
          this.spawnedInGate++;
        }
      }
    }
  }
  onKill(e){if(this.game.mode==='gate'&&e.type!=='boss')this.gateKills++;}
  dispose(){for(const e of [...this.game.enemies,...this.pool])e.dispose();}
}
