import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Bot, Copy, Cpu, Eye, SendHorizonal } from 'lucide-react'

const MotionDiv = motion.div

export default function WorkspacePanel({
  selectedAgent,
  logs,
  terminalRef,
  onCopyLine,
  onOpenLog,
  agents,
  selectedAgentId,
  onSelectAgent,
  prompt,
  onChangePrompt,
  onSubmit,
  promptRef,
}) {
  return (
    <div className="center-stage">
      <section className="panel command-center">
        <div className="workspace-top">
          <div className="workspace-title">
            <p>Workspace</p>
            <h3>TESS Command Center</h3>
          </div>
          <span className="live-dot">
            <Activity size={13} /> live
          </span>
        </div>

        <div className="context-bar">
          <span>
            <Bot size={14} /> {selectedAgent?.name}
          </span>
          <span>
            <Cpu size={14} /> {selectedAgent?.model}
          </span>
        </div>

        <div className="terminal" ref={terminalRef} aria-live="polite">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <MotionDiv
                key={log.id}
                className={`terminal-line line-${log.level}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <span className="terminal-time">[{log.time}]</span>
                <span className="terminal-message">{log.line}</span>
                <span className="line-actions">
                  <button
                    type="button"
                    className="line-action-btn"
                    onClick={() => onCopyLine(log.line)}
                    aria-label="Copy log line"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    type="button"
                    className="line-action-btn"
                    onClick={() => onOpenLog(log)}
                    aria-label="Open log payload"
                  >
                    <Eye size={12} />
                  </button>
                </span>
              </MotionDiv>
            ))}
          </AnimatePresence>
        </div>

        <form className="prompt-form" onSubmit={onSubmit}>
          <label>
            Agent
            <select value={selectedAgentId} onChange={(event) => onSelectAgent(event.target.value)}>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>

          <div className="prompt-model-card">
            <span className="prompt-model-label">Model</span>
            <strong>{selectedAgent?.model}</strong>
          </div>

          <label>
            Prompt
            <textarea
              ref={promptRef}
              value={prompt}
              onChange={(event) => onChangePrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              rows={4}
              placeholder="Ask an agent to execute a new task..."
            />
          </label>

          <button type="submit" className="send-btn">
            <SendHorizonal size={15} /> Send
          </button>
        </form>

        <p className="prompt-hint">Tip: use Ctrl/Cmd + K to jump to Prompt. Ctrl/Cmd + Shift + P toggles Focus Mode.</p>
      </section>
    </div>
  )
}
