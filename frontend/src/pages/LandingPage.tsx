import { GitBranch, GitCommit, BarChart3, Brain, ArrowRight } from 'lucide-react'
import { useAuthentication } from '../hooks/useAuthentication'
import { Navigate } from 'react-router-dom'
import NavigationBar from '../components/layout/NavigationBar'
import { API_BASE_URL, GITHUB_REPOSITORY_URL } from '../constants/config.constants'

export default function LandingPage() {
  const { user } = useAuthentication()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <NavigationBar rightContent={
        <>
          <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '13px', padding: '6px 12px' }}>GitHub</a>
          <a href={`${API_BASE_URL}/auth/github`} className="btn-primary" style={{ fontSize: '13px', padding: '6px 14px' }}>
            <GitBranch size={14} />
            Sign in with GitHub
          </a>
        </>
      } />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 32px 80px', textAlign: 'center' }}>

        <div className="badge badge-default" style={{ marginBottom: '28px' }}>Open Source · Free Forever</div>

        <h1 style={{ fontSize: '56px', fontWeight: '600', lineHeight: '1.1', letterSpacing: '-1.5px', color: 'var(--text-primary)', marginBottom: '20px', maxWidth: '680px' }}>
          GitHub tracks your work.
          <br />
          Clutch tracks you.
        </h1>

        <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '440px', marginBottom: '36px', lineHeight: '1.7', fontWeight: '300' }}>
          Commit streaks, activity patterns, language breakdowns, and AI-powered weekly insights — all in one place.
        </p>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
          <a href={`${API_BASE_URL}/auth/github`} className="btn-primary" style={{ fontSize: '14px', padding: '10px 22px' }}>
            <GitBranch size={15} />
            Get Started Free
            <ArrowRight size={13} />
          </a>
          <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '14px', padding: '10px 20px' }}>View on GitHub</a>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>No credit card. No email required.</p>

        <div style={{ width: '100%', maxWidth: '800px', margin: '72px auto 0', borderTop: '1px solid var(--border)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', marginTop: '0', width: '100%', maxWidth: '800px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          {[
            { icon: <GitCommit size={16} color="var(--text-secondary)" />, title: 'Commit Streaks', desc: 'Track your daily consistency and never lose your streak again.' },
            { icon: <BarChart3 size={16} color="var(--text-secondary)" />, title: 'Activity Patterns', desc: 'Discover your most productive days, repos and languages.' },
            { icon: <Brain size={16} color="var(--text-secondary)" />, title: 'AI Insights', desc: 'Weekly summaries powered by Groq that actually tell you something useful.' },
          ].map((f) => (
            <div key={f.title} style={{ background: 'var(--bg-card)', padding: '28px 24px', textAlign: 'left' }}>
              <div style={{ marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1px', width: '100%', maxWidth: '800px', background: 'var(--border)', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '20px 28px', textAlign: 'left' }}>
            <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Also available as a CLI</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                '$ pip install clutch-dev',
                '$ clutch streak',
                '◉ Current Streak: 6 days',
                '$ clutch insight',
                '◉ Strong week — 61 commits across 6 days...',
              ].map((line, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: line.startsWith('$') ? 'var(--text-primary)' : line.startsWith('◉') ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
        <span>© 2026 Clutch — Open Source</span>
        <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Star on GitHub ⭐</a>
      </footer>
    </div>
  )
}
