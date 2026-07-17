const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

async function request(path, options) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Intentá nuevamente.')
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(payload.message || 'Ocurrió un error inesperado.')
    error.status = response.status
    throw error
  }

  return payload.data
}

export function login(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function register(user) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export function resendVerification(email) {
  return request('/api/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}
