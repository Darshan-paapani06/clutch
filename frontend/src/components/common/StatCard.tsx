import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div style={{ background: 'var(--bg-card)', padding: '18px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', color: 'var(--text-muted)' }}>
        {icon}
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{value}</div>
    </div>
  )
}
