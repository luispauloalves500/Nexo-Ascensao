import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveSystem } from '../src/systems/SaveSystem.js';
import { initialCharacter } from '../src/systems/Progression.js';
function mockStorage(){
  const map=new Map();
  globalThis.localStorage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
}
test('salvamento escreve, lê e remove o estado',()=>{
  mockStorage();const store=new SaveSystem();const ch=initialCharacter();ch.kills=30;
  assert.equal(store.write(ch),true);assert.equal(store.hasSave(),true);
  assert.equal(store.read().kills,30);store.clear();assert.equal(store.hasSave(),false);
});
test('save desconhecido é sanitizado e itens inválidos não entram',()=>{
  const store=new SaveSystem();
  const d=store.sanitize({level:10000,points:-5,attributes:{forca:999},inventory:[{uid:'<script>',id:'lamina-fenda',rarity:'raro',level:2},{uid:'legit',id:'escudo-arcano',rarity:'raro',level:120,plus:90}],equipped:{armadura:'legit'}});
  assert.equal(d.level,60);assert.equal(d.points,0);assert.equal(d.attributes.forca,99);
  assert.equal(d.inventory.length,1);assert.equal(d.inventory[0].level,60);
  assert.equal(d.inventory[0].plus,10);assert.equal(d.equipped.armadura,'legit');
  assert.equal(d.equipped.arma,null);
});
