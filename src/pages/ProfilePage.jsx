import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../context/ChatContext'
import { updateProfile } from '../services/userService'
import { ArrowLeft, ChevronDown } from 'lucide-react'

const availabilityLabels = {
  available: 'Disponible',
  busy: 'Ocupado',
  away: 'Ausente',
}

function formatDate(value, fallback = 'Sin actividad registrada') {
  if (!value) return fallback
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { usuario, setUsuario } = useChat()
  const [form, setForm] = useState({
    display_name: usuario?.display_name || '',
    bio: usuario?.bio || '',
    availability: usuario?.availability || 'available',
    avatar_url: usuario?.avatar_url || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setMessage('')
    setError('')
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { user } = await updateProfile(form)
      setUsuario(user)
      localStorage.setItem('wordwork_user', JSON.stringify(user))
      setMessage('Perfil actualizado correctamente.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const initials = form.display_name.slice(0, 2).toUpperCase() || 'WW'

  return (
    <main className="profile-page" style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 'clamp(12px, 4vw, 48px)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <section className="profile-card" style={{ width: 'min(100%, 760px)', overflow: 'hidden', border: '1px solid var(--border)', borderRadius: '18px', background: 'var(--bg-sidebar)', boxShadow: '0 8px 30px rgba(17,27,33,.14)' }}>
        <header className="profile-header" style={{ position: 'relative', minHeight: 94, display: 'grid', placeItems: 'center', padding: '20px 76px', background: '#00a884', color: '#fff' }}>
          <button className="profile-back" onClick={() => navigate('/chat')} aria-label="Volver al chat" title="Volver al chat" style={{ position: 'absolute', left: 22, top: '50%', width: 48, height: 48, display: 'grid', placeItems: 'center', transform: 'translateY(-50%)', borderRadius: '50%', color: '#fff' }}><ArrowLeft size={32} strokeWidth={2} /></button>
          <h1 style={{ margin: 0, fontSize: 'clamp(27px, 4vw, 32px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: 0, textAlign: 'center' }}>Mi perfil</h1>
        </header>

        <form className="profile-form" onSubmit={submit} style={{ width: 'min(100%, 620px)', display: 'grid', gap: '22px', margin: '0 auto', padding: 'clamp(24px, 5vw, 42px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', textAlign: 'center' }}>
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="Foto de perfil" style={{ width: 112, height: 112, objectFit: 'cover', borderRadius: '50%', border: '4px solid #d9fdd3' }} />
            ) : (
              <div style={{ width: 112, height: 112, display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#00a884', color: '#fff', fontSize: '32px', fontWeight: 700 }}>{initials}</div>
            )}
            <div style={{ width: '100%', display: 'grid', gap: '7px', textAlign: 'left' }}>
              <label htmlFor="avatar_url" style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 650 }}>URL de la foto</label>
              <input id="avatar_url" name="avatar_url" type="url" value={form.avatar_url} onChange={change} placeholder="https://..." style={inputStyle} />
              <small style={{ color: 'var(--text-secondary)' }}>Por ahora usamos una imagen pública mediante URL.</small>
            </div>
          </div>

          <label style={fieldStyle}>Nombre<input name="display_name" value={form.display_name} onChange={change} minLength="2" maxLength="50" required style={inputStyle} /></label>
          <label style={fieldStyle}>Biografía<textarea name="bio" value={form.bio} onChange={change} maxLength="140" rows="3" style={{ ...inputStyle, resize: 'vertical' }} /><small style={{ color: 'var(--text-secondary)', textAlign: 'right' }}>{form.bio.length}/140</small></label>
          <label style={fieldStyle}>Disponibilidad<span style={{ position: 'relative', display: 'block' }}><select name="availability" value={form.availability} onChange={change} style={{ ...inputStyle, appearance: 'none', paddingRight: 44, cursor: 'pointer' }}>{Object.entries(availabilityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={20} strokeWidth={2} aria-hidden="true" style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)', color: 'var(--icon-color)', pointerEvents: 'none' }} /></span></label>

          <div className="profile-meta">
            <div className="profile-meta__row"><strong>Registro</strong><span>{formatDate(usuario?.created_at, 'Fecha no disponible')}</span></div>
            <div className="profile-meta__row"><strong>Última conexión</strong><span>{formatDate(usuario?.last_seen_at)}</span></div>
            <div className="profile-meta__row"><strong>Estado</strong><span className="profile-meta__status"><i />{usuario?.presence === 'online' ? 'En línea' : 'Desconectado'}</span></div>
          </div>

          {error && <p role="alert" style={{ margin: 0, color: '#b42318' }}>{error}</p>}
          {message && <p role="status" style={{ margin: 0, color: '#008069' }}>{message}</p>}
          <button disabled={saving} type="submit" style={{ justifySelf: 'center', minWidth: 190, padding: '12px 26px', borderRadius: '24px', background: '#00a884', color: '#fff', fontWeight: 700 }}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
        </form>
      </section>
    </main>
  )
}

const fieldStyle = { display: 'grid', gap: '7px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 650 }
const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '9px', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '15px', outlineColor: '#00a884' }
