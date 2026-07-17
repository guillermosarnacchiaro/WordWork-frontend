import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

export default function NewChatModal({ users, onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [openingId, setOpeningId] = useState(null)

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return users
    return users.filter((user) =>
      `${user.name} ${user.email || ''}`.toLowerCase().includes(normalizedQuery),
    )
  }, [query, users])

  async function selectUser(user) {
    setOpeningId(user.userId)
    setError('')
    try {
      await onSelect(user)
      onClose()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setOpeningId(null)
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'grid', placeItems: 'center',
      padding: '16px', background: 'rgba(17, 27, 33, 0.48)',
    }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="new-chat-title" style={{
        width: 'min(100%, 440px)', maxHeight: 'min(680px, 90vh)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', borderRadius: '14px', background: 'var(--bg-sidebar)', boxShadow: '0 18px 60px rgba(0,0,0,.24)',
      }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 id="new-chat-title" style={{ margin: 0, fontSize: '19px', color: 'var(--text-primary)' }}>Nuevo chat</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{ fontSize: '26px', color: 'var(--text-secondary)' }}>×</button>
        </header>

        <div style={{ position: 'relative', margin: '14px 16px' }}>
          <Search size={17} aria-hidden="true" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
            placeholder="Buscar por nombre o correo"
            aria-label="Buscar contacto"
            style={{ width: '100%', height: 40, padding: '0 12px 0 40px', border: '1px solid var(--border)', borderRadius: 20, background: 'var(--bg-input)', color: 'var(--text-primary)', outlineColor: 'var(--accent)' }}
          />
        </div>

        <div style={{ minHeight: 160, overflowY: 'auto', borderTop: '1px solid var(--border)' }}>
          {filteredUsers.length === 0 ? (
            <p style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No se encontraron contactos</p>
          ) : filteredUsers.map((user) => (
            <button key={user.userId} disabled={openingId !== null} onClick={() => selectUser(user)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px',
              textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-primary)',
            }}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700 }}>{user.avatar}</span>
              )}
              <span style={{ minWidth: 0 }}>
                <strong style={{ display: 'block', fontWeight: 500 }}>{user.name}</strong>
                <small style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>{openingId === user.userId ? 'Abriendo chat…' : user.email}</small>
              </span>
            </button>
          ))}
        </div>
        {error && <p role="alert" style={{ margin: 0, padding: '12px 20px', color: '#b42318', fontSize: 13 }}>{error}</p>}
      </section>
    </div>
  )
}
