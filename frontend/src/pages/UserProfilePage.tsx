import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import httpClient from '../api/httpClient'
import { MapPin, Users, BookOpen } from 'lucide-react'
import NavigationBar from '../components/layout/NavigationBar'
import LoadingScreen from '../components/common/LoadingScreen'
import type { PublicUserProfile } from '../types/user.types'

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<PublicUserProfile | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    httpClient.get(`/users/${username}`).then(res => setProfile(res.data)).catch(() => setNotFound(true))
  }, [username])

  if (notFound) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '8px', background: 'var(--bg)' }}>
      <p style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)' }}>User not found</p>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>@{username} doesn't exist or has a private profile.</p>
    </div>
  )

  if (!profile) return <LoadingScreen />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <NavigationBar rightContent={
        <a href="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>← Back to Dashboard</a>
      } />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 32px' }}>
        <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <img src={profile.avatar_url || ''} alt={profile.username} style={{ width: '72px', height: '72px', borderRadius: '50%', border: '1px solid var(--border)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '2px', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>{profile.name || profile.username}</h1>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '10px' }}>@{profile.username}</p>
            {profile.bio && <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px', lineHeight: '1.6' }}>{profile.bio}</p>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '12px', flexWrap: 'wrap' }}>
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
