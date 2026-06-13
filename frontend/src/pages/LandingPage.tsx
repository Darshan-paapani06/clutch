import { GitBranch, Terminal, Zap, Activity } from 'lucide-react'
import { useAuthentication } from '../hooks/useAuthentication'
import { Navigate } from 'react-router-dom'
import NavigationBar from '../components/layout/NavigationBar'
import TickerStrip from '../components/common/TickerStrip'
import { API_BASE_URL, GITHUB_REPOSITORY_URL } from '../constants/config.constants'

const TICKER_ITEMS = ['COMMIT STREAKS', 'AI INSIGHTS', 'ACTIVITY HEATMAP', 'GITHUB OAUTH', 'OPEN SOURCE', 'GROQ POWERED', 'WAKATIME COMING SOON']

export default function LandingPage() {
  const { user } = useAuthentication()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div className="scanlines" />

      <NavigationBar rightContent={
        <>
          <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="btn-yellow" style={{ fontSize: '10px', padding: '6px 14px' }}>★ STAR</a>
          <a href={`${API_BASE_URL}/auth/github`} className="btn-cyan" style={{ fontSize: '10px', padding: '6px 14px' }}>▶ CONNECT GITHUB</a>
        </>
      } />

      <TickerStrip items={TICKER_ITEMS} />

      {/* HERO */}
      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '60px 28px', alignItems: 'center' }}>

        {/* LEFT */}
        <div style={{ paddingRight: '48px' }}>
          <div className="status-pill status-online" style={{ marginBottom: '24px', display: 'inline-block' }}>SYSTEM ACTIVE</div>

          <h1 className="pixel-heading pixel-heading-cyan" style={{ fontSize: '20px', marginBottom: '8px', lineHeight: 1.8 }}>
            CLUTCH
          </h1>
          <h2 className="pixel-heading pixel-heading-pink" style={{ fontSize: '13px', marginBottom: '28px', lineHeight: 1.8 }}>
            DEV ACTIVITY DASHBOARD
          </h2>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '32px' }}>
            {'>'} Track commit streaks<br />
            {'>'} Visualize your activity<br />
            {'>'} Get AI-powered weekly insights<br />
            {'>'} CLI + Web + Open Source
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href={`${API_BASE_URL}/auth/github`} className="btn-cyan">
              <GitBranch size={13} /> {'>'} CONNECT GITHUB
            </a>
            <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="btn-pink">
              <Terminal size={13} /> VIEW SOURCE
            </a>
          </div>

          <div style={{ marginTop: '32px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            $ pip install clutch-dev &nbsp;<span style={{ color: 'var(--neon-green)' }}>✓ FREE FOREVER</span>
          </div>
        </div>

        {/* RIGHT — terminal panel */}
        <div className="terminal">
          <div className="terminal-bar">
            <div className="terminal-dot" style={{ background: 'var(--neon-pink)' }} />
            <div className="terminal-dot" style={{ background: 'var(--neon-yellow)' }} />
            <div className="terminal-dot" style={{ background: 'var(--neon-green)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginLeft: '8px' }}>clutch — terminal</span>
          </div>
          {[
            { type: 'cmd', text: '$ clutch streak' },
            { type: 'out', text: '◆ Current Streak: 12 days 🔥' },
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
          <div className="terminal-line">
            <span className="cmd">$ <span className="blink">_</span></span>
          </div>
        </div>
      </main>

      <hr className="cyber-divider" style={{ margin: '0 28px' }} />

      {/* FEATURES */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '48px 28px' }}>
        <h3 className="pixel-heading pixel-heading-yellow" style={{ fontSize: '10px', marginBottom: '32px', letterSpacing: '0.2em' }}>// FEATURES</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
          {[
            { icon: <Activity size={16} color="var(--neon-cyan)" />, label: 'STREAKS', title: 'Commit Streaks', desc: 'Track daily consistency. Never lose your streak again.', color: 'var(--neon-cyan)' },
            { icon: <Zap size={16} color="var(--neon-pink)" />, label: 'PATTERNS', title: 'Activity Patterns', desc: 'Discover your most productive days, repos and languages.', color: 'var(--neon-pink)' },
            { icon: <Terminal size={16} color="var(--neon-yellow)" />, label: 'AI INSIGHTS', title: 'Weekly Insights', desc: 'AI summaries powered by Groq that actually tell you something.', color: 'var(--neon-yellow)' },
          ].map((f) => (
            <div
              key={f.label}
              className="panel"
              style={{ padding: '24px', borderColor: 'var(--border)', background: 'var(--bg-card)', transition: 'transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.2s ease', cursor: 'default' }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.transform = 'perspective(700px) rotateX(-5deg) rotateY(3deg) translateY(-6px) scale(1.02)'
                el.style.boxShadow = `0 16px 40px rgba(0,0,0,0.55), 0 0 20px ${f.color}22`
                el.style.borderColor = f.color
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0) scale(1)'
                el.style.boxShadow = 'none'
                el.style.borderColor = 'var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                {f.icon}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: f.color, letterSpacing: '0.12em' }}>{f.label}</span>
              </div>
              <h4 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>{f.title}</h4>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <TickerStrip items={['OPEN SOURCE', 'MIT LICENSE', 'SELF HOSTABLE', 'FASTAPI BACKEND', 'REACT FRONTEND', 'TYPER CLI', 'GROQ AI']} />

      <footer style={{ borderTop: '1px solid var(--border)', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>© 2026 CLUTCH — OPEN SOURCE</span>
        <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-cyan)', textDecoration: 'none' }}>GITHUB ↗</a>
      </footer>
    </div>
  )
}
