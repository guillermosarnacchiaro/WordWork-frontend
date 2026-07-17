import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useChat } from '../context/ChatContext'
import ContactItem from './ContactItem'
import CreateGroupModal from './CreateGroupModal'
import { FolderOpen, LogOut, MessageCircle, Moon, MoreVertical, Settings, SquarePen, Sun, UsersRound } from 'lucide-react'

export default function Sidebar({ onSeleccionar, onCrearGrupo, loading = false, error = '' }) {
  const { contactos, contactoActivoId, usuario, setUsuario } = useChat()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtro, setFiltro] = useState('Todos')
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('wordwork_theme') || 'light')
  const query = searchParams.get('q') || ''

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('wordwork_theme', theme)
  }, [theme])

  const totalUnread = contactos.reduce((acc, c) => acc + c.unread, 0)

  const filtrados = contactos
    .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    .filter(c => {
      if (filtro === 'No leídos') return c.unread > 0
      return true
    })

  function handleBusqueda(e) {
    const val = e.target.value
    if (val) setSearchParams({ q: val })
    else setSearchParams({})
  }

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('wordwork_user')
    setUsuario(null)
    navigate('/')
  }

  const iconBtn = {
    width: '48px', height: '48px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#54656f', transition: 'background 0.15s',
  }

  return (
    <div className="sidebar-shell" style={{ display: 'flex', height: '100dvh', flexShrink: 0 }}>

      {/* Barra izquierda */}
      <div className="sidebar-rail" style={{
        width: '60px', background: 'var(--bg-header)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '12px 0', gap: '4px',
      }}>

        {/* Chats con badge */}
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <button title="Chats" style={iconBtn}
            onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <MessageCircle size={23} strokeWidth={1.9} />
          </button>
{totalUnread > 0 && (
  <span style={{
    position: 'absolute', top: '-4px', right: '-4px',
    background: '#00a884', color: 'white',
    borderRadius: '10px', fontSize: '11px', fontWeight: '700',
    minWidth: '20px', height: '20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 5px',
    lineHeight: '1',
    boxSizing: 'border-box',
  }}>
    {totalUnread}
  </span>
)}
        </div>

        {/* Tema */}
        <button title={theme === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'} onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} style={iconBtn}
          onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          {theme === 'dark' ? <Sun size={23} strokeWidth={1.9} /> : <Moon size={23} strokeWidth={1.9} />}
        </button>

        {/* Comunidades */}
        <button title="Comunidades" style={iconBtn}
          onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.06L2 22l4.94-1.37A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
  <circle cx="8.5" cy="12" r="1" fill="currentColor"/>
  <circle cx="12" cy="12" r="1" fill="currentColor"/>
  <circle cx="15.5" cy="12" r="1" fill="currentColor"/>
</svg>
        </button>

        {/* Grupos */}
        <button title="Crear grupo" aria-label="Crear grupo" onClick={() => setShowGroupModal(true)} style={iconBtn}
          onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <UsersRound size={24} strokeWidth={1.9} />
        </button>

        <div style={{ flex: 1 }} />

        {/* Galería */}
        <button title="Archivos" style={iconBtn}
          onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <FolderOpen size={23} strokeWidth={1.9} />
        </button>

        {/* Configuración */}
        <button title="Configuración" onClick={() => navigate('/profile')} style={iconBtn}
          onMouseEnter={e => e.currentTarget.style.background='#c5cbce'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <Settings size={23} strokeWidth={1.9} />
        </button>

        <button title="Cerrar sesión" onClick={handleLogout} style={iconBtn}
          onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <LogOut size={22} strokeWidth={1.9} />
        </button>

        {/* Avatar abajo */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: 'var(--accent)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: '700', fontSize: '12px',
          cursor: 'pointer', marginTop: '4px',
          border: '2px solid #d1d7db',
        }} onClick={() => navigate('/profile')}>
          {usuario?.display_name?.slice(0, 2).toUpperCase() || 'WW'}
        </div>

      </div>

      {/* Panel de chats */}
      <div className="sidebar-panel" style={{
        width: '360px', background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', height: '100dvh',
      }}>

{/* Header */}
<div style={{
  padding: '12px 16px',
  background: 'var(--bg-header)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '60px',
  flexShrink: 0,
}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#00a884">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.37 17.04 14.27C16.97 14.17 16.81 14.1 16.56 13.98C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.31C14.15 13.55 13.67 14.1 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.22 11.94 13.96 11 13.12C10.26 12.47 9.77 11.67 9.62 11.43C9.5 11.19 9.61 11.05 9.73 10.93C9.84 10.82 9.99 10.64 10.11 10.5C10.23 10.36 10.27 10.25 10.35 10.08C10.43 9.92 10.39 9.78 10.33 9.66C10.27 9.54 9.77 8.33 9.56 7.82C9.36 7.33 9.16 7.39 9 7.38C8.86 7.38 8.7 7.33 8.53 7.33Z"/>
            </svg>
            <span style={{ color: '#00a884', fontWeight: '600', fontSize: '18px' }}>WordWork</span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button style={{ ...iconBtn, width: '36px', height: '36px' }}
              onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <SquarePen size={20} strokeWidth={1.9} />
            </button>
            <button style={{ ...iconBtn, width: '36px', height: '36px' }}
              onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <MoreVertical size={20} strokeWidth={1.9} />
            </button>
          </div>
        </div>

{/* Buscador */}
<div style={{ padding: '8px 12px', flexShrink: 0, background: 'var(--bg-header)' }}>
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    <span style={{
      position: 'absolute', left: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#54656f', pointerEvents: 'none',
      top: '50%', transform: 'translateY(-50%)',
    }}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    </span>
<input
  type="text"
  placeholder="Buscar un chat o iniciar uno nuevo"
  value={query}
  onChange={handleBusqueda}
  onFocus={e => e.target.style.border = '1px solid #00a884'}
  onBlur={e => e.target.style.border = '1px solid var(--border)'}
  style={{
    width: '100%',
    height: '38px',
    padding: '0 12px 0 38px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  }}
/>
  </div>
</div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px', padding: '4px 12px 8px', flexShrink: 0 }}>
          {['Todos', 'No leídos', 'Favoritos'].map((f) => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '4px 12px', borderRadius: '16px',
              fontSize: '13px', fontWeight: '500',
              background: filtro === f ? '#d9fdd3' : 'var(--bg-header)',
              color: filtro === f ? '#008069' : 'var(--text-secondary)',
              border: 'none', cursor: 'pointer',
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px', fontSize: '13px' }}>
              Cargando usuarios…
            </p>
          ) : error ? (
            <p role="alert" style={{ color: '#b42318', textAlign: 'center', padding: '24px', fontSize: '13px', lineHeight: 1.5 }}>
              {error}
            </p>
          ) : filtrados.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px', fontSize: '13px' }}>
              {query ? 'No se encontraron usuarios' : 'Todavía no tenés conversaciones'}
            </p>
          ) : (
            filtrados.map(contacto => (
              <ContactItem
                key={contacto.id}
                contacto={contacto}
                isActive={contacto.id === contactoActivoId}
                onClick={() => onSeleccionar(contacto)}
              />
            ))
          )}
        </div>

      </div>
      {showGroupModal && (
        <CreateGroupModal
          users={contactos.filter((contacto) => contacto.userId)}
          onClose={() => setShowGroupModal(false)}
          onCreate={onCrearGrupo}
        />
      )}
    </div>
  )
}
