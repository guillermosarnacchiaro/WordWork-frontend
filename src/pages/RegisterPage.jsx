import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register, resendVerification } from '../services/authService'
import styles from './LoginPage.module.css'
import BrandWordmark from '../components/BrandWordmark'

export default function RegisterPage() {
  const [form, setForm] = useState({ display_name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
    setCanResend(false)
    setResendMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await register({
        display_name: form.display_name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      setRegisteredEmail(form.email)
    } catch (requestError) {
      setError(requestError.message)
      setCanResend(requestError.status === 409)
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    const email = (registeredEmail || form.email).trim()
    if (!email || resending) return
    setResending(true)
    setResendMessage('')
    try {
      await resendVerification(email)
      setResendMessage('Si la cuenta está pendiente, enviamos un nuevo enlace. Revisá también spam.')
    } catch (requestError) {
      setResendMessage(requestError.message)
    } finally {
      setResending(false)
    }
  }

  if (registeredEmail) {
    return (
      <main className={styles.page}>
        <section className={`${styles.card} ${styles.successCard}`}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>Revisá tu correo</h1>
          <p className={styles.subtitle}>
            Enviamos un enlace de verificación a <strong>{registeredEmail}</strong>.
            Activá tu cuenta antes de iniciar sesión.
          </p>
          <p className={styles.resendText}>¿No te llegó? <button type="button" onClick={handleResend} disabled={resending}>{resending ? 'Enviando…' : 'Reenviar'}</button></p>
          {resendMessage && <p className={styles.resendMessage} role="status">{resendMessage}</p>}
          <Link className={styles.buttonLink} to="/">Volver al inicio</Link>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="register-title">
        <div className={styles.brand}><img src="/wordwork-logo-v2.png" alt="Logo de WORDWORK" /></div>
        <p className={styles.appName}><BrandWordmark /></p>
        <h1 id="register-title" className={styles.title}>Crear una cuenta</h1>
        <p className={styles.subtitle}>Registrate para empezar a conversar.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span>Nombre</span>
            <input className={styles.input} name="display_name" value={form.display_name} onChange={handleChange} placeholder="Tu nombre" autoComplete="name" minLength="2" required />
          </label>
          <label className={styles.field}>
            <span>Correo electrónico</span>
            <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="nombre@correo.com" autoComplete="email" required />
          </label>
          <label className={styles.field}>
            <span>Contraseña</span>
            <input className={styles.input} type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" autoComplete="new-password" minLength="8" required />
          </label>
          <label className={styles.field}>
            <span>Repetir contraseña</span>
            <input className={styles.input} type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repetí tu contraseña" autoComplete="new-password" required />
          </label>

          {error && <div className={styles.alert} role="alert"><span>{error}</span>{canResend && <span className={styles.resendInline}>¿No te llegó? <button type="button" onClick={handleResend} disabled={resending}>{resending ? 'Enviando…' : 'Reenviar'}</button></span>}</div>}
          {resendMessage && <p className={styles.resendMessage} role="status">{resendMessage}</p>}

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.switchText}>¿Ya tenés una cuenta? <Link to="/">Iniciá sesión</Link></p>
      </section>
    </main>
  )
}
