import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../utils/api'
import { MapPin, Users, BookOpen } from 'lucide-react'

interface PublicUser {
  username: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
}

export default function Profile() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<PublicUser | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/users/${username}`).then(res => setProfile(res.data)).catch(() => setNotFound(true))
  }, [username])

  if (notFound) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '8px', background: 'var(--bg)' }}>
      <p style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)' }}>User not found</p>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>@{username} doesn't exist or has a private profile.</p>
    </div>
  )

  if (!profile) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(8px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>◉</span>
          <span style={{ fontWeight: '500', fontSize: '15px', letterSpacing: '-0.2px' }}>Clutch</span>
        </a>
        <a href="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>← Back to Dashboard</a>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 32px' }}>
        <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <img src={profile.avatar_url || ''} alt={profile.username} style={{ width: '72px', height: '72px', borderRadius: '50%', border: '1px solid var(--border)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '2px', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>{profile.name || profile.username}</h1>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '10px' }}>@{profile.username}</p>
            {profile.bio && <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px', lineHeight: '1.6' }}>{profile.bio}</p>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
              {profile.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} />{profile.location}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} />{profile.followers} followers</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={12} />{profile.public_repos} repos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}