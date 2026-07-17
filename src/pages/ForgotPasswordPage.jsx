import { useState } from 'react'
import { Link } from 'react-router-dom'
import BrandWordmark from '../components/BrandWordmark'
import { forgotPassword } from '../services/authService'
import styles from './LoginPage.module.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await forgotPassword(email.trim())
      setSent(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="forgot-title">
        <div className={styles.brand}><img src="/wordwork-logo-v2.png" alt="Logo de WORDWORK" /></div>
        <p className={`${styles.appName} ${styles.appNameLogo}`}><BrandWordmark /></p>
        <h1 id="forgot-title" className={styles.title}>Recuperar contraseña</h1>
        {sent ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.subtitle}>Si <strong>{email}</strong> corresponde a una cuenta verificada, recibirás un enlace válido durante 30 minutos.</p>
            <Link className={styles.buttonLink} to="/">Volver al inicio</Link>
          </div>
        ) : (
          <>
            <p className={styles.subtitle}>Ingresá tu correo y te enviaremos un enlace para crear una contraseña nueva.</p>
            <form className={styles.form} onSubmit={submit}>
              <label className={styles.field}>Correo electrónico<input className={styles.input} type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} placeholder="nombre@correo.com" autoComplete="email" required /></label>
              {error && <p className={styles.alert} role="alert">{error}</p>}
              <button className={styles.button} disabled={loading}>{loading ? 'Enviando…' : 'Enviar enlace'}</button>
            </form>
            <p className={styles.switchText}><Link to="/">Volver a iniciar sesión</Link></p>
          </>
        )}
      </section>
    </main>
  )
}
