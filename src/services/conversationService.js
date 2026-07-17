const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

async function authorizedRequest(path, options = {}) {
  const token = localStorage.getItem('access_token')
  if (!token) throw new Error('Tu sesión finalizó. Volvé a iniciar sesión.')

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor.')
  }

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'No se pudo completar la operación.')
  return payload.data
}

export function getConversations() {
  return authorizedRequest('/api/conversations')
}

export function openPrivateConversation(userId) {
  return authorizedRequest('/api/conversations/private', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  })
}

export function createGroup(name, memberIds) {
  return authorizedRequest('/api/conversations/groups', {
    method: 'POST',
    body: JSON.stringify({ name, member_ids: memberIds }),
  })
}

export function getMessages(conversationId) {
  return authorizedRequest(`/api/conversations/${conversationId}/messages`)
}

export function sendMessage(conversationId, content) {
  return authorizedRequest(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export function searchMessages(conversationId, query) {
  return authorizedRequest(`/api/conversations/${conversationId}/messages/search?q=${encodeURIComponent(query)}`)
}

export function updateGroup(conversationId, updates) {
  return authorizedRequest(`/api/conversations/${conversationId}/group`, {
    method: 'PATCH', body: JSON.stringify(updates),
  })
}

export function addGroupMember(conversationId, userId) {
  return authorizedRequest(`/api/conversations/${conversationId}/group/members`, {
    method: 'POST', body: JSON.stringify({ user_id: userId }),
  })
}

export function removeGroupMember(conversationId, userId) {
  return authorizedRequest(`/api/conversations/${conversationId}/group/members/${userId}`, { method: 'DELETE' })
}

export function setGroupMemberRole(conversationId, userId, role) {
  return authorizedRequest(`/api/conversations/${conversationId}/group/members/${userId}/role`, {
    method: 'PATCH', body: JSON.stringify({ role }),
  })
}
