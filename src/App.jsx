import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import AgentsPanel from './components/AgentsPanel'
import HeaderBar from './components/HeaderBar'
import IntroOverlay from './components/IntroOverlay'
import LogPayloadModal from './components/LogPayloadModal'
import WorkspacePanel from './components/WorkspacePanel'
import { AGENT_TASKS, HANDOFF_CHAIN, INITIAL_AGENTS, MAX_LOG_ENTRIES } from './constants/agents'
import { dependencyLabel, formatTime, formatUsd, pickLine } from './utils/ui'

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    const savedTheme = window.localStorage.getItem('tess_theme')
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  const [agents, setAgents] = useState(INITIAL_AGENTS)
  const [selectedAgentId, setSelectedAgentId] = useState(INITIAL_AGENTS[0].id)
  const [prompt, setPrompt] = useState('')
  const [burstAgentId, setBurstAgentId] = useState(null)
  const [presentationMode, setPresentationMode] = useState(false)
  const [activeLog, setActiveLog] = useState(null)
  const [showIntro, setShowIntro] = useState(true)
  const [introTilt, setIntroTilt] = useState({ x: 0, y: 0 })
  const [hasWebGL] = useState(() => {
    if (typeof document === 'undefined') return false
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return Boolean(gl)
  })
  const terminalRef = useRef(null)
  const promptRef = useRef(null)
  const [logs, setLogs] = useState([
    {
      id: crypto.randomUUID(),
      time: formatTime(),
      level: 'system',
      line: 'TESS Command Center initialized. Multi-agent stream is live.',
      payload: { type: 'system.boot', detail: 'Command center startup completed' },
    },
    {
      id: crypto.randomUUID(),
      time: formatTime(),
      level: 'agent',
      line: 'Nova Designer is validating color contrast in dark and light themes.',
      payload: {
        type: 'agent.activity',
        agentId: 'nova',
        model: 'Claude 3.7 Sonnet',
        detail: 'Contrast audit in progress',
      },
    },
  ])

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId),
    [agents, selectedAgentId],
  )
  const sessionCost = useMemo(() => agents.reduce((sum, agent) => sum + agent.cost, 0), [agents])
  const logoSrc = theme === 'dark' ? '/assets/tess-logo-light.svg' : '/assets/tess-logo-dark.svg'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('tess_theme', theme)
  }, [theme])

  useEffect(() => {
    if (!showIntro) return
    const timer = window.setTimeout(() => setShowIntro(false), 2800)
    return () => window.clearTimeout(timer)
  }, [showIntro])

  useEffect(() => {
    if (!terminalRef.current) return
    terminalRef.current.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' })
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

        if (!candidateIndexes.length) return prevAgents

        const picked = candidateIndexes[Math.floor(Math.random() * candidateIndexes.length)]
        const nextAgents = [...prevAgents]
        const target = { ...nextAgents[picked.index] }

        const beforeStatus = target.status
        let nextStatus = target.status
        let nextProgress = target.progress
        let nextTokens = target.tokens
        let nextTps = target.tps
        let nextCost = target.cost

        if (target.status === 'thinking') {
          nextProgress = Math.min(100, target.progress + 10 + Math.floor(Math.random() * 12))
          nextStatus = nextProgress > 34 ? 'executing' : 'thinking'
          nextTps = 0
        } else if (target.status === 'executing') {
          nextProgress = Math.min(100, target.progress + 12 + Math.floor(Math.random() * 15))
          nextStatus = nextProgress >= 100 ? 'done' : 'executing'
          nextTps = 30 + Math.floor(Math.random() * 28)
          nextTokens += nextTps
          nextCost += nextTps * 0.000018
        } else {
          const shouldRestart = Math.random() > 0.72
          if (!shouldRestart) return prevAgents
          nextStatus = 'thinking'
          nextProgress = 8
          nextTps = 0
          target.taskCursor = (target.taskCursor + 1) % AGENT_TASKS[target.id].length
          target.currentTask = AGENT_TASKS[target.id][target.taskCursor]
        }

        Object.assign(target, {
          status: nextStatus,
          progress: nextProgress,
          tokens: nextTokens,
          tps: nextTps,
          cost: Number(nextCost.toFixed(3)),
        })
        nextAgents[picked.index] = target

        setLogs((prevLogs) => {
          const nextLogs = [
            ...prevLogs,
            {
              id: crypto.randomUUID(),
              time: formatTime(),
              level: nextStatus === 'done' ? 'success' : 'agent',
              line: pickLine(target, nextStatus),
              payload: {
                type: 'agent.update',
                agentId: target.id,
                model: target.model,
                status: nextStatus,
                progress: nextProgress,
                tokens: nextTokens,
                tokensPerSecond: nextTps,
                usdCost: target.cost,
                task: target.currentTask,
              },
            },
          ]
          return nextLogs.slice(-MAX_LOG_ENTRIES)
        })

        if (beforeStatus === 'executing' && nextStatus === 'done') {
          const nextAgentId = HANDOFF_CHAIN[target.id]
          if (nextAgentId) {
            setLogs((prevLogs) => {
              const downstream = nextAgents.find((agent) => agent.id === nextAgentId)
              const nextLogs = [
                ...prevLogs,
                {
                  id: crypto.randomUUID(),
                  time: formatTime(),
                  level: 'system',
                  line: `[SYSTEM] Output from ${target.name} passed to ${downstream?.name}.`,
                  payload: {
                    type: 'agent.handoff',
                    from: target.id,
                    to: nextAgentId,
                    fromName: target.name,
                    toName: downstream?.name,
                  },
                },
              ]
              return nextLogs.slice(-MAX_LOG_ENTRIES)
            })
          }
        }

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
    if (!prompt.trim() || !selectedAgent) return

    setAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id !== selectedAgentId
          ? agent
          : {
              ...agent,
              status: 'thinking',
              progress: 6,
              currentTask: prompt.trim(),
            },
      ),
    )

    setBurstAgentId(selectedAgentId)
    window.setTimeout(() => setBurstAgentId(null), 850)

    setLogs((prevLogs) => {
      const nextLogs = [
        ...prevLogs,
        {
          id: crypto.randomUUID(),
          time: formatTime(),
          level: 'prompt',
          line: `Instruction sent to ${selectedAgent.name}: "${prompt.trim()}"`,
          payload: {
            type: 'prompt.dispatch',
            targetAgent: selectedAgent.id,
            targetName: selectedAgent.name,
            model: selectedAgent.model,
            prompt: prompt.trim(),
          },
        },
      ]
      return nextLogs.slice(-MAX_LOG_ENTRIES)
    })

    setPrompt('')
  }

  const handleCopyLine = async (line) => {
    try {
      await navigator.clipboard.writeText(line)
    } catch {
      // no-op clipboard fallback
    }
  }

  return (
    <div className="app-shell">
      <IntroOverlay
        showIntro={showIntro}
        hasWebGL={hasWebGL}
        theme={theme}
        logoSrc={logoSrc}
        introTilt={introTilt}
        onMouseMove={(event) => {
          const { innerWidth, innerHeight } = window
          const x = ((event.clientY / innerHeight) - 0.5) * -12
          const y = ((event.clientX / innerWidth) - 0.5) * 12
          setIntroTilt({ x, y })
        }}
      />

      <div className="texture" />

      <HeaderBar
        logoSrc={logoSrc}
        sessionCostLabel={formatUsd(sessionCost)}
        presentationMode={presentationMode}
        onTogglePresentation={() => setPresentationMode((current) => !current)}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />

      <main className={`grid-layout content-shell ${presentationMode ? 'presentation' : ''}`}>
        <AgentsPanel
          agents={agents}
          selectedAgentId={selectedAgentId}
          burstAgentId={burstAgentId}
          presentationMode={presentationMode}
          onSelectAgent={setSelectedAgentId}
          dependencyLabel={dependencyLabel}
        />

        <WorkspacePanel
          selectedAgent={selectedAgent}
          logs={logs}
          terminalRef={terminalRef}
          onCopyLine={handleCopyLine}
          onOpenLog={setActiveLog}
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          prompt={prompt}
          onChangePrompt={setPrompt}
          onSubmit={handlePromptSubmit}
          promptRef={promptRef}
        />
      </main>

      <LogPayloadModal activeLog={activeLog} onClose={() => setActiveLog(null)} />
    </div>
  )
}

export default App
