import test from 'node:test';
import assert from 'node:assert/strict';
import { initialCharacter, calcStats } from '../src/systems/Progression.js';
import { renderInventory } from '../src/ui/views/InventoryView.js';
import { renderAttributes, renderAbilities, renderJournal } from '../src/ui/views/ProgressView.js';
import { renderMap } from '../src/ui/views/WorldView.js';
import { renderPause, renderDeath, renderSettings, renderCredits } from '../src/ui/views/SystemView.js';

test('todos os nove painéis geram marcação a partir do estado do personagem',()=>{
  const character=initialCharacter();
  const game={character,stats:calcStats(character),shadows:[],mode:'expanse',state:'paused',settings:{quality:'auto',fps:60,masterVolume:.65,showDamage:true,showHints:true,autoSave:true}};
  const vm={game,filter:'todos',selectedUid:null};
  for(const [fn,text] of [
    [renderInventory,'EQUIPAMENTOS ATIVOS'],
    [renderAttributes,'Força'],
    [renderAbilities,'Corte espectral'],
    [renderJournal,'O primeiro despertar'],
    [renderMap,'FENDA CENTRAL'],
    [renderPause,'Continuar partida'],
    [renderDeath,'Renascer na Planície'],
    [renderSettings,'Qualidade gráfica'],
    [renderCredits,'NEXO: ASCENSÃO']
  ]) {
    const html=fn.call(vm);
    assert.equal(typeof html,'string');
    assert.ok(html.length>100,`${fn.name} deve gerar painel útil`);
    assert.ok(html.includes(text),`${fn.name} precisa incluir ${text}`);
  }
});
