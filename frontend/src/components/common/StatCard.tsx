import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  color?: 'cyan' | 'pink' | 'yellow' | 'green'
}

const colorMap = {
  cyan: 'var(--neon-cyan)',
  pink: 'var(--neon-pink)',
  yellow: 'var(--neon-yellow)',
  green: 'var(--neon-green)',
}

export default function StatCard({ label, value, icon, color = 'cyan' }: StatCardProps) {
  const accent = colorMap[color]
  return (
    <div
      className="stat-chip"
      style={{
        borderLeft: `3px solid ${accent}`,
        cursor: 'default',
        transition: 'transform 0.18s cubic-bezier(.22,.68,0,1.2), box-shadow 0.18s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.transform = 'perspective(600px) rotateX(-6deg) rotateY(4deg) translateY(-4px) scale(1.03)'
        el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.5), 0 0 18px ${accent}33`
        el.style.borderColor = accent
        el.style.zIndex = '2'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0) scale(1)'
        el.style.boxShadow = 'none'
        el.style.zIndex = '1'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: 'var(--text-muted)' }}>
        {icon}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: accent, letterSpacing: '0.05em', fontWeight: 700 }}>{value}</div>
    </div>
  )
}
