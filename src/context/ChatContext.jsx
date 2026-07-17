/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { sendMessage as persistMessage } from '../services/conversationService'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [contactos, setContactos] = useState([])
  const [mensajes, setMensajes] = useState({})
  const [contactoActivoId, setContactoActivoId] = useState(null)
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wordwork_user')) } catch { return null }
  })

  const contactoActivo = useMemo(
    () => contactos.find((contacto) => String(contacto.id) === String(contactoActivoId)) ?? null,
    [contactos, contactoActivoId],
  )
  const mensajesActivos = contactoActivoId ? mensajes[contactoActivoId] ?? [] : []

  const seleccionarContacto = useCallback((id) => {
    setContactoActivoId(id)
    setContactos((actuales) => actuales.map((contacto) =>
      String(contacto.id) === String(id) ? { ...contacto, unread: 0 } : contacto,
    ))
  }, [])

  async function enviarMensaje(texto) {
    if (!contactoActivoId || !texto.trim()) return
    const { message } = await persistMessage(contactoActivoId, texto.trim())
    const createdAt = new Date(message.created_at)
    const nuevoMensaje = {
      id: message.id,
      text: message.content,
      sent: true,
      delivered: false,
      read: false,
      time: createdAt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMensajes((actuales) => ({
      ...actuales,
      [contactoActivoId]: [...(actuales[contactoActivoId] ?? []), nuevoMensaje],
    }))
    setContactos((actuales) => actuales.map((contacto) =>
      String(contacto.id) === String(contactoActivoId)
        ? { ...contacto, lastMessage: nuevoMensaje.text, lastTime: nuevoMensaje.time }
        : contacto,
    ))
  }

  return (
    <ChatContext.Provider value={{
      contactos, setContactos, mensajes, setMensajes,
      contactoActivo, mensajesActivos, contactoActivoId,
      usuario, setUsuario, seleccionarContacto, enviarMensaje,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChat debe usarse dentro de ChatProvider')
  return context
}
