import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useChat } from '../context/ChatContext'
import ContactItem from './ContactItem'
import CreateGroupModal from './CreateGroupModal'
import NewChatModal from './NewChatModal'
import BrandWordmark from './BrandWordmark'
import { LogOut, MessageCircle, Moon, Settings, SquarePen, Sun, UsersRound } from 'lucide-react'

export default function Sidebar({ users = [], onSeleccionar, onCrearGrupo, loading = false, error = '' }) {
  const { contactos, contactoActivoId, usuario, setUsuario } = useChat()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtro, setFiltro] = useState('Todos')
  const [showGroupModal, setShowGroupModal] = useState(() => searchParams.get('crearGrupo') === '1')
  const [showNewChatModal, setShowNewChatModal] = useState(false)
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
      if (filtro === 'Favoritos') return c.favorite
      if (filtro === 'Grupos') return c.type === 'group'
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
    color: 'var(--icon-color)', transition: 'background 0.15s, color 0.15s',
  }

  return (
    <div className="sidebar-shell" style={{ display: 'flex', height: '100dvh', flexShrink: 0 }}>

      {/* Barra izquierda */}
      <div className="sidebar-rail" style={{
        width: '60px', background: 'var(--bg-rail)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '12px 0', gap: '4px',
      }}>

        {/* Chats con badge */}
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <button className="rail-icon-active" title="Chats" style={iconBtn}
            onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <MessageCircle size={23} strokeWidth={1.9} />
          </button>
{totalUnread > 0 && (
  <span style={{
    position: 'absolute', top: '-4px', right: '-4px',
    background: 'var(--accent)', color: 'white',
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

        {/* Grupos */}
        <button title="Crear grupo" aria-label="Crear grupo" onClick={() => setShowGroupModal(true)} style={iconBtn}
          onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <UsersRound size={24} strokeWidth={1.9} />
        </button>

        <div style={{ flex: 1 }} />

        {/* Tema */}
        <button title={theme === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'} aria-label={theme === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'} onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} style={iconBtn}
          onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          {theme === 'dark' ? <Sun size={23} strokeWidth={1.9} /> : <Moon size={23} strokeWidth={1.9} />}
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
<div className="sidebar-header" style={{
  padding: '12px 16px',
  background: 'var(--bg-header)',
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  height: '60px',
  flexShrink: 0,
}}>
          <div style={{ gridColumn: 1, justifySelf: 'start', display: 'flex', alignItems: 'center' }}>
            <BrandWordmark style={{ fontSize: '20px', letterSpacing: '.05em' }} />
          </div>
          <div style={{ gridColumn: 3, justifySelf: 'end', display: 'flex', gap: '4px' }}>
            <button title="Nuevo chat" aria-label="Buscar contacto para iniciar un chat" onClick={() => setShowNewChatModal(true)} style={{ ...iconBtn, width: '36px', height: '36px' }}
              onMouseEnter={e => e.currentTarget.style.background='#eae9e7'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <SquarePen size={20} strokeWidth={1.9} />
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
  className="chat-search-input"
  type="text"
  placeholder="Buscar en tus chats"
  value={query}
  onChange={handleBusqueda}
  style={{
    width: '100%',
    height: '38px',
    padding: '0 12px 0 38px',
    background: 'var(--bg-input)',
    border: '1px solid var(--input-border)',
    borderRadius: '20px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  }}
/>
  </div>
</div>

        {/* Filtros */}
        <div className="chat-filters" style={{ display: 'flex', gap: '8px', padding: '4px 12px 8px', flexShrink: 0 }}>
          {['Todos', 'No leídos', 'Favoritos', 'Grupos'].map((f) => (
            <button className={`filter-button${filtro === f ? ' is-active' : ''}`} key={f} onClick={() => setFiltro(f)} style={{
              padding: '4px 12px', borderRadius: '16px',
              fontSize: '13px', fontWeight: '500',
              background: filtro === f ? 'var(--accent-soft)' : 'var(--bg-header)',
              color: filtro === f ? 'var(--accent-dark)' : 'var(--text-secondary)',
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
              {query ? 'No se encontraron chats' : 'Todavía no tenés conversaciones'}
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
          users={users}
          onClose={() => setShowGroupModal(false)}
          onCreate={onCrearGrupo}
        />
      )}
      {showNewChatModal && (
        <NewChatModal
          users={users}
          onClose={() => setShowNewChatModal(false)}
          onSelect={onSeleccionar}
        />
      )}
    </div>
  )
}
