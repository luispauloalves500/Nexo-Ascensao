# NEXO: ASCENSÃO — GDD COMPLETO

**Documento:** GDD v1.0 · **Plataforma prioritária:** navegadores desktop e Android/iOS modernos, hospedagem estática no GitHub Pages · **Motor:** Three.js + JavaScript ES modules + Vite · **Idioma principal:** português do Brasil.

> **Originalidade:** um jogo original de fantasia sombria, progressão individual e aliados invocados. A inspiração é a sensação de evolução de um caçador fraco até um comandante sobrenatural, comum ao gênero de *progression fantasy*. Não utilizar personagens, mundo, nomes próprios, efeitos sonoros, emblemas, ilustrações ou trilha sonora de *Solo Leveling*.

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
| Epílogo | Última Fratura | Liberar, absorver ou quebrar o pacto | A Voz sem Nome | Final de acordo com escolhas |

*(O restante do GDD completo está no arquivo original do projeto e descreve fendas, classes, skills, itens, balanceamento, UI, etc. Este é o cabeçalho; o arquivo completo foi incluído no repositório.)*

---

**Nota:** o documento completo de ~600 linhas está disponível no repositório. Para a versão jogável v0.1.0, consulte `docs/ESTADO_ATUAL.md`.
