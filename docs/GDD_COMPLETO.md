# NEXO: ASCENSÃO — GDD COMPLETO

**Documento:** GDD v1.0 · **Plataforma prioritária:** navegadores desktop e Android/iOS modernos, hospedagem estática no GitHub Pages · **Motor:** Three.js + JavaScript ES modules + Vite · **Idioma principal:** português do Brasil.

> **Originalidade:** um jogo original de fantasia sombria, progressão individual e aliados invocados. A inspiração é a sensação de evolução de um caçador fraco até um comandante sobrenatural, comum ao gênero de *progression fantasy*. Não utilizar personagens, mundo, nomes próprios, efeitos sonoros, emblemas, ilustrações ou trilha sonora de *Solo Leveling*.
>
> **Escopo:** este GDD especifica o **jogo final planejado**. A pasta do projeto contém um **vertical slice jogável v0.1.0**, cujas funcionalidades efetivamente implementadas estão enumeradas no fim deste documento e no `ESTADO_ATUAL.md`. Não confundir proposta de produção com funcionalidade entregue.

---

## 1. Visão geral

| Campo | Decisão |
| --- | --- |
| Nome | **NEXO: ASCENSÃO** |
| Gênero | ARPG 3D single-player, combate em tempo real, fantasia sombria, masmorras e progressão persistente |
| Perspectiva | Terceira pessoa com câmera elevada, foco em leitura de ataques e inimigos |
| Identidade | Portal dimensional, interface do Sistema, criaturas cristalinas, pactos com Ecos, ruínas vivas |
| Loop fundamental | Explorar → lutar → receber EXP/saques → distribuir pontos → equipar/aprimorar → desafiar fenda → vencer guardião → liberar novos poderes/área |
| Sessões | 5–20 minutos; fendas de 8–15 minutos; chefes de 3–6 minutos |
| Público | Fãs de crescimento de personagem, loot, chefes e combate acessível, com profundidade opcional |
| Progressão | 60 níveis de personagem, ranks E a S, equipamentos, técnicas, Ecos, talentos, reputação e fendas crescentes |
| Monetização | Nenhuma; jogo completo local, sem login nem rede obrigatória |
| Estrutura de release | v0.1 demonstração jogável → v0.3 vertical slice completo → v0.6 campanha base → v1.0 campanha e pós-jogo |
| Visual | Low-poly sofisticado com iluminação dramática e efeitos simples, legíveis mesmo sem bloom |
| Alvo técnico | 60 FPS desktop mediano; 30 FPS no Android intermediário; abertura do jogo com downloads compactos |

### Pilares inegociáveis

1. **Toda batalha rende progresso perceptível:** EXP, material, missão, domínio de técnica ou chance de loot.
2. **O protagonista fica visivelmente mais forte:** novos golpes, Ecos, estilos, efeitos e inimigos progressivamente mais formidáveis.
3. **Bosses são justos:** animação de aviso, hitboxes confiáveis, janelas de resposta, punição por erro e recompensa valiosa.
4. **O Sistema nunca atrapalha o jogador:** menus responsivos, pause real, filtros, comparações, textos legíveis e autosave seguro.
5. **O jogo cabe em hospedagem estática:** nenhum backend obrigatório, sem bibliotecas pesadas, sem reiniciar toda a cena ao trocar de área.
6. **O código não é monolítico:** separação de estados, dados, entidade, combate, progressão, renderização, UI, mundo, inventário, saves e testes.

## 2. Universo, trama e capítulos

O mundo de **Asterion** sofreu o surgimento de fraturas chamadas **Nexos**. Quem atravessa uma fratura pode voltar alterado, enlouquecer ou desaparecer. A população conhecia seis ordens de vigias, mas elas estão ruindo porque as fraturas mudam mais depressa do que as ordens conseguem contê-las. O protagonista é um **Andarilho**, um sobrevivente sem linhagem de poder que recebe um contrato com a **Voz do Nexo**: evoluir em troca de estabilizar anomalias e resgatar as memórias daqueles que sucumbiram.

**Conflito original:** os Ecos invocados não são simples servos. Cada Eco transporta fragmentos de uma vida extinta. O jogador pode usá-los como armas, restaurar memórias ou libertá-los. O crescimento de poder tem implicações para a história e para o final.

### Campanha: 5 atos + epílogo

| Ato | Região principal | Foco dramático | Chefe de ato | Sistema liberado |
| --- | --- | --- | --- | --- |
| Prólogo — A Marca | Planície das Cinzas | O despertar, primeiro portal, encontro com a Voz | Arconte da Ruptura | Vínculo dos Ecos, primeira classe |
| I — Ferro e Vidro | Bastilha de Iridium | Ruínas urbanas e antigos vigias | Guardião Prismático | Forja, runas, árvore de talentos |
| II — Floresta sem Sol | Bosque de Naevra | Ecos perdidos, exploração e purificação | Matriarca das Raízes | Sinergia dos Ecos, rastreamento |
| III — Mar de Ossos | Costa Espectral | Escolhas sobre uso de memórias | Leviatã do Sal | Comando tático, montarias de curta distância |
| IV — Coração do Abismo | Trono Invertido | Descoberta do custo real do contrato | Rei do Intervalo | Forma de Ascensão, fusão temporária de Ecos |
| V — O Outro Eu | Núcleo do Nexo | Confronto final entre poder e identidade | Reflexo Primordial | Final, NG+ e desafio S |

**Conteúdo alvo da v1.0:** 6 regiões reconhecíveis, 30 fendas autorais (5 por região), 12 variantes de chefes incluindo atos e opcionais, 28 famílias de inimigos, 4 especializações jogáveis, 50 técnicas/passivas, 36 modelos base de equipamento, 18 arquétipos de Ecos e 2 finais + epílogo opcional. Esses números são **metas de produção**, não conteúdo já pronto.

### Missões e cenas narrativas

- Missões principais ativam diálogos curtos e cenas de 15–45s; não bloqueiam a interface de carregamento.
- NPCs têm árvore de conversa, estado de missão, memória dos objetivos já completados e ícone visual contextual.
- Escolhas alteram reputação e missões secundárias, não os pontos básicos de progressão.
- A opção **Pular cena** só aparece em cutscenes, com confirmação quando a escolha de diálogo ainda não foi registrada.
- Finais consideram memória restaurada, alianças de Ecos, conclusão de missões e decisão central do Ato V.

## 3. Loop completo de jogo

```text
MENU PRINCIPAL
    ↓
REFÚGIO / PLANÍCIE
    ├─ conversar / aceitar contratos
    ├─ equipar / forjar / ajustar build
    ├─ explorar mapa e eventos dinâmicos
    └─ entrar em PORTAL
         ↓
      SALAS / ENCONTROS
         ├─ eliminar inimigos / escapar / salvar NPC / resolver mecanismo
         ├─ obter EXP, loot, materiais, registros
         ├─ usar técnicas + posicionamento + Ecos
         └─ desafiar CHEFE
               ↓
       TELA DE RESULTADOS
         ├─ EXP, rank, tempo, feitos e bônus
         ├─ item garantido do chefe e bônus de objetivo
         └─ voltar ao refúgio ou avançar na narrativa
               ↓
        DISTRIBUIÇÃO DE PONTOS / FORJA / TALENTOS
               ↓
        NOVA FENDA / NOVO ATO / DESAFIO DE RANK
```

**Loop de 30 segundos:** avistar inimigo → ler ataque → usar combo e esquiva → recuperar recursos → saque.

**Loop de 10 minutos:** escolher fenda → concluir 2–4 encontros → miniboss → chefe → recompensas.

**Loop de 2 horas:** atingir marco de nível/rank → nova técnica ou classe → conquistar conjunto mais forte → abrir região.

**Longo prazo:** coleção de Ecos, domínio de arma, builds temáticas, fendas de rank A/S e NG+.

## 4. Controle e movimentação

### Desktop implementado no protótipo

| Comando | Ação | Regra |
| --- | --- | --- |
| WASD / setas | Deslocamento em plano XZ | Velocidade normalizada (diagonais sem vantagem) |
| Mouse na cena | Mirar / orientar o personagem | Interseção do raio com o plano do chão |
| Clique esquerdo | Combo de ataque básico | Três estágios, janela de 0,9s |
| 1–4 | Técnicas | Respeitam mana, desbloqueio e cooldown |
| Shift | Correr | Consome vigor, regenera ao parar |
| R | Invocar Eco | Requer primeira fenda vencida, mana e capacidade |
| E | Interagir no portal | Proximidade: 5m |
| I | Inventário | Pausa combate e abre mochila |
| C | Atributos | Pausa e abre personagem |
| K | Técnicas | Pausa e abre habilidades |
| J | Missões | Pausa e abre diário |
| M | Mapa/Fendas | Pausa e abre mapa |
| Esc ou P | Pause/retomar | Usa máquina de estados, não sobrepõe dois menus |
| Roda do mouse | Zoom | Limites para não perder leitura de combate |

**Dispositivo de toque na v0.1:** joystick virtual, ataque, 1–4, invocação, interação e pause. **Planejado:** câmera gestual com área dedicada, remapeamento de botões, vibração de toque opcional, gamepad via Gamepad API (Xbox/PlayStation) com navegação total dos menus. A versão atual ainda não implementa suporte completo a gamepad.

### Máquina de estados de locomoção planejada

`Idle → Walk → Sprint → Windup/Attack → Recovery`, com eventos que podem interromper: `Dodge`, `HitReaction`, `Stagger`, `Death`, `Interact`. A esquiva v0.3 receberá 0,25s de invulnerabilidade; a técnica Passo Sombrio do protótipo já oferece curto deslocamento evasivo. Não permitir spam que ignore animação de recuperação. Transições devem usar tempo local e não `setTimeout` isolado.

### Câmera

- Desktop: câmera oblíqua em terceira pessoa, suavização independente da taxa de quadros e mira no mundo.
- Projeto v0.3: modo perseguição atrás dos ombros, orbit control sob botão, colisão com parede por raycast simplificado e zoom entre 5 e 15m.
- Boss: aumentar FOV 4–7 graus por até 0,35s em habilidades especiais; nunca mover a câmera para dentro do chefe.
- Acessibilidade: trepidação desativável, ajuste de sensibilidade e inversão Y.

## 5. Combate e ritmo

**Tipos de dano finais:** físico, ruptura, arcano, espectral e verdadeiro (exclusivo de efeitos especiais). Não existem danos de aliados entre si na dificuldade normal.

**Combo básico:** primeiro golpe 100%, segundo 120%, terceiro 155%, dano em arco; consome 5 de vigor por ataque. Acertos podem interromper inimigos menores, mas bosses apenas em janelas de postura.

**Recursos:** PV (vida), PM (mana), vigor (correr/ações físicas), carga do vínculo (futuro) e medidor de Ascensão (futuro). Os três primeiros estão implementados.

**Defesa e dano:** na versão atual, dano básico deriva de Força, Agilidade e arma; defesa reduz dano de inimigos linearmente em 28% do valor da defesa, com mínimo de 1. Na v0.3, migrar para curva de mitigação com retornos decrescentes e cobertura de resistências.

**Crítico:** a chance de crítico deriva da Percepção (máximo 40% na base), e o protótipo aplica multiplicador 1,7×. Proposta de v1.0: tipo de arma, runas e fraquezas regionais podem alterar o valor, sem ultrapassar limite global balanceado.

### Técnicas ativas já implementadas

| Técnica | Tecla | Desbloqueio | Custo PM | Recarga | Papel |
| --- | --- | ---: | ---: | ---: | --- |
| Corte espectral | 1 | Nível 1 | 12 | 3,2s | Arco de 4,6m, dano 1,85× e breve stagger |
| Ruptura | 2 | Nível 3 | 25 | 10s | Explosão de 6,5m, dano 2,4×, stun 1,1s |
| Passo sombrio | 3 | Nível 2 | 15 | 6,5s | Avanço de até 5,5m, invulnerabilidade curta, dano 1,4× |
| Dreno vital | 4 | Nível 5 | 30 | 13s | Golpe 1,1× e recuperação de PV por inimigo atingido |
| Vínculo dos Ecos | R | Primeiro Arconte | 35 | Recurso/capacidade | Evoca combatente aliado autônomo |

### Catálogo de técnicas projetado para v1.0

- **Espadachim do Limiar:** Corte tríplice, Reversão, Quebra-postura, Lâmina lunar, Círculo de aço, Fio de relâmpago, Contra-golpe perfeito.
- **Arcanista Rúnico:** Lança prismática, Estouro da Marca, Corrente elétrica, Onda de silêncio, Campo retardador, Fragmentação, Selo de pressão.
- **Tecelão dos Ecos:** Ordem de ataque, Formação de guarda, Elo vital, Marca do comandante, Explosão de vínculo, Recrutamento, Ressonância.
- **Guardião do Vazio:** Bloqueio reforçado, Investida, Provocação, Pulso protetor, Muralha, Sacrifício, Vontade indomável.

Todo ataque terá dados separados para `startup`, `activeFrames`, `recovery`, `stamina`, `mana`, `area`, `armorBreak`, `cancelWindow`, `fxId`, `sfxId`, `cameraProfile` e `hitStopMs`. **Nenhum ataque tem permissão de infligir dano a cada frame:** criar um `hitSet` por instância de golpe ou `attackId`.

### Condições de status planejadas

- Queimadura: 2% PV máximo por 3s (limite por porte do inimigo), duração renovável, não empilha infinitamente.
- Sangramento: danos leves a cada 0,75s por 5s; até 3 stacks.
- Quebra-postura: preenche medidor e abre 1,8s de vulnerabilidade.
- Lentidão: 25–40% de perda de velocidade por 2s, com redução em chefes.
- Silêncio: bloqueio curto de cast para magos inimigos, não para ataques físicos.
- Corrupção: debuff de defesa e dano recebido, curável em fogueira de fenda.

## 6. Níveis, ranks e atributos

### Progressão básica — implementada

- Nível inicial: 1. Teto do protótipo e objetivo inicial: **60**.
- EXP para sair do nível `L`: **`arredondar(75 × L^1,56)`**.
- Ao subir: **+5 pontos de atributos** e recuperação de vida/mana/vigor.
- Atributos: **Força, Agilidade, Vitalidade, Inteligência, Percepção**; base 5 e teto 99 cada.

| Rank | Níveis | Identidade |
| --- | --- | --- |
| E | 1–6 | Sobrevivente; técnicas básicas |
| D | 7–15 | Caçador capaz; primeira especialização |
| C | 16–26 | Soldado rúnico; mais Ecos e técnicas |
| B | 27–38 | Especialista de incursões; conteúdo de alto risco |
| A | 39–50 | Comandante; fendas complexas |
| S | 51–60 | Ascendente; desafios finais e NG+ |

**Atributos derivados do protótipo:**

```text
PV máximo     = 85 + Vitalidade_efetiva × 11 + (nível − 1) × 7 + defesa_base_da_armadura
PM máximo     = 42 + Inteligência_efetiva × 8 + poder_do_anel
Vigor máximo  = 75 + Agilidade_efetiva × 3
Dano          = 10 + Força_efetiva × 2,4 + dano_da_arma + Agilidade_efetiva × 0,5
Defesa        = arredondar(defesa_base_da_armadura × 0,35 + Vitalidade_efetiva × 0,7)
Crítico       = min(40%, 3% + Percepção_efetiva × 0,9%)
Velocidade    = 4,5 + Agilidade_efetiva × 0,045
Capacidade de Ecos = min(8, 1 + piso((nível − 1)/6))
```

Atributos **efetivos** somam pontos distribuídos aos bônus de itens equipados. A UI deve exibir ambos para evitar que o jogador interprete bônus temporários como pontos gastos.

### Evolução avançada planejada

**Domínio de arma:** proficiência por golpes significativos; 5 estágios por família, bônus moderados e modificações visuais (não apenas +dano). **Árvore de talentos:** 3 ramos por especialização, 24 nós por classe, com no máximo 12 ativos; respeitar builds híbridas. **Prestígio:** após campanha, estrelas de ascensão aumentam opções estratégicas, sem tornar inacessível o PvE básico.

## 7. Itens, inventário e equipamento — especificação de sistema

### Categorias e slots

- **Slots equipáveis ativos do protótipo:** arma, armadura e anel.
- **Versão final:** arma principal, secundária/relicário, cabeça, peito, luvas, botas, amuleto, 2 anéis, 2 selos rúnicos e item de uso rápido.
- **Tipos de loot final:** equipamentos, consumíveis, minérios, fragmentos, runas, códices, contratos, itens de missão e cosméticos.
- **Espaço inicial:** 60 itens com pilha apenas para materiais/consumíveis; equipamento ocupa um slot por instância. Projeto v1.0: expansão opcional até 120, sem microtransações.

### Raridades do protótipo

| Raridade | Cor | Multiplicador de poder | Probabilidade base de um drop de equipamento |
| --- | --- | ---: | ---: |
| Comum | Cinza | 1,00× | 41% |
| Incomum | Verde | 1,20× | 33% |
| Raro | Azul | 1,52× | 18% |
| Épico | Violeta | 1,95× | 6,5% |
| Lendário | Dourado | 2,55× | 1,5% |

O drop de equipamento é separado do drop de ouro e essência: inimigos normais têm ~25% de chance de entregar item; Arconte entrega um item garantido **de qualidade mínima épica**. A tabela acima é condicional **ao ocorrer drop**, não probabilidade absoluta por inimigo.

### Regras de inventário implementadas

1. Coleta automática após derrotar inimigos; nenhum objeto físico de loot adicional é exigido no vertical slice.
2. Cada item tem `uid`, `id`, `rarity`, `level` e `plus`. `id` aponta a um catálogo imutável.
3. Escolher categoria (`Tudo/Armas/Armaduras/Anéis`) e inspecionar item mostra nome, nível, raridade, poder, bônus e descrição.
4. **Equipar** substitui o item daquele slot; o item anterior permanece na mochila.
5. **Desequipar** preserva o item e recalcula PV/PM sem aumentar indevidamente os recursos correntes.
6. **Aprimorar** consome ouro e essência. Sucesso garantido até +10, sem perda ou quebra do item.
7. **Desmontar** converte item não equipado em essência; não existe recuperação automática após a ação.
8. Se a mochila estiver cheia durante o drop, o protótipo converte a oportunidade em 15 de ouro e informa ao usuário.

**Custo de aprimoramento implementado:** `ouro = arredondar(45 × (plus+1)^1,75)` e `essência = arredondar(7 × (plus+1)^1,35)`; limite `+10`. A curva de poder soma `2 × (nível do item − 1) + 4 × plus` à base, antes de multiplicar pela raridade.

### Melhorias previstas na UI e no algoritmo

- Ordenar por raridade, poder, nível, data, tipo e novos itens; filtros persistidos por sessão.
- Comparação lado a lado `Equipado x Selecionado` com ganhos e perdas de cada atributo.
- Indicador de conjunto `2/4` e `4/4` com bonus de build; bloqueio/favorito impede desmontagem.
- Seleção de vários itens para desmontagem com tela de revisão e preço total.
- **Aba Material** com pilhas (`quantity`) e **Aba Quest** com proteção de descarte.
- Separar `InventoryRepository` (dados), `EquipmentService` (regras), `LootTableService` (sorteio), `CraftingService` (forja) e `InventoryView` (DOM).
- **Operações atômicas:** verificar custo/capacidade antes de mutar inventário; aplicar mudança uma vez, persistir versão do save e disparar um evento de UI. Não alterar stats a cada render.
- `uid` obrigatório e validado; impedir item duplicado por evento repetido (`pickupEventId`).

## 8. Economia e forja

**Moedas:** ouro (comércio e upgrades), essência (Ecos e aprimoramentos), fragmento ancestral (chefes/ranks superiores, planejado) e selo de história (progresso narrativo, não gastável). Ouro e essência já são funcionais.

**Geração de recursos:** inimigo concede XP e ouro por definição da espécie + ajuste por nível; essência cresce ligeiramente por nível. Atividades de exploração, desafios secundários e missão têm recompensa fixa para evitar grind obrigatório.

**Controle de inflação:** custos de melhoria crescentes, limites de stack e teto de bônus por set, mas não preço de reparar armadura (evitar frustração). O jogo é offline; balanceamento não depende de microeconomia online.

**Forja completa futura:** refino (`+1...+10`), infusão de atributo secundário com material específico, criar runa, extrair runa preservando item e transmutar 3 duplicatas em chance de item superior. Toda operação tem pré-visualização de custos e botão de confirmar.

## 9. Legião de Ecos — sistema exclusivo

O jogador captura **Ecos de criaturas derrotadas** usando um vínculo espiritual, não uma cópia de animações ou figuras de qualquer franquia. O primeiro Arconte libera o sistema; no protótipo o jogador invoca um modelo genérico aliado por 35 PM.

### Versão jogável v0.1

- Conquista: primeira vitória contra o Arconte.
- Tecla R para invocar; limite de ativos aumenta por marcos de nível (máximo 8).
- Cada Eco adquire alvo hostil mais próximo e persegue até a distância de ataque.
- Executa golpe periódico equivalente a parte do dano do jogador; pode receber dano.
- Ecos são removidos ao retornar ao território aberto ou quando a sessão é reiniciada. O desbloqueio persiste.

### Versão final projetada

**Comando tático (sem microgerenciamento obrigatório):**

| Ordem | Significado | Comportamento da IA |
| --- | --- | --- |
| Seguir | Seguir o jogador a 1,5–4m | Evita aglomeração; teleporte corretivo fora de combate se ficar preso |
| Atacar meu alvo | Focar inimigo marcado | Prioridade superior ao aggro local por até 8s |
| Guardar posição | Defender um raio de 5m | Não perseguir além da área |
| Proteger | Defender usuário/NPC | Intercepta ameaças mais próximas e provê bloqueio |
| Dispersar | Reduzir risco de dano em área | Busca pontos seguros fora dos telegraphs |
| Recolher | Deixar campo | Devolve parte da carga do vínculo; sem animação demorada |

**Evolução:** Eco começa em Grau I; usa fragmentos de memória para atingir Grau V. Níveis e skills têm progressão separada do jogador, com teto por rank. Três famílias: Sentinela (tanque), Assassino (rápido), Arcanista (controle). Famílias avançadas: Arauto, Curandeiro, Titã. Um Eco especial possui missão de memória e passiva exclusiva, sem ser obrigatório para concluir a história.

**Controle de CPU:** 2–8 Ecos, `AITick` próximo 10Hz; distante 2Hz; apenas 1 raycast de linha de visão por grupo em condição de ataque, nunca por frame para cada Eco. Formação por slots ao redor do jogador e seleção de alvo via spatial hash. Animadores inativos param; invocações fora da câmera recebem LOD simplificado.

## 10. Inimigos e inteligência artificial

### Inimigos da demonstração

| Criatura | PV base | Movimento | Dano | Estilo | Recompensa EXP |
| --- | ---: | ---: | ---: | --- | ---: |
| Errante | 54 | 2,6 m/s | 8 | Corpo a corpo comum | 18 |
| Espectro da Fenda | 62 | 2,9 m/s | 11 | Agressivo e móvel | 25 |
| Vigia de Obsidiana | 108 | 1,6 m/s | 14 | Mais lento e resistente | 32 |
| Arconte da Ruptura | 850 | 2,4 m/s | 23 | Chefe de área, alcance maior | 280 |

No protótipo, todos perseguem alvos e executam golpes corpo a corpo telegrafados. **Espectro ainda não possui projétil de longa distância.** Não tratar esse arquétipo como mago completo antes da v0.3.

**Máquina de estados implementada:** `Chase → Windup (sinal visual) → Attack → Recover`, com `Stun` interrompendo transições. Prioridade de alvo: jogador ou Eco vivo mais próximo dentro de distância razoável. Recuperação limita frequência de ataques. PV e força crescem com nível.

### IA final proposta

- `Dormant`: desativado se fora de carga do chunk ou em zona segura.
- `Patrol`: rota curta ou animação parada, interrupção se jogador cruza cone de percepção.
- `Investigate`: examina último ruído ou projétil.
- `Alert`: aviso de grupo, inicia perseguição.
- `Chase`: movimentação usando steering local e grade de navegação por chunk.
- `Strafe`: reposicionamento lateral; probabilidade baixa para não parecer aleatório.
- `Windup`: sinal audiovisual claro, hitbox ainda inativa.
- `Attack`: período pequeno de dano, 1 aplicação por `attackId`/alvo.
- `Recover`: penalidade depois do golpe.
- `Stagger`: perda breve de controle.
- `Return`: volta ao lar se o jogador escapa, e recupera estado inicial.
- `Death`: concede loot apenas uma vez; corpo some por dissolução econômica após 2–4s.

**Orçamento:** máximo de 12 inimigos simultâneos na planície do MVP; 5 menores + chefe em masmorra; meta final 20 leves desktop / 10 leves mobile, com ajustes por dispositivo. IA em taxa fixa de 10Hz, animação visual interpolada a 30/60Hz, busca de alvos limitada por raio e pré-filtrada espacialmente.

### Chefes finais — padrões e fases

| Chefe | Fase 1 | Fase 2 | Fase 3 | Contra-jogo |
| --- | --- | --- | --- | --- |
| Arconte da Ruptura | Golpes lentos, onda no chão | 65% PV: 2 cortes e invocação | 25%: fendas radiais | Ficar entre os cones, punir recuperação |
| Guardião Prismático | Escudo frontal, laser linear | Fragmenta arenas em coberturas | Reflexos de projéteis | Quebrar cristais que alimentam escudo |
| Matriarca das Raízes | Raízes que prendem, sementes | Convida 3 lacaios de cura | Escurece arena, lança raízes | Limpar brotos, buscar área iluminada |
| Leviatã do Sal | Cauda, investida | Maré que muda terreno | Exposição de núcleo | Esquiva direcional e uso de pilares |
| Rei do Intervalo | Esgrima rápida | Portais e sombras falsas | Contra-ataque perfeito | Ritmo de esquiva, identificar sinal real |
| Reflexo Primordial | Espelha técnica selecionada | Troca gravidade local | Usa versão corrompida dos Ecos | Alternar habilidades, aproveitar janela curta |

**Aviso importante:** esses padrões multietapas são **especificação da campanha**, não código já implementado. O Arconte atual possui ataque telegráfico de uma etapa e estatísticas elevadas.

## 11. Masmorras, fendas e estrutura de áreas

### Prova de conceito implementada

1. O jogador começa na Planície das Cinzas; aproxima-se do arco violeta e usa **E**.
2. O mundo troca de bioma para uma fenda escura; chunks antigos são removidos e instâncias determinísticas novas são criadas.
3. O jogador elimina **8 criaturas** e provoca o aparecimento do **Arconte**.
4. Vencer o Arconte concede EXP, ouro, essência e item épico ou superior, além de liberar os Ecos na primeira vitória.
5. O portal pode ser usado para abandonar a incursão ou retornar após concluir; a recompensa de conclusão só ocorre na vitória.
6. O grau de incursão cresce de 1 até 24 e afeta o nível dos inimigos. O progresso do personagem é salvo.

### Design das fendas finais

**Fenda autoral =** `FendaDef {id, act, rankMin, seed, layoutGraph, rooms, objectives, elites, boss, rewards, ambience, musicCue, exitRule}`.

Uma fenda padrão terá:

- **Entrada curta:** contexto da missão e porta para primeira sala.
- **Encontro 1:** explica novo inimigo/mecânica com terreno simples.
- **Encontro 2:** exige posicionamento, interações ou movimento.
- **Evento dinâmico:** altar de bônus, reforço opcional, escolha de rota ou NPC.
- **Sala segura:** checkpoint limitado e pausa sem ameaças, não um teleporte para a tela inicial.
- **Miniboss ou enigma:** combina dois padrões, recompensa média.
- **Chefe:** arena fechada, telegraph, batalha em fases.
- **Resultados e extração:** resumo de rank, tempo, objetivos, XP e loot.

**Rank da fenda:** E/D/C/B/A/S, separado do rank atual do jogador. Requisitos de entrada por história e nível; se nível abaixo do recomendado, avisar mas não bloquear conteúdo opcional.

**Variedade**: defesa por tempo, caça de alvo, perseguição, escolta leve, boss rush, resgate de NPC, eliminação furtiva e sobrevivência com portais temporários.

## 12. Mapas e exploração

**Seis biomas** com formato próprio: planície de rochas cinzas, bastilha industrial roxa, floresta turquesa enevoada, costa azul-espectral, trono invertido geometrizado e núcleo cristalino. Cada região terá 4 marcos visuais que ajudem orientação.

**Exploração recompensada:** baús únicos, vestígios de história, fontes de essência, altares de status temporário, portas bloqueadas por rune keys e ameaças opcionais.

**Sem mundos gigantes vazios:** cada região equivalente a 8–12 minutos de navegação direta, mas atravessada por fendas e atalhos permanentes. Chunks são unidades de streaming, não obrigação de criar mapas infinitos procedurais. Biomas podem ter chunks autorais + vegetação semeada de forma determinística.

### Colisão

- Protótipo: esferas de colisão aproximadas para pilares, rochas e árvores; movimentação por eixo (X depois Z); chão plano.
- Final: cápsula do jogador e colisão com AABBs/cápsulas estáticas; broadphase por chunk; no máximo 1–2 subpassos de física em velocidade normal.
- Inimigos: steering e separação simples entre agentes; evitar física rígida completa para dezenas de monstros.
- Slope/escadas: heightfield ou malhas simplificadas de colisão; colisores são independentes do LOD visual.

## 13. Menus — fluxos e conteúdo obrigatórios

### Navegação de alto nível

```text
[TÍTULO]
  ├── Continuar (apenas se existe save)
  ├── Novo despertar (confirma sobrescrita)
  ├── Configurações
  └── Créditos

[DENTRO DO JOGO]
  ├── HUD
  │   ├── Vida / Mana / Vigor / EXP
  │   ├── Nível e Rank
  │   ├── Moedas
  │   ├── Missão rastreada
  │   ├── Minimap
  │   ├── Barra de ação (ataque / 1 / 2 / 3 / 4 / invocar)
  │   └── Contexto de interação e mensagens
  ├── I → Inventário
  ├── C → Atributos
  ├── K → Técnicas
  ├── J → Missões
  ├── M → Mapa/Fendas
  └── Esc → PAUSE
        ├── Continuar
        ├── Inventário / Atributos / Missões
        ├── Configurações
        ├── Salvar
        └── Sair para título

[AO SER DERROTADO]
  ├── Renascer na planície (−10% ouro)
  └── Voltar ao título
```

### Menu principal — layout

- Fundo: cena 3D viva de ruínas e portal + vinheta em CSS, usando a mesma cena do jogo, sem vídeo pesado obrigatório.
- Logo à esquerda; slogan, identificação da versão e quatro botões com foco/hover e navegação por teclado.
- `Continuar` desabilitado se não houver save; informar data e nível do save na v0.3.
- `Novo despertar`: diálogo de confirmação antes de substituir save; iniciar tutorial sem duas telas extras.
- `Configurações` acessível **sem entrar no jogo**, com retorno garantido ao título.
- `Créditos`: autoria, licença dos pacotes usados e licença do projeto.
- Transição: fade de 0,25–0,45s em vez de carregar outra página HTML.

### HUD — especificação completa

- **Superior esquerdo:** personagem, HP, MP, vigor, EXP, nível, rank e ícone de efeito negativo.
- **Superior centro:** nome de território, grau do portal e condição especial (`NO AR`, `BOSS`, `ÁREA SEGURA`).
- **Superior direito:** missão ativa, indicador de progresso, minimapa sem atualização por frame.
- **Inferior centro:** ataque básico, 4 técnicas, Eco, cooldown em máscara central, bloqueio por nível e teclas.
- **Inferior esquerdo:** ouro, essência e log de combate/eventos com máximo de 4 linhas recentes.
- **Contextual:** texto com `E` sobre portal, baú ou NPC, só quando dentro de raio verificável.
- **Em combate:** números de dano opcionais e críticos dourados, nunca spam ilimitado de DOM.
- **Acessibilidade final:** escala HUD 80–140%, modo alto contraste, opções de daltonismo, efeitos reduzidos, fonte mínima no mobile e campo de visão.

### Pause — sem vazamento de estados

`GameState` é **exclusivo**: `title`, `playing`, `paused`, `dead`, `cinematic`, `loading`. Abas de inventário e configurações são `OverlayState`, não `GameState` separado; só um modal principal pode estar ativo.

**Ao pausar:** congelar relógio de simulação, movimentação, IA, dano, cooldowns, timers de fenda, quests temporizadas e timers de status. Parar captura de movimento, mas renderizar a última imagem; manter UI navegável. Ao retornar, eliminar delta acumulado e limpar entradas pendentes para evitar golpe involuntário. Se o navegador perde foco, pausar automaticamente. O protótipo implementa `title/playing/paused/dead`; `cinematic/loading` são planejados.

**Menu de pause implementado:** continuar, inventário, atributos, missões, configurações, salvar, sair. **Mudar aba** não retoma combate. `Esc` fecha a janela ativa e retoma; quando estiver derrotado, não permitir fechar o modal sem decidir renascer/sair. Ao sair, salvar antes de abrir o menu principal.

### Inventário — layout e segurança

Painel esquerdo com **equipamentos ativos**, filtro, moedas, grade de 60 espaços; painel direito com ícone, nome, raridade, nível, bônus, descrição e ações `Equipar/Aprimorar/Desmontar`. Botões indisponíveis ficam desabilitados visual e logicamente, nunca apenas escondidos. Não permitir desmontagem de item equipado. Upgrade informa custo antes de aplicar. Atualizar a UI somente após alteração de dados. No mobile, passar a uma coluna e mover o detalhe para baixo da grade (implementado); v0.3 usará detalhe como drawer para reduzir rolagem.

### Atributos e técnicas

- **Atributos:** nível destacado, pontos livres, lista de 5 atributos, botão `+1` por linha e métricas derivadas (PV/PM/dano/defesa/crítico/velocidade/capacidade de Ecos). Impedir alocação se pontos 0 ou atributo no teto. V0.3: prévia de nova stat e confirmação de lote.
- **Técnicas:** ícone, tecla, descrição, custo PM, recarga, nível de liberação e estado `bloqueada/ativa`. V1.0: árvore ramificada, mudança de barra (loadout), respec e prévia de vídeo leve em WebM opcional.
- **Missões:** descrição, progresso rastreável, requisitos, recompensas individuais e botão de resgate. Recompensas não podem ser resgatadas 2 vezes.
- **Mapa/Fendas:** resumo de área, mapa esquemático sem textura pesada no protótipo; depois mapas de região e `fog-of-war` persistente.
- **Configurações:** preset gráficos, 30/60 FPS, volume, números de dano, dicas, autosave, export/import. Futuro: idioma, remapeamento, acessibilidade e dispositivos de entrada.

### Tela de resultados (planejada v0.3)

Rank de desempenho C/B/A/S, tempo de incursão, dano recebido, mortes, objetivos bônus, item raro com animação de revelação limitada a 0,8s e botões `Voltar`, `Próxima fenda`, `Abrir mochila`. Recompensas creditadas **antes** da animação para evitar perda por refresh.

## 14. Persistência, recuperação e integridade

**Save atual:** `localStorage` (offline, sem servidor), envelope com versão e timestamp, dados sanitizados na importação. Exportação/importação de JSON via UI. Autosave a cada 45s, após nivelar, equipar, forjar, missões, invocar, entrar/sair e vencer chefes. O usuário pode salvar manualmente no pause.

**Modelo mínimo:**

```json
{
  "version": "0.1.0",
  "date": 0,
  "data": {
    "level": 1,
    "xp": 0,
    "points": 0,
    "attributes": { "forca": 5, "agilidade": 5, "vitalidade": 5, "inteligencia": 5, "percepcao": 5 },
    "gold": 150,
    "essence": 24,
    "inventory": [{ "uid": "starter-blade", "id": "lamina-fenda", "rarity": "comum", "level": 1, "plus": 0 }],
    "equipped": { "arma": "starter-blade", "armadura": null, "anel": null },
    "kills": 0,
    "gateClears": 0,
    "shadowUnlocked": false,
    "currentZone": "expanse"
  }
}
```

**Futuro recomendado:** migrações numeradas (`v1→v2`), fallback para último save válido, registro de checksum simples para corrupção acidental, dual slot `active/backup`, armazenamento IndexedDB para muitos itens e eventos de mundo, e gerenciamento explícito de quota. **Não implementar criptografia fictícia** em save offline; proteção contra corrupção não impede edição de JSON pelo jogador.

**Persistir:** status, nível, moeda, itens, quests, talentos, descoberta de mapa, fendas concluídas e decisões narrativas. **Não persistir inicialmente:** ponteiros WebGL, Mesh, textura, cache de chunks, timers fracionários, raycast e referências DOM. Ao carregar uma fenda no protótipo, a onda reinicia; em v0.3 suportar checkpoint com identificadores de salas concluídas.

## 15. Áudio, VFX e direção artística

**Direção:** base escura, geometria angular, veios emissivos roxo/ciano e silhuetas nítidas. Evitar bloom global caro, transparência volumétrica pesada e dezenas de partículas individuais. Efeitos do MVP usam poucas geometrias reutilizáveis e anéis baratos. Futuro: GPU particles agrupadas e pós-processamento apenas no preset Alto.

**Pacotes de áudio finais (originais/licenciados corretamente):**

| Pacote | Mínimo | Formato | Streaming |
| --- | --- | --- | --- |
| UI | Hover, confirmar, erro, abrir, fechar, equipar | OGG/MP3 compactos | Após primeira interação |
| Personagem | 3 variações de golpe, dash, dano, passo | OGG/MP3 | Preload na área |
| Inimigos | Alert, ataque, impacto, morte por família | OGG/MP3 | Pacote de cada bioma |
| Boss | Avisos de fase, golpe grande, morte | OGG/MP3 | Pré-carregar antes da sala |
| Ambiente | Vento, portal, ruínas, chuva | OGG/MP3 loop | Fade entre áreas |
| Música | Menu, planície, exploração fenda, combate, chefe, vitória | OGG/MP3 loop | 1 ou 2 buffers ativos |

A versão v0.1 **não contém arquivos de música nem efeitos sonoros**; o controle de volume aparece na UI como campo reservado. Não anunciar áudio como implementado. Nunca usar músicas de *Solo Leveling* ou de outras obras sem licença.

**Mixer futuro:** `master`, `music`, `sfx`, `ambient`, `voice`; máximo de 12 fontes simultâneas mobile/24 desktop; repetição de golpes com variação por amostra, não por oscilador. Suspender áudio no pause salvo áudio de menu. Primeiro gesto do usuário deve desbloquear WebAudio somente quando o módulo de áudio existir.

## 16. Acessibilidade e localização

- PT-BR inicial, estrutura de dicionário pronta para EN/ES.
- Remapeamento completo para teclado/gamepad, opção de segurar/alternar corrida e assistência de mira.
- Cor + forma para raridade; ícone de status não depende apenas da cor.
- Redução de efeitos e limite de 30 FPS; modo de fontes grandes no mobile.
- Contorno do alvo selecionado sem efeitos de tela pesada; modo daltônico com contrastes certificados por QA.
- Salvar configurações independente do progresso de personagem, com botão Restaurar padrões.

## 17. Modo offline, instalação e distribuição

- GitHub Pages serve `dist/` estático; Vite inclui Three.js nos arquivos gerados, sem buscar bibliotecas JS de CDN em tempo de jogo.
- `base: './'` resolve caminhos de assets em repositórios publicados como `/nome-do-repo/`.
- PWA instalável e service worker são **marco v0.3**, ainda não inclusos na demo; usar cache com versionamento e fallback de atualização.
- Arquivos grandes de mapas e inimigos serão carregados sob demanda com `import()` e fetch de `.glb/.webp` locais da mesma origem.
- Publicação pode ocorrer por Actions usando `.github/workflows/deploy.yml`; não carregar `node_modules` ao repositório.

## 18. Balanceamento e telemetria local

**Objetivo de dificuldade:** primeiras vitórias em menos de 7 minutos; quem aprende telegraphs consegue vencer sem precisar farmar acima da recomendação; builds focadas em dano não sobrevivem paradas recebendo tudo.

**Planilha de balanceamento:** registrar `time-to-kill`, `time-to-death`, EXP/minuto, ouro/minuto, dano por golpe, custo de mana por ciclo, frequência de drop por raridade e % de falhas por chefe. Usar seeds repetíveis para comparar builds e alterações de patch.

**Sem analytics externos por padrão:** métricas locais de QA com botão de exportar JSON; nunca enviar dados do usuário por engano. v1.0 pode ter telemetria apenas mediante consentimento explícito e com política de privacidade, se vier a ser necessária.

## 19. Plano de testes e critérios de aceitação

| Sistema | Critério de aprovação |
| --- | --- |
| Menu | Novo jogo, continuar, configuração e créditos navegam sem tela preta |
| Pause | Inimigos e cooldowns congelam; Esc retoma; sair salva corretamente |
| Combate | Cada golpe aplica dano uma vez por inimigo; stun e cooldown respeitados |
| Movimentação | Diagonal não aumenta velocidade; colisão não prende jogador em canto |
| EXP | Fórmula monotônica, subida múltipla sem perder pontos, cap no lvl 60 |
| Inventário | Equipar/desequipar sem duplicar; 60 itens e proteção de equipado |
| Forja | Custo deduzido uma única vez, não pode ficar com saldo negativo |
| Saves | Corrompido não trava jogo; import rejeita itens inválidos e arquivos grandes |
| Missões | Recompensa exatamente uma vez; objetivos rastreados corretamente |
| Ecos | Limite por nível; não atacar aliados; não executar IA fora do jogo |
| Masmorra | 8 abates, boss, retorno; sem conceder recompensa de chefe em abandono |
| Chunks | Carregar/descarregar de forma determinística, sem criar duas instâncias do mesmo tile |
| LOD | Troca simples com histerese, sem modificar colisão, custo de render reduzido |
| Render | Sem vazamento de geometrias exclusivas ou crescimento infinito de inimigos ativos |
| Mobile | Joystick e 4 habilidades acionáveis; tela não rola durante gestos de jogo |
| GitHub Pages | Todos os paths funcionam em `/<repo>/`; nenhum import para `/src` no `dist` |

### Metas de desempenho — propostas, não medições obtidas

- **Desktop 1080p preset médio:** ≥55 FPS mediana; 1% low ≥35 FPS em arena com 12 inimigos e 4 Ecos; tempo de render GPU ≤16 ms típico.
- **Android intermediário 720p interno:** mediana ≥29 FPS e 1% low ≥22; ≤10 inimigos; texturas WebP ≤1K salvo boss.
- **Build inicial:** JS comprimido ~400–700 KB sem grandes modelos; assets da primeira região ≤10–16 MB comprimidos; nunca precache de todos os biomas.
- **Draw calls:** preferir ≤200 durante jogo normal desktop / ≤120 mobile; verificar via `renderer.info.render.calls`, não declarar esses números como resultado.
- **Memória de cena ativa:** alvo ≤250 MB desktop e ≤160 MB mobile incluindo texturas, em dispositivo que suporte WebGL2.

## 20. Roadmap de produção

| Fase | Conteúdo | Saída verificável |
| --- | --- | --- |
| v0.1.0 — base | Menu, HUD, pause, combate básico, 4 técnicas, 3 mobs, 1 boss simplificado, XP, itens, forja simples, Ecos, save, chunks, LOD, mobile | **Código entregue neste pacote**; precisa teste gráfico real |
| v0.2 — polimento jogável | Corrigir combate, telegraphs de chefe, animação mais natural, audio real, 3 arenas, loot de chão e integração dos resultados | Boss e 20min de jogo fluido com teste visual |
| v0.3 — vertical slice | Hub, 3 masmorras autorais, 2 especializações, PWA, gamepad, UI mobile, loaders assíncronos e primeira cutscene | Fluxo do prólogo completo e offline testado |
| v0.4–0.6 — campanha | 3 regiões + 8–12 inimigos, navmesh leve, bosses em fases, árvore, forja avançada | 4–6h de conteúdo e saves migráveis |
| v0.7–0.9 — conteúdo | 6 biomas, 30 fendas, finais, áudio, efeitos e acessibilidade | Campanha jogável de ponta a ponta |
| v1.0 — certificação | Balanceamento, desafios rank S, QA cross-browser, otimização de memória e PWA | Build com cobertura de cenários, entrega final |

## 21. Matriz de implementação da v0.1.0

| Funcionalidade | Situação |
| --- | --- |
| Three.js/Vite/Actions e código modular | Implementado no código-fonte |
| Cenário 3D low-poly e portal | Implementado no código-fonte |
| Geração determinística de chunks 24m | Implementado no código-fonte |
| Instancing de rochas/árvores/pilares e 2 níveis visuais LOD | Implementado no código-fonte |
| Mundo aberto pequeno e fenda em modo instanciado | Implementado no código-fonte |
| Combate, 4 técnicas, mira, corrida | Implementado no código-fonte |
| 3 criaturas + 1 boss simplificado | Implementado no código-fonte |
| XP, atributos, ranks, itens raros, equipar/desmontar/upgrades | Implementado no código-fonte |
| Seis contratos com recompensas | Implementado no código-fonte |
| Eco básico invocável após chefe | Implementado no código-fonte |
| Título, pause, inventário, atributos, técnicas, mapa, missões, configurações | Implementado no código-fonte |
| Autosave, exportação/importação e testes unitários | Implementado no código-fonte |
| Efeitos temporários de impacto, minimapa e toque | Implementado no código-fonte |
| Caminhada com animações simples de geometria | Implementado no código-fonte |
| Música/áudio real, cutscenes e dublagem | Não implementado |
| Avatar GLB/rig, combos de animação profissionais | Não implementado |
| Boss multifase, projéteis, UI de resultados e diálogo | Não implementado |
| Navmesh, heightfield, estruturas em múltiplos andares | Não implementado |
| PWA instalável/offline garantido | Não implementado |
| Gamepad, loadout, talentos, reputação, árvore de classes | Não implementado |
| Campanha 5 atos, 30 fendas e 12 bosses | Planejado; não incluso |

---

**Regra de manutenção:** toda versão deve atualizar este GDD apenas quando houver mudança de design, atualizar `ESTADO_ATUAL.md` conforme testes realmente executados e registrar alterações relevantes em um `CHANGELOG.md` curto. Não criar vários README e changelogs duplicados em cada release.
