import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { GitCommit, GitPullRequest, Flame, Brain, RefreshCw, LogOut, BarChart3, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ActivityData {
  total_commits: number
  total_prs: number
  total_issues: number
  active_days: number
  daily_activity: Array<{ date: string; commits: number; prs: number }>
}

interface StreakData {
  current_streak: number
  longest_streak: number
  total_active_days: number
}

interface InsightData {
  week_start: string
  stats: { total_commits: number; total_prs: number; active_days: number; best_day: string }
  ai_summary: string
  generated_by: string
  message?: string
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activity, setActivity] = useState<ActivityData | null>(null)
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [insight, setInsight] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [activityRes, streakRes] = await Promise.all([
        api.get('/github/activity?days=30'),
        api.get('/github/streak'),
      ])
      setActivity(activityRes.data)
      setStreak(streakRes.data)
      api.get('/insights/weekly').then(res => setInsight(res.data)).catch(() => {})
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSync = async () => {
    setSyncing(true)
    await api.post('/github/sync').catch(() => {})
    await fetchData()
    setSyncing(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '12px', background: 'var(--bg)' }}>
      <span style={{ fontSize: '22px', color: 'var(--text-secondary)' }}>◉</span>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Loading your activity...</p>
    </div>
  )

  const chartData = activity?.daily_activity
    ?.sort((a, b) => a.date.localeCompare(b.date))
    ?.slice(-14)
    ?.map(d => ({ date: d.date.slice(5), commits: d.commits })) || []

  const stats = [
    { label: 'Commits', value: activity?.total_commits ?? '—', icon: <GitCommit size={14} /> },
    { label: 'Pull Requests', value: activity?.total_prs ?? '—', icon: <GitPullRequest size={14} /> },
    { label: 'Current Streak', value: streak ? `${streak.current_streak}d` : '—', icon: <Flame size={14} /> },
    { label: 'Longest Streak', value: streak ? `${streak.longest_streak}d` : '—', icon: <BarChart3 size={14} /> },
    { label: 'Active Days', value: streak?.total_active_days ?? '—', icon: <Calendar size={14} /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>◉</span>
          <span style={{ fontWeight: '500', fontSize: '15px', letterSpacing: '-0.2px' }}>Clutch</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleSync} disabled={syncing} className="btn-ghost" style={{ fontSize: '13px', padding: '6px 12px' }}>
            <RefreshCw size={12} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Syncing...' : 'Sync'}
          </button>
          <a href={`/u/${user?.username}`}>
            <img src={user?.avatar_url || ''} alt={user?.username} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer', display: 'block' }} />
          </a>
          <button onClick={logout} className="btn-ghost" style={{ fontSize: '13px', padding: '6px 10px' }}>
            <LogOut size={12} />
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>

        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '600', marginBottom: '4px', letterSpacing: '-0.5px' }}>
            Hey, {user?.name || user?.username} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            @{user?.username} · Last 30 days · <a href={`/u/${user?.username}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>View public profile →</a>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'var(--bg-card)', padding: '18px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', color: 'var(--text-muted)' }}>
                {s.icon}
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', letterSpacing: '-0.1px' }}>Commit Activity</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Last 14 days</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData} barSize={12}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'Geist Mono', fontSize: '11px', color: 'var(--text-primary)' }} labelStyle={{ color: 'var(--text-secondary)' }} itemStyle={{ color: 'var(--text-primary)' }} cursor={{ fill: 'var(--border)' }} />
                <Bar dataKey="commits" fill="var(--text-secondary)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px', textAlign: 'center', padding: '32px 0' }}>No activity yet. Click Sync to load your data.</p>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Brain size={14} color="var(--text-secondary)" />
            <span style={{ fontSize: '13px', fontWeight: '500' }}>Weekly AI Insight</span>
            <span className="badge badge-default" style={{ marginLeft: 'auto', fontSize: '11px' }}>Groq</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>
            {insight?.ai_summary || insight?.message || 'Sync your activity first to generate AI insights.'}
          </p>
          {insight?.stats && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '24px' }}>
              {[
                { label: 'Best Day', value: insight.stats.best_day },
                { label: 'Commits', value: insight.stats.total_commits },
                { label: 'Active Days', value: `${insight.stats.active_days}/7` },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{item.label}</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}