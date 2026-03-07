import { HANDOFF_CHAIN } from '../constants/agents'

export const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export const formatUsd = (value) => `$${value.toFixed(3)}`

export const modelGlowColor = (model) => {
  if (model.includes('Claude')) return '#4da9ff'
  if (model.includes('GPT')) return '#8c6bff'
  if (model.includes('Gemini')) return '#25d39c'
  return '#61d5ad'
}

export const dependencyLabel = (agent, allAgents) => {
  const upstreamId = Object.keys(HANDOFF_CHAIN).find((key) => HANDOFF_CHAIN[key] === agent.id)
  const downstreamId = HANDOFF_CHAIN[agent.id]

  if (upstreamId) {
    const upstream = allAgents.find((item) => item.id === upstreamId)
    if (upstream && upstream.status !== 'done') {
      return `Waiting for ${upstream.name.split(' ')[0]}`
    }
  }

  if (agent.status === 'done' && downstreamId) {
    const downstream = allAgents.find((item) => item.id === downstreamId)
    if (downstream) {
      return `Feeding ${downstream.name.split(' ')[0]}`
    }
  }

  return null
}

export const pickLine = (agent, nextStatus) => {
  if (nextStatus === 'thinking') {
    return `${agent.name} is interpreting constraints before execution.`
  }

  if (nextStatus === 'done') {
    return `${agent.name} delivered output package and is awaiting next prompt.`
  }

  return `${agent.name} is running: ${agent.currentTask}`
}
