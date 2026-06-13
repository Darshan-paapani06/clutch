interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '12px',
      background: 'var(--bg)',
    }}>
      <span style={{ fontSize: '22px', color: 'var(--text-secondary)' }}>◉</span>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{message}</p>
    </div>
  )
}
