import type { ReactNode } from 'react'

interface NavigationBarProps {
  rightContent?: ReactNode
  sticky?: boolean
}

export default function NavigationBar({ rightContent, sticky = true }: NavigationBarProps) {
  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: sticky ? 'sticky' : 'static',
      top: 0,
      background: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(8px)',
      zIndex: 10,
    }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)' }}>
        <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>◉</span>
        <span style={{ fontWeight: '500', fontSize: '15px', letterSpacing: '-0.2px' }}>Clutch</span>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {rightContent}
      </div>
    </nav>
  )
}
