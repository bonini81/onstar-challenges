import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTeam } from '../../firebase/teams'
import { getStoredTeamId } from '../../utils/session'
import styles from './Welcome.module.css'

// A dónde mandar a un equipo que recarga la tablet, según en qué quedó su sesión.
const STATUS_ROUTES = {
  registered: '/mision',
  reading: '/perfil-cliente',
  locked: '/tiempo-cumplido',
  scoring: '/calificacion-1',
  completed: '/score',
}

function Welcome() {
  const navigate = useNavigate()
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const teamId = getStoredTeamId()
    if (!teamId) {
      setCheckingSession(false)
      return
    }

    getTeam(teamId)
      .then((team) => {
        const route = team && STATUS_ROUTES[team.status]
        if (route) {
          navigate(route, { replace: true })
        } else {
          setCheckingSession(false)
        }
      })
      .catch(() => setCheckingSession(false))
  }, [navigate])

  if (checkingSession) {
    return <section className={styles.screen} />
  }

  return (
    <section className={styles.screen}>
      <div className={styles.ring}>
        <div className={styles.logo}>
          <img src="/src/assets/images/logo-onStar.png" alt="Logo OnStar" />
        </div>
      

        <h1 className={styles.headline}>
          Conoce al cliente
          <strong>
            Detecta
            <br />
            el riesgo
          </strong>
          Vende la solución
        </h1>

        <button className={styles.primaryButton} onClick={() => navigate('/criterios')}>
          Iniciar
        </button>
      </div>
    </section>
  )
}

export default Welcome
