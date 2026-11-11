import * as THREE from 'three';
import { ENEMY_TYPES } from '../data/balance.js';

const torsoG=new THREE.DodecahedronGeometry(1,0);
const headG=new THREE.IcosahedronGeometry(.48,0);
const limbG=new THREE.CylinderGeometry(.16,.24,1.3,5);
const eyeG=new THREE.BoxGeometry(.46,.09,.07);
const groundRingG=new THREE.RingGeometry(1,1.1,24);
const eyeM=new THREE.MeshBasicMaterial({color:0xffd3e1});
const warnM=new THREE.MeshBasicMaterial({color:0xff4978,side:THREE.DoubleSide,transparent:true,opacity:.4});

export class Enemy {
  constructor(scene,type='errante',level=1){
    this.root=new THREE.Group();scene.add(this.root);
    this.mat=new THREE.MeshStandardMaterial({color:0x8194aa,metalness:.22,roughness:.62,flatShading:true});
    this.body=new THREE.Mesh(torsoG,this.mat);this.body.position.y=1.3;this.body.scale.set(.7,1,.58);this.root.add(this.body);
    this.head=new THREE.Mesh(headG,this.mat);this.head.position.y=2.3;this.root.add(this.head);
    this.eye=new THREE.Mesh(eyeG,eyeM);this.eye.position.set(0,2.32,-.43);this.root.add(this.eye);
    this.legs=[];
    for(const d of [-1,1]){
      const leg=new THREE.Mesh(limbG,this.mat);leg.position.set(d*.45,.6,0);this.root.add(leg);this.legs.push(leg);
    }
    this.warn=new THREE.Mesh(groundRingG,warnM);this.warn.rotation.x=-Math.PI/2;this.warn.position.y=.015;this.warn.visible=false;this.root.add(this.warn);
    this.hpBarBg=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.1),new THREE.MeshBasicMaterial({color:0x240e20,depthTest:false}));
    this.hpBarBg.position.set(0,3.03,0);this.root.add(this.hpBarBg);
    this.hpBar=new THREE.Mesh(new THREE.PlaneGeometry(1.24,.06),new THREE.MeshBasicMaterial({color:0xf66a9e,depthTest:false}));
    this.hpBar.position.set(0,3.03,-.01);this.root.add(this.hpBar);
    this.active=true;this.configure(type,level);
  }
  configure(type,level){
    this.type=type;this.def=ENEMY_TYPES[type];this.level=level;
    const scale=type==='boss'?2.2:type==='vigia'?1.25:1;
    this.root.scale.setScalar(scale);this.mat.color.setHex(this.def.color);
    this.hpMax=Math.round(this.def.hp*(1+Math.max(0,level-1)*.18));this.hp=this.hpMax;
    this.speed=this.def.speed;this.state='chase';this.cooldown=.6;this.windup=0;this.stun=0;this.lifetime=0;
    this.active=true;this.root.visible=true;this.warn.visible=false;
  }
  spawn(x,z){this.root.position.set(x,0,z);this.root.visible=true;this.active=true;}
  get position(){return this.root.position;}
  get radius(){return this.def.radius*(this.type==='boss'?1.15:1);}
  update(dt,game){
    if(!this.active)return;
    this.lifetime+=dt;this.stun=Math.max(0,this.stun-dt);this.cooldown=Math.max(0,this.cooldown-dt);
    const target=game.pickEnemyTarget(this);
    if(!target)return;
    const dx=target.position.x-this.position.x,dz=target.position.z-this.position.z;
    const dist=Math.max(.01,Math.hypot(dx,dz));
    this.root.rotation.y=Math.atan2(-dx,-dz);
    const near=dist<(this.def.range + this.radius*.4);
    if(this.stun>0){this.state='stun';this.warn.visible=false;}
    else if(this.state==='windup'){
      this.windup-=dt;this.warn.visible=true;
      this.warn.scale.setScalar(1+(1-this.windup/.65)*.55);
      if(this.windup<=0){
        this.warn.visible=false;
        if(dist<this.def.range+this.radius+0.55){
          const dmg=Math.max(1,this.def.attack*(1+Math.max(0,this.level-1)*.12)-game.stats.armor*.28);
          game.hitTarget(target,Math.round(dmg),this);
        }
        this.state='recover';this.cooldown=this.type==='boss'?1.05:1.4;
      }
    } else if(this.state==='recover'){
      if(this.cooldown<=0)this.state='chase';
    }else if(near&&this.cooldown<=0){this.state='windup';this.windup=this.type==='boss'?.88:.65;this.warn.scale.setScalar(1);}
    else if(!near){
      this.state='chase';this.warn.visible=false;
      const spd=this.speed*(this.stun>0?0:1);
      const x=this.position.x+(dx/dist)*spd*dt,z=this.position.z+(dz/dist)*spd*dt;
      if(game.world.isFree(x,z,this.radius*.6)){this.position.x=x;this.position.z=z;}
      this.legs[0].rotation.x=Math.sin(this.lifetime*8)*.3;
      this.legs[1].rotation.x=-this.legs[0].rotation.x;
    }
    this.body.rotation.z=Math.sin(this.lifetime*2.5)*.05;
    this.hpBar.scale.x=Math.max(.001,this.hp/this.hpMax);
    this.hpBar.position.x=-.62*(1-this.hp/this.hpMax);
    this.hpBarBg.lookAt(game.camera.position);
    this.hpBar.lookAt(game.camera.position);
  }
  damage(value,stagger=0){
    if(!this.active)return false;
    this.hp=Math.max(0,this.hp-value);this.stun=Math.max(this.stun,stagger);
    if(stagger>0)this.state='chase';
    return this.hp<=0;
  }
  remove(){this.active=false;this.root.visible=false;this.warn.visible=false;}
  dispose(){this.root.parent?.remove(this.root);this.mat.dispose();}
}
