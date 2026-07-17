import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useChat } from '../context/ChatContext'
import { LogOut, MessageCircle, Moon, Settings, Sun, UsersRound } from 'lucide-react'

export default function NavigationRail() {
  const { usuario, setUsuario } = useChat()
  const navigate = useNavigate()
  const location = useLocation()
  const [theme, setTheme] = useState(() => localStorage.getItem('wordwork_theme') || 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('wordwork_theme', theme)
  }, [theme])

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('wordwork_user')
    setUsuario(null)
    navigate('/')
  }

  const iconStyle = {
    width: 48, height: 48, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: 'var(--icon-color)',
    transition: 'background .15s, color .15s',
  }
  const hover = (event) => { event.currentTarget.style.background = 'var(--rail-hover)' }
  const leave = (event) => { event.currentTarget.style.background = '' }

  return (
    <nav className="sidebar-rail persistent-navigation" aria-label="Navegación principal" style={{
      width: 60, height: '100dvh', flex: '0 0 60px', padding: '12px 0',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      background: 'var(--bg-rail)', borderRight: '1px solid var(--border)',
    }}>
      <button className={location.pathname.startsWith('/chat') ? 'rail-icon-active' : ''} aria-current={location.pathname.startsWith('/chat') ? 'page' : undefined} title="Chats" aria-label="Chats" onClick={() => navigate('/chat')} style={{ ...iconStyle, marginBottom: 8 }} onMouseEnter={hover} onMouseLeave={leave}>
        <MessageCircle size={23} strokeWidth={1.9} />
      </button>
      <button title="Crear grupo" aria-label="Crear grupo" onClick={() => navigate('/chat?crearGrupo=1')} style={iconStyle} onMouseEnter={hover} onMouseLeave={leave}>
        <UsersRound size={24} strokeWidth={1.9} />
      </button>
      <div style={{ flex: 1 }} />
      <button title={theme === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'} aria-label={theme === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'} onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} style={iconStyle} onMouseEnter={hover} onMouseLeave={leave}>
        {theme === 'dark' ? <Sun size={23} strokeWidth={1.9} /> : <Moon size={23} strokeWidth={1.9} />}
      </button>
      <button className={location.pathname === '/profile' ? 'rail-icon-active' : ''} aria-current={location.pathname === '/profile' ? 'page' : undefined} title="Configuración" aria-label="Configuración" onClick={() => navigate('/profile')} style={iconStyle} onMouseEnter={hover} onMouseLeave={leave}>
        <Settings size={23} strokeWidth={1.9} />
      </button>
      <button title="Cerrar sesión" aria-label="Cerrar sesión" onClick={logout} style={iconStyle} onMouseEnter={hover} onMouseLeave={leave}>
        <LogOut size={22} strokeWidth={1.9} />
      </button>
      <button title="Mi perfil" aria-label="Mi perfil" onClick={() => navigate('/profile')} style={{ width: 38, height: 38, marginTop: 4, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--accent)', color: '#fff', border: '2px solid var(--border)', fontWeight: 700, fontSize: 12 }}>
        {usuario?.display_name?.slice(0, 2).toUpperCase() || 'WW'}
      </button>
    </nav>
  )
}
