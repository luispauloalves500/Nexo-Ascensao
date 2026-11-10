# NEXO: ASCENSÃO — RPG de ação 3D original

**Three.js + Vite · GitHub Pages · código modular · v0.1.0**

Jogo de fantasia de progressão com combate em terceira pessoa, criaturas, fendas, XP, atributos, equipamentos, forja e aliados invocados chamados **Ecos**. É um universo original e não reutiliza personagens, nomes, músicas ou artes de outras franquias.

> **Importante:** este pacote contém uma **base de jogo jogável em código**, preparada para compilação e publicação. Não é a campanha completa prevista no GDD. Os 7 testes automatizados de regras, save e renderizadores de painéis passaram no ambiente de geração; **não foi possível executar o build gráfico nem validar a renderização real aqui**, pois as dependências do npm não estavam disponíveis para instalação local. A etapa final de validação deve ocorrer no seu computador ou no GitHub Actions.

## Arquivos mais importantes

- **`docs/GDD_COMPLETO.md`** — conteúdo total planejado: história, capítulos, 30 fendas, progressão, classes, skills, combate, chefes, menus, pause, inventário e sistemas.
- **`docs/ARQUITETURA_TECNICA.md`** — arquitetura modular, streaming por chunks, LOD, instancing, gerenciamento de memória e orçamentos de FPS.
- **`docs/ESTADO_ATUAL.md`** — o que está implementado vs. planejado, com testes realizados e limitações conhecidas.
- **`docs/TESTES_MANUAIS.md`** — checklist para conferir a versão publicada.
- **`src/`** — código dividido em módulos; **não é um arquivo HTML único**.

## Jogar localmente (Windows, macOS ou Linux)

1. Instale Node.js 22 ou superior.
2. Extraia todos os arquivos preservando pastas.
3. Abra um terminal na pasta onde está `package.json`.
4. Execute:

```bash
npm install
npm run dev
```

5. Abra o endereço mostrado no terminal (normalmente `http://localhost:5173/`).

Para preparar distribuição:

```bash
npm test
npm run build
npm run preview
```

A pasta `dist/` é a versão compilada **estática**. O build empacota Three.js e o código para rodar sem importar JS de CDNs externos.

## Publicar no GitHub Pages sem mexer em código

1. Crie um repositório GitHub, por exemplo `Nexo-Ascensao`.
2. Coloque **todos** os arquivos deste pacote na raiz do repositório: `index.html`, `package.json`, `vite.config.js`, `src/`, `styles/`, `public/`, `.github/`, `docs/`, `tests/`.
3. Acesse **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Faça um commit na branch `main` (ou `master`).
5. Veja **Actions → Build and publish GitHub Pages**. A ação instala dependências, roda testes, gera `dist/` e publica o site.
6. Abra `https://SEU-USUARIO.github.io/Nexo-Ascensao/` após o deploy ficar verde.

**Atenção:** não publique o código-fonte puro via **Deploy from a branch** como se fosse build pronto. `index.html` importa módulos que dependem do `three` via Vite. Para usar branch estática sem Actions, publique o conteúdo de `dist/` depois do `npm run build` no computador.

O `vite.config.js` usa `base: './'` para os recursos continuarem funcionando quando o repositório é servido em `/<nome-do-repo>/`.

## Comandos do jogo

| Tecla | Ação |
| --- | --- |
| WASD / setas | Andar |
| Mouse | Mirar |
| Clique esquerdo | Atacar (combo) |
| Shift | Correr |
| 1–4 | Técnicas de combate |
| R | Invocar Eco (após primeiro chefe) |
| E | Entrar/sair do portal |
| I | Inventário, equipar, forjar, desmontar |
| C | Atributos |
| K | Técnicas |
| J | Missões e recompensas |
| M | Mapa e fendas |
| Esc/P | Pausar e retomar |

Em celular há joystick e botões virtuais de ataque, 1–4, Eco, interação e pause. O jogo ainda precisa de teste prático em aparelhos variados; o GDD lista o plano de refinamento mobile.

## Como evoluir o jogo sem bagunçar o projeto

- Adicione novas armas, inimigos e técnicas inicialmente em `src/data/balance.js`.
- Modifique regras numéricas em `src/systems/Progression.js` e mantenha testes em `tests/`.
- Adicione biomas e objetos no módulo `src/world/World.js`; para mapas grandes, use a arquitetura incremental descrita no documento técnico.
- Para NPCs/GLB, crie módulos de asset loading e novas entidades; não coloque toda a lógica em `main.js`.
- Corrija navegação/HUD em `src/ui/UI.js`, telas específicas em `src/ui/views/` e estilos separados em `styles/base.css`, `hud.css`, `panels.css` e `responsive.css`. Não despeje novas páginas dentro do controlador de HUD.
- Altere a versão e atualize `docs/ESTADO_ATUAL.md` com **testes que de fato foram executados**, não apenas funcionalidades desejadas.

## Limitações explícitas da v0.1.0

Não inclui música, sons externos, modelos GLB rigados, campanha de 5 atos, 30 fendas, boss multifase, PWA offline, gamepad completo ou texturas cinematográficas. Os itens, a câmera, a IA e o combate são uma demonstração funcional de código a validar visualmente. Não é um produto final certificado.

**Licença:** código original desta demonstração fornecido para evolução do projeto; dependências externas mantêm suas próprias licenças (Three.js: MIT). Ao incorporar artes, músicas e modelos externos, registrar origem e licença no repositório.
