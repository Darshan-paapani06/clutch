import { GitBranch, Terminal, Zap, Activity, ArrowRight } from 'lucide-react'
import { useAuthentication } from '../hooks/useAuthentication'
import { Navigate } from 'react-router-dom'
import NavigationBar from '../components/layout/NavigationBar'
import { API_BASE_URL, GITHUB_REPOSITORY_URL } from '../constants/config.constants'

export default function LandingPage() {
  const { user } = useAuthentication()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <NavigationBar rightContent={
        <>
          <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="btn-nb btn-ghost" style={{ fontSize: '12px', padding: '6px 14px' }}>GitHub</a>
          <a href={`${API_BASE_URL}/auth/github`} className="btn-nb btn-purple">
            <GitBranch size={13} /> Connect GitHub
          </a>
        </>
      } />

      <main style={{ flex: 1, maxWidth: '1080px', margin: '0 auto', width: '100%', padding: '72px 32px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>

        {/* LEFT */}
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <span className="tag tag-purple">Open Source</span>
            <span className="tag tag-outline">Free Forever</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', lineHeight: '1.2', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Track Your Developer
          </h1>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', lineHeight: '1.2', color: 'var(--accent-pink)', marginBottom: '24px' }}>
            Momentum.
          </h1>

          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '32px', maxWidth: '500px' }}>
            Lower the friction between developer and their personal growth.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <a href={`${API_BASE_URL}/auth/github`} className="btn-nb btn-dark">
              <GitBranch size={14} /> Get Started <ArrowRight size={13} />
            </a>
            <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="btn-nb btn-ghost">
              View on GitHub
            </a>
          </div>

          {/* MINI STAT ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1px', background: 'var(--border)', border: '2px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            {[
              { label: 'access clutch in your terminal', value: 'Command Line Interface' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-card)', padding: '12px 14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--bg-panel)', border: '1px solid var(--border-light)' }}>
            $ pip install clutch-cli
          </div>
        </div>

        {/* RIGHT — terminal */}
        <div>
          <div className="terminal">
            <div className="terminal-bar">
              <div className="terminal-dot" style={{ background: '#e8185a' }} />
              <div className="terminal-dot" style={{ background: '#d97706' }} />
              <div className="terminal-dot" style={{ background: '#059669' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4a4a6a', marginLeft: '8px' }}>clutch — terminal</span>
            </div>
            {[
              { type: 'cmd', text: '$ clutch streak' },
              { type: 'out', text: '◆ Current Streak: 12 days' },
              { type: 'out', text: '◆ Longest Streak: 24 days' },
              { type: 'cmd', text: '$ clutch insight' },
              { type: 'out', text: '◆ Strong week — 47 commits' },
              { type: 'comment', text: '  Most active: Tuesday' },
              { type: 'comment', text: '  Top repo: clutch' },
              { type: 'cmd', text: '$ clutch stats --days 30' },
              { type: 'out', text: '◆ 183 commits · 12 PRs' },
              { type: 'out', text: '◆ 28 active days / 30' },
            ].map((line, i) => (
              <div key={i} className="terminal-line">
                <span className={line.type}>{line.text}</span>
              </div>
            ))}
            <div className="terminal-line"><span className="cmd">$ <span className="blink">_</span></span></div>
          </div>

          {/* FEATURES below terminal */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px' }}>
            {[
              { icon: <Activity size={16} />, label: 'Streaks', color: 'var(--accent-purple)' },
              { icon: <Zap size={16} />, label: 'Patterns', color: 'var(--accent-pink)' },
              { icon: <Terminal size={16} />, label: 'AI Insight', color: 'var(--accent-cyan)' },
            ].map(f => (
              <div key={f.label} className="nb-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderColor: f.color, boxShadow: `3px 3px 0px ${f.color}` }}>
                <span style={{ color: f.color }}>{f.icon}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '2px solid var(--border)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>© 2026 Clutch — MIT License</span>
        <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-purple)', textDecoration: 'none' }}>Star on GitHub ★</a>
      </footer>
    </div>
  )
}
