

export function renderPause(){
    return `<div class="pause-screen"><div class="pause-label">O TEMPO DA FENDA FOI SUSPENSO</div>
      <p>Inimigos, projéteis, tempo de habilidades e progressão ficam congelados até você voltar.</p>
      <div class="pause-actions">
        <button class="btn btn-primary" data-action="resume">▶ Continuar partida</button>
        <button class="btn btn-outline" data-action="tab" data-tab="inventory">▣ Inventário</button>
        <button class="btn btn-outline" data-action="tab" data-tab="attributes">✧ Atributos</button>
        <button class="btn btn-outline" data-action="tab" data-tab="journal">◈ Missões</button>
        <button class="btn btn-outline" data-action="tab" data-tab="settings">⚙ Configurações</button>
        <button class="btn btn-outline" data-action="save">⤓ Salvar manualmente</button>
        <button class="btn btn-ghost danger" data-action="quit">Sair para o título</button>
      </div><div class="save-note">Salvamento automático no descanso e a cada 45 segundos (se habilitado).</div></div>`;
  }

export function renderSettings(){
    const s=this.game.settings;
    return `<div class="settings-list"><div class="setting-row"><div><b>Qualidade gráfica</b><p>Resolução dinâmica, distância de visualização e densidade de efeitos.</p></div><select data-setting="quality"><option value="auto" ${s.quality==='auto'?'selected':''}>Automática</option><option value="low" ${s.quality==='low'?'selected':''}>Baixa</option><option value="medium" ${s.quality==='medium'?'selected':''}>Média</option><option value="high" ${s.quality==='high'?'selected':''}>Alta</option></select></div>
      <div class="setting-row"><div><b>Limite de FPS</b><p>30 FPS reduz consumo em aparelhos modestos.</p></div><select data-setting="fps"><option value="30" ${s.fps===30?'selected':''}>30 FPS</option><option value="60" ${s.fps===60?'selected':''}>60 FPS</option></select></div>
      <div class="setting-row"><div><b>Volume mestre (reservado)</b><p>Controle já salvo; áudio autoral será incorporado em pacotes externos.</p></div><div class="volume-control"><input data-setting="masterVolume" type="range" min="0" max="1" step="0.05" value="${s.masterVolume}" /><span id="volume-value">${Math.round(s.masterVolume*100)}%</span></div></div>
      <div class="setting-row"><div><b>Números de dano</b><p>Mostrar flutuantes de acertos e golpes críticos.</p></div><input type="checkbox" data-setting="showDamage" ${s.showDamage?'checked':''}/></div>
      <div class="setting-row"><div><b>Dicas na tela</b><p>Exibir lembrete rápido dos comandos.</p></div><input type="checkbox" data-setting="showHints" ${s.showHints?'checked':''}/></div>
      <div class="setting-row"><div><b>Salvamento automático</b><p>Persiste progresso localmente a cada 45 segundos.</p></div><input type="checkbox" data-setting="autoSave" ${s.autoSave?'checked':''}/></div>
      ${this.game.state!=='title'?`<div class="save-tools"><button class="btn btn-outline" data-action="export">Exportar save JSON</button><button class="btn btn-outline" data-action="import">Importar save JSON</button></div>`:''}
      <small class="muted">Dados locais deste navegador. Não há conta remota. A qualidade automática usa densidade de pixels e plataforma como estimativa inicial.</small></div>`;
  }

export function renderDeath(){return `<div class="pause-screen"><div class="pause-label">SINAL VITAL PERDIDO // SISTEMA DE RECUPERAÇÃO</div><h3>Você caiu na Fenda</h3><p>Retorne ao ponto de origem com PV e mana restaurados. A penalidade é de 10% do ouro disponível; equipamentos e níveis são preservados.</p><div class="pause-actions"><button class="btn btn-primary" data-action="revive">↺ Renascer na Planície</button><button class="btn btn-outline" data-action="quit">Voltar ao menu</button></div></div>`;}

export function renderCredits(){return `<div class="credits"><span>PROJETO ORIGINAL</span><h3>NEXO: ASCENSÃO</h3><p>Um action-RPG original de caça a monstros, fortalecimento pessoal e domínio de ecos. Inspirado no gênero de fantasia de progressão, sem personagens, nomes, imagens ou músicas licenciadas de outras franquias.</p><p>Protótipo criado em Three.js, modular e publicado via Vite + GitHub Actions.</p><button class="btn btn-primary" data-action="close">Voltar</button></div>`;}
