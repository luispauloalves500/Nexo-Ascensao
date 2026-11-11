import * as THREE from 'three';
import { distance2 } from '../utils/math.js';

const bodyG=new THREE.ConeGeometry(.58,2.2,5);
const headG=new THREE.IcosahedronGeometry(.29,0);
const eyesG=new THREE.BoxGeometry(.37,.07,.08);
const mats=[new THREE.MeshStandardMaterial({color:0x232044,emissive:0x14113f,emissiveIntensity:.8,roughness:.7}),new THREE.MeshBasicMaterial({color:0x8a74ff})];

export class Shadow {
  constructor(scene,index){
    this.root=new THREE.Group();scene.add(this.root);
    this.root.add(new THREE.Mesh(bodyG,mats[0]));this.root.children[0].position.y=1.1;
    const head=new THREE.Mesh(headG,mats[0]);head.position.y=2.3;this.root.add(head);
    const eyes=new THREE.Mesh(eyesG,mats[1]);eyes.position.set(0,2.34,-.23);this.root.add(eyes);
    const aura=new THREE.Mesh(new THREE.RingGeometry(.57,.73,20),new THREE.MeshBasicMaterial({color:0x7563ee,side:THREE.DoubleSide,transparent:true,opacity:.65}));
    aura.rotation.x=-Math.PI/2;aura.position.y=.05;this.root.add(aura);
    this.index=index;this.hp=90;this.hpMax=90;this.timer=.4;this.dead=false;
  }
  get position(){return this.root.position;}
  update(dt,game){
    if(this.dead)return;
    this.timer-=dt;
    const target=game.enemies.filter(e=>e.active).sort((a,b)=>distance2(a.position,this.position)-distance2(b.position,this.position))[0];
    const friend=game.player.position;
    const desired=target?.position||friend;
    const dist=distance2(this.position,desired);
    if(dist> (target?2.0:2+this.index*.7)){
      const nx=(desired.x-this.position.x)/dist,nz=(desired.z-this.position.z)/dist;
      const x=this.position.x+nx*5.6*dt,z=this.position.z+nz*5.6*dt;
      if(game.world.isFree(x,z,.35)){this.position.x=x;this.position.z=z;}
      this.root.rotation.y=Math.atan2(-nx,-nz);
    }
    if(target&&dist<2.25&&this.timer<=0){
      this.timer=.92;game.damageEnemy(target,Math.round(game.stats.damage*.42+game.character.level*1.6),false,'ECO');
      game.effects.burst(target.position,0x856dff,5);
    }
    this.root.position.y=Math.sin(game.time*2+this.index)*.12;
  }
  damage(value){this.hp=Math.max(0,this.hp-value);if(this.hp<=0){this.dead=true;this.root.visible=false;}return true;}
  dispose(){this.root.parent?.remove(this.root);}
}
