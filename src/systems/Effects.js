import * as THREE from 'three';
import { seedRandom } from '../utils/math.js';

const sparkGeometry=new THREE.TetrahedronGeometry(.16,0);
export class Effects {
  constructor(scene){
    this.scene=scene;this.pool=[];this.active=[];this.rng=seedRandom(28471);
    this.mats=new Map();this.swing=null;
  }
  material(color){
    if(!this.mats.has(color))this.mats.set(color,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.88,depthWrite:false}));
    return this.mats.get(color);
  }
  burst(pos,color=0x77dbff,count=8){
    for(let i=0;i<count && this.active.length<128;i++){
      const p=this.pool.pop()||{mesh:new THREE.Mesh(sparkGeometry,this.material(color)),time:0,v:new THREE.Vector3()};
      p.mesh.material=this.material(color);
      p.mesh.position.set(pos.x+(this.rng()-.5),1.4+this.rng(),pos.z+(this.rng()-.5));
      const theta=this.rng()*Math.PI*2;
      p.v.set(Math.cos(theta)*(2+this.rng()*3),1+this.rng()*3,Math.sin(theta)*(2+this.rng()*3));
      p.mesh.scale.setScalar(.7+this.rng());p.time=.55+this.rng()*.3;
      this.scene.add(p.mesh);this.active.push(p);
    }
  }
  attackRing(pos,color=0x75dcee,radius=3){
    if(this.swing){this.scene.remove(this.swing.mesh);this.swing.mesh.geometry.dispose();this.swing.mesh.material.dispose();this.swing=null;}
    const mesh=new THREE.Mesh(new THREE.RingGeometry(radius*.88,radius,40),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.65,side:THREE.DoubleSide,depthWrite:false}));
    mesh.position.set(pos.x,.02,pos.z);mesh.rotation.x=-Math.PI/2;
    this.scene.add(mesh);
    this.swing={mesh,ttl:.32};
  }
  update(dt){
    for(let i=this.active.length-1;i>=0;i--){
      const p=this.active[i];p.time-=dt;p.mesh.position.addScaledVector(p.v,dt);p.v.y-=dt*7;
      p.mesh.scale.multiplyScalar(Math.max(.2,1-dt*.9));
      if(p.time<=0){p.mesh.parent?.remove(p.mesh);this.pool.push(p);this.active.splice(i,1);}
    }
    if(this.swing){this.swing.ttl-=dt;this.swing.mesh.material.opacity=Math.max(0,this.swing.ttl/.32*.65);
      if(this.swing.ttl<=0){this.scene.remove(this.swing.mesh);this.swing.mesh.geometry.dispose();this.swing.mesh.material.dispose();this.swing=null;}}
  }
}
