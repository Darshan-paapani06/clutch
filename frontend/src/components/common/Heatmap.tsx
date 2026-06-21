import type { HeatmapData } from '../../types/dashboard.types'

interface HeatmapProps {
  data: HeatmapData | null
}

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', '']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function intensity(count: number, max: number): string {
  if (count === 0) return 'var(--bg-panel)'
  const ratio = count / Math.max(max, 1)
  if (ratio > 0.75) return '#1a1a2e'
  if (ratio > 0.5) return '#4a4a5e'
  if (ratio > 0.25) return '#7a7a8a'
  return '#b8b8c0'
}

export default function Heatmap({ data }: HeatmapProps) {
  if (!data || data.days.length === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-chrome)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-8) 0' }}>
        No activity data — click Sync to load.
      </p>
    )
  }

  // Build week columns, padding the first week so it starts on Monday
  const days = data.days
  const firstDate = new Date(days[0].date + 'T00:00:00')
  const firstWeekday = (firstDate.getDay() + 6) % 7 // 0 = Monday
  const padding: (typeof days[number] | null)[] = Array.from({ length: firstWeekday }, () => null)
  const padded: (typeof days[number] | null)[] = padding.concat(days)

  const weeks: (typeof days[number] | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }

  // Month labels — find which week index each month starts in
  const monthLabels: { week: number; label: string }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstValid = week.find((d) => d !== null)
    if (!firstValid) return
    const month = new Date(firstValid.date + 'T00:00:00').getMonth()
    if (month !== lastMonth) {
      monthLabels.push({ week: wi, label: MONTH_NAMES[month] })
      lastMonth = month
    }
  })

  const cellSize = 11
  const cellGap = 3

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
      <div style={{ display: 'inline-block' }}>
        {/* Month labels */}
        <div style={{ display: 'flex', marginLeft: 24, marginBottom: 'var(--space-1)' }}>
          {weeks.map((_, wi) => {
            const m = monthLabels.find((m) => m.week === wi)
            return (
              <div key={wi} style={{ width: cellSize + cellGap, fontFamily: 'var(--font-chrome)', fontSize: 10, color: 'var(--text-muted)' }}>
                {m ? m.label : ''}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: cellGap }}>
          {/* Day-of-week labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: cellGap, marginRight: 'var(--space-1)' }}>
            {DAY_LABELS.map((label, i) => (
              <div key={i} style={{ width: 18, height: cellSize, fontFamily: 'var(--font-chrome)', fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                {label}
              </div>
            ))}
          </div>

          {/* Week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: cellGap }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  title={day ? `${day.count} contributions on ${day.date}` : ''}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: day ? intensity(day.count, data.max_count) : 'transparent',
                    border: day ? '1px solid var(--border)' : 'none',
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-3)', marginLeft: 24 }}>
          <span style={{ fontFamily: 'var(--font-chrome)', fontSize: 10, color: 'var(--text-muted)', marginRight: 'var(--space-1)' }}>Less</span>
          {[0, 0.2, 0.4, 0.7, 1].map((r, i) => (
            <div key={i} style={{ width: cellSize, height: cellSize, background: intensity(Math.round(r * data.max_count), data.max_count), border: '1px solid var(--border)' }} />
          ))}
          <span style={{ fontFamily: 'var(--font-chrome)', fontSize: 10, color: 'var(--text-muted)', marginLeft: 'var(--space-1)' }}>More</span>
        </div>
      </div>
    </div>
  )
}
