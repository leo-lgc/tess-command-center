# TESS Command Center

Interface em React para visualizacao e acompanhamento de multiplos agentes de IA em paralelo, com foco em uma linguagem premium, operacional e enterprise-first.

## Stack

- React + Vite
- Framer Motion para transicoes e micro-interacoes
- Three.js com `@react-three/fiber` e `@react-three/drei` para a intro imersiva
- Lucide React para iconografia
- Dados 100% mockados em memoria (sem backend)

## Como rodar localmente

```bash
npm install
npm run dev
```

Build de producao:

```bash
npm run build
npm run preview
```

## O que foi implementado

- Feed de agentes ativos com nome, status (`thinking`, `executing`, `done`), progresso, modelo e estado visual selecionado.
- Log em tempo real no estilo terminal elegante com atualizacao mockada via `setInterval`.
- Quick Prompt para disparar uma nova instrucao para um agente especifico.
- Suporte a `dark/light mode`, com intro e identidade visual adaptadas aos dois temas.
- Focus Mode para apresentacao, priorizando o workspace.
- Telemetria de operacao com `tokens`, custo por agente e `Session Cost` no topo.
- Handoff entre agentes no log, reforcando a ideia de fluxo multi-agent.
- Log interativo com copia rapida e visualizacao de payload bruto em modal.

## Micro-interacao surpresa

- Intro imersiva com Three.js: logo da TESS em uma cena 3D minimal com profundidade, particulas e padrao pontilhado responsivo ao tema.
- Glow de execucao nos agentes ativos, com acento visual variando conforme o modelo em uso.

## Atalhos

- `Ctrl/Cmd + K`: foca no campo de Prompt
- `Enter`: envia o prompt rapidamente
- `Ctrl/Cmd + Shift + P`: ativa/desativa o Focus Mode

## Decisao de UX

Escolhi separar a tela em duas camadas de leitura: uma visao lateral de agentes para awareness operacional e um workspace central para observacao e intervencao.

Motivo: em um contexto de plataforma corporativa, o usuario precisa entender rapidamente `quem esta executando`, `qual modelo esta em uso`, `quanto isso esta consumindo` e `quando intervir`, sem perder o foco na atividade principal.

## Ferramentas de IA usadas

- ChatGPT para ideacao de arquitetura, refinamento de copy e apoio na organizacao das iteracoes.
- IA para acelerar exploracao visual, tokens de interface e alternativas de micro-interacao.

## Roteiro rapido de demonstracao (2-3 min)

- Abra a aplicacao e mostre a intro 3D com identidade da TESS.
- Mostre `dark/light mode` e o favicon/logo integrados a marca.
- Dispare prompts para agentes diferentes e destaque o log em tempo real.
- Aponte a telemetria (`tokens`, custo e Session Cost) e o handoff entre agentes.
- Mostre o Focus Mode e os atalhos de operacao.
- Passe o mouse em uma linha do log para abrir payload ou copiar output.

## O que eu faria com mais tempo

- Persistencia dos eventos e filtros avancados por agente, modelo, severidade e custo.
- Timeline visual de handoff entre agentes e mapa mais explicito de dependencias.
- Comparacao de output entre modelos (ex: GPT x Claude x Gemini) dentro do mesmo fluxo.
- Estados mais completos de loading, erro e reconexao para simular integracao real.
- Instrumentacao de acessibilidade avancada, incluindo narracao de eventos e melhor navegacao por teclado.
