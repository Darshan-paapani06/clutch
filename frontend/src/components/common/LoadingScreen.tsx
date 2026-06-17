interface LoadingScreenProps { message?: string }

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px', background: 'var(--bg)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-primary)' }}>
        Clutch<span className="blink" style={{ color: 'var(--accent-purple)' }}>_</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{message}</div>
    </div>
  )
}
