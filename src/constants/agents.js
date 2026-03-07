export const STATUS_LABEL = {
  thinking: 'thinking',
  executing: 'executing',
  done: 'done',
}

export const STATUS_CLASS = {
  thinking: 'status-thinking',
  executing: 'status-executing',
  done: 'status-done',
}

export const HANDOFF_CHAIN = {
  atlas: 'nova',
  nova: 'pulse',
  pulse: 'relay',
}

export const MAX_LOG_ENTRIES = 28

export const AGENT_TASKS = {
  atlas: [
    'Cross-checking competitor landing pages',
    'Scoring UX benchmark against enterprise leaders',
    'Building summary matrix for stakeholder review',
  ],
  nova: [
    'Generating hero typography options',
    'Validating color contrast in dark and light themes',
    'Running responsive sanity pass for 320px to 1440px',
  ],
  pulse: [
    'Parsing campaign metrics and confidence intervals',
    'Mapping outlier spikes to source channels',
    'Preparing recommendation deck for growth squad',
  ],
  relay: [
    'Organizing deployment checklist for command center',
    'Auditing event stream format and payload quality',
    'Compiling final handoff notes for QA',
  ],
}

export const INITIAL_AGENTS = [
  {
    id: 'atlas',
    name: 'Atlas Strategist',
    model: 'GPT-4.1',
    status: 'thinking',
    progress: 18,
    tokens: 118,
    tps: 0,
    cost: 0.012,
    taskCursor: 0,
    currentTask: AGENT_TASKS.atlas[0],
  },
  {
    id: 'nova',
    name: 'Nova Designer',
    model: 'Claude 3.7 Sonnet',
    status: 'executing',
    progress: 54,
    tokens: 742,
    tps: 45,
    cost: 0.061,
    taskCursor: 1,
    currentTask: AGENT_TASKS.nova[1],
  },
  {
    id: 'pulse',
    name: 'Pulse Analyst',
    model: 'Gemini 2.0 Pro',
    status: 'executing',
    progress: 71,
    tokens: 964,
    tps: 52,
    cost: 0.074,
    taskCursor: 2,
    currentTask: AGENT_TASKS.pulse[2],
  },
  {
    id: 'relay',
    name: 'Relay Ops',
    model: 'Llama 3.3 70B',
    status: 'thinking',
    progress: 24,
    tokens: 196,
    tps: 0,
    cost: 0.017,
    taskCursor: 0,
    currentTask: AGENT_TASKS.relay[0],
  },
]
