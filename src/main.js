import '../styles/base.css';
import '../styles/hud.css';
import '../styles/panels.css';
import '../styles/responsive.css';
import { Game } from './core/Game.js';

const game = new Game(document.querySelector('#app'));
window.addEventListener('error',e=>{
  console.error('NEXO erro:',e.error||e.message);
  game.ui?.toast('Erro inesperado. Verifique o console.','bad');
});
window.addEventListener('unhandledrejection',e=>{
  console.error('NEXO promessa:',e.reason);
  game.ui?.toast('Falha de carregamento ou gravação.','bad');
});
window.addEventListener('pagehide',()=>{if(game.state!=='title'&&game.settings.autoSave)game.save();});
