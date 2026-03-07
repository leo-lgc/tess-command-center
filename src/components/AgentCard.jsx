import { AnimatePresence, motion } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { STATUS_CLASS, STATUS_LABEL } from '../constants/agents'
import { formatUsd, modelGlowColor } from '../utils/ui'

const MotionArticle = motion.article
const MotionSpan = motion.span
const MotionDiv = motion.div
const MotionParagraph = motion.p

export default function AgentCard({ agent, isSelected, isBursting, dependency, onSelect }) {
  return (
    <MotionArticle
      layout
      className={`agent-card ${isSelected ? 'selected' : ''} ${agent.status === 'executing' ? 'is-executing' : ''}`}
      style={{ '--model-glow': modelGlowColor(agent.model) }}
      onClick={onSelect}
    >
      <AnimatePresence>
        {isBursting ? (
          <MotionSpan
            className="burst"
            initial={{ opacity: 0.5, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ) : null}
      </AnimatePresence>

      <div className="agent-top">
        <div>
          <p className="agent-name">{agent.name}</p>
          <div className="agent-task-wrap">
            <AnimatePresence mode="wait" initial={false}>
              <MotionParagraph
                key={agent.currentTask}
                className="agent-task"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {agent.currentTask}
              </MotionParagraph>
            </AnimatePresence>
          </div>
        </div>
        <span className={`status-pill ${STATUS_CLASS[agent.status]}`}>{STATUS_LABEL[agent.status]}</span>
      </div>

      {dependency ? <p className="dependency-tag">{dependency}</p> : null}

      <div className="agent-meta">
        <span>
          <Cpu size={14} /> {agent.model}
        </span>
        <span>{agent.progress}%</span>
      </div>

      <div className="agent-telemetry">
        <span>{agent.tokens.toLocaleString('pt-BR')} tokens</span>
        <span>{formatUsd(agent.cost)}</span>
      </div>

      <div className="progress-track">
        <MotionDiv
          className="progress-fill"
          animate={{ width: `${agent.progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </MotionArticle>
  )
}
