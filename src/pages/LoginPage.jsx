import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useChat } from '../context/ChatContext'
import { login } from '../services/authService'
import styles from './LoginPage.module.css'
import BrandWordmark from '../components/BrandWordmark'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUsuario } = useChat()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await login(form)
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('wordwork_user', JSON.stringify(data.user))
      setUsuario(data.user)
      navigate('/chat')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="login-title">
        <div className={`${styles.brand} ${styles.brandLarge}`}><img src="/wordwork-logo-v2.png" alt="Logo de WORDWORK" /></div>
        <p className={`${styles.appName} ${styles.appNameLogo}`}>
          <BrandWordmark />
        </p>
        <h1 id="login-title" className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>Ingresá para continuar tus conversaciones.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span>Correo electrónico</span>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nombre@correo.com"
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Contraseña</span>
            <input
              className={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              minLength="8"
              required
            />
          </label>

          <Link className={styles.forgotLink} to="/recuperar-contrasena">¿Olvidaste tu contraseña? Recuperala</Link>

          {error && <p className={styles.alert} role="alert">{error}</p>}

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿Todavía no tenés una cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </section>
    </main>
  )
}
