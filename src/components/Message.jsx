import { Check, CheckCheck } from 'lucide-react'

export default function Message({ mensaje }) {
  return (
    <div className="message-row" style={{ display: 'flex', justifyContent: mensaje.sent ? 'flex-end' : 'flex-start', marginBottom: '4px', padding: '0 clamp(8px, 4vw, 60px)' }}>
      <div className="message-bubble" style={{
        maxWidth: 'min(72%, 620px)', padding: '7px 10px 5px',
        borderRadius: mensaje.sent ? '9px 2px 9px 9px' : '2px 9px 9px 9px',
        background: mensaje.sent ? 'var(--bubble-sent)' : 'var(--bubble-recv)',
        color: 'var(--text-primary)', fontSize: '14.2px', lineHeight: '1.45',
        boxShadow: '0 1px 2px rgba(0,0,0,.12)',
      }}>
        {!mensaje.sent && mensaje.senderName && <p style={{ margin: '0 0 2px', color: 'var(--accent)', fontSize: '12px', fontWeight: 700 }}>{mensaje.senderName}</p>}
        <p style={{ margin: 0, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{mensaje.text}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3px', minHeight: '16px', marginTop: '1px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '10.5px', lineHeight: 1 }}>{mensaje.time}</span>
          {mensaje.sent && (mensaje.read
            ? <CheckCheck size={16} strokeWidth={2.25} color="#53bdeb" aria-label="Leído" />
            : mensaje.delivered
              ? <CheckCheck size={16} strokeWidth={2.25} color="var(--text-muted)" aria-label="Entregado" />
              : <Check size={16} strokeWidth={2.25} color="var(--text-muted)" aria-label="Enviado" />)}
        </div>
      </div>
    </div>
  )
}
