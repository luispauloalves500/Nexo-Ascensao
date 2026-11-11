# NEXO: ASCENSÃO — ARQUITETURA TÉCNICA E OTIMIZAÇÃO

**Alvo:** GitHub Pages + Vite + Three.js, sem backend, sem arquivo JS gigante. Este documento registra **o que existe no vertical slice** e o plano de evolução até uma estrutura sustentável para a campanha completa.

## 1. Árvore de módulos entregues

```text
nexo-ascensao-github-pages/
│
├── index.html                    # Shell HTML mínimo
├── vite.config.js                # base relativa; bundle / code splitting do three
├── package.json                  # dependências e scripts
├── styles/base.css               # tokens globais e título
├── styles/hud.css                # barras, habilidades e minimapa
├── styles/panels.css             # inventário, atributos, menus, pause
├── styles/responsive.css         # adaptações touch / viewport
├── public/favicon.svg
├── .github/workflows/deploy.yml  # build + teste + GitHub Pages
│
├── src/
│   ├── main.js                   # bootstrap / handlers globais
│   ├── core/Game.js              # ciclo de jogo, estados, integração
│   ├── input/Input.js            # teclado, mouse, joystick e botões touch
│   ├── world/World.js            # chunks, biomas, LOD, instancing, colisão estática
│   ├── entities/Player.js        # personagem low-poly + movimento
│   ├── entities/Enemy.js         # agente, IA simples, HP, ataque telegráfico
│   ├── entities/Shadow.js        # aliado invocado
│   ├── systems/Combat.js         # cooldown, combo e habilidades
│   ├── systems/Spawns.js         # ondas, limite de inimigos, pool
│   ├── systems/Effects.js        # pool de impactos e anéis de habilidade
│   ├── systems/Progression.js    # regras puras de EXP, stats, raridade, forja
│   ├── systems/SaveSystem.js     # persistência, validação e import/export
│   ├── systems/Quests.js         # dados dos 6 contratos e regras de progresso
│   ├── ui/UI.js                   # roteador de overlay, HUD, eventos e minimapa
│   ├── ui/format.js               # formatação/segurança de texto da interface
│   ├── ui/views/InventoryView.js  # equipamentos, mochila e aprimoramentos
│   ├── ui/views/ProgressView.js   # atributos, técnicas e missões
│   ├── ui/views/WorldView.js      # painel de regiões e fendas
│   ├── ui/views/SystemView.js     # pause, configurações, créditos, morte
│   ├── data/balance.js           # catálogos declarativos
│   └── utils/math.js             # clamp, RNG com seed e distância
│
├── tests/progression.test.js     # regras de experiência, stats, drop, forja
├── tests/save.test.js            # leitura e saneamento de save
├── tests/ui-views.test.js        # renderização isolada dos 9 painéis
└── docs/
    ├── GDD_COMPLETO.md
    ├── ARQUITETURA_TECNICA.md
    ├── TESTES_MANUAIS.md
    └── ESTADO_ATUAL.md
```

**Princípio:** HTML é só shell; CSS separado; regras de negócio ficam em JS puro; o renderizador usa Three.js; UI DOM é montada de forma central e atualizada pontualmente. Os renderizadores de telas já estão separados em `src/ui/views/`; `UI.js` coordena apenas eventos/HUD. No crescimento do projeto, separar `Game.js` em serviços mais finos e extrair controladores adicionais será P1. Não colocar IA, HUD, SAVE, loja e física no mesmo arquivo.

## 2. Fluxo de dados e ciclo de vida

```text
              Index.html
                   │
             main.js bootstrap
                   │
                 Game
    ┌──────────────┼───────────────┐
    │              │               │
Input/Controls  Scene/World      CharacterState
    │              │               │
    └─ commands ──►│◄─ events ─────┘
                   │
          fixed-step simulation
             60 Hz (máx. 4)
                   │
      ┌────────────┼────────────┐
      │            │            │
  Player/AI     Combat       Spawns + Loot
      └────────────┼────────────┘
                   │
              State Delta
              ┌────┴────┐
              ▼         ▼
           UI (DOM)   SaveSystem
              │
         Three renderer
```

**Loop real:** `requestAnimationFrame` interno de `renderer.setAnimationLoop`, limite configurado em 30/60 FPS, delta máximo de 80ms, simulação fixa de `1/60`, com até quatro subpassos e descarte do atraso excessivo para evitar a espiral de morte. Quando pausado/morto, a simulação não roda, mas é possível renderizar a cena congelada e navegar nos menus. No título, apenas a apresentação visual segue ativa.

**Não fazer:** utilizar `setInterval` separado para AI, save, cooldown e câmera com relógios distintos. Tudo deve depender do tempo de simulação ou de relógio explícito. O autosave pode ser periódico, mas o relógio da física/combate precisa parar no pause.

## 3. Estados finitos: sem abrir pause duas vezes

| Estado | Atualiza mundo | Renderiza mundo | Aceita ataque | Abre menu |
| --- | --- | --- | --- | --- |
| `title` | Somente portal/apresentação | Sim | Não | Configurações/créditos |
| `playing` | Sim | Sim | Sim | Sim; muda para `paused` |
| `paused` | Não | Sim | Não | Abas do menu e configurações |
| `dead` | Não | Sim | Não | Apenas modal de derrota |
| `loading` (P1) | Não | Tela dedicada | Não | Não |
| `cinematic` (P2) | Só animação da cena | Sim | Não | Skip e eventualmente pause |

**Contrato:** ao entrar num painel, limpar entradas de ataque pendentes; no retorno, não reutilizar o mesmo clique usado para fechar o menu. Renderização do DOM não deve chamar movimento ou progressão. Importar save é uma transação que reinicializa personagem, mundo e recursos uma única vez.

**Regressão comum a evitar:** um documento abrindo pause por evento delegado de click, e depois exigindo fechar o mesmo pause novamente. A solução estrutural é `GameState + OverlayState`, com um roteador que não reenvia eventos de `Escape` e click à camada de jogo.

## 4. Streaming por chunks 24m × 24m

### Implementado agora

- Cada tile de terreno ocupa `24 × 24` unidades de mundo.
- Coordenadas inteiras `(chunkX, chunkZ)` e chave `"x,z"` identificam chunks.
- Região visível `raio=1`, portanto grade de **3 × 3 = 9 chunks** próximos ao personagem.
- Sementes determinísticas por coordenada e bioma geram sempre as mesmas posições de rochas/árvores/pilares.
- Um `Map` guarda grupos atualmente carregados; um segundo `Map` guarda os colisores em coordenadas globais.
- A cada ~230ms, verificar se o jogador mudou de área e remover grupos fora do raio.
- Ao sair do tile, a geometria compartilhada fica na memória, mas instâncias e grupo são liberados ao GC; a geometria e o material exclusivos do anel central são descartados explicitamente.
- As geometrias dos props são compartilhadas globalmente, não duplicadas para cada pedra.

### P1: streaming incremental sem travadas

Para biomas com GLB/texturas reais, carregar em duas etapas e usando orçamento:

```text
1. updateChunkPriority(playerXZ, cameraFrustum)
2. desired = visual radius + buffer
3. se chunk AUSENTE: criar Placeholder barato (chão + collider)
4. marcar CHUNK_QUEUED e enfileirar por distância
5. loader executa no máx. 1 chunk pesado ou 2ms de CPU por frame
6. decodificar e preparar off-thread quando suportado
7. anexar chunk apenas se ainda estiver no raio
8. gerar colliders, caches de spawn, spatial hash
9. visualizar com crossfade discreto/fog
10. descarregar fora do raio + 1 chunk de histerese
```

**Estados de chunk a implementar:** `UNLOADED → QUEUED → LOADING → READY → ACTIVE → COOLING → DISPOSED`. Um token de geração invalida respostas atrasadas (o jogador já mudou de região). Nunca montar GLB de um chunk que foi abandonado após `fetch` e depois deixar como objeto órfão.

**Separação:** `WorldStreamer` (fila/desejados), `ChunkBuilder` (spawn determinístico), `AssetManager` (GLB/WebP/OGG), `CollisionWorld` (formas físicas simples), `NavGrid` (rotas), `ChunkCache` (LRU por peso em MB). O protótipo atual ainda usa `World.js` compacto porque as malhas são primitivas leves e sincronamente geradas.

### Regras de bordas

- Terrain chunks usam coordenadas fixas por world-space, sem variação de altura na versão inicial; não há “costura” de texturas visível por altura.
- Uma versão de heightmap precisa de sementes que forneçam os **mesmos valores nas amostras de borda**. Gerar altura por coordenada global, nunca pelo `Math.random` interno do chunk.
- Decorações não podem nascer dentro de raio 13m do centro de missão nem 5m do portal.
- O sistema de colisão consulta chunks vizinhos, não apenas tile atual; isso evita atravessar uma rocha junto à borda.
- Inimigos persistentes terão `entityId` global e não serão recriados duas vezes ao cruzar bordas.

## 5. LOD: 2 níveis funcionais e expansão para 3

### Atual (funcional por código)

`LOD0`: pedras dodecaédricas, tronco + copa separados, pilares cilíndricos. `LOD1`: pedra box simples, copa em cone de 3 lados, pilar prismático. Ambos usam InstancedMesh. Somente um conjunto está visível por chunk.

| Distância do centro do chunk ao jogador | LOD atual | Observação |
| --- | --- | --- |
| Até 30m | LOD0 | Objetos principais com silhueta mais rica |
| 30–36m | Histerese | Mantém estado anterior para evitar alternância contínua |
| Acima de 36m | LOD1 | Silhuetas leves, menos polígonos por objeto |
| Preset Baixo | Força LOD1 | Aplica mesmo perto, evita custo extra |

A verificação de LOD ocorre no mesmo intervalo da atualização de chunks, ~4 vezes por segundo, e não 60 vezes. Instanced meshes possuem esfera de limite calculada para permitir frustum culling.

### Planejado (quando houver modelos externos)

- `LOD0 0–18m`: modelos completos; alvo de ~1.200–3.000 triângulos para NPC comuns, até 6.000 para boss hero.
- `LOD1 18–36m`: geometria simplificada 40–60% triângulos, mesmo material/atlas quando possível.
- `LOD2 >36m`: 10–20% triângulos ou impostor/billboard em vegetação, só onde a distância justificar.
- `CULL >50m` para pequenas decorações; bosses e marcos narrativos usam distância própria.
- LOD deve preservar mesma altura/pivô e não alterar colisor/animador de gameplay. Troca com histerese de 20%; dither fade apenas preset Alto e se não for caro.
- Nunca aplicar LOD complexo à arma na mão a 5m se a economia de triângulos não compensar as mudanças de material.

**Medir:** tris, vertices, draw calls, tempo de troca, `renderer.info`, GPU timeline. LOD que duplica texturas na VRAM pode ser pior que o original; compartilhar texturas e materiais por família.

## 6. Instancing, materiais e efeitos

**Já usado:** `THREE.InstancedMesh` para rochas, troncos, copas e pilares de cada chunk; geometria compartilhada; `MeshLambertMaterial` para props. Dano usa geometrias pequenas; partículas de impacto retornam a um pool após ~0,5–0,8s.

**P1/P2:**

- Atlas de personagens/armas por classe; máximo 1–3 materiais por inimigo comum.
- Vários inimigos do mesmo tipo com `InstancedMesh` apenas quando animação e hitbox permitem, ou `BatchedMesh` compatível se útil.
- Objetos de interação com modelo instanciado e estado no sistema, em vez de mesh per object.
- Hits: pool fixo de 128 partículas e 32 números de dano; descartar os mais antigos se exceder.
- Evitar `MeshPhysicalMaterial`, transparências empilhadas, SSAO e sombras em cascata em dispositivos modestos.
- `renderer.shadowMap.enabled=false` no preset Baixo; no Médio, shadows para protagonista + boss apenas (planejado).
- Texturas comprimidas KTX2/ETC1S quando decoder estiver incluído; fallback WebP em navegador incompatível.

## 7. Asset manager planejado

```ts
AssetRegistry = {
  'region/naevra/terrain': { url:'assets/regions/naevra/terrain.glb', budgetMB:1.2, priority:2 },
  'mob/errante': { url:'assets/enemies/errante.glb', budgetMB:0.55, priority:1 },
  'boss/arconte': { url:'assets/boss/arconte.glb', budgetMB:2.1, priority:0 },
  'music/boss01': { url:'assets/audio/boss01.ogg', budgetMB:1.8, priority:3 }
};
```

**Pipeline:** fonte `.blend` ou `.fbx` (não publicada no build web) → `glTF/GLB` triangulado → texturas 512/1K WebP → `gltf-transform` para deduplicar, reamostrar animações e quantizar → `assets.json` com tamanho/hashes → `import()` ou URL local no momento adequado. Draco/Meshopt só se medição provar vantagem total com decoder.

**Preload:** apenas protagonista + primeiras criaturas e portal antes de sair do título; carregar boss enquanto o jogador enfrenta a onda. Retornar do portal permite reutilizar `AssetCache` de material/GLB, e os NPCs usam clones controlados. Downloads de outras regiões não entram no primeiro carregamento.

**Importante:** não usar CDN para o runtime do Three.js; o bundler entrega bibliotecas sob a mesma origem do GitHub Pages.

## 8. AI e scheduler

**Atual:** cada inimigo é uma entidade de baixa complexidade, atualizada na simulação fixa; até 12 no mundo aberto, ou 5 na fenda + chefe; perseguição simples e telegraph de golpe. Ecos seguem alvo local. Entidades mortas são reutilizadas por `Spawns` em um pool, evitando criar/remover grupo 3D a cada novo spawn.

**P1 scheduler:**

| Classe | Perto | Médio | Longe |
| --- | --- | --- | --- |
| Chefe | 20Hz decisão + 60Hz movimento | Não aplicável | Suspenso fora da sala |
| Inimigo agressivo | 10Hz decisão + 60Hz movimento | 5Hz | Desativado |
| Eco aliado | 10Hz | 5Hz | 2Hz ou teleport corretivo |
| NPC neutro | 5Hz | 1Hz | Estado congelado |
| Pathfinding A* | 2 pedidos/frame no desktop | 1 pedido/frame mobile | Nunca todo frame |

Uma fila central `AIScheduler` agenda tarefas com `nextUpdateAt`; nada de instanciar `setInterval` individual por inimigo. `SpatialHash` com célula de 6m fornece alvos próximos em tempo aproximado O(k) e evita ordenar todos os inimigos por frame. No protótipo a lista é pequena, então o sistema mais simples é adequado e reduz complexidade antes do volume crescer.

**Corpos mortos:** instantaneamente interrompem colisão/IA/ataques; efeito visual de dissolução no máximo 2–4s e reciclagem do mesh; loot creditado no evento de morte, não no fim do efeito.

## 9. Físicas e hitboxes

- Preferir colisões próprias 2D XZ para RPG de arena; sem bibliotecas de física pesada no primeiro release.
- Broadphase: chunk + spatial hash + distância ao quadrado; depois hitbox simplificada (esfera/cápsula).
- `AttackInstance`: id único, origem, arco, raio, `hitTargets`, `expireAt`, dano base e tag de status.
- O sistema de dano nunca lê diretamente o DOM nem o FPS renderizado.
- Dano precisa ser aplicado **uma vez por AttackInstance/target** e `deathEventId` usado como trava de loot.
- Boss: hitboxes separadas em braço/torso/núcleo, mas com limite de 3–5 testes por boss e sem raycast de todos os triângulos.

## 10. Renderizações de menus e dados

**Atual:** UI DOM em camada acima do canvas. HUD atualiza ~8 vezes/s; minimapa em `<canvas 2D>` atualiza ~3,5 vezes/s; menus completos são reconstruídos apenas quando abertos ou depois de ações de item/pontos. Não gerar 100 elementos DOM novos a cada frame.

**Atual:** inventário, progressão, mapa, pause e configurações já possuem módulos de renderização separados em `src/ui/views/`. **P1:** avançar para `TitleView`, `HUDView`, `SkillTreeView` e `QuestView` independentes e fazer cada view receber snapshot de estado + `dispatch(command)`, sem depender da instância inteira de `Game`.

**Menu mais complexo sem gargalo:** virtualização de grade quando houver 120+ itens, `requestIdleCallback` para ordenar sem travar, e cache de descrição/ícones. DOM tem boa legibilidade e suporte a leitor de tela; renderizar tudo dentro da cena WebGL não é obrigatório nem recomendável para o inventário.

## 11. Salvamento

- Atual: `localStorage` com chave de versão, save imutável serializado em JSON, validação de item/atributo, auto-save a cada 45s e em marcos.
- v0.3: `SaveRepository` com dual slot (`current`, `previous`), migração versionada, evento `beforeSave/afterSave`, persistência incremental de mapas e fallback em erro.
- Export/import local JSON como backup manual, com limite de tamanho e saneamento; não presumir segurança criptográfica.
- Em `pagehide`, realizar save de saída síncrono quando possível e nunca prometer que o navegador sempre garantirá o flush em encerramento abrupto.
- Tratar `QuotaExceededError`, storage bloqueado e `JSON.parse` inválido com aviso e modo de recuperação sem crash.

## 12. Qualidade automática

**Preset atual:**

| Preset | Limite de densidade de pixels (DPR) | LOD | FPS selecionável |
| --- | --- | --- | --- |
| Baixo | Máx. 0,85 | LOD1 sempre | 30/60 |
| Médio | Máx. 1,15 | LOD0/LOD1 | 30/60 |
| Alto | Máx. 1,6 | LOD0/LOD1 | 30/60 |
| Auto | Máx. 1,0 mobile / 1,3 desktop | Dinâmico | 30/60 |

Um governador observa FPS médio em blocos de 5s e reduz DPR em 0,11 quando fica abaixo de 45 FPS; aumenta 0,045 quando supera 58 FPS, até o teto do aparelho. O governador não adapta resolução durante um modo explicitamente limitado a 30 FPS.

**Cuidados:** não ligar `antialias:true` em todos os celulares. Prefira resolução ajustada; limitar iluminação real a hemisférica + direcional + um portal emissivo com ponto de luz curto. Reduzir CSS `backdrop-filter` no mobile se a UI ficar cara, embora o render 3D deva ficar separado dos menus.

## 13. Código de referência: atualizações sem travamento

```js
// Exemplo de contrato futuro: não substituir o World.js existente sem teste.
const stream = new WorldStreamer({ chunkSize:24, visibleRadius:2, maxLoadsPerFrame:1 });

function updateFrame(dt) {
  input.dispatchCommands();
  if (state !== 'playing') return;
  for (const fixedStep of physicsClock.consume(dt,4)) {
    worldStreamer.updateDesiredChunks(player.position);
    playerSystem.fixedUpdate(fixedStep);
    combatSystem.fixedUpdate(fixedStep);
    aiScheduler.fixedUpdate(fixedStep);
    damageSystem.fixedUpdate(fixedStep);
    effectPool.fixedUpdate(fixedStep);
  }
  animationSystem.interpolate();
  worldStreamer.commitReadyAssets({ maxMs:2 });
  hud.updateDirtyOnly();
  renderer.render(scene,camera);
}
```

## 14. Instrumentação e teste de performance

Registrar em QA (não necessariamente em produção): `renderer.info.render.calls`, `triangles`, `geometries`, `textures`, frame médio, 1% low, quantidade de chunks ativos, meshes instanciados, número de inimigos vivos, status de filas de assets e tamanho aproximado da memória de cache.

**Cenários de estresse:**

1. Ficar 15min na planície sem sair da célula: não cresce o número de mesh/partículas.
2. Caminhar 2.000m cruzando dezenas de chunks: contagem ativa permanece 9 após estabilizar.
3. Entrar/sair de 20 fendas: não duplicar luzes, materials ou enemies.
4. Golpear 15 alvos consecutivamente: sem mais de 1 dano por ataque e sem stutters de números DOM.
5. Abrir inventário 100 vezes durante horda: nenhum inimigo ataca com jogo em pause.
6. Forçar Chrome a `document.hidden`, retornar após 10min: delta de movimento não explode.
7. Aplicar preset Baixo, alternar Médio e voltar: DPR e LOD mudam sem precisar reiniciar.
8. Em Android, desligar e religar tela, minimizar e restaurar: estado volta pausado e save íntegro.
9. Carregar save v0.1 e v0.2 por migração: nenhum item perdido.
10. Publicar em repo com nome contendo hífen: URLs `assets` relativas resolvem sem 404.

## 15. Problemas técnicos e prioridades

| Prioridade | Risco | Medida |
| --- | --- | --- |
| P0 | Build do navegador não foi executado neste ambiente (pacotes npm indisponíveis localmente) | Confirmar GitHub Actions `npm install/npm build` e abrir Pages em desktop real |
| P0 | Mecânicas com geometria básica ainda exigem playtest de câmera, hitbox e UI | Reproduzir checklist no Chrome/Edge/Android e corrigir interações |
| P0 | IA pode atravessar zonas abertas sem navmesh completo | Colisores por raio e distância de perseguição em v0.2 |
| P1 | Troca de bioma recria decoração síncrona | Loader em estágios e placeholder de terreno |
| P1 | `UI.js` e `Game.js` ainda contêm coordenação central | Continuar separação em views e serviços; as primeiras views já estão modularizadas |
| P1 | Falta Gamepad API e PWA | Implementar e testar separadamente, sem misturar com AI |
| P1 | Áudio não existe | Adicionar pacotes OGG originais, mixer e pré-carregamento |
| P2 | Boss é de uma fase só | Implementar state machine com golpes telegráficos e arena |
| P2 | Entidades não têm rig GLB | Integração futura por asset manager, crossfade e retargeting |

---

**Critério para integrar qualquer técnica de otimização:** primeiro medir o gargalo, depois aplicar alteração isolada, reproduzir mesma cena/seed, comparar FPS e consumo, revisar efeito visual e registrar resultado. Otimização não pode destruir a leitura de combate nem quebrar saves existentes.
