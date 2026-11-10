# ESTADO ATUAL E AUDITORIA — v0.1.0

**Data:** 10/11/2026 · **Status:** fonte e GDD entregues; regras de progressão/saves testadas com Node; renderização/browser e build final **não validados neste ambiente**.

## Entregue no código

**Base técnica:** módulos ES independentes, telas do inventário/atributos/mapa/configurações em `src/ui/views/`, Vite com `base: './'`, build de Pages por Actions, configuração gráfica 30/60 FPS, qualidade baixa/média/alta/auto, limite DPR e governador de resolução, máquina de estados para título/pause/jogo/derrota.

**Cena:** campo 3D low-poly, portal interativo, dois biomas visuais, chunks gerados com seed e grade 3×3 (24m cada), 2 LODs por chunk, props em `InstancedMesh`, neblina, 3 fontes de iluminação simples, câmera suave, colisão radial para obstáculos.

**Jogo:** personagem procedural, movimento, corrida com vigor, mira por mouse, combo de 3, 4 skills, ataque de inimigos com aviso, 3 monstros + boss, XP, 60 níveis/ranks, 5 atributos, 6 missões com resgate, 3 slots, raridade, 6 famílias de item, forja +10, desmontagem, ouro e essência. Arena de fenda com 8 abates e boss; Ecos invocados após vencê-lo.

**Interface:** título/continuar/novo/créditos; pause; inventário com filtro e detalhe; atributos; técnicas; missões; mapa; configurações; minimapa; barras de HP/MP/vigor/XP; moedas; alertas; zoom de mouse; joystick e botões touch.

**Persistência:** save local, auto-save 45s se ligado, manual, export/import JSON, validação de atributos e inventário. Dados de cena/objetos 3D não são serializados.

## Testes realmente executados

- `node --check` em **todos** os arquivos JavaScript do projeto: sem falhas de sintaxe.
- `npm test`: **7 testes passaram, 0 falhas** — curva de EXP e níveis, atributos/stats, raridade/forja/desmontagem, ranks/missões, persistência, higienização de save e renderização isolada dos nove painéis.

## Não executado/sem confirmação

- `npm install` / `npm run build`: a execução local não pôde baixar dependências de rede para construir o bundle Three.js; workflow está configurado para realizar isso no GitHub.
- **Navegador real:** sem playtest gráfico WebGL, detecção de hitbox/câmera, screenshot ou medição real de FPS. Não declarar que o jogo já roda sem problemas em desktop/Android até essa validação.
- **GitHub Pages:** deploy não foi executado porque não há repositório de destino designado nesta conversa.

## Riscos/pendências priorizadas

| Prioridade | Pendência | Solução técnica proposta | Impacto |
| --- | --- | --- | --- |
| P0 | Confirmar build e deploy em GitHub Actions | Verificar log de `npm install`, `npm test`, `npm run build` e Pages | Bloqueia link jogável |
| P0 | Playtest real da câmera, mira, combos, pause e fenda | Checklist manual e logs de console | Bloqueia certificação de gameplay |
| P0 | Verificar menu touch 320–420px e FPS celular | Testes em Chrome Android e Safari iOS | Bloqueia suporte mobile confiável |
| P1 | Cinemática de introdução e boss em 3 fases | Sistema de eventos de cena e state machine | Conteúdo e imersão |
| P1 | Animações GLB para personagem e inimigos | AssetManager glTF + AnimationMixer | Fidelidade visual |
| P1 | Áudio autoral, mixer e efeitos | Assets OGG/MP3 + AudioManager | Feedback sensorial |
| P1 | Seguir decompondo `Game.js` e roteamento de `UI.js` | Views separadas já presentes; evoluir para facade + event bus + serviços | Manutenção e escalabilidade |
| P1 | Checkpoint de fenda persistente | Dados da sala/onda, versão de save | Evita repetir onda após refresh |
| P1 | Spawner avançado e spatial hash | UpdateScheduler, pooling e broadphase | Aumenta quantidade de inimigos |
| P2 | PWA, preload de regiões, service worker | Cache com versão, fallback offline | Instalação/offline |
| P2 | Gamepad e remapeamento | Gamepad API e comandos normalizados | Acessibilidade |
| P2 | Campanha completa/chefes/áudio | Implementar conforme GDD, atos e QA | Escopo final |

**Próximo marco recomendado:** publicar v0.1 em GitHub Pages via Actions, capturar erros reais do console, corrigir P0, e então fazer v0.2 de gráficos/IA/boss/áudio sem aumentar escopo da campanha antes da base estar estável.
