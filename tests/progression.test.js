import test from 'node:test';
import assert from 'node:assert/strict';
import { xpForNext, initialCharacter, gainXp, calcStats, spendPoint, rankForLevel, createDrop, upgradeCost, upgradeItem, dismantle } from '../src/systems/Progression.js';
import { seedRandom } from '../src/utils/math.js';
import { questAvailable, QUESTS } from '../src/systems/Quests.js';

test('curva de experiência cresce de maneira monotônica e atribui pontos',()=>{
  for(let lv=2;lv<=60;lv++)assert.ok(xpForNext(lv)>xpForNext(lv-1));
  const c=initialCharacter();
  assert.equal(gainXp(c,xpForNext(1)),1);
  assert.equal(c.level,2);assert.equal(c.points,5);assert.equal(c.xp,0);
  const n=gainXp(c,xpForNext(2)+xpForNext(3)+5);
  assert.equal(n,2);assert.equal(c.level,4);assert.equal(c.xp,5);assert.equal(c.points,15);
});
test('atributos e equipamentos alteram estatísticas sem mutar atributos originais',()=>{
  const c=initialCharacter(),before=calcStats(c);
  c.points=2;assert.equal(spendPoint(c,'forca'),true);assert.equal(spendPoint(c,'forca'),true);
  assert.equal(spendPoint(c,'forca'),false);
  assert.equal(spendPoint(c,'inexistente'),false);
  const after=calcStats(c);
  assert.ok(after.damage>before.damage);
  assert.equal(c.attributes.forca,7);
  assert.equal(before.attrs.forca,6); // bônus do item inicial
});
test('raridade, custos, aprimoramento garantido e desmontagem protegida',()=>{
  const c=initialCharacter(),r=seedRandom(42);
  const item=createDrop('errante',r,9);
  assert.ok(['comum','incomum','raro','epico','lendario'].includes(item.rarity));
  assert.ok(item.level>=8&&item.level<=10);
  c.inventory.push(item);
  const cost=upgradeCost(item);
  c.gold=cost.gold;c.essence=cost.essence;
  assert.equal(upgradeItem(c,item.uid),true);
  assert.equal(item.plus,1);
  assert.equal(upgradeItem(c,item.uid),false);
  assert.equal(dismantle(c,'starter-blade'),false);
  assert.equal(dismantle(c,item.uid),true);
  assert.equal(c.inventory.find(i=>i.uid===item.uid),undefined);
});
test('rank é definido por faixas e missão só libera recompensa ao cumprir requisito',()=>{
  const c=initialCharacter();
  assert.equal(rankForLevel(1),'E');assert.equal(rankForLevel(7),'D');assert.equal(rankForLevel(51),'S');
  const q=QUESTS[0];assert.equal(questAvailable(c,q),false);
  c.kills=5;assert.equal(questAvailable(c,q),true);
  c.questClaimed.push(q.id);assert.equal(questAvailable(c,q),false);
});
