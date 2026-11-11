import { GATE_RANKS } from '../../data/balance.js';

export function renderMap(){
    const c=this.game.character,g=this.game;
    return `<div class="map-panel"><div class="map-illustration"><div class="map-gate">✧<span>FENDA CENTRAL</span></div><div class="map-home">⌂ <span>PLANÍCIE</span></div><div class="map-player">●</div></div>
      <div class="map-description"><div class="section-caption">CICLO DE INCURSÕES</div><h3>Rupturas do Nexo</h3><p>Entre na fenda pressionando E perto do portal. Elimine oito criaturas para atrair o Arconte. Derrote-o e volte pelo portal para evoluir o grau da próxima incursão.</p>
        <div class="detail-stats"><div><span>Masmorras vencidas</span><b>${c.gateClears}</b></div><div><span>Grau atual</span><b>${GATE_RANKS[Math.min(5,Math.floor((c.gateLevel-1)/4))]}</b></div><div><span>Incursão atual</span><b>${g.mode==='gate'?'Em andamento':'Disponível'}</b></div></div>
        <p class="muted">O mundo aberto é carregado em tiles de 24m com distância visual adaptativa. O modo história completo terá 6 regiões e 30 fendas autorais.</p></div></div>`;
  }
