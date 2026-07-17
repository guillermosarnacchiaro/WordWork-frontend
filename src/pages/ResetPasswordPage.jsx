import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BrandWordmark from '../components/BrandWordmark'
import { resetPassword } from '../services/authService'
import styles from './LoginPage.module.css'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  async function submit(event) {
    event.preventDefault()
    if (!token) return setError('El enlace de recuperación no es válido.')
    if (form.password !== form.confirmPassword) return setError('Las contraseñas no coinciden.')
    setLoading(true)
    setError('')
    try {
      await resetPassword(token, form.password)
      setCompleted(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="reset-title">
        <div className={styles.brand}><img src="/wordwork-logo-v2.png" alt="Logo de WORDWORK" /></div>
        <p className={`${styles.appName} ${styles.appNameLogo}`}><BrandWordmark /></p>
        <h1 id="reset-title" className={styles.title}>{completed ? 'Contraseña actualizada' : 'Crear nueva contraseña'}</h1>
        {completed ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.subtitle}>Ya podés iniciar sesión con tu contraseña nueva.</p>
            <Link className={styles.buttonLink} to="/">Iniciar sesión</Link>
          </div>
        ) : (
          <>
            <p className={styles.subtitle}>Usá al menos 8 caracteres. El enlace solo puede utilizarse una vez.</p>
            <form className={styles.form} onSubmit={submit}>
              <label className={styles.field}>Nueva contraseña<input className={styles.input} type="password" name="password" value={form.password} onChange={change} autoComplete="new-password" minLength="8" maxLength="72" required /></label>
              <label className={styles.field}>Repetir contraseña<input className={styles.input} type="password" name="confirmPassword" value={form.confirmPassword} onChange={change} autoComplete="new-password" minLength="8" maxLength="72" required /></label>
              {error && <p className={styles.alert} role="alert">{error}</p>}
              <button className={styles.button} disabled={loading || !token}>{loading ? 'Actualizando…' : 'Actualizar contraseña'}</button>
            </form>
            <p className={styles.switchText}><Link to="/recuperar-contrasena">Solicitar otro enlace</Link></p>
          </>
        )}
      </section>
    </main>
  )
}
