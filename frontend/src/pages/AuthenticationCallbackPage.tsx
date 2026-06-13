import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthentication } from '../hooks/useAuthentication'
import LoadingScreen from '../components/common/LoadingScreen'

export default function AuthenticationCallbackPage() {
  const [params] = useSearchParams()
  const { login } = useAuthentication()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      login(token)
        .then(() => navigate('/dashboard', { replace: true }))
        .catch(() => navigate('/', { replace: true }))
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return <LoadingScreen message="Authenticating..." />
}
