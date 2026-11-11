import { clamp } from '../utils/math.js';

export class Input {
  constructor(canvas){
    this.canvas=canvas;this.down=new Set();this.pressed=new Set();this.mouse={x:0,y:0,inside:false};
    this.pointer={x:0,y:0};this.touchMove={x:0,z:0};this.orbit=0;this.zoom=0;
    window.addEventListener('keydown',e=>{
      if(e.target.closest('input, textarea, select'))return;
      if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();
      if(!this.down.has(e.code))this.pressed.add(e.code);
      this.down.add(e.code);
    });
    window.addEventListener('keyup',e=>this.down.delete(e.code));
    window.addEventListener('blur',()=>{this.down.clear();this.pressed.clear();this.touchMove={x:0,z:0};});
    canvas.addEventListener('pointermove',e=>{
      if(e.pointerType!=='touch')this.mouse.inside=true;
      this.mouse.x=(e.clientX/window.innerWidth)*2-1;
      this.mouse.y=-(e.clientY/window.innerHeight)*2+1;
    });
    canvas.addEventListener('pointerdown',e=>{
      if(e.button===0)this.pressed.add('MouseLeft');
    });
    canvas.addEventListener('contextmenu',e=>e.preventDefault());
    canvas.addEventListener('wheel',e=>{this.zoom=clamp(this.zoom+Math.sign(e.deltaY),-4,6);},{passive:true});
  }
  consume(code){if(this.pressed.has(code)){this.pressed.delete(code);return true;}return false;}
  movement(){
    const x=Number(this.down.has('KeyD')||this.down.has('ArrowRight'))-Number(this.down.has('KeyA')||this.down.has('ArrowLeft'))+this.touchMove.x;
    const z=Number(this.down.has('KeyS')||this.down.has('ArrowDown'))-Number(this.down.has('KeyW')||this.down.has('ArrowUp'))+this.touchMove.z;
    const d=Math.max(1,Math.hypot(x,z));return {x:x/d,z:z/d};
  }
  get sprinting(){return this.down.has('ShiftLeft')||this.down.has('ShiftRight');}
  attachMobile(root){
    const joy=root.querySelector('#move-joystick');
    if(!joy)return;
    const thumb=joy.querySelector('.joystick-thumb');
    let activeId=null;
    const reset=()=>{activeId=null;this.touchMove={x:0,z:0};thumb.style.transform='translate(0,0)';};
    joy.addEventListener('pointerdown',e=>{e.preventDefault();activeId=e.pointerId;joy.setPointerCapture(activeId);position(e);});
    const position=e=>{
      if(e.pointerId!==activeId)return;
      const b=joy.getBoundingClientRect();let x=(e.clientX-(b.left+b.width/2))/(b.width*.36);let z=(e.clientY-(b.top+b.height/2))/(b.height*.36);
      const d=Math.max(1,Math.hypot(x,z));x=clamp(x/d,-1,1);z=clamp(z/d,-1,1);
      this.touchMove={x,z};thumb.style.transform=`translate(${x*35}px,${z*35}px)`;
    };
    joy.addEventListener('pointermove',position);
    joy.addEventListener('pointerup',reset);joy.addEventListener('pointercancel',reset);
    root.querySelectorAll('[data-touch]').forEach(b=>b.addEventListener('pointerdown',e=>{
      e.preventDefault();this.pressed.add(b.dataset.touch);
    }));
  }
  clear(){this.pressed.clear();}
}
