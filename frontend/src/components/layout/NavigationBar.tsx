import type { ReactNode } from 'react'

interface NavigationBarProps { rightContent?: ReactNode }

export default function NavigationBar({ rightContent }: NavigationBarProps) {
  return (
    <nav className="nb-nav">
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xl)', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Clutch</span>
        <span className="tag tag-green">ONLINE</span>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>{rightContent}</div>
    </nav>
  )
}
