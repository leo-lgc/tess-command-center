# TESS Command Center

Interface em React para visualizacao e controle de agentes de IA em paralelo, com foco em design de alto impacto para contexto enterprise.

## Stack

- React + Vite
- Framer Motion para micro-interacoes e transicoes
- Lucide React para iconografia
- Dados mockados em memoria (sem backend)

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

## Funcionalidades implementadas

- Feed de agentes ativos com nome, status (`thinking`, `executing`, `done`), progresso e modelo de LLM.
- Log em tempo real no estilo terminal elegante com stream mockado por `setInterval`.
- Quick Prompt para enviar nova instrucao a um agente especifico.
- Indicador de modelo em cada card e no painel de foco do agente selecionado.
- Tema `dark/light` com tokens de design para reforcar maturidade de sistema visual.

## Micro-interacao surpresa

Quando um agente troca de estado ou recebe novo prompt, o card dispara um efeito de `resonance burst` animado (pulso radial) sincronizado com a entrada no log em tempo real. Isso cria uma sensacao de evento vivo, nao apenas atualizacao de texto.

## Ferramentas de IA usadas

- ChatGPT para acelerar ideacao de arquitetura da interface e refinamento de copy dos estados.
- IA para apoio no desenho de tokens de design (dark/light) e consolidacao de hierarquia visual.

## Decisao de UX e por que

Escolhi separar a tela em tres zonas claras (agentes, terminal e dispatch de prompt) para manter leitura operacional em poucos segundos.

Motivo: em cenarios com multiplos agentes, o usuario precisa identificar rapido `quem esta fazendo o que`, `se esta funcionando`, e `como intervir` sem trocar de contexto.

## O que eu faria com mais tempo

- Persistencia dos eventos e filtros por agente/modelo/status no log.
- Modo de comparacao entre outputs de modelos (ex: GPT x Claude x Gemini).
- Instrumentacao de acessibilidade avancada (atalhos de teclado e narracao de eventos em ARIA live).
- Empty/loading/error states mais completos para cobrirem comportamento real de integracao.
