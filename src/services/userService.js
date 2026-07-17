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
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('access_token')
    throw new Error(payload.message || 'No se pudieron cargar los usuarios.')
  }

  return payload.data
}

export async function getUsers(search = '') {
  const query = search ? `?q=${encodeURIComponent(search)}` : ''
  const data = await authorizedRequest(`/api/users${query}`)
  return data.users
}

export function getProfile() {
  return authorizedRequest('/api/users/me')
}

export function updateProfile(profile) {
  return authorizedRequest('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  })
}

export function deleteAccount() {
  return authorizedRequest('/api/users/me', { method: 'DELETE' })
}

export function touchPresence() {
  return authorizedRequest('/api/users/me/presence', { method: 'POST' })
}
