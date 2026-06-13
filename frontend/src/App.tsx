import { AuthenticationProvider } from './contexts/AuthenticationContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <AuthenticationProvider>
      <AppRoutes />
    </AuthenticationProvider>
  )
}
