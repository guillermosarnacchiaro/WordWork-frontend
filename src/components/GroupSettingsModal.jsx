import { useState } from 'react'
import { addGroupMember, deleteGroup, removeGroupMember, setGroupMemberRole, updateGroup } from '../services/conversationService'
import { Image, ShieldCheck, UserPlus, X } from 'lucide-react'

export default function GroupSettingsModal({ group, users, currentUserId, onClose, onUpdate, onDelete }) {
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

  async function removeGroup() {
    if (!window.confirm(`¿Eliminar el grupo "${group.name}"? Esta acción borrará todos sus mensajes y no se puede deshacer.`)) return
    setBusy(true); setError('')
    try {
      await deleteGroup(group.conversationId)
      onDelete(group.conversationId)
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  const available = users.filter((user) => !members.some((member) => member.id === user.userId))

  return (
    <div className="modal-overlay" style={overlayStyle} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal-card group-settings" role="dialog" aria-modal="true" aria-labelledby="group-settings-title" style={modalStyle}>
        <header className="group-settings__header" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', background: 'var(--bg-header)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 42, height: 42, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)' }}><ShieldCheck size={23} /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2 id="group-settings-title" style={{ margin: 0, color: 'var(--text-primary)', fontSize: 19 }}>Configuración del grupo</h2>
            <p style={{ margin: '3px 0 0', color: 'var(--text-secondary)', fontSize: 12 }}>{canManage ? 'Administrá la información y los integrantes' : 'Información e integrantes del grupo'}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" title="Cerrar" style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: '50%', color: 'var(--icon-color)' }}><X size={22} /></button>
        </header>
        <div className="modal-body group-settings__body" style={{ padding: 22, overflowY: 'auto' }}>
          <form onSubmit={save} style={{ display: 'grid', gap: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--bg-input)' }}>
              {draft.avatar_url ? <img src={draft.avatar_url} alt="Imagen del grupo" style={{ width: 58, height: 58, flex: '0 0 auto', objectFit: 'cover', borderRadius: 14 }} /> : <div style={{ width: 58, height: 58, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: 14, background: 'var(--accent-soft)', color: 'var(--accent)' }}><Image size={25} /></div>}
              <div style={{ minWidth: 0 }}><strong style={{ display: 'block', overflow: 'hidden', color: 'var(--text-primary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.name || 'Grupo sin nombre'}</strong><span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{members.length} integrantes</span></div>
            </div>
            <label style={fieldStyle}>Nombre<input disabled={!canManage} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} maxLength="60" style={inputStyle} /></label>
            <label style={fieldStyle}>Descripción<textarea disabled={!canManage} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} maxLength="250" rows="3" style={{ ...inputStyle, resize: 'vertical' }} /></label>
            <label style={fieldStyle}>URL de imagen<input disabled={!canManage} value={draft.avatar_url} onChange={(event) => setDraft({ ...draft, avatar_url: event.target.value })} type="url" placeholder="https://..." style={inputStyle} /></label>
            {canManage && <button disabled={busy} style={{ ...primaryStyle, justifySelf: 'end' }}>{busy ? 'Guardando…' : 'Guardar información'}</button>}
          </form>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, margin: '28px 0 12px' }}><h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 16 }}>Integrantes</h3><span style={{ padding: '4px 9px', borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent-dark)', fontSize: 12, fontWeight: 700 }}>{members.length}</span></div>
          {canManage && available.length > 0 && <div className="add-member-row" style={{ display: 'flex', gap: 8, marginBottom: 14, padding: 12, borderRadius: 12, background: 'var(--bg-input)' }}><select aria-label="Usuario para agregar" value={newMember} onChange={(event) => setNewMember(event.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 0 }}><option value="">Seleccionar usuario…</option>{available.map((user) => <option key={user.userId} value={user.userId}>{user.name}</option>)}</select><button type="button" onClick={addMember} disabled={busy || !newMember} style={{ ...primaryStyle, display: 'inline-flex', alignItems: 'center', gap: 7 }}><UserPlus size={17} />Agregar</button></div>}

          <div style={{ display: 'grid', gap: 8 }}>
            {members.map((member) => <div className="group-member-row" key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 11, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg-sidebar)' }}><span style={{ width: 36, height: 36, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700 }}>{member.display_name?.slice(0, 2).toUpperCase()}</span><span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere', color: 'var(--text-primary)', fontWeight: 600 }}>{member.display_name}{member.id === currentUserId && <small style={{ display: 'block', color: 'var(--text-secondary)', fontWeight: 400 }}>Vos</small>}</span><select aria-label={`Rol de ${member.display_name}`} disabled={!canManage || member.id === currentUserId || busy} value={roleFor(member.id)} onChange={(event) => changeRole(member.id, event.target.value)} style={{ ...inputStyle, width: 'auto', paddingBlock: 8 }}><option value="admin">Administrador</option><option value="member">Miembro</option></select>{canManage && member.id !== currentUserId && <button type="button" disabled={busy} onClick={() => removeMember(member.id)} style={{ padding: '8px 10px', borderRadius: 18, color: '#dc2626', fontWeight: 650 }}>Expulsar</button>}</div>)}
          </div>
          {canManage && (
            <div style={{ marginTop: 28, padding: 16, border: '1px solid rgba(220, 38, 38, .24)', borderRadius: 12, background: 'rgba(220, 38, 38, .05)' }}>
              <h3 style={{ margin: '0 0 6px', color: '#dc2626', fontSize: 15 }}>Zona de peligro</h3>
              <p style={{ margin: '0 0 12px', color: 'var(--text-secondary)', fontSize: 13 }}>El grupo y todos sus mensajes se eliminarán permanentemente.</p>
              <button type="button" disabled={busy} onClick={removeGroup} style={{ padding: '9px 16px', border: '1px solid #dc2626', borderRadius: 20, color: '#dc2626', fontWeight: 700 }}>
                {busy ? 'Procesando…' : 'Eliminar grupo'}
              </button>
            </div>
          )}
          {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
        </div>
      </section>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, zIndex: 1100, display: 'grid', placeItems: 'center', padding: 16, background: 'rgba(7, 17, 31, .62)', backdropFilter: 'blur(3px)' }
const modalStyle = { width: 'min(100%, 660px)', maxHeight: 'min(90dvh, 760px)', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 18, background: 'var(--bg-sidebar)', overflow: 'hidden', boxShadow: '0 22px 70px rgba(7, 17, 31, .3)' }
const fieldStyle = { display: 'grid', gap: 7, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 650 }
const inputStyle = { width: '100%', padding: '11px 12px', border: '1px solid var(--input-border)', borderRadius: 9, background: 'var(--bg-input)', color: 'var(--text-primary)', font: 'inherit', outlineColor: 'var(--accent)' }
const primaryStyle = { padding: '10px 17px', borderRadius: 22, background: 'var(--accent)', color: '#fff', fontWeight: 700 }
