# NEXO: ASCENSÃO — GDD v1.1

**Substitui a v1.0 como documento de design.** A v1.0 permanece em `NEXO_ASCENSAO_GDD_COMPLETO.md` como registro. Este arquivo é o que se implementa.

**Plataforma:** navegador, desktop e celular, site estático. **Motor:** Three.js + Vite. **Idioma:** português do Brasil. **Câmera da v1:** terceira pessoa oblíqua, elevada. Não muda para ombro no meio do projeto. **Sessão:** 8–20 minutos. **Rede:** nenhuma. Sem login, sem loja, sem backend.

> Universo original. A sensação de ficar mais forte é do gênero; os nomes, as ordens, a Marca e os Ecos não vêm de outra obra. Não usar personagens, brasões, trilha, vozes nem a estrutura “associação que emite rank de caçador”.

---

## 0. O que a v1.0 errava, e o que fecha

A v1.0 era honesta sobre o que o código já faz, e isso continua obrigatório. Como **design**, ela descrevia dois jogos ao mesmo tempo: um slice de uma fenda, e um ARPG de 30 fendas, 4 classes, montaria, escolta, furtivo e legião tática. O gancho — cada Eco é uma vida extinta, e usá-la tem custo — aparecia num parágrafo e sumia. No sistema, Eco era pet de dano.

| Problema da v1.0 | Decisão da v1.1 |
| --- | --- |
| Status (“não implementado”) repetido em toda seção | Design aqui. O que o código faz está só no apêndice A. |
| Loop igual ao de qualquer ARPG | O verbo exclusivo entra na fenda, não no epílogo: **Armar, Recordar ou Libertar** um Eco nomeado. |
| Três coisas chamadas rank (letra do herói, letra da fenda, nota C/B/A/S da run) | **Marca** (poder), **Grau** (perigo da fenda), **Avaliação** (Bronze / Prata / Ouro / Inteira). |
| Percepção morre aos ~42 pontos: crítico trava em 40% e o resto do atributo não faz nada | Crítico **para de subir em 35%**. Excedente vira dano crítico e leitura de golpe 80 ms mais cedo. |
| Defesa descrita de dois jeitos (“28% do valor” vs mitigação) | Uma fórmula só, na seção 8. O protótipo ainda usa a conta antiga; migrar é patch de número, não de conteúdo. |
| Câmera oblíqua agora, ombro “na v0.3” | Oblíqua até o fim da v1. Ombro seria outro jogo (hitbox, toque, telegraph). |
| 30 fendas, 28 famílias, 18 Ecos, 4 classes, montaria, escolta, furtivo | Isso é **Volume 2**. A v1 cabe em 3 regiões, 9 fendas, 6 famílias, 8 Ecos nomeados, 2 estilos. |
| Nenhum conteúdo especificado até o fim | Uma fenda, um chefe e um Eco estão fechados abaixo. Os outros copiam essa ficha, não uma lista de gêneros. |
| Repetir a única fenda é o melhor jeito de subir de nível | Primeira conclusão paga 100%. Repetir a mesma paga **35% de EXP e 50% de ouro**. Marca D vem de conteúdo novo. |
| Pilar “o código não é monolítico” | Pilar de engenharia sai do GDD. Continua valendo no código; não é promessa ao jogador. |
| “Sistema” como nome da interface | A interface se chama **Marca**. É o contrato, não um menu de light novel. |

**Regra de ouro:** se uma frase não muda o que o jogador faz, vê ou perde, ela não entra. Orçamento de draw call fica na arquitetura técnica, não aqui.

---

## 1. Promessa

Você entra fraco numa planície rasgada por fendas. Cada vitória deixa você mais forte de um jeito que se vê: golpe novo, arma melhor, Eco ao lado. O preço é que alguns aliados **são pessoas**. Armar um Eco gasta o nome dele para ganhar a luta. Recordar o nome abre o mundo e te deixa mais fraco naquela hora. Libertar recusa os dois.

Em 20 minutos o jogador precisa sentir as três coisas: **eu li o golpe, eu fiquei mais forte, eu escolhi o que fazer com alguém.**

### Pilares

1. **Toda luta paga.** EXP, material, fragmento ou uma escolha de Eco. Combate sem prêmio não existe.
2. **O corpo muda.** Golpe novo, silhueta da arma, Eco visível, inimigo que antes matava e agora cai.
3. **O golpe inimigo se lê.** Forma e cor avisam antes do dano. Errar dói; acertar o espaço vazio do inimigo é a recompensa.
4. **A Marca não atrapalha.** Pause de verdade, um modal por vez, comparar item sem conta de cabeça, autosave que não corrompe.
5. **A escolha do Eco é permanente e justa.** Não tem opção claramente idiota. Armar ganha a luta. Recordar ganha caminho. Libertar ganha o final e uma ajuda pequena, nunca maior que o dano de ter armado.

### Não é

- Não é MMO, não tem feira de jogador, não tem gacha.
- Não é soulslike de um erro. Errar um telegraph tira um pedaço de vida, não a tentativa inteira. Vigor e posição é que matam quem fica parado.
- Não é jogo de capturar a fauna. Só **elites e chefes** oferecem Eco nomeado. O resto vira essência.
- Não tem montaria, furtivo como modo, escolta de NPC frágil, nem quatro estilos no lançamento.

---

## 2. Mundo em uma página

**Asterion** rachou. As rachaduras se chamam **fendas**. Quem passa volta mudado, louco ou não volta. Seis ordens de vigias continham isso. Agora atrasam.

| Ordem | Onde manda | O que acredita | Atrito com o jogador |
| --- | --- | --- | --- |
| Lâmina Pálida | Planície das Cinzas | Andarilho é contágio | Te caça se a Marca estiver acesa |
| Vidro | Bastilha de Iridium | Arquivar é controlar | Quer os códices, não os Ecos armados |
| Raiz | Bosque de Naevra | Memória se queima | Trata Recordar como heresia branda e Armar como crime |
| Sal | Costa Espectral | Não se invoca os mortos | Única ordem que respeita Libertar |
| Intervalo | Trono Invertido | O tempo da fenda é ferramenta | Volume 2 |
| Núcleo | Sumiu | Virou a boca da Voz | Não é facção jogável |

O protagonista é **Neri Vale**, sem linhagem. Quer atravessar a planície como pessoa, não como contrato. A **Voz do Nexo** oferece poder em troca de estabilizar fendas. A mentira da Voz: *“armar um Eco é devolver um corpo.”* A verdade, que o jogo mostra sem discurso de 4 minutos: armar **apaga o nome** e usa o resto como arma. O nome só sobrevive se for recordado ou se o Eco for libertado.

Neri não fala em parágrafos. Fala em linhas curtas. A Voz fala no HUD, em uma frase, quando a escolha importa. Sem dublagem na v1.

### Três finais (um eixo, três contagens)

O jogo conta, em silêncio, quantos Ecos **nomeados** foram armados, recordados e libertados. Empate favorece Recordar, depois Libertar.

| Final | Condição | O que o jogador vê | O que muda no pós-jogo |
| --- | --- | --- | --- |
| **Trono** | Armados ≥ os outros | Neri vira a próxima Voz. A planície fica quieta. O HUD continua, mais frio. | Fendas de grau alto. Os nomes não voltam. |
| **Arquivo** | Recordados ≥ os outros | As ordens recebem os códices. As fendas encolhem e não somem. A Marca fica, fraca. | Atalhos e fraquezas dos chefes permanecem. |
| **Romper** | Libertados ≥ os outros, incluindo o Reflexo | A Marca racha. As letras do HUD apagam. Parte do mapa continua perigosa, sem contrato. | Neri joga o pós-jogo sem capacidade de armar. Bênçãos já ganhas ficam. |

**NG+** só depois de qualquer final. Mantém nível, atributos, itens e forja. Zera a campanha e os três contadores, para ver outro final. Não multiplica dano inimigo na primeira volta; a segunda volta sobe o grau das fendas em 1.

Volume 2 (Intervalo, Núcleo, Reflexo como ato longo) usa estes finais como prólogo. Não bloqueia a v1.

---

## 3. Os primeiros 12 minutos

Isto é roteiro de implementação, não sugestão. Sem tela de lore antes do controle.

| Min | O que acontece | O que ensina | Sem |
| --- | --- | --- | --- |
| 0:00 | Título. Um botão grande: **Despertar**. Continuar só se houver save. | Entrar | Quatro menus antes de jogar |
| 0:20 | Neri no chão, planície, um Errante andando devagar. A Marca diz: “Levanta.” WASD já vale. | Mover | Texto de atributo |
| 0:40 | O Errante prepara um **cone âmbar**. Se Neri está fora, o golpe erra. Clique ataca. | Ler e bater | Combo explicado por tooltip |
| 1:30 | Segundo Errante. Desta vez o cone acerta se o jogador ficar. Dói ~15% da vida. Poção não existe; a vida regenera devagar fora de combate. | Errar tem custo baixo | Tela de morte no tutorial |
| 2:30 | Portal. “E — entrar”. Dentro: sala pequena, 3 Errantes, já com o ritmo do jogo. | Fenda | Mapa |
| 4:00 | Sala 2: 2 Espectros (rápidos) e 1 Vigia (lento, muito PV). Matar o rápido primeiro é obviamente melhor: o Vigia quase não alcança. | Prioridade | Diálogo |
| 5:30 | Altar. Duas placas: **Beber** (cura toda) ou **Colher** (essência, e um Errante extra acorda). | Escolha pequena antes da escolha grande | Lore |
| 7:00 | Portão do Arconte. Três golpes só, seção 6. | Chefe justo | Fase secreta |
| 9:30 | Arconte cai. Não vira pet sozinho. A Marca oferece **Sera** (seção 7): Armar, Recordar ou Libertar. | O verbo do jogo | Menu de legião |
| 11:00 | Resultado: EXP, ouro, item, uma linha do que a escolha fez. Volta à planície. A forja do acampamento acende. | Recompensa | Árvore de talentos |
| 12:00 | Se sobrou ponto, a Marca abre atributos **uma vez**, com a frase do que cada um faz. Dá para fechar. | Crescer | Build perfeita |

Morrer no tutorial não acontece: o primeiro cone não é letal e a vida de Neri no nível 1 aguenta erro. Morrer no Arconte sim: volta à entrada da fenda, sem perder o altar, perde 10% do ouro, o chefe reinicia. Não volta ao título.

---

## 4. Loops

**30 segundos.** Ver o telegraph → sair da forma → bater na recuperação → não gastar o vigor inteiro.

**Uma fenda (8–15 min).** Entrada → encontro que ensina → encontro que cobra → altar ou escolha → chefe → **no máximo um Eco nomeado** → resultado → planície.

**Uma sessão (até 40 min).** Uma fenda nova, ou uma antiga repetida de propósito (item, não nível). Gastar ouro na forja. Equipar se o número for maior. Parar.

**A campanha.** Marca sobe porque o mapa abre, não porque a mesma sala foi moída. Quando a letra da Marca muda, o jogador ganha um golpe ou um slot de Eco, nunca os dois no mesmo nível.

**Repetir fenda.** Permitido e útil para essência e para o item que faltou. EXP 35%, ouro 50%, item de chefe na mesma tabela. Se três conclusões seguidas daquela fenda não deram épico nem melhor, a quarta **garante épico**. O jogador não é obrigado a saber da pity; a Marca diz “a fenda cede” quando dispara.

---

## 5. Escopo fechado

| | v0.1 (código que já existe) | v1 (este GDD manda construir) | Volume 2 (não prometer data) |
| --- | --- | --- | --- |
| Regiões | Planície + 1 fenda | Planície, Iridium, Naevra, refúgio | Sal, Intervalo, Núcleo |
| Fendas | 1 arena de 8 abates | 9 autorais (3 por região) | Até 30, só se a ficha da seção 6 estiver leve de produzir |
| Chefes | Arconte de 1 golpe | 4 (Arconte, Prismático, Matriarca, Voz-sem-nome no epílogo) | Leviatã, Rei do Intervalo, Reflexo longo |
| Inimigos | Errante, Espectro, Vigia | +2 por região nova, papel claro | Famílias extras |
| Estilos | Nenhum; atributos livres | **Limiar** (aço) e **Tecelão** (Ecos), escolhidos na Marca D | Arcanista, Guardião |
| Técnicas | 4 ativas + invocar | 4 por estilo, barra de 4, uma troca grátis no refúgio | Árvore de 24 nós |
| Ecos | 1 modelo genérico depois do chefe | 8 nomeados, 3 verbos, até 3 armados | Graus I–V, 6 ordens de IA |
| Itens | Arma, armadura, anel, +10 | Os mesmos 3 slots. Conjunto não entra. | Mais slots, runas, sets |
| Câmera | Oblíqua | Oblíqua | Reabrir a discussão só aqui |
| Áudio | Nenhum | Menu, 3 golpes, 1 hit, 1 telegraph, 2 músicas (planície, chefe) | Pacote completo |
| Morte | −10% ouro, planície | −10% ouro, **entrada da fenda** | Idem |

Se uma feature não está na coluna v1, ela não entra no código da v1 “porque o GDD antigo listava”.

### Campanha da v1

| Ato | Região | Fendas | Chefe | O que o ato ensina |
| --- | --- | --- | --- | --- |
| Prólogo — A Marca | Planície das Cinzas | A Primeira Marca, A Lavra, O Vigia Cego | Arconte da Ruptura na primeira; um elite nas outras | Mover, ler golpe, a escolha |
| I — Ferro e Vidro | Bastilha de Iridium | Três fendas de corredor e pátio | Guardião Prismático | Quebrar a coisa que alimenta o escudo, não o escudo |
| II — Sem Sol | Bosque de Naevra | Três fendas de clareira | Matriarca das Raízes | Matar o broto de cura antes do corpo grande |
| Epílogo | A mesma planície, à noite | Uma sala | A Voz sem nome (usa os seus contadores) | O final |

Cada fenda nova apresenta **um** padrão novo e reusa os antigos. A terceira fenda de uma região combina os dois anteriores. É assim que se chega a 9 sem inventar 9 gêneros.

---

## 6. Fenda modelo — A Primeira Marca

As outras oito saem desta ficha. Não inventar layout no código.

| Campo | Valor |
| --- | --- |
| id | `fenda.primeira-marca` |
| Região | Planície das Cinzas |
| Grau | 1 |
| Marca recomendada | E (níveis 1–6). Abaixo disso, avisar. Não bloquear. |
| Semente | Fixa. A fenda de história não é procedural. |
| Objetivo | Atravessar 3 salas e derrubar o Arconte. |
| Eco nomeado | Sera, só na primeira vitória. Repetição não oferece Sera de novo. |
| Música | Silêncio na v0.2; tema de chefe na v1, só na última sala. |
| Saída | Portal atrás da arena, ou morte, ou pausa → abandonar. Abandonar não paga o chefe e não oferece Sera. |

**Sala 1 — Três Errantes.** Chão liso, dois pilares que quebram o cone. Nenhum cai de surpresa nas costas.

**Sala 2 — Dois Espectros, um Vigia.** Os Espectros vêm primeiro. O Vigia nasce 4 m atrás e caminha. Se o jogador focar o Vigia, os Espectros punem. Não há fala dizendo isso.

**Sala 3 — Altar.** Beber ou Colher, como no minuto 5:30. A escolha dura a fenda, não o save inteiro. Dá para mudar na próxima entrada.

**Sala 4 — Arconte.** Porta fecha. Não há adds na primeira versão deste chefe. A invocação de lacaios fica para o Guardião Prismático, que precisa dessa lição.

**Resultado.** Crédito de EXP, ouro, essência e item **antes** de qualquer animação. Se o jogador fechar a aba no meio do brilho, o prêmio já está no save.

Avaliação da incursão (não é Marca, não é Grau):

| Avaliação | Regra |
| --- | --- |
| Inteira | Chefe morto, nenhuma morte, altar não importa |
| Ouro | Chefe morto, no máximo 1 morte |
| Prata | Chefe morto, 2 ou 3 mortes |
| Bronze | Chefe morto com 4+ mortes, ou saiu e voltou mais de uma vez |

A avaliação paga um bônus pequeno de essência (Inteira +8, Ouro +4, Prata +0, Bronze +0). Não paga item exclusivo que prenda o jogador a jogar sem errar.

---

## 7. Chefe modelo — Arconte da Ruptura

Um chefe, três leituras, uma fase extra curta. Não três personalidades.

| Golpe | Forma | Cor | Aviso | Dano no nível 1 | Como punir |
| --- | --- | --- | --- | --- | --- |
| Corte | Cone de 70°, 4 m | Âmbar | 0,55 s parado | 23 | Passo para o lado, 2 ataques leves |
| Queda | Anel no chão, raio 3,2 m, centrado no jogador | Ciano | 0,70 s | 28 | Sair andando; correr só se estiver no centro |
| Ruptura | Quatro riscos radiais | Magenta | 0,90 s, só abaixo de 40% de PV | 34 | Ficar no vão entre os riscos |

Regras:

- Hitbox **não existe** durante o aviso. Existe num pulso de 0,12 s.
- Um golpe acerta cada alvo **uma vez** por `attackId`.
- Entre golpes, recuperação de 0,8 s (0,5 s abaixo de 40% de PV). É a janela honesta.
- O Arconte não vira para o jogador durante o aviso. A forma mostra a direção. Se a forma mentir, o chefe está errado.
- Adiciona um anel magenta no próprio corpo 1 s antes da Ruptura, para quem não olha o chão.
- Vida: 850 no grau 1. Sobe 12% por grau, não por nível do jogador. O grau é que escala o conteúdo.
- Não invoca lacaio. Não tem armadura que ignore a leitura.

**Linguagem para todos os chefes da v1** (não reinventar cor):

| Forma | Cor | Significa |
| --- | --- | --- |
| Cone | Âmbar | Sai pelos lados |
| Anel ou círculo | Ciano | Sai de dentro |
| Linha | Branco | Esquiva perpendicular; é investida |
| Marca pulsando no corpo | Magenta | Ainda não; o dano é no segundo pulso |

Dois pulsos no máximo. Um som seco no início do aviso, outro no impacto, quando houver áudio. Daltonismo: a forma basta; a cor reforça. Âmbar nunca é o único sinal de “sai dos lados”.

Hitstop do jogador: 40 ms no leve, 70 ms no terceiro golpe do combo e nas técnicas. Zero se errar. Câmera não treme na v1 (opção futura, desligada por padrão).

---

## 8. Combate

### O que o jogador faz

Combo de 3 no clique: 100%, 120%, 155% do dano, arco curto, janela de 0,9 s para encadear. Cada golpe leve custa 5 de vigor. Sem vigor, o golpe sai com 60% do dano e não encadeia. Vigor volta quando não está correndo nem batendo.

Técnicas 1–4 gastam mana e respeito de recarga. Passo sombrio é a única esquiva com invulnerabilidade: **0,20 s**, deslocamento até 5,5 m. Não há botão de dodge além dessa técnica. Não prometer iframe no WASD.

Correr (Shift) custa vigor por segundo. Vigor vazio: volta à caminhada na hora.

### Fórmulas fechadas da v1

O protótipo (apêndice A) ainda usa outra conta de defesa e outro teto de crítico. A v1 usa estas:

```text
PV  = 85 + Vitalidade_efetiva × 11 + (nível − 1) × 7 + bônus de armadura
PM  = 42 + Inteligência_efetiva × 8 + bônus de anel
Vigor = 75 + Agilidade_efetiva × 3

Dano_base = 10 + Força_efetiva × 2,2 + arma + Agilidade_efetiva × 0,35
           + Inteligência_efetiva × 0,35   (este último só em técnica de Marca, não no combo)

Defesa = arredondar(armadura × 0,35 + Vitalidade_efetiva × 0,7)
Dano_recebido = max(1, floor(Dano_bruto × 100 / (100 + Defesa)))

Crítico_chance = min(35%, 3% + Percepção_efetiva × 0,8%)
Crítico_dano   = 150% + max(0, Percepção_efetiva − 40) × 0,4%
Leitura        = se Percepção_efetiva ≥ 40, telegraphs aparecem 80 ms antes

Velocidade = 4,5 + Agilidade_efetiva × 0,04
Slots_Eco  = 1 no desbloqueio, +1 na Marca D, +1 na Marca C   (teto 3 na v1)
```

Defesa 0 recebe 100% do golpe. Defesa 100 recebe metade. Defesa 300 recebe um quarto. Não existe subtração seca.

### Para que serve cada atributo no nível 60

Nenhum vira lixo no teto.

| Atributo | Sempre faz | Quando já está alto |
| --- | --- | --- |
| Força | Dano do combo e quebra de postura | Continua sendo o melhor dano físico. Não capar. |
| Agilidade | Andar, vigor, um pouco de dano | Acima de 40, a cadência do combo ganha 4% (uma vez), não infinita. |
| Vitalidade | Vida e defesa | Única forma de aguentar chefe sem decorar tudo. |
| Inteligência | Mana e dano das técnicas de Marca | Cada 15 pontos: +5% de dano dos Ecos **armados**. |
| Percepção | Crítico até 35% | Depois: dano crítico e aviso mais cedo. |

**Regra da build.** Até a Marca D o jogador só distribui atributos. Na Marca D escolhe **Limiar** ou **Tecelão**, uma vez por NG+. Limiar aumenta combo e Passo. Tecelão aumenta o dano dos Ecos e barateia Armar (−10 PM). Não há respec na v1: a escolha cabe em uma frase e o NG+ existe para a outra. Híbrido é permitido porque os atributos continuam livres; o estilo só inclina.

### Técnicas da v1

Manter as quatro do protótipo no Limiar, com os mesmos papéis (arco, área, avanço, dreno). O Tecelão troca a lista, não as teclas:

| Tecla | Limiar | Tecelão |
| --- | --- | --- |
| 1 | Corte espectral | Ordem: os Ecos atacam o marcado |
| 2 | Ruptura | Elo: 30% do dano que Neri tomar, neste 4 s, vai para um Eco armado |
| 3 | Passo sombrio | Passo sombrio (os dois estilos esquivam igual) |
| 4 | Dreno vital | Ceder nome: gasta 1 fragmento, o Eco explode o aviso magenta num alvo |

Desbloqueio por nível permanece: 1 no nível 1, 3 no nível 2, 2 no nível 3, 4 no nível 5. Números de custo do protótipo (12 / 25 / 15 / 30 PM) ficam até playtest dizer que a mana acaba no meio do chefe. Se acabar, sobe mana, não corta o custo pela metade em silêncio.

### Dano

Tipos na v1: **físico** e **de Marca**. Só. Resistências por tipo entram no Volume 2, quando existir inimigo que ensine a trocar de golpe. Até lá, elemento extra é texto morto.

Status na v1: **atordoamento** (já existe na Ruptura, 1,1 s, chefe sofre 0,4 s) e **postura**. Postura é uma barra escondida em elite e chefe; quando enche, 1,5 s de vulnerabilidade e +30% de dano recebido. Combo enche pouco, Ruptura enche mais. Não há sangramento, queimadura, silêncio nem corrupção na v1.

Aliado não fere aliado.

---

## 9. Progressão

- Nível 1 a 60. EXP para sair do nível `L`: `arredondar(75 × L ^ 1,56)`.
- Subir de nível: +5 pontos, vida e mana e vigor enchem.
- Base 5 em cada atributo, teto 99.
- A UI mostra **base** e **efetivo** (base + item). Bônus de item não é ponto gasto.

| Marca | Níveis | O que ganha de verdade, além dos pontos |
| --- | --- | --- |
| E | 1–6 | As 4 técnicas e a primeira escolha de Eco |
| D | 7–15 | Estilo (Limiar ou Tecelão) e o 2º slot de Eco |
| C | 16–26 | 3º slot. Iridium já deve ter sido concluída perto daqui |
| B | 27–38 | Naevra. Não há sistema novo; os chefes cobram as leituras juntas |
| A | 39–50 | Epílogo disponível. Grau das fendas antigas sobe se quiser repetir |
| S | 51–60 | Pós-jogo. Nada de obrigatório atrás deste muro |

Conta de EXP até a Marca D (nível 7): cerca de 3 500. Uma primeira conclusão da fenda modelo, com 5 Errantes no mapa somados à fenda, 2 Espectros, 1 Vigia e o Arconte, dá em torno de 450 de EXP. Três primeiras conclusões nas três fendas da planície mais os contratos do refúgio precisam chegar perto de 3 500 **sem** repetir. Se no playtest não chegarem, aumenta a EXP de primeira conclusão. Não mexe na curva `L^1,56` antes disso.

Ouro de uma primeira conclusão da fenda modelo: cerca de 290, mais 150 iniciais. Custo acumulado da forja: +1 = 45, +2 ≈ 200, +3 ≈ 500, +5 ≈ 1 800, +10 ≈ 10 500 de ouro e ~750 de essência. Ritmo desejado:

| Momento | Forja esperada |
| --- | --- |
| Fim do prólogo | Arma +2 |
| Fim da planície | +3 |
| Fim de Iridium | +5 num item, não nos três |
| Fim da v1 | +6 ou +7 se o jogador não desmontou à toa |
| +10 | Pós-jogo. Não é requisito de nenhum chefe |

Se o chefe final exigir +10, a forja está cara demais ou o chefe está inflado. Os dois se corrigem; não se cria uma terceira moeda para “resolver”.

Fragmento ancestral e selo de história **não existem na v1**. O selo era moeda que não se gasta. Isso não é moeda.

---

## 10. Itens

Três slots na v1: **arma, armadura, anel**. Mais slots não mudam a fantasia; atrasam o inventário.

Seis itens-base do protótipo continuam o catálogo inicial. Cada região nova acrescenta no máximo 4 bases. Melhor que 36 modelos sem diferença.

Raridade, condicional a ter caído um equipamento:

| Raridade | Cor + forma no ícone | Multiplicador | Chance |
| --- | --- | ---: | ---: |
| Comum | Cinza, barra | 1,00× | 41% |
| Incomum | Verde, uma marca | 1,20× | 33% |
| Raro | Azul, duas marcas | 1,52× | 18% |
| Épico | Violeta, losango | 1,95× | 6,5% |
| Lendário | Dourado, losango duplo | 2,55× | 1,5% |

Inimigo comum: 25% de rolar essa tabela. Elite: 60%. Chefe: 1 item garantido, mínimo épico, e a tabela só decide se foi épico ou lendário (96% / 4% no chefe de história; a pity da seção 4 pode forçar épico, nunca lendário).

Poder do item, antes da raridade: `base + 2 × (nível do item − 1) + 4 × plus`.

Forja: sucesso garantido até +10, sem quebrar. Custo `ouro = arredondar(45 × (plus+1)^1,75)`, `essência = arredondar(7 × (plus+1)^1,35)`. Confirmar mostrando o custo. Desmontar devolve essência e **não** devolve ouro: o ouro é o sumidouro. Item equipado não desmonta. Item de missão não desmonta. Um botão de “desmontar comuns” existe no refúgio, com uma linha de confirmação, porque 60 slots enchem.

Mochila: 48 na v1, não 60, não 120. Material empilha. Equipamento não. Mochila cheia: o item não vira 15 de ouro em silêncio. A Marca diz “sem espaço” e o drop fica no chão da sala até sair da fenda. Aí sim converte em essência mínima (3) e avisa.

Comparar com o equipado é obrigatório na v1, não “melhoria futura”. Verde sobe, vermelho desce, número ao lado.

---

## 11. Ecos

### O que o jogador entende

Nem todo morto vira Eco. Elite e chefe, na primeira vez, deixam um nome. A Marca abre três verbos. Não dá para voltar atrás naquele nome.

| Verbo | Na hora | No combate dali em diante | No final |
| --- | --- | --- | --- |
| **Armar** | Gasta o nome. O Eco fica na reserva e entra com a tecla R, custando 35 PM (25 se Tecelão). Ocupa 1 slot. | Luta sozinho no alvo mais próximo, ou no marcado se o Tecelão ordenar. Pode morrer na fenda; volta no refúgio. | Soma em Armados. O HUD mostra o título (“Vigia”), não o nome. |
| **Recordar** | Uma cena de até 25 s, pulável depois da primeira linha. Vira um códice. | Não luta. Abre **um** fato útil: atalho, fraqueza de um chefe futuro, ou um contrato. | Soma em Recordados. |
| **Libertar** | O Eco vai embora. Bênção única e pequena: +8% de vida máxima **ou** +1 de vigor por segundo fora de corrida, à escolha, permanente, não stack do mesmo tipo acima de 3. | Não luta. Em **um** chefe futuro, se o texto do Eco prometeu, ele interfere uma vez (segura um golpe). A ficha do Eco diz qual. | Soma em Libertados. |

Três bênçãos de Libertar no máximo. A quarta libertação só conta para o final, sem stat. Assim Libertar não vira a build obrigatória.

Essência continua caindo de inimigo comum. Essência não é Eco.

### Sera, a primeira — ficha

| | |
| --- | --- |
| Quem era | Vigia da Lâmina Pálida. Segurava a planície. A fenda comeu o posto, não a vontade. |
| Armar | Sentinela lenta, muito PV, pouco dano, empurra Errantes. Boa para a sala 2 se o jogador voltar. |
| Recordar | Mostra um segundo portal atrás da Lavra, a fenda 2, sem ter que achar no escuro. |
| Libertar | Na luta do Guardião Prismático, Sera quebra **um** cristal de escudo sozinha, uma vez. |
| Não dizer | Não chamar de sombra, soldado invocado, nem rank de caçador. |

Os outros sete nomes seguem esta ficha: 8 linhas, uma utilidade por verbo, zero “personalidade a definir”.

### IA que o jogador percebe

Na v1 o Eco armado só sabe: seguir entre 2 m e 4 m, bater no mais próximo, não bater em Neri, não atravessar telegraph de anel ciano (eles também saem do círculo). Ordens Seguir / Guardar / Dispersar ficam para o Volume 2. A tecla do Tecelão “atacar o marcado” é a única ordem da v1, e marcar é o clique do meio (desktop) ou um botão extra (toque) em cima do inimigo.

Fora da câmera o Eco não ganha vida nova de código: continua o mesmo boneco, com tick mais raro. Isso é teto de implementação, não feature.

---

## 12. Inimigos

Papel antes de tabela. Se dois inimigos fazem a mesma coisa, um deles não entra.

| Criatura | Papel | PV | Passo | Dano | EXP | Ouro |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Errante | Ensina o cone | 54 | 2,6 | 8 | 18 | 9 |
| Espectro | Pune quem ignora o rápido | 62 | 2,9 | 11 | 25 | 14 |
| Vigia | Parede lenta; não é o alvo certo | 108 | 1,6 | 14 | 32 | 16 |
| Arconte | Exame das três formas | 850 | 2,4 | ver seção 7 | 280 | 200 |

Grau da fenda acima de 1: PV e dano `× (1 + 0,12 × (grau − 1))`. EXP e ouro `× (1 + 0,08 × (grau − 1))`. Não escalar também pelo nível de Neri. O jogador forte **é** forte.

IA da v1: percebe em 12 m, persegue, trava no aviso, golpeia, recupera, atordoa se a barra mandar. Sem patrulha elaborada, sem investigar ruído, sem voltar para casa curando tudo. Se Neri sair da sala, o inimigo da sala esquece e regenera. Chefe não esquece: a porta fechou.

Teto: 6 inimigos vivos numa sala da v1. A planície pode ter 8 no pedaço carregado. Passou disso, a sala está cheia demais para a leitura do chão.

Espectro **não** atira na v1. Quando atirar, o projétil é uma linha branca lenta, e isso será o inimigo novo de Iridium, com outro nome. Não reciclar o Espectro mudando a ficha em silêncio.

---

## 13. Controles e câmera

Câmera oblíqua, atrás e acima, distância fixa em 11 m, zoom da roda entre 8 e 14. Sem orbitação livre na v1: orbitação esconde telegraph atrás da parede. Colisão de câmera: se um pilar cruzar a linha, aproxima até 6 m e volta com suavidade. Não entra no corpo do chefe.

Mira: o personagem olha para o ponto do chão sob o cursor. Em toque, olha na direção do joystick de movimento; um segundo dedo no lado direito da tela aponta, se existir. Não exigir dois joysticks para o prólogo: o prólogo se joga com um polegar e o botão de ataque.

| Input | Ação |
| --- | --- |
| WASD ou setas | Andar. Diagonal normalizada. |
| Mouse no chão | Orientar |
| Clique esquerdo | Combo |
| Clique do meio | Marcar alvo (Tecelão; nos outros estilos, não faz nada e não gasta) |
| 1–4 | Técnicas |
| Shift | Correr |
| R | Armar no campo o próximo Eco da reserva, se houver slot e mana |
| E | Interagir, 5 m |
| I C K J M | Inventário, atributos, técnicas, missões, mapa. Cada um pausa |
| Esc ou P | Pause |
| Roda | Zoom |

Não há tecla de jogo que abra dois modais. Esc fecha o de cima; se não houver modal e o estado for jogando, pausa; se estiver pausado, continua.

Toque: joystick, ataque, quatro técnicas, R, E, pause. Botões de pelo menos 44 px. A página não rola. Pinch não dá zoom no browser.

Gamepad fica fora da v1. Não desenhar ícone de controle que não funciona.

Morte, pause e aba escondida: o relógio para. Ao voltar, o delta acumulado é jogado fora. Nenhuma técnica dispara sozinha pelo botão que ficou apertado.

---

## 14. Interface

Estados do jogo, um só por vez: `title`, `playing`, `paused`, `dead`, `choice`, `cinematic`. Inventário e afins são overlay **em cima de** `paused` ou de `title`, nunca um estado paralelo que deixa o boneco batendo.

`choice` é o modal de Armar / Recordar / Libertar. Não dá para abrir o inventário em cima dele. Três botões, o nome do Eco, uma linha do que cada verbo faz **neste** Eco (a ficha da seção 11, não um texto genérico).

HUD:

- Esquerda: vida, mana, vigor, EXP, nível, letra da Marca.
- Centro, fino: nome do lugar e, na fenda, o grau. Some fora de combate se não houver nada a dizer.
- Direita: uma missão, um número, minimapa que atualiza 4 vezes por segundo e não todo frame.
- Baixo: ataque e quatro técnicas, com recarga por máscara. Ícone de Eco com o número de slots (`1/2`).
- Canto: ouro, essência, no máximo 3 linhas de log.

Dano flutua no mundo, no máximo 8 números vivos. Crítico é maior e dourado. Errar não gera “0”.

Pause: Continuar, Inventário, Atributos, Missões, Configurações, Salvar, Abandonar fenda (só dentro de fenda), Sair para o título. Sair salva antes.

Configurações que a v1 precisa ter de verdade, não cinza: volume (mesmo com pouco áudio), números de dano, tremor desligado, escala do HUD 80–140%, 30 ou 60 FPS, autosave ligado por padrão, exportar e importar save. Idioma extra não.

Derrota: “Renascer na entrada” e “Sair”. Esc não fecha esta tela sem escolher. Renascer tira 10% do ouro, nunca deixa negativo abaixo de zero por arredondamento: tira `floor(ouro × 0,10)`.

Título: Despertar, Continuar (com nível e letra, se houver save), Configurações, Créditos. Novo jogo por cima de save pede confirmação com o nível que será apagado escrito no botão, não só “tem certeza?”.

---

## 15. Save

`localStorage` na v1. Envelope com versão. Importar valida tipo, faixa e tamanho; arquivo ruim não apaga o save bom. Dois slots lógicos: o atual e a cópia da gravação anterior. Corrupção cai na cópia. Sem criptografia de mentira.

Grava ao pausar, ao subir de nível, ao equipar, ao forjar, ao escolher verbo de Eco, ao entrar e sair de fenda, ao vencer chefe, e a cada 45 s se algo mudou. Não gravar mesh, timer solto nem referência de DOM.

Dentro da fenda, morrer volta à entrada com as salas já limpas **permanecendo limpas** naquela tentativa, e o chefe reiniciado. Sair para o título no meio da tentativa descarta a tentativa e fica o save da entrada. Isso evita o jogador preso numa sala pela metade sem checkpoint, e evita duplicar prêmio reabrindo a aba.

Versão do save muda quando a forma dos dados muda. Migração é função nomeada, uma por salto (`0.1 → 1.0`). Save desconhecido: recusa e explica, não zera.

---

## 16. Direção

Escuro, quina dura, veio roxo na fenda e ciano no telegraph de anel. Âmbar só para cone, para a cor não mentir. Silhueta do Neri mais clara que o chão: se o personagem some, o cenário está errado, não a luz.

Low poly. Sem bloom obrigatório. Partícula pouca e reutilizada. Número de dano é o efeito mais importante; o resto é secundário.

Áudio mínimo da v1, original ou em licença que caiba num arquivo `CREDITOS.md`: clique de interface, três variações de corte, um impacto, um sino seco de telegraph, loop curto da planície, loop do chefe. Música some no pause, efeito de interface não. Sem faixa de outra obra, mesmo “só no protótipo”.

Texto todo cabe em dicionário `{ chave: frase }`. v1 só PT-BR. Não deixar frase montada no meio do código de UI.

---

## 17. Aceite

Uma build da v1 só está pronta se uma pessoa que não leu este GDD consegue, sem ajuda:

1. Sair do título e acertar o primeiro Errante em menos de 1 minuto.
2. Levar um golpe de cone e dizer **de que lado** tinha que ter ido.
3. Terminar a Primeira Marca, escolher um verbo de Sera e explicar o que perdeu.
4. Morrer no Arconte, renascer na entrada, e achar o ouro menor.
5. Fechar o navegador na tela de vitória e, ao continuar, ter o item.
6. Abrir inventário no meio da planície e ver o jogo parado; Esc volta sem disparar golpe.
7. Jogar 10 minutos em 390 px de largura sem a página rolar e sem botão debaixo do dedo errado.
8. Repetir a fenda e ver menos EXP do que da primeira vez.

Testes de número (EXP monotônica, forja sem saldo negativo, item equipado que não desmonta, prêmio de missão uma vez) continuam automáticos. Eles não substituem os oito acima.

Desempenho é meta, não número já medido: 60 FPS em desktop modesto na planície, 30 estáveis no celular intermediário com a qualidade baixa. Se não der, desce luz e distância de vista. Não desce a leitura do telegraph.

---

## 18. Riscos

| Risco | Sintoma | Resposta já decidida |
| --- | --- | --- |
| O prólogo é fácil demais (nível 1 mata Errante em dois golpes e aguenta ~20) | Ninguém aprende a sair do cone | O primeiro cone tutorial pode ser leve; o Arconte não pode. Não buffar o Errante a ponto de matar no minuto 1. |
| Um atributo domina | Todo mundo sobe só Força | Inteligência paga técnica e Eco; Percepção paga leitura; Vitalidade paga erro. Rever só depois de ver builds reais. |
| A escolha Libertar parece burra | Ninguém liberta, um final morre | A interferência prometida na ficha tem que ser visível (o cristal quebra). Se ainda assim for burra, aumenta o momento do final, não o % de dano. |
| Escopo volta a crescer | “Já que temos a fenda, bora pôr escolta” | A tabela da seção 5 é o não. |
| Save no meio do prêmio | Jogador perde o épico | Creditar antes da animação. Já é regra. |
| Câmera de ombro “rapidinho” | Telegraph some | Não fazer. |

---

## Apêndice A — O que a v0.1 já é

Isto não é design. É o chão. Não tratar como defeito moral; tratar como distância até a seção 3.

Já está no código do pacote v0.1: cena low poly, planície, portal, fenda de 8 abates, Arconte de um golpe telegrafado, combo, quatro técnicas, correr, três inimigos, EXP até 60, cinco atributos, ranks E–S, três slots, raridade, forja até +10, desmontar, seis contratos, Eco genérico depois do primeiro chefe, título, pause, inventário, HUD, toque básico, save com exportação, chunks de 24 m, dois LODs.

Ainda usa: defesa como redução linear (`0,28 × defesa`), crítico até 40% sem função depois do teto, Eco sem escolha, morte de volta à planície, repetir fenda sem penalidade de EXP, câmera oblíqua (isto a v1 **mantém**).

Não está: áudio, modelos animados de fora, chefe de várias fases, diálogo, os três verbos, segunda região, gamepad, PWA, árvore, conjuntos, Volume 2 inteiro.

Fórmulas ainda válidas no código, até a migração da seção 8: EXP `75 × L^1,56`; custo de forja da seção 10; raridades da seção 10.

## Apêndice B — Volume 2, compacto

Guardado para não perder, sem fingir que é a próxima sprint.

- Regiões Sal, Intervalo e Núcleo, com as ordens já nomeadas na seção 2.
- Estilos Arcanista e Guardião, quando Limiar e Tecelão tiverem sido jogados por alguém além do autor.
- Chefes Leviatã (o chão muda), Rei do Intervalo (um sinal é falso; o falso usa a mesma cor e uma forma **quebrada**, nunca outra cor — senão o daltônico perde), Reflexo (copia a última técnica usada e erra de propósito a cada terceiro golpe, para ser justo).
- Ordens de Eco além de “bater no mais próximo”, graus I–V, mais slots.
- Runas, segundo anel, conjuntos de 2 peças no máximo.
- Tipos de dano extra, só junto com um inimigo que os ensine.

Nada disso corrige um prólogo ruim. O prólogo vem antes.

---

**Manutenção:** mudança de design edita este arquivo e uma linha no topo com a data. O que foi testado de verdade vai para `ESTADO_ATUAL.md`, não para cá. Não abrir um GDD novo a cada versão.
