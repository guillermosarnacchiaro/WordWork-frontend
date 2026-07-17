export default function ContactItem({ contacto, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        width: '100%', padding: '10px 16px',
        background: isActive ? 'var(--bg-active)' : 'transparent',
        border: 'none', borderBottom: '1px solid var(--border)',
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)' }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
    >
      {contacto.avatarUrl ? <img src={contacto.avatarUrl} alt="" style={{ width: '49px', height: '49px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} /> : <div style={{
        width: '49px', height: '49px', borderRadius: '50%',
        background: contacto.color, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', color: 'white', fontSize: '14px', flexShrink: 0,
      }}>
        {contacto.avatar}
      </div>}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: '400', color: 'var(--text-primary)', fontSize: '16px' }}>
            {contacto.name}
          </span>
          <span style={{ fontSize: '12px', color: contacto.unread > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
            {contacto.lastTime}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '13px', color: 'var(--text-secondary)',
            whiteSpace: 'nowrap', overflow: 'hidden',
            textOverflow: 'ellipsis', maxWidth: '220px',
          }}>
            {contacto.lastMessage}
          </span>
          {contacto.unread > 0 && (
            <span style={{
              background: 'var(--accent)', color: 'white',
              borderRadius: '50%', width: '20px', height: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', flexShrink: 0,
            }}>
              {contacto.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
