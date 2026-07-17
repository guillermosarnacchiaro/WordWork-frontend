import { useState } from 'react'
import { addGroupMember, removeGroupMember, setGroupMemberRole, updateGroup } from '../services/conversationService'

export default function GroupSettingsModal({ group, users, currentUserId, onClose, onUpdate }) {
  const [draft, setDraft] = useState({ name: group.name, description: group.description || '', avatar_url: group.avatarUrl || '' })
  const [members, setMembers] = useState(group.participants || [])
  const [admins, setAdmins] = useState(group.admins || [])
  const [newMember, setNewMember] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const canManage = admins.includes(currentUserId)

  function roleFor(userId) {
    if (admins.includes(userId)) return 'admin'
    return 'member'
  }

  async function save(event) {
    event.preventDefault()
    setBusy(true); setError('')
    try {
      const { conversation } = await updateGroup(group.conversationId, draft)
      onUpdate(conversation)
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  async function addMember() {
    if (!newMember) return
    setBusy(true); setError('')
    try {
      const { conversation } = await addGroupMember(group.conversationId, newMember)
      setMembers(conversation.participants)
      setNewMember('')
      onUpdate(conversation)
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  async function removeMember(userId) {
    if (!window.confirm('¿Expulsar a este integrante?')) return
    setBusy(true); setError('')
    try {
      await removeGroupMember(group.conversationId, userId)
      setMembers((current) => current.filter((member) => member.id !== userId))
      setAdmins((current) => current.filter((id) => id !== userId))
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  async function changeRole(userId, role) {
    setBusy(true); setError('')
    try {
      await setGroupMemberRole(group.conversationId, userId, role)
      setAdmins((current) => role === 'admin' ? [...current.filter((id) => id !== userId), userId] : current.filter((id) => id !== userId))
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  const available = users.filter((user) => !members.some((member) => member.id === user.userId))

  return (
    <div className="modal-overlay" style={overlayStyle} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal-card group-settings" role="dialog" aria-modal="true" style={modalStyle}>
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #e9edef' }}><h2 style={{ margin: 0, fontSize: 19 }}>Configuración del grupo</h2><button onClick={onClose} style={{ fontSize: 25 }}>×</button></header>
        <div className="modal-body" style={{ padding: 20, overflowY: 'auto' }}>
          <form onSubmit={save} style={{ display: 'grid', gap: 12 }}>
            <label style={fieldStyle}>Nombre<input disabled={!canManage} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} style={inputStyle} /></label>
            <label style={fieldStyle}>Descripción<textarea disabled={!canManage} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} maxLength="250" style={inputStyle} /></label>
            <label style={fieldStyle}>URL de imagen<input disabled={!canManage} value={draft.avatar_url} onChange={(event) => setDraft({ ...draft, avatar_url: event.target.value })} style={inputStyle} /></label>
            {canManage && <button disabled={busy} style={primaryStyle}>Guardar información</button>}
          </form>

          <h3 style={{ margin: '24px 0 10px' }}>Integrantes ({members.length})</h3>
          {canManage && available.length > 0 && <div className="add-member-row" style={{ display: 'flex', gap: 8, marginBottom: 14 }}><select value={newMember} onChange={(event) => setNewMember(event.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 0 }}><option value="">Agregar usuario…</option>{available.map((user) => <option key={user.userId} value={user.userId}>{user.name}</option>)}</select><button type="button" onClick={addMember} disabled={busy || !newMember} style={primaryStyle}>Agregar</button></div>}

          <div style={{ display: 'grid', gap: 8 }}>
            {members.map((member) => <div className="group-member-row" key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}><span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{member.display_name}</span><select disabled={!canManage || member.id === currentUserId || busy} value={roleFor(member.id)} onChange={(event) => changeRole(member.id, event.target.value)}><option value="admin">Administrador</option><option value="member">Miembro</option></select>{canManage && member.id !== currentUserId && <button disabled={busy} onClick={() => removeMember(member.id)} style={{ color: '#b42318' }}>Expulsar</button>}</div>)}
          </div>
          {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
        </div>
      </section>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, zIndex: 1100, display: 'grid', placeItems: 'center', padding: 16, background: 'rgba(17,27,33,.5)' }
const modalStyle = { width: 'min(100%, 620px)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: 14, background: '#fff', overflow: 'hidden' }
const fieldStyle = { display: 'grid', gap: 6, color: '#3b4a54', fontSize: 13, fontWeight: 650 }
const inputStyle = { padding: '10px 12px', border: '1px solid #d1d7db', borderRadius: 8, font: 'inherit' }
const primaryStyle = { padding: '9px 16px', borderRadius: 20, background: '#00a884', color: '#fff', fontWeight: 700 }
