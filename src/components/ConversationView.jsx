import { useState, useRef, useEffect } from 'react'
import { useChat } from '../context/ChatContext'
import Message from './Message'
import GroupSettingsModal from './GroupSettingsModal'
import BrandWordmark from './BrandWordmark'

export default function ConversationView({ onVolver, esMobile }) {
  const {
    contactoActivo,
    mensajesActivos,
    enviarMensaje,
    contactos,
    setContactos,
    setMensajes,
    seleccionarContacto,
    usuario,
  } = useChat()
  const [input, setInput] = useState('')
  const [sendError, setSendError] = useState('')
  const [sending, setSending] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showGroupSettings, setShowGroupSettings] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const bottomRef = useRef(null)
  const optionsRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajesActivos])

  useEffect(() => {
    if (!showOptions) return undefined
    function closeOptions(event) {
      if (!optionsRef.current?.contains(event.target)) setShowOptions(false)
    }
    function closeWithEscape(event) {
      if (event.key === 'Escape') setShowOptions(false)
    }
    document.addEventListener('mousedown', closeOptions)
    document.addEventListener('keydown', closeWithEscape)
    return () => {
      document.removeEventListener('mousedown', closeOptions)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [showOptions])

  function toggleFavorite() {
    const nextFavorite = !contactoActivo.favorite
    setContactos((current) => current.map((contact) =>
      contact.id === contactoActivo.id ? { ...contact, favorite: nextFavorite } : contact,
    ))
    let favoriteIds
    try {
      favoriteIds = new Set(JSON.parse(localStorage.getItem('wordwork_favorite_chats')) || [])
    } catch {
      favoriteIds = new Set()
    }
    if (nextFavorite) favoriteIds.add(contactoActivo.id)
    else favoriteIds.delete(contactoActivo.id)
    localStorage.setItem('wordwork_favorite_chats', JSON.stringify([...favoriteIds]))
    setShowOptions(false)
  }

  function closeChat() {
    setShowOptions(false)
    seleccionarContacto(null)
    onVolver()
  }

  async function handleEnviar(e) {
    e.preventDefault()
    if (!input.trim()) return
    setSending(true)
    setSendError('')
    try {
      await enviarMensaje(input)
      setInput('')
    } catch (error) {
      setSendError(error.message)
    } finally {
      setSending(false)
    }
  }

  const visibleMessages = searchQuery.trim().length >= 2
    ? mensajesActivos.filter((message) => message.text.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : mensajesActivos

  function updateGroupContact(conversation) {
    setContactos((current) => current.map((contact) => contact.id === conversation.id ? {
      ...contact,
      name: conversation.name,
      description: conversation.description,
      avatarUrl: conversation.avatar_url,
      participants: conversation.participants,
      memberCount: conversation.participants.length,
      admins: conversation.admins,
    } : contact))
  }

  function deleteGroupContact(conversationId) {
    setContactos((current) => current.filter((contact) => contact.id !== conversationId))
    setMensajes((current) => {
      const next = { ...current }
      delete next[conversationId]
      return next
    })
    setShowGroupSettings(false)
    seleccionarContacto(null)
    onVolver()
  }

  if (!contactoActivo) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-app)', color: 'var(--text-secondary)', gap: '12px',
        borderLeft: '1px solid var(--border)',
      }}>
        <img className="empty-chat-logo" src="/wordwork-logo-v2-app-bg.png" alt="" style={{ width: 150, height: 88, objectFit: 'contain' }} />
        <h2 style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '28px' }}>
          <BrandWordmark />
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px', lineHeight: 1.6 }}>
          Elegí un usuario para iniciar una conversación
        </p>
        <div style={{ width: '200px', height: '1px', background: 'var(--border)', margin: '8px 0' }} />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Tus conversaciones aparecerán en este espacio
        </p>
      </div>
    )
  }

  return (
    <div className="conversation-view" style={{
      flex: 1, display: 'flex', flexDirection: 'column', height: '100dvh', minWidth: 0,
    }}>

{/* Header */}
<div className="conversation-header" style={{
  display: 'flex', alignItems: 'center', gap: '8px',
  padding: '10px 16px',
  background: 'var(--bg-header)',
  borderBottom: '1px solid var(--border)',
  flexShrink: 0, height: '60px',
}}>

  {/* Botón volver — solo mobile */}
  {esMobile && (
    <button
      onClick={onVolver}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--icon-color)', background: 'none', border: 'none',
        cursor: 'pointer', padding: '4px', flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </button>
  )}

  {contactoActivo.avatarUrl ? <img src={contactoActivo.avatarUrl} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} /> : <div style={{
    width: '40px', height: '40px', borderRadius: '50%',
    background: contactoActivo.color, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', color: 'white', fontSize: '13px', flexShrink: 0,
  }}>
    {contactoActivo.avatar}
  </div>}

  <div className="conversation-title" style={{ flex: 1, minWidth: 0 }}>
    <p style={{ color: 'var(--text-primary)', fontWeight: '500', margin: 0, fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {contactoActivo.name}
    </p>
    <p style={{ color: contactoActivo.type === 'group' ? 'var(--text-secondary)' : contactoActivo.status === 'online' ? 'var(--online)' : 'var(--text-muted)', margin: 0, fontSize: '12px' }}>
      {contactoActivo.type === 'group'
        ? `${contactoActivo.memberCount} integrantes`
        : contactoActivo.status === 'online' ? 'en línea' : 'desconectado'}
    </p>
  </div>

  <div style={{ display: 'flex', gap: '4px', position: 'relative' }}>
    <button onClick={() => setShowSearch((value) => !value)} title="Buscar mensajes" style={{ width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--icon-color)', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background='#f0f2f5'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    </button>
    <div ref={optionsRef} style={{ position: 'relative' }}>
    <button onClick={() => setShowOptions((value) => !value)} title="Opciones" aria-label="Opciones del chat" aria-expanded={showOptions} style={{ width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--icon-color)', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background='#f0f2f5'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    </button>
    {showOptions && (
      <div role="menu" style={{
        position: 'absolute', zIndex: 20, top: 44, right: 0, minWidth: 190,
        padding: '6px 0', borderRadius: 8, border: '1px solid var(--border)',
        background: 'var(--bg-sidebar)', boxShadow: '0 8px 24px rgba(17,27,33,.18)',
      }}>
        <button role="menuitem" onClick={toggleFavorite} style={{ width: '100%', padding: '11px 16px', textAlign: 'left', color: 'var(--text-primary)' }}>
          {contactoActivo.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        </button>
        <button role="menuitem" onClick={closeChat} style={{ width: '100%', padding: '11px 16px', textAlign: 'left', color: 'var(--text-primary)' }}>
          Cerrar chat
        </button>
        {contactoActivo.type === 'group' && (
          <button role="menuitem" onClick={() => { setShowOptions(false); setShowGroupSettings(true) }} style={{ width: '100%', padding: '11px 16px', textAlign: 'left', color: 'var(--text-primary)' }}>
            Configurar grupo
          </button>
        )}
      </div>
    )}
    </div>
  </div>
</div>

      {showSearch && (
        <div style={{ padding: '8px 16px', background: 'var(--bg-header)', borderBottom: '1px solid var(--border)' }}>
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} autoFocus placeholder="Buscar en la conversación" style={{ width: '100%', padding: '9px 13px', border: '1px solid #d1d7db', borderRadius: '18px', outlineColor: 'var(--accent)' }} />
        </div>
      )}

      {/* Mensajes */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px 0',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-chat)',
      }}>
        {visibleMessages.map(mensaje => (
          <Message
            key={mensaje.id}
            mensaje={mensaje}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {sendError && (
        <p role="alert" style={{ margin: 0, padding: '8px 16px', background: '#fff5f5', color: '#b42318', fontSize: '13px' }}>
          {sendError}
        </p>
      )}
      <form className="message-composer" onSubmit={handleEnviar} style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 16px',
        background: 'var(--bg-header)',
        flexShrink: 0, minHeight: '62px',
      }}>
        <button className="composer-optional" type="button" style={{ color: 'var(--icon-color)', fontSize: '22px', padding: '4px', display:'flex', alignItems:'center' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
        </button>
        <button className="composer-optional" type="button" style={{ color: 'var(--icon-color)', display:'flex', alignItems:'center' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
          </svg>
        </button>
        <input
          className="message-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe un mensaje"
          style={{
            flex: 1, padding: '10px 16px',
            background: 'var(--bg-input)',
            border: '1px solid var(--input-border)', borderRadius: '8px',
            color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
          }}
        />
        <button disabled={sending} type={input.trim() ? 'submit' : 'button'} style={{
          width: '42px', height: '42px', borderRadius: '50%',
          background: 'var(--accent)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background='var(--accent-dark)'}
          onMouseLeave={e => e.currentTarget.style.background='var(--accent)'}
          onMouseDown={e => e.currentTarget.style.background='var(--accent-pressed)'}
          onMouseUp={e => e.currentTarget.style.background='var(--accent-dark)'}>
          {input.trim() ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </button>
      </form>

      {showGroupSettings && contactoActivo.type === 'group' && (
        <GroupSettingsModal
          group={contactoActivo}
          users={contactos.filter((contact) => contact.userId)}
          currentUserId={usuario?.id}
          onClose={() => setShowGroupSettings(false)}
          onUpdate={updateGroupContact}
          onDelete={deleteGroupContact}
        />
      )}

    </div>
  )
}
