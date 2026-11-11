import * as THREE from 'three';
import { clamp, lerp } from '../utils/math.js';

const capeMat = new THREE.MeshStandardMaterial({color:0x171528,metalness:.2,roughness:.7,side:THREE.DoubleSide});
const armorMat = new THREE.MeshStandardMaterial({color:0x232c43,metalness:.58,roughness:.4,flatShading:true});
const skinMat = new THREE.MeshStandardMaterial({color:0xe3b6a9,roughness:.8});
const darkMat = new THREE.MeshStandardMaterial({color:0x0b0e1b,metalness:.25,roughness:.6});
const bladeMat = new THREE.MeshStandardMaterial({color:0x72eaf2,emissive:0x1687a9,emissiveIntensity:1.6,metalness:.8,roughness:.18});
function part(group,g,m,pos,rot){const o=new THREE.Mesh(g,m);o.position.set(...pos);if(rot)o.rotation.set(...rot);group.add(o);return o;}
export class Player {
  constructor(scene){
    this.root=new THREE.Group();scene.add(this.root);
    this.visual=new THREE.Group();this.root.add(this.visual);
    this.body=part(this.visual,new THREE.BoxGeometry(.8,1.12,.46),armorMat,[0,1.62,0]);
    part(this.visual,new THREE.DodecahedronGeometry(.34,0),skinMat,[0,2.48,-.03]);
    part(this.visual,new THREE.BoxGeometry(.7,.12,.54),darkMat,[0,2.65,-.02]);
    part(this.visual,new THREE.BoxGeometry(.34,.13,.30),skinMat,[0,2.28,-.06]);
    this.leftArm =new THREE.Group();this.leftArm.position.set(-.55,2.07,0);this.visual.add(this.leftArm);
    part(this.leftArm,new THREE.BoxGeometry(.27,.83,.32),armorMat,[0,-.42,0]);
    this.rightArm=new THREE.Group();this.rightArm.position.set(.55,2.07,0);this.visual.add(this.rightArm);
    part(this.rightArm,new THREE.BoxGeometry(.27,.83,.32),armorMat,[0,-.42,0]);
    part(this.rightArm,new THREE.CylinderGeometry(.075,.095,.7,6),darkMat,[.09,-.97,.04]);
    this.sword=part(this.rightArm,new THREE.BoxGeometry(.15,1.0,.16),bladeMat,[.09,-1.21,.04]);
    part(this.sword,new THREE.ConeGeometry(.14,.4,4),bladeMat,[0,-.60,0],[Math.PI,0,0]);
    this.leftLeg=new THREE.Group();this.leftLeg.position.set(-.23,1.04,0);this.visual.add(this.leftLeg);
    part(this.leftLeg,new THREE.BoxGeometry(.3,1.08,.38),darkMat,[0,-.52,0]);
    this.rightLeg=new THREE.Group();this.rightLeg.position.set(.23,1.04,0);this.visual.add(this.rightLeg);
    part(this.rightLeg,new THREE.BoxGeometry(.3,1.08,.38),darkMat,[0,-.52,0]);
    this.cape=part(this.visual,new THREE.PlaneGeometry(1.5,2.2),capeMat,[0,1.3,.36],[.23,0,0]);
    this.ring=part(this.root,new THREE.RingGeometry(.64,.71,28),new THREE.MeshBasicMaterial({color:0x74dbff,transparent:true,opacity:.6,side:THREE.DoubleSide}),[0,-.13,0],[-Math.PI/2,0,0]);
    this.root.position.set(0,0,5);this.health=100;this.mana=100;this.stamina=100;
    this.aim=0;this.walkTime=0;this.attackTime=0;this.invuln=0;this.hitFlash=0;
  }
  get position(){return this.root.position;}
  move(dt,axis,input,world,stats){
    const motion=Math.hypot(axis.x,axis.z);
    let dirX=axis.x,dirZ=axis.z;
    if(motion>1){dirX/=motion;dirZ/=motion;}
    let speed=stats.move*(input.sprinting?1.32:1);
    if(input.sprinting&&motion>.1){this.stamina=Math.max(0,this.stamina-dt*14);if(this.stamina<2)speed=stats.move;}
    const x=this.position.x+dirX*speed*dt,z=this.position.z+dirZ*speed*dt;
    if(world.isFree(x,this.position.z,.45))this.position.x=x;
    if(world.isFree(this.position.x,z,.45))this.position.z=z;
    if(motion>.1){
      this.walkTime+=dt*(input.sprinting?13:10);
      const turn= Math.atan2(-dirX,-dirZ);
      const delta=Math.atan2(Math.sin(turn-this.visual.rotation.y),Math.cos(turn-this.visual.rotation.y));
      this.visual.rotation.y += delta*Math.min(1,dt*12);
    }
    this.attackTime=Math.max(0,this.attackTime-dt);
    this.invuln=Math.max(0,this.invuln-dt);
    this.hitFlash=Math.max(0,this.hitFlash-dt);
    this.leftLeg.rotation.x=lerp(this.leftLeg.rotation.x,motion>.1?Math.sin(this.walkTime)*.6:0,Math.min(1,dt*11));
    this.rightLeg.rotation.x=lerp(this.rightLeg.rotation.x,motion>.1?-Math.sin(this.walkTime)*.6:0,Math.min(1,dt*11));
    this.leftArm.rotation.x=lerp(this.leftArm.rotation.x,motion>.1?-Math.sin(this.walkTime)*.4:0,Math.min(1,dt*9));
    this.rightArm.rotation.x=lerp(this.rightArm.rotation.x,this.attackTime>0?-1.7+Math.sin(this.attackTime*24)*.7:-.12,Math.min(1,dt*16));
    this.cape.rotation.x=.2+(motion>.1?Math.sin(this.walkTime*.8)*.12:.02);
    this.visual.position.y=motion>.1?Math.abs(Math.sin(this.walkTime))*.055:0;
  }
  face(x,z){const a=Math.atan2(x-this.position.x,z-this.position.z)+Math.PI;this.visual.rotation.y=a;}
  attack(){this.attackTime=.29;}
  damage(amount){if(this.invuln>0)return false;this.health=Math.max(0,this.health-amount);this.invuln=.52;this.hitFlash=.2;return true;}
  fill(stats){this.health=stats.maxHp;this.mana=stats.maxMp;this.stamina=stats.maxStamina;}
  restore(dt,stats){
    this.health=clamp(this.health+dt*(.4+stats.attrs.vitalidade*.06),0,stats.maxHp);
    this.mana=clamp(this.mana+dt*(2+stats.attrs.inteligencia*.08),0,stats.maxMp);
    this.stamina=clamp(this.stamina+dt*17,0,stats.maxStamina);
  }
  dispose(){this.root.parent?.remove(this.root);}
}
