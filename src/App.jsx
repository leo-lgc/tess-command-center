import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Bot,
  Cpu,
  Eye,
  EyeOff,
  MoonStar,
  SendHorizonal,
  Sun,
} from 'lucide-react'
import './App.css'

const IntroLogoScene = lazy(() => import('./components/IntroLogoScene'))

const STATUS_LABEL = {
  thinking: 'thinking',
  executing: 'executing',
  done: 'done',
}

const STATUS_CLASS = {
  thinking: 'status-thinking',
  executing: 'status-executing',
  done: 'status-done',
}

const AGENT_TASKS = {
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

const INITIAL_AGENTS = [
  {
    id: 'atlas',
    name: 'Atlas Strategist',
    model: 'GPT-4.1',
    status: 'thinking',
    progress: 18,
    taskCursor: 0,
    currentTask: AGENT_TASKS.atlas[0],
  },
  {
    id: 'nova',
    name: 'Nova Designer',
    model: 'Claude 3.7 Sonnet',
    status: 'executing',
    progress: 54,
    taskCursor: 1,
    currentTask: AGENT_TASKS.nova[1],
  },
  {
    id: 'pulse',
    name: 'Pulse Analyst',
    model: 'Gemini 2.0 Pro',
    status: 'executing',
    progress: 71,
    taskCursor: 2,
    currentTask: AGENT_TASKS.pulse[2],
  },
  {
    id: 'relay',
    name: 'Relay Ops',
    model: 'Llama 3.3 70B',
    status: 'thinking',
    progress: 24,
    taskCursor: 0,
    currentTask: AGENT_TASKS.relay[0],
  },
]

const MotionArticle = motion.article
const MotionSpan = motion.span
const MotionDiv = motion.div
const MotionParagraph = motion.p
const MotionImg = motion.img

const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const pickLine = (agent, nextStatus) => {
  if (nextStatus === 'thinking') {
    return `${agent.name} is interpreting constraints before execution.`
  }

  if (nextStatus === 'done') {
    return `${agent.name} delivered output package and is awaiting next prompt.`
  }

  return `${agent.name} is running: ${agent.currentTask}`
}

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    const savedTheme = window.localStorage.getItem('tess_theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  const [agents, setAgents] = useState(INITIAL_AGENTS)
  const [selectedAgentId, setSelectedAgentId] = useState(INITIAL_AGENTS[0].id)
  const [prompt, setPrompt] = useState('')
  const [burstAgentId, setBurstAgentId] = useState(null)
  const [presentationMode, setPresentationMode] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [hasWebGL] = useState(() => {
    if (typeof document === 'undefined') {
      return false
    }

    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return Boolean(gl)
  })
  const [introTilt, setIntroTilt] = useState({ x: 0, y: 0 })
  const terminalRef = useRef(null)
  const promptRef = useRef(null)
  const [logs, setLogs] = useState([
    {
      id: crypto.randomUUID(),
      time: formatTime(),
      level: 'system',
      line: 'TESS Command Center initialized. Multi-agent stream is live.',
    },
    {
      id: crypto.randomUUID(),
      time: formatTime(),
      level: 'agent',
      line: 'Nova Designer is validating color contrast in dark and light themes.',
    },
  ])

  const selectedAgent = useMemo(() => {
    return agents.find((agent) => agent.id === selectedAgentId)
  }, [agents, selectedAgentId])

  const logoSrc = theme === 'dark' ? '/assets/tess-logo-light.svg' : '/assets/tess-logo-dark.svg'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('tess_theme', theme)
  }, [theme])

  useEffect(() => {
    if (!showIntro) {
      return
    }

    const timer = window.setTimeout(() => {
      setShowIntro(false)
    }, 2800)

    return () => window.clearTimeout(timer)
  }, [showIntro])

  useEffect(() => {
    if (!terminalRef.current) {
      return
    }

    terminalRef.current.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [logs])

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        promptRef.current?.focus()
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault()
        setPresentationMode((current) => !current)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAgents((prevAgents) => {
        const candidateIndexes = prevAgents
          .map((agent, index) => ({ agent, index }))
          .filter(({ agent }) => agent.status !== 'done' || Math.random() > 0.7)

        if (!candidateIndexes.length) {
          return prevAgents
        }

        const picked = candidateIndexes[Math.floor(Math.random() * candidateIndexes.length)]
        const nextAgents = [...prevAgents]
        const target = { ...nextAgents[picked.index] }

        const beforeStatus = target.status
        let nextStatus = target.status
        let nextProgress = target.progress

        if (target.status === 'thinking') {
          nextProgress = Math.min(100, target.progress + 10 + Math.floor(Math.random() * 12))
          nextStatus = nextProgress > 34 ? 'executing' : 'thinking'
        } else if (target.status === 'executing') {
          nextProgress = Math.min(100, target.progress + 12 + Math.floor(Math.random() * 15))
          nextStatus = nextProgress >= 100 ? 'done' : 'executing'
        } else {
          const shouldRestart = Math.random() > 0.72
          if (!shouldRestart) {
            return prevAgents
          }

          nextStatus = 'thinking'
          nextProgress = 8
          target.taskCursor = (target.taskCursor + 1) % AGENT_TASKS[target.id].length
          target.currentTask = AGENT_TASKS[target.id][target.taskCursor]
        }

        target.status = nextStatus
        target.progress = nextProgress
        nextAgents[picked.index] = target

        const line = pickLine(target, nextStatus)
        setLogs((prevLogs) => {
          const nextLogs = [
            ...prevLogs,
            {
              id: crypto.randomUUID(),
              time: formatTime(),
              level: nextStatus === 'done' ? 'success' : 'agent',
              line,
            },
          ]

          return nextLogs.slice(-14)
        })

        if (beforeStatus !== nextStatus) {
          setBurstAgentId(target.id)
          window.setTimeout(() => setBurstAgentId(null), 850)
        }

        return nextAgents
      })
    }, 2200)

    return () => window.clearInterval(timer)
  }, [])

  const handlePromptSubmit = (event) => {
    event.preventDefault()

    if (!prompt.trim() || !selectedAgent) {
      return
    }

    setAgents((prevAgents) => {
      return prevAgents.map((agent) => {
        if (agent.id !== selectedAgentId) {
          return agent
        }

        return {
          ...agent,
          status: 'thinking',
          progress: 6,
          currentTask: prompt.trim(),
        }
      })
    })

    setBurstAgentId(selectedAgentId)
    window.setTimeout(() => setBurstAgentId(null), 850)

    const newLogId = crypto.randomUUID()

    setLogs((prevLogs) => {
      const nextLogs = [
        ...prevLogs,
        {
          id: newLogId,
          time: formatTime(),
          level: 'prompt',
          line: `Instruction sent to ${selectedAgent.name}: "${prompt.trim()}"`,
        },
      ]

      return nextLogs.slice(-14)
    })

    setPrompt('')
  }

  return (
    <div className="app-shell">
      <AnimatePresence>
        {showIntro ? (
          <MotionDiv
            className="intro-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onMouseMove={(event) => {
              const { innerWidth, innerHeight } = window
              const x = ((event.clientY / innerHeight) - 0.5) * -12
              const y = ((event.clientX / innerWidth) - 0.5) * 12
              setIntroTilt({ x, y })
            }}
          >
            {hasWebGL ? (
              <div className="intro-canvas-wrap">
                <Suspense fallback={null}>
                  <IntroLogoScene theme={theme} />
                </Suspense>
              </div>
            ) : null}

            <MotionDiv
              className="intro-logo-shell"
              initial={{ opacity: 0, scale: 0.93, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -6 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              style={{
                transform: `perspective(900px) rotateX(${introTilt.x}deg) rotateY(${introTilt.y}deg)`,
              }}
            >
              <MotionImg
                src={logoSrc}
                alt="TESS"
                className="intro-logo"
                initial={{ opacity: 0, filter: 'blur(7px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.18, duration: 0.48 }}
              />
              <p className="intro-caption">Command Center</p>
            </MotionDiv>
          </MotionDiv>
        ) : null}
      </AnimatePresence>

      <div className="texture" />

      <div className="header-shell">
        <header className="topbar">
          <div className="brand">
            <img className="brand-logo" src={logoSrc} alt="TESS" />
            <p className="eyebrow">Command Center</p>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="mode-toggle"
              onClick={() => setPresentationMode((current) => !current)}
            >
              {presentationMode ? <Eye size={16} /> : <EyeOff size={16} />}
              {presentationMode ? 'Exit Focus' : 'Focus Mode'}
            </button>

            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? <Sun size={16} /> : <MoonStar size={16} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </header>
      </div>

      <main className={`grid-layout content-shell ${presentationMode ? 'presentation' : ''}`}>
        <section
          className={`panel agent-feed ${presentationMode ? 'is-hidden' : ''}`}
          aria-hidden={presentationMode}
        >
          <div className="panel-header">
            <h2>Agents</h2>
            <span>{agents.length} online</span>
          </div>

          <div className="agent-list">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId
              const isBursting = burstAgentId === agent.id

              return (
                <MotionArticle
                  layout
                  key={agent.id}
                  className={`agent-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedAgentId(agent.id)}
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
                    <span className={`status-pill ${STATUS_CLASS[agent.status]}`}>
                      {STATUS_LABEL[agent.status]}
                    </span>
                  </div>

                  <div className="agent-meta">
                    <span>
                      <Cpu size={14} /> {agent.model}
                    </span>
                    <span>{agent.progress}%</span>
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
            })}
          </div>
        </section>

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
                  </MotionDiv>
                ))}
              </AnimatePresence>
            </div>

            <form className="prompt-form" onSubmit={handlePromptSubmit}>
              <label>
                Agent
                <select
                  value={selectedAgentId}
                  onChange={(event) => setSelectedAgentId(event.target.value)}
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Prompt
                <textarea
                  ref={promptRef}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
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
      </main>
    </div>
  )
}

export default App
