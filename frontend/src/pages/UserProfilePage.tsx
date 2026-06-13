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
      <div className="pixel-heading pixel-heading-pink" style={{ fontSize: '12px' }}>404</div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>@{username} NOT FOUND OR PROFILE IS PRIVATE</p>
    </div>
  )

  if (!profile) return <LoadingScreen message="LOADING PROFILE..." />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="scanlines" />
      <NavigationBar rightContent={
        <a href="/dashboard" className="btn-cyan" style={{ fontSize: '10px', padding: '6px 14px' }}>← DASHBOARD</a>
      } />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 28px' }}>
        <div
          className="panel panel-cyan"
          style={{ padding: '28px', transition: 'transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.2s ease', cursor: 'default' }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.transform = 'perspective(800px) rotateX(-4deg) rotateY(3deg) translateY(-6px)'
            el.style.boxShadow = '0 20px 48px rgba(0,0,0,0.6), 0 0 24px rgba(0,245,255,0.12)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'
            el.style.boxShadow = '0 0 12px rgba(0,245,255,0.08)'
          }}
        >
          <div className="panel-label">USER PROFILE</div>
          <div style={{ paddingTop: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <img
              src={profile.avatar_url || ''}
              alt={profile.username}
              style={{ width: '72px', height: '72px', border: '2px solid var(--neon-cyan)', flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '22px', marginBottom: '2px', color: 'var(--text-primary)' }}>
                {profile.name || profile.username}
              </h1>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-cyan)', marginBottom: '12px', letterSpacing: '0.1em' }}>
                @{profile.username}
              </p>
              {profile.bio && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.8 }}>
                  {'>'} {profile.bio}
                </p>
              )}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {profile.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <MapPin size={12} color="var(--neon-yellow)" />{profile.location}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <Users size={12} color="var(--neon-pink)" />{profile.followers} FOLLOWERS
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <BookOpen size={12} color="var(--neon-cyan)" />{profile.public_repos} REPOS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
