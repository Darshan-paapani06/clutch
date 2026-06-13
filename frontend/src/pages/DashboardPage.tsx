import { useState, useEffect } from 'react'
import { useAuthentication } from '../hooks/useAuthentication'
import httpClient from '../api/httpClient'
import { GitCommit, GitPullRequest, Flame, Brain, RefreshCw, LogOut, BarChart3, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import NavigationBar from '../components/layout/NavigationBar'
import StatCard from '../components/common/StatCard'
import LoadingScreen from '../components/common/LoadingScreen'
import TickerStrip from '../components/common/TickerStrip'
import type { ActivitySummary, StreakSummary, WeeklyInsight } from '../types/dashboard.types'

const panelHover = (accent: string) => ({
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    el.style.transform = 'perspective(900px) rotateX(-3deg) rotateY(2deg) translateY(-5px)'
    el.style.boxShadow = `0 20px 48px rgba(0,0,0,0.6), 0 0 24px ${accent}22`
    el.style.transition = 'transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.2s ease'
  },
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)'
    el.style.boxShadow = '0 0 12px rgba(0,245,255,0.08)'
    el.style.transition = 'transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.2s ease'
  },
})

export default function DashboardPage() {
  const { user, logout } = useAuthentication()
  const [activity, setActivity] = useState<ActivitySummary | null>(null)
  const [streak, setStreak] = useState<StreakSummary | null>(null)
  const [insight, setInsight] = useState<WeeklyInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [activityRes, streakRes] = await Promise.all([
        httpClient.get('/github/activity?days=30'),
        httpClient.get('/github/streak'),
      ])
      setActivity(activityRes.data)
      setStreak(streakRes.data)
      httpClient.get('/insights/weekly').then(r => setInsight(r.data)).catch(() => {})
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleSync = async () => {
    setSyncing(true)
    await httpClient.post('/github/sync').catch(() => {})
    await fetchDashboardData()
    setSyncing(false)
  }

  if (loading) return <LoadingScreen message="LOADING ACTIVITY DATA..." />

  const chartData = activity?.daily_activity
    ?.sort((a, b) => a.date.localeCompare(b.date))
    ?.slice(-14)
    ?.map(d => ({ date: d.date.slice(5), commits: d.commits })) || []

  const tickerItems = [
    `@${user?.username}`,
    `${activity?.total_commits ?? 0} COMMITS`,
    `${streak?.current_streak ?? 0} DAY STREAK`,
    `${activity?.active_days ?? 0} ACTIVE DAYS`,
    `${activity?.total_prs ?? 0} PULL REQUESTS`,
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="scanlines" />

      <NavigationBar rightContent={
        <>
          <button onClick={handleSync} disabled={syncing} className="btn-cyan" style={{ fontSize: '10px', padding: '6px 14px' }}>
            <RefreshCw size={12} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'SYNCING...' : 'SYNC'}
          </button>
          <a href={`/u/${user?.username}`}>
            <img src={user?.avatar_url || ''} alt={user?.username} style={{ width: '32px', height: '32px', border: '2px solid var(--neon-cyan)', cursor: 'pointer', display: 'block' }} />
          </a>
          <button onClick={logout} className="btn-pink" style={{ fontSize: '10px', padding: '6px 12px' }}>
            <LogOut size={12} />
          </button>
        </>
      } />

      <TickerStrip items={tickerItems} />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 28px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', borderLeft: '3px solid var(--neon-pink)', paddingLeft: '16px' }}>
          <div className="pixel-heading pixel-heading-pink" style={{ fontSize: '11px', marginBottom: '6px', fontWeight: 700 }}>DASHBOARD</div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '30px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {user?.name || user?.username}
          </h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 700 }}>
            @{user?.username} &nbsp;·&nbsp;
            <a href={`/u/${user?.username}`} style={{ color: 'var(--neon-cyan)', textDecoration: 'none' }}>PUBLIC PROFILE ↗</a>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', marginBottom: '24px' }}>
          <StatCard label="Commits" value={activity?.total_commits ?? '—'} icon={<GitCommit size={12} />} color="cyan" />
          <StatCard label="Pull Requests" value={activity?.total_prs ?? '—'} icon={<GitPullRequest size={12} />} color="pink" />
          <StatCard label="Streak" value={streak ? `${streak.current_streak}D` : '—'} icon={<Flame size={12} />} color="yellow" />
          <StatCard label="Best Streak" value={streak ? `${streak.longest_streak}D` : '—'} icon={<BarChart3 size={12} />} color="green" />
          <StatCard label="Active Days" value={streak?.total_active_days ?? '—'} icon={<Calendar size={12} />} color="cyan" />
        </div>

        {/* Chart panel */}
        <div
          className="panel panel-cyan"
          style={{ padding: '20px', marginBottom: '24px', transition: 'transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.2s ease', cursor: 'default' }}
          {...panelHover('var(--neon-cyan)')}
        >
          <div className="panel-label" style={{ fontWeight: 700 }}>COMMIT ACTIVITY — LAST 14 DAYS</div>
          <div style={{ paddingTop: '16px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={chartData} barSize={10}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Share Tech Mono', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#050508', border: '1px solid var(--neon-cyan)', fontFamily: 'Share Tech Mono', fontSize: '11px', color: 'var(--neon-cyan)', fontWeight: 700 }} cursor={{ fill: 'rgba(0,245,255,0.05)' }} />
                  <Bar dataKey="commits" fill="var(--neon-cyan)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0', fontWeight: 700 }}>
                {'>'} NO ACTIVITY DATA — RUN SYNC TO LOAD
              </p>
            )}
          </div>
        </div>

        {/* AI Insight panel */}
        <div
          className="panel panel-pink"
          style={{ padding: '20px', transition: 'transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.2s ease', cursor: 'default' }}
          {...panelHover('var(--neon-pink)')}
        >
          <div className="panel-label" style={{ fontWeight: 700 }}>AI WEEKLY INSIGHT — GROQ</div>
          <div style={{ paddingTop: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Brain size={18} color="var(--neon-pink)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, fontWeight: 600 }}>
                {insight?.ai_summary || insight?.message || '> SYNC YOUR ACTIVITY FIRST TO GENERATE AI INSIGHTS.'}
              </p>
              {insight?.stats && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'BEST DAY', value: insight.stats.best_day },
                    { label: 'COMMITS', value: insight.stats.total_commits },
                    { label: 'ACTIVE', value: `${insight.stats.active_days}/7` },
                  ].map(item => (
                    <div key={item.label}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '4px', fontWeight: 700 }}>{item.label}</p>
                      <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--neon-pink)', fontWeight: 700 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
