# PLANO DE PLAYTEST — NEXO v0.1.0

Este checklist NÃO significa que o jogo foi testado visualmente. Preencher somente após reproduzir cada caso em navegador real.

## Preparação

- [ ] `npm install`, `npm test`, `npm run build` sem erros.
- [ ] Carregar `dist/` via servidor HTTP, não `file://`.
- [ ] Abrir DevTools > Console e Network; confirmar sem import 404, textura inexistente ou WebGL error.
- [ ] Publicar em Pages na subpasta `/nome-repositorio/` e confirmar links relativos.

## Menu e save

- [ ] Primeiro acesso: botão Continuar desabilitado.
- [ ] Novo jogo carrega personagem e HUD sem erro.
- [ ] Esc abre pause, congela inimigos e countdowns, Esc retoma.
- [ ] Menu de atributos → inventário → missões, sem retomar combate no meio.
- [ ] Fechar documentos e telas de inventário não abre um segundo pause.
- [ ] Salvar manualmente, recarregar página e Continuar preserva itens/nível/moeda.
- [ ] Exportar backup JSON, iniciar novo jogo e importar save antigo com confirmação.
- [ ] Importar JSON malformado exibe erro e não destrói save anterior.
- [ ] Perder foco na aba pausa; retorno não faz movimento acelerado.

## Gameplay e progressão

- [ ] WASD e setas funcionam; diagonal não acelera.
- [ ] Desviar de rochas/pilares sem atravessar obstáculo.
- [ ] Clique desfere combo; crítico exibe número dourado.
- [ ] Shift consome vigor e para de correr quando vazio; vigor regenera.
- [ ] Skill 1 usa mana; 2 só no lvl 3; 3 no lvl 2; 4 no lvl 5.
- [ ] Oponente fica atordoado e telegraph de ataque aparece no chão.
- [ ] Eliminar 5 mobs libera recompensa da primeira missão.
- [ ] Resgatar missão uma única vez; EXP e ouro creditados.
- [ ] Distribuir pontos altera stats e desabilita botão sem pontos.
- [ ] Equipar/desequipar funciona; itens permanecem na mochila.
- [ ] Aperfeiçoar desconta custo exato; não aprimora sem saldo.
- [ ] Item equipado não pode ser desmontado; item não equipado pode.
- [ ] Entrar no portal E; matar 8; Arconte surge; boss derrotado.
- [ ] Primeira vitória libera R; Eco segue e ataca automaticamente.
- [ ] Sair pelo portal sem matar boss não concede recompensa de conclusão.
- [ ] Morreu: tela de derrota, renascer com menos 10% ouro; sem modal preso.

## Chunks e LOD

- [ ] Caminhar 4 chunks à frente e voltar: não há buraco no chão nem objeto invisível.
- [ ] Conferir fronteira de tiles e colisores próximos da borda.
- [ ] Objetos reaparecem nas mesmas posições ao retornar à mesma região.
- [ ] Mudar preset Baixo causa silhuetas LOD1; Médio reativa LOD0 perto.
- [ ] Modo alto com 9 chunks, 12 inimigos e 4 Ecos: medir `renderer.info.render.calls` via instrumentação.
- [ ] Ficar 15min andando e comparar memória e quantidade de geometrias.
- [ ] Entrar e sair de 20 fendas não causa queda progressiva de FPS.

## Celular

- [ ] Interface não sobrepõe a barra de habilidades nas resoluções 320px, 375px, 390px.
- [ ] Joystick responde sem rolar a página.
- [ ] Botões de 1, 2, 3, 4 e ATK funcionam sem ataques duplicados.
- [ ] `E` interage com o portal; `ECO` invoca quando liberado; pause funciona.
- [ ] Atributos/inventário cabem no painel e rolam verticalmente.
- [ ] Abaixar qualidade e limitar FPS a 30 melhora consumo.
- [ ] Rotacionar tela mantém aspecto correto e não perde save.

## Registro de evidências (preencher após testar)

| Caso | Navegador / aparelho | Resultado | Evidência / bug |
| --- | --- | --- | --- |
| Build | A confirmar | Não executado aqui | — |
| Tela inicial | A confirmar | Não testado | — |
| Gameplay 10min | A confirmar | Não testado | — |
| Fenda + boss | A confirmar | Não testado | — |
| Save/import | A confirmar | Não testado visualmente | 7 testes unitários executados |
| Desktop 60FPS | A confirmar | Não medido | — |
| Android 30FPS | A confirmar | Não medido | — |
| Pages deploy | A confirmar | Não publicado | — |
