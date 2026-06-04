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
      const [activityRes, streakRes] = await Promise.all([api.get('/github/activity?days=30'), api.get('/github/streak')])
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
      <span style={{ fontSize: '28px' }}>⚡</span>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Loading your activity...</p>
    </div>
  )

  const chartData = activity?.daily_activity?.sort((a, b) => a.date.localeCompare(b.date))?.slice(-14)?.map(d => ({ date: d.date.slice(5), commits: d.commits })) || []

  const stats = [
    { label: 'Total Commits', value: activity?.total_commits ?? '—', icon: <GitCommit size={15} />, color: 'var(--accent-orange)' },
    { label: 'Pull Requests', value: activity?.total_prs ?? '—', icon: <GitPullRequest size={15} />, color: 'var(--accent-blue)' },
    { label: 'Current Streak', value: streak ? `${streak.current_streak}d` : '—', icon: <Flame size={15} />, color: 'var(--accent-red)' },
    { label: 'Longest Streak', value: streak ? `${streak.longest_streak}d` : '—', icon: <BarChart3 size={15} />, color: 'var(--accent-purple)' },
    { label: 'Active Days', value: streak?.total_active_days ?? '—', icon: <Calendar size={15} />, color: 'var(--accent-green)' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <span style={{ fontWeight: '600', fontSize: '15px' }}>Clutch</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleSync} disabled={syncing} className="btn-ghost" style={{ fontSize: '13px', padding: '6px 12px' }}>
            <RefreshCw size={13} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Syncing...' : 'Sync'}
          </button>
          <a href={`/u/${user?.username}`} style={{ display: 'flex', alignItems: 'center' }}>
            <img src={user?.avatar_url || ''} alt={user?.username} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer' }} />
          </a>
          <button onClick={logout} className="btn-ghost" style={{ fontSize: '13px', padding: '6px 10px' }}>
            <LogOut size={13} />
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '4px', letterSpacing: '-0.5px' }}>Hey, {user?.name || user?.username} 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            @{user?.username} · Last 30 days · <a href={`/u/${user?.username}`} style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>View public profile →</a>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'var(--bg)', padding: '20px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: s.color }}>
                {s.icon}
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>Commit Activity</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '20px' }}>Last 14 days</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={chartData} barSize={14}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'DM Mono', fontSize: '12px' }} labelStyle={{ color: 'var(--text-secondary)' }} itemStyle={{ color: 'var(--accent-orange)' }} />
                <Bar dataKey="commits" fill="var(--accent-orange)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>No activity yet. Click Sync to load your data.</p>
          )}
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Brain size={15} color="var(--accent-purple)" />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Weekly AI Insight</span>
            <span className="badge badge-blue" style={{ marginLeft: 'auto', fontSize: '11px' }}>Groq AI</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>
            {insight?.ai_summary || insight?.message || 'Sync your activity first to generate AI insights.'}
          </p>
          {insight?.stats && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '20px' }}>
              {[
                { label: 'Best Day', value: insight.stats.best_day },
                { label: 'Commits', value: insight.stats.total_commits },
                { label: 'Active Days', value: `${insight.stats.active_days}/7` },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{item.label}</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}