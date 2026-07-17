import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useChat } from '../context/ChatContext'
import { getProfile, touchPresence } from '../services/userService'

export default function ProtectedRoute() {
  const { setUsuario } = useChat()
  const [status, setStatus] = useState(localStorage.getItem('access_token') ? 'loading' : 'unauthorized')

  useEffect(() => {
    if (status !== 'loading') return undefined
    let cancelled = false

    getProfile()
      .then(({ user }) => {
        if (cancelled) return
        setUsuario(user)
        localStorage.setItem('wordwork_user', JSON.stringify(user))
        setStatus('authorized')
      })
      .catch(() => {
        if (cancelled) return
        localStorage.removeItem('access_token')
        localStorage.removeItem('wordwork_user')
        setStatus('unauthorized')
      })

    return () => { cancelled = true }
  }, [setUsuario, status])

  useEffect(() => {
    if (status !== 'authorized') return undefined
    touchPresence().catch(() => {})
    const interval = window.setInterval(() => touchPresence().catch(() => {}), 60000)
    return () => window.clearInterval(interval)
  }, [status])

  if (status === 'loading') {
    return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#667781' }}>Verificando sesión…</main>
  }

  return status === 'authorized' ? <Outlet /> : <Navigate to="/" replace />
}
