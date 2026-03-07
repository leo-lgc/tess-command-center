import { Eye, EyeOff, MoonStar, Sun } from 'lucide-react'

export default function HeaderBar({
  logoSrc,
  sessionCostLabel,
  presentationMode,
  onTogglePresentation,
  theme,
  onToggleTheme,
}) {
  return (
    <div className="header-shell">
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src={logoSrc} alt="TESS" />
          <p className="eyebrow">Command Center</p>
        </div>

        <div className="topbar-actions">
          <div className="cost-monitor">Session Cost {sessionCostLabel}</div>

          <button type="button" className="mode-toggle" onClick={onTogglePresentation}>
            {presentationMode ? <Eye size={16} /> : <EyeOff size={16} />}
            {presentationMode ? 'Exit Focus' : 'Focus Mode'}
          </button>

          <button type="button" className="theme-toggle" onClick={onToggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <MoonStar size={16} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </header>
    </div>
  )
}
