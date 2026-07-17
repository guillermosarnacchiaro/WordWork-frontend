import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChat } from '../context/ChatContext'
import Sidebar from '../components/Sidebar'
import ConversationView from '../components/ConversationView'
import { getUsers } from '../services/userService'
import {
  createGroup,
  getConversations,
  getMessages,
  openPrivateConversation,
} from '../services/conversationService'

function mapMessages(messages) {
  let currentUserId = null
  try {
    currentUserId = JSON.parse(localStorage.getItem('wordwork_user'))?.id
  } catch {
    currentUserId = null
  }

  return messages.map((message) => ({
    id: message.id,
    text: message.content,
    sent: message.sender_id === currentUserId,
    senderName: message.sender_name,
    delivered: (message.delivered_to || []).length > 0,
    read: (message.read_by || []).length > 0,
    time: new Date(message.created_at).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))
}

function getFavoriteConversationIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem('wordwork_favorite_chats')) || [])
  } catch {
    return new Set()
  }
}

function useEsMobile() {
  const [esMobile, setEsMobile] = useState(window.innerWidth < 900)
  useEffect(() => {
    function handleResize() {
      setEsMobile(window.innerWidth < 900)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return esMobile
}

export default function ChatPage() {
  const { seleccionarContacto, setContactos, setMensajes } = useChat()
  const { id } = useParams()
  const navigate = useNavigate()
  const esMobile = useEsMobile()
  const mostrarChat = Boolean(id)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [availableUsers, setAvailableUsers] = useState([])

  useEffect(() => {
    let cancelled = false

    Promise.all([getUsers(), getConversations()])
      .then(([users, conversationData]) => {
        if (cancelled) return
        const conversations = conversationData.conversations
        const favoriteIds = getFavoriteConversationIds()
        const mappedUsers = users.map((user) => ({
          id: `user:${user.id}`,
          userId: user.id,
          conversationId: null,
          type: 'private',
          name: user.display_name,
          email: user.email,
          avatar: user.display_name.slice(0, 2).toUpperCase(),
          color: '#2563eb',
          status: user.presence || 'offline',
          availability: user.availability,
          avatarUrl: user.avatar_url,
          lastSeenAt: user.last_seen_at,
          lastMessage: user.bio || user.email,
          lastTime: '',
          unread: 0,
        }))
        setAvailableUsers(mappedUsers)

        const privateContacts = conversations
          .filter((conversation) => conversation.type === 'private' && conversation.other_user)
          .map((conversation) => {
            const user = conversation.other_user
            return {
            id: conversation.id,
            userId: user.id,
            conversationId: conversation.id,
            favorite: favoriteIds.has(conversation.id),
            type: 'private',
            name: user.display_name,
            avatar: user.display_name.slice(0, 2).toUpperCase(),
            color: '#2563eb',
            status: user.presence || 'offline',
            availability: user.availability,
            avatarUrl: user.avatar_url,
            lastSeenAt: user.last_seen_at,
            lastMessage: conversation.last_message?.content || user.bio || user.email,
            lastTime: '',
            unread: 0,
          }
        })
        const groupContacts = conversations
          .filter((conversation) => conversation.type === 'group')
          .map((conversation) => ({
            id: conversation.id,
            conversationId: conversation.id,
            favorite: favoriteIds.has(conversation.id),
            type: 'group',
            name: conversation.name,
            avatar: 'GR',
            color: '#7c3aed',
            status: 'group',
            memberCount: conversation.participants.length,
            participants: conversation.participants,
            admins: conversation.admins || [],
            description: conversation.description || '',
            avatarUrl: conversation.avatar_url || '',
            lastMessage: conversation.last_message?.content || `${conversation.participants.length} integrantes`,
            lastTime: '',
            unread: 0,
          }))
        setContactos([...groupContacts, ...privateContacts])

        if (id) {
          seleccionarContacto(id)
          return getMessages(id).then(({ messages }) => {
            if (!cancelled) setMensajes((current) => ({ ...current, [id]: mapMessages(messages) }))
          })
        }
      })
      .catch((error) => {
        if (cancelled) return
        setUsersError(error.message)
        if (!localStorage.getItem('access_token')) navigate('/')
      })
      .finally(() => {
        if (!cancelled) setLoadingUsers(false)
      })

    return () => { cancelled = true }
  }, [id, navigate, seleccionarContacto, setContactos, setMensajes])

  useEffect(() => {
    if (!id) return undefined

    let cancelled = false
    const refresh = async () => {
      try {
        const { messages } = await getMessages(id)
        if (!cancelled) {
          setMensajes((current) => ({ ...current, [id]: mapMessages(messages) }))
        }
      } catch {
        // El error de red inicial ya se muestra en el panel lateral.
      }
    }

    const interval = window.setInterval(refresh, 4000)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [id, setMensajes])

  async function handleSeleccionar(contacto) {
    try {
      setUsersError('')
      const conversationId = contacto.conversationId
        || (await openPrivateConversation(contacto.userId)).conversation.id

      if (!contacto.conversationId) {
        setContactos((current) => {
          const openedContact = { ...contacto, id: conversationId, conversationId }
          const exists = current.some((item) => item.userId === contacto.userId)
          return exists
            ? current.map((item) => item.userId === contacto.userId
              ? { ...item, id: conversationId, conversationId }
              : item)
            : [openedContact, ...current]
        })
      }
      seleccionarContacto(conversationId)
      const { messages } = await getMessages(conversationId)
      setMensajes((current) => ({ ...current, [conversationId]: mapMessages(messages) }))
      navigate(`/chat/${conversationId}`)
    } catch (error) {
      setUsersError(error.message)
    }
  }

  async function handleCrearGrupo(name, memberIds) {
    const { conversation } = await createGroup(name, memberIds)
    const newGroup = {
      id: conversation.id,
      conversationId: conversation.id,
      type: 'group',
      name: conversation.name,
      avatar: 'GR',
      color: '#7c3aed',
      status: 'group',
      memberCount: conversation.participants.length,
      participants: conversation.participants,
      admins: conversation.admins || [],
      description: conversation.description || '',
      avatarUrl: conversation.avatar_url || '',
      lastMessage: `${conversation.participants.length} integrantes`,
      lastTime: '',
      unread: 0,
      favorite: false,
    }
    setContactos((current) => [newGroup, ...current])
    setMensajes((current) => ({ ...current, [conversation.id]: [] }))
    seleccionarContacto(conversation.id)
    navigate(`/chat/${conversation.id}`)
  }

  function handleVolver() {
    navigate('/chat')
  }

  const mostrarSidebar = !esMobile || !mostrarChat
  const mostrarConversacion = !esMobile || mostrarChat

  return (
    <div className="chat-layout" style={{
      display: 'flex',
      height: '100dvh',
      overflow: 'hidden',
      background: 'var(--bg-app)',
    }}>

      <div className="chat-sidebar-slot" style={{
        display: mostrarSidebar ? 'flex' : 'none',
        flexShrink: 0,
        width: esMobile ? '100vw' : 'auto',
      }}>
        <Sidebar
          users={availableUsers}
          onSeleccionar={handleSeleccionar}
          onCrearGrupo={handleCrearGrupo}
          loading={loadingUsers}
          error={usersError}
        />
      </div>

      <div className="chat-conversation-slot" style={{
        display: mostrarConversacion ? 'flex' : 'none',
        flex: 1,
        overflow: 'hidden',
        width: esMobile ? '100vw' : 'auto',
      }}>
        <ConversationView onVolver={handleVolver} esMobile={esMobile} />
      </div>

    </div>
  )
}
