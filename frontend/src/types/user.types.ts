export interface AuthenticatedUser {
  id: number
  username: string
  name: string | null
  email: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
  is_public: boolean
  created_at: string
  last_synced_at: string | null
}

export interface PublicUserProfile {
  username: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
}

export interface AuthenticationContextValue {
  user: AuthenticatedUser | null
  loading: boolean
  login: (token: string) => Promise<AuthenticatedUser>
  logout: () => void
}
