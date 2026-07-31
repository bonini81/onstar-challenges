import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createTeam } from '../../firebase/teams'
import { setStoredTeamId } from '../../utils/session'
import Button from '../Button/Button'
import styles from './Confirmacion.module.css'

function Confirmacion() {
  const navigate = useNavigate()
  const location = useLocation()
  const teamName = location.state?.teamName
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!teamName) {
      navigate('/registro', { replace: true })
    }
  }, [teamName, navigate])

  if (!teamName) return null

  const handleBack = () => navigate('/registro', { state: { teamName } })

  const handleConfirm = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const { teamId } = await createTeam(teamName)
      setStoredTeamId(teamId)
      navigate('/mision', { replace: true })
    } catch (err) {
      console.error('No se pudo registrar el equipo:', err)
      setError('No se pudo registrar el equipo. Intenta de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.title}>Confirma el nombre <br /> de tu equipo:</h1>

          <hr class={styles.divider} />

        <p className={styles.teamName}>{teamName}</p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button
            onClick={handleBack}
            disabled={submitting}
            icon={false}
            bgColor="var(--color-bg)"
            textColor="var(--color-text)"
          >
            Atrás
          </Button>
          <Button onClick={handleConfirm} disabled={submitting} bgColor="var(--color-text)" textColor="var(--color-primary)">
            {submitting ? 'Confirmando…' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Confirmacion
