import * as THREE from 'three';
import { CHUNK_SIZE, LOADED_RADIUS } from '../data/balance.js';
import { seedRandom } from '../utils/math.js';

const floorGeometry = new THREE.PlaneGeometry(CHUNK_SIZE,CHUNK_SIZE);
const rockGeometry = new THREE.DodecahedronGeometry(1,0);
const treeTrunkGeometry = new THREE.CylinderGeometry(.23,.38,2.5,5);
const crownGeometry = new THREE.ConeGeometry(1.6,3.2,5);
const pillarGeometry = new THREE.CylinderGeometry(.65,.85,4,6);
// LOD1: silhuetas de poucos triângulos. Geometrias compartilhadas entre todos os chunks.
const rockLowGeometry = new THREE.BoxGeometry(1.7,1.4,1.6);
const treeLowGeometry = new THREE.ConeGeometry(1.65,4.8,3);
const pillarLowGeometry = new THREE.BoxGeometry(1.25,3.3,1.25);

export class World {
  constructor(scene){
    this.scene=scene;this.chunks=new Map();this.colliders=new Map();this.mode='expanse';this.tick=0;this.detail='auto';
    this.floorMat = new THREE.MeshLambertMaterial({color:0x121b2b});
    this.rockMat=new THREE.MeshLambertMaterial({color:0x35415b,flatShading:true});
    this.treeMat=new THREE.MeshLambertMaterial({color:0x172c37,flatShading:true});
    this.trunkMat=new THREE.MeshLambertMaterial({color:0x242b3a,flatShading:true});
    this.pillarMat=new THREE.MeshLambertMaterial({color:0x3c3656,flatShading:true});
    this.portal = new THREE.Group();this.scene.add(this.portal);
    this.makePortal();
    this.ambient=new THREE.HemisphereLight(0x97b5fa,0x101124,1.6);scene.add(this.ambient);
    this.sun=new THREE.DirectionalLight(0x9fb5ff,2.15);this.sun.position.set(-10,22,18);scene.add(this.sun);
    this.fill = new THREE.PointLight(0x8f6bff,14,22,2);this.fill.position.set(0,4,-9);scene.add(this.fill);
    this.scene.fog=new THREE.FogExp2(0x090e1a,.014);
    this.scene.background=new THREE.Color(0x090e1a);
    this.setMode('expanse');
    this.updateChunks(0,0);
  }
  makePortal(){
    const ringMat=new THREE.MeshStandardMaterial({color:0x7d55d0,emissive:0x7545f8,emissiveIntensity:1.8,metalness:.3,roughness:.3});
    this.portalRing=new THREE.Mesh(new THREE.TorusGeometry(2.45,.20,8,48),ringMat);
    this.portalRing.position.y=3.05;this.portal.add(this.portalRing);
    const inner=new THREE.Mesh(new THREE.CircleGeometry(2.16,36),new THREE.MeshBasicMaterial({color:0x45226e,transparent:true,opacity:.54,side:THREE.DoubleSide,depthWrite:false}));
    inner.position.set(0,3.05,.07);this.portal.add(inner);this.innerPortal=inner;
    for(let i=0;i<5;i++){
      const rune = new THREE.Mesh(new THREE.OctahedronGeometry(.2,.0),new THREE.MeshBasicMaterial({color:0x8de8ff}));
      rune.position.set(Math.cos(i*Math.PI*2/5)*2.45,3.05+Math.sin(i*Math.PI*2/5)*2.45,0);
      this.portal.add(rune);
    }
    const base=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.8,.45,10),this.pillarMat);
    base.position.y=.15;this.portal.add(base);
    const circle = new THREE.Mesh(new THREE.RingGeometry(2.2,3.3,36),new THREE.MeshBasicMaterial({color:0x7659dd,transparent:true,opacity:.45,side:THREE.DoubleSide}));
    circle.rotation.x=-Math.PI/2;circle.position.y=.39;this.portal.add(circle);
    this.portal.position.set(-9,0,-9);
  }
  setMode(mode){
    this.mode=mode;
    const gate=mode==='gate';
    this.scene.fog.color.setHex(gate?0x080610:0x090e1a);
    this.scene.fog.density=gate?.022:.014;
    this.scene.background.setHex(gate?0x080610:0x090e1a);
    this.floorMat.color.setHex(gate?0x160e21:0x152235);
    this.rockMat.color.setHex(gate?0x473050:0x35415b);
    this.pillarMat.color.setHex(gate?0x36223e:0x3c3656);
    this.portalRing.material.color.setHex(gate?0x74e0c9:0x7d55d0);
    this.portalRing.material.emissive.setHex(gate?0x2ed9b4:0x7545f8);
    this.portal.position.set(gate?0:-9,0,gate?-9:-9);
    this.ambient.intensity=gate?1.05:1.6;
    this.fill.position.set(this.portal.position.x,4,this.portal.position.z);
    this.clearChunks();this.updateChunks(0,0);
  }
  clearChunks(){for(const chunk of this.chunks.values())this.disposeChunk(chunk);this.chunks.clear();this.colliders.clear();}
  disposeChunk(group){
    this.scene.remove(group);
    // Apenas o anel da célula central usa geometria e material exclusivos.
    group.traverse(o=>{
      if(o.isInstancedMesh)o.dispose?.();
      if(o.isMesh&&!o.isInstancedMesh&&o.geometry?.type==='RingGeometry'){o.geometry.dispose();o.material.dispose();}
    });
  }
  seed(cx,cz){return (cx*73856093 ^ cz*19349663 ^ (this.mode==='gate'?712391:13579))>>>0;}
  buildChunk(cx,cz){
    const rng=seedRandom(this.seed(cx,cz));
    const group=new THREE.Group();group.position.set(cx*CHUNK_SIZE,0,cz*CHUNK_SIZE);
    const ground=new THREE.Mesh(floorGeometry,this.floorMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.21;group.add(ground);
    if(cx===0&&cz===0){
      const lines=new THREE.Mesh(new THREE.RingGeometry(9.7,9.82,48),new THREE.MeshBasicMaterial({color:this.mode==='gate'?0x462443:0x2d4263,side:THREE.DoubleSide,transparent:true,opacity:.25}));
      lines.rotation.x=-Math.PI/2;lines.position.y=-.19;group.add(lines);
    }
    const colliders=[];
    const rocks=[];const trees=[];const pillars=[];
    for(let i=0;i<16;i++){
      const x=(rng()-.5)*(CHUNK_SIZE-3),z=(rng()-.5)*(CHUNK_SIZE-3);
      const wx=x+cx*CHUNK_SIZE,wz=z+cz*CHUNK_SIZE;
      if(Math.hypot(wx,wz)<13 || Math.hypot(wx-this.portal.position.x,wz-this.portal.position.z)<5)continue;
      const roll=rng(); const s=.65+rng()*1.25;
      if(roll<.55) rocks.push({x,z,s,rot:rng()*6.3});
      else if(roll<.80&&! (this.mode==='gate')) trees.push({x,z,s:.75+rng()*.5});
      else pillars.push({x,z,s:.6+rng()*.4});
      colliders.push({x:wx,z:wz,r:s*(roll<.55?.75:1.05)});
    }
    const near=new THREE.Group(), far=new THREE.Group();
    group.add(near,far);group.userData.near=near;group.userData.far=far;
    group.userData.lod='high';
    const temp=new THREE.Object3D();
    function instanced(parent,geometry,material,items,place){
      if(!items.length)return;
      const im=new THREE.InstancedMesh(geometry,material,items.length);
      items.forEach((p,i)=>{place(p,temp);temp.updateMatrix();im.setMatrixAt(i,temp.matrix);});
      im.instanceMatrix.needsUpdate=true;
      im.computeBoundingSphere(); // permite frustum culling com instâncias deslocadas
      parent.add(im);
    }
    instanced(near,rockGeometry,this.rockMat,rocks,(p,t)=>{t.position.set(p.x,.6*p.s,p.z);t.scale.set(p.s,p.s*.85,p.s);t.rotation.set(0,p.rot,0);});
    instanced(near,treeTrunkGeometry,this.trunkMat,trees,(p,t)=>{t.position.set(p.x,1.1*p.s,p.z);t.scale.setScalar(p.s);t.rotation.set(0,0,0);});
    instanced(near,crownGeometry,this.treeMat,trees,(p,t)=>{t.position.set(p.x,3.6*p.s,p.z);t.scale.setScalar(p.s);t.rotation.set(0,0,0);});
    instanced(near,pillarGeometry,this.pillarMat,pillars,(p,t)=>{t.position.set(p.x,1.6*p.s,p.z);t.scale.setScalar(p.s);t.rotation.set(0,0,0);});
    instanced(far,rockLowGeometry,this.rockMat,rocks,(p,t)=>{t.position.set(p.x,.6*p.s,p.z);t.scale.setScalar(p.s);t.rotation.set(0,p.rot,0);});
    instanced(far,treeLowGeometry,this.treeMat,trees,(p,t)=>{t.position.set(p.x,2.65*p.s,p.z);t.scale.setScalar(p.s);t.rotation.set(0,0,0);});
    instanced(far,pillarLowGeometry,this.pillarMat,pillars,(p,t)=>{t.position.set(p.x,1.6*p.s,p.z);t.scale.setScalar(p.s);t.rotation.set(0,0,0);});
    far.visible=false;
    this.colliders.set(`${cx},${cz}`,colliders);
    this.chunks.set(`${cx},${cz}`,group);this.scene.add(group);
  }
  updateChunks(x,z){
    const cx=Math.floor((x+CHUNK_SIZE/2)/CHUNK_SIZE),cz=Math.floor((z+CHUNK_SIZE/2)/CHUNK_SIZE);
    const wanted = new Set();
    for(let dx=-LOADED_RADIUS;dx<=LOADED_RADIUS;dx++){
      for(let dz=-LOADED_RADIUS;dz<=LOADED_RADIUS;dz++){
        const k=`${cx+dx},${cz+dz}`;wanted.add(k);
        if(!this.chunks.has(k))this.buildChunk(cx+dx,cz+dz);
      }
    }
    for(const [k,g] of this.chunks){
      if(!wanted.has(k)){this.disposeChunk(g);this.chunks.delete(k);this.colliders.delete(k);}
    }
  }
  updateLOD(x,z){
    for(const group of this.chunks.values()){
      const d=Math.hypot(group.position.x-x,group.position.z-z);
      const last=group.userData.lod;
      // Histerese 30/36 m reduz alternância visual e reconstruções.
      const next=this.detail==='low'||(last==='high'?d>36:d>30)?'low':'high';
      if(next!==last){
        group.userData.near.visible=next==='high';
        group.userData.far.visible=next==='low';
        group.userData.lod=next;
      }
    }
  }
  isFree(x,z,r=.45){
    const cx=Math.floor((x+CHUNK_SIZE/2)/CHUNK_SIZE),cz=Math.floor((z+CHUNK_SIZE/2)/CHUNK_SIZE);
    for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
      const obstacles=this.colliders.get(`${cx+dx},${cz+dz}`)||[];
      for(const p of obstacles)if(Math.hypot(p.x-x,p.z-z)<p.r+r)return false;
    }
    return true;
  }
  portalDistance(x,z){return Math.hypot(x-this.portal.position.x,z-this.portal.position.z);}
  update(dt,time,player){
    this.tick+=dt;
    if(this.tick>.23){this.updateChunks(player.x,player.z);this.updateLOD(player.x,player.z);this.tick=0;}
    this.portalRing.rotation.z=Math.sin(time*.3)*.02;
    this.innerPortal.material.opacity=.36+Math.sin(time*1.5)*.13;
    this.fill.intensity=12+Math.sin(time*2)*3;
  }
  dispose(){this.clearChunks();this.scene.remove(this.portal);}
}
