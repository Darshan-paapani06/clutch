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
    httpClient.get(`/users/${username}`).then(r => setProfile(r.data)).catch(() => setNotFound(true))
  }, [username])

  if (notFound) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '12px', background: 'var(--bg)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text-primary)' }}>User not found</h1>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>@{username} doesn't exist or has a private profile.</p>
    </div>
  )

  if (!profile) return <LoadingScreen message="Loading profile..." />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <NavigationBar rightContent={
        <a href="/dashboard" className="btn-nb btn-ghost" style={{ fontSize: '12px', padding: '6px 14px' }}>← Dashboard</a>
      } />
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '56px 32px' }}>
        <div className="section-label">Profile</div>
        <div className="nb-panel-purple" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <img src={profile.avatar_url || ''} alt={profile.username} style={{ width: '72px', height: '72px', border: '2px solid var(--border)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '2px', color: 'var(--text-primary)' }}>
                {profile.name || profile.username}
              </h1>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-purple)', marginBottom: '12px' }}>@{profile.username}</p>
              {profile.bio && (
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.7' }}>{profile.bio}</p>
              )}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {profile.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <MapPin size={12} color="var(--accent-yellow)" />{profile.location}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Users size={12} color="var(--accent-pink)" />{profile.followers} followers
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <BookOpen size={12} color="var(--accent-purple)" />{profile.public_repos} repos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
