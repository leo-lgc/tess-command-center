import AgentCard from './AgentCard'

export default function AgentsPanel({
  agents,
  selectedAgentId,
  burstAgentId,
  presentationMode,
  onSelectAgent,
  dependencyLabel,
}) {
  return (
    <section className={`panel agent-feed ${presentationMode ? 'is-hidden' : ''}`} aria-hidden={presentationMode}>
      <div className="panel-header">
        <h2>Agents</h2>
        <span>{agents.length} online</span>
      </div>

      <div className="agent-list">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={agent.id === selectedAgentId}
            isBursting={burstAgentId === agent.id}
            dependency={dependencyLabel(agent, agents)}
            onSelect={() => onSelectAgent(agent.id)}
          />
        ))}
      </div>
    </section>
  )
}
