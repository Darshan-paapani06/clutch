import { useState, useEffect } from 'react'
import { useAuthentication } from '../hooks/useAuthentication'
import httpClient from '../api/httpClient'
import { GitCommit, GitPullRequest, Flame, Brain, RefreshCw, LogOut, BarChart3, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import NavigationBar from '../components/layout/NavigationBar'
import StatCard from '../components/common/StatCard'
import LoadingScreen from '../components/common/LoadingScreen'
import type { ActivitySummary, StreakSummary, WeeklyInsight } from '../types/dashboard.types'

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

  if (loading) return <LoadingScreen message="Loading activity..." />

  const chartData = activity?.daily_activity
    ?.sort((a, b) => a.date.localeCompare(b.date))
    ?.slice(-14)
    ?.map(d => ({ date: d.date.slice(5), commits: d.commits })) || []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <NavigationBar rightContent={
        <>
          <button onClick={handleSync} disabled={syncing} className="btn-nb btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }}>
            <RefreshCw size={12} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Syncing...' : 'Sync'}
          </button>
          <a href={`/u/${user?.username}`}>
            <img src={user?.avatar_url || ''} alt={user?.username} style={{ width: '32px', height: '32px', border: '2px solid var(--border)', cursor: 'pointer', display: 'block' }} />
          </a>
          <button onClick={logout} className="btn-nb btn-pink" style={{ fontSize: '12px', padding: '6px 10px' }}>
            <LogOut size={12} />
          </button>
        </>
      } />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 32px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid var(--border)' }}>
          <div className="section-label">Dashboard</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {user?.name || user?.username}
          </h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            @{user?.username} · Last 30 days ·{' '}
            <a href={`/u/${user?.username}`} style={{ color: 'var(--accent-purple)', textDecoration: 'none' }}>Public profile →</a>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          <StatCard label="Commits" value={activity?.total_commits ?? '—'} icon={<GitCommit size={13} />} color="purple" />
          <StatCard label="Pull Requests" value={activity?.total_prs ?? '—'} icon={<GitPullRequest size={13} />} color="pink" />
          <StatCard label="Streak" value={streak ? `${streak.current_streak}d` : '—'} icon={<Flame size={13} />} color="yellow" />
          <StatCard label="Best Streak" value={streak ? `${streak.longest_streak}d` : '—'} icon={<BarChart3 size={13} />} color="cyan" />
          <StatCard label="Active Days" value={streak?.total_active_days ?? '—'} icon={<Calendar size={13} />} color="green" />
        </div>

        {/* CHART */}
        <div className="nb-panel-purple" style={{ padding: '22px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span className="section-label" style={{ marginBottom: 0 }}>Commit Activity</span>
            <span className="tag tag-outline">Last 14 days</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={chartData} barSize={10}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--accent-purple)', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--text-primary)', boxShadow: '4px 4px 0px var(--accent-purple)' }} cursor={{ fill: 'rgba(124,58,237,0.06)' }} />
                <Bar dataKey="commits" fill="var(--accent-purple)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>
              No activity data — click Sync to load.
            </p>
          )}
        </div>

        {/* AI INSIGHT */}
        <div className="nb-panel-pink" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span className="section-label" style={{ marginBottom: 0 }}>Weekly AI Insight</span>
            <span className="tag tag-pink" style={{ marginLeft: 'auto' }}>Groq</span>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <Brain size={18} color="var(--accent-pink)" style={{ flexShrink: 0, marginTop: '3px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                {insight?.ai_summary || insight?.message || 'Sync your activity first to generate AI insights.'}
              </p>
              {insight?.stats && (
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Best Day', value: insight.stats.best_day },
                    { label: 'Commits', value: insight.stats.total_commits },
                    { label: 'Active', value: `${insight.stats.active_days}/7` },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="stat-label" style={{ marginBottom: '4px' }}>{item.label}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--accent-pink)' }}>{item.value}</p>
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
