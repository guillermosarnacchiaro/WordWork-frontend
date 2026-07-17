import { useState } from 'react'

export default function CreateGroupModal({ users, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function toggleUser(userId) {
    setSelected((current) => current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId])
  }

  async function submit(event) {
    event.preventDefault()
    if (name.trim().length < 2) return setError('Escribí un nombre para el grupo.')
    if (selected.length < 2) return setError('Elegí al menos dos personas.')

    setSaving(true)
    setError('')
    try {
      await onCreate(name.trim(), selected)
      onClose()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'grid', placeItems: 'center',
      padding: '16px', background: 'rgba(17, 27, 33, 0.48)',
    }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="group-title" style={{
        width: 'min(100%, 440px)', maxHeight: 'min(680px, 90vh)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', borderRadius: '14px', background: '#fff', boxShadow: '0 18px 60px rgba(0,0,0,.24)',
      }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #e9edef' }}>
          <h2 id="group-title" style={{ margin: 0, fontSize: '19px' }}>Crear grupo</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{ fontSize: '26px', color: '#667781' }}>×</button>
        </header>

        <form onSubmit={submit} style={{ display: 'flex', minHeight: 0, flex: 1, flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px' }}>
            <label style={{ display: 'grid', gap: '7px', color: '#3b4a54', fontSize: '13px', fontWeight: 600 }}>
              Nombre del grupo
              <input value={name} onChange={(event) => setName(event.target.value)} maxLength="60" autoFocus placeholder="Ej: Equipo de trabajo" style={{ padding: '11px 13px', border: '1px solid #d1d7db', borderRadius: '8px', outlineColor: '#00a884' }} />
            </label>
          </div>

          <p style={{ margin: 0, padding: '0 20px 8px', color: '#667781', fontSize: '13px' }}>Integrantes ({selected.length} seleccionados)</p>
          <div style={{ minHeight: 120, overflowY: 'auto', borderBlock: '1px solid #e9edef' }}>
            {users.map((user) => (
              <label key={user.userId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 20px', cursor: 'pointer', borderBottom: '1px solid #f0f2f5' }}>
                <input type="checkbox" checked={selected.includes(user.userId)} onChange={() => toggleUser(user.userId)} />
                <span style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#00a884', color: '#fff', fontSize: '12px', fontWeight: 700 }}>{user.avatar}</span>
                <span style={{ color: '#111b21' }}>{user.name}</span>
              </label>
            ))}
          </div>

          {error && <p role="alert" style={{ margin: '12px 20px 0', color: '#b42318', fontSize: '13px' }}>{error}</p>}
          <footer className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 20px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 18px', borderRadius: '22px', color: '#008069', fontWeight: 700 }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{ padding: '10px 20px', borderRadius: '22px', background: '#00a884', color: '#fff', fontWeight: 700 }}>{saving ? 'Creando…' : 'Crear grupo'}</button>
          </footer>
        </form>
      </section>
    </div>
  )
}
