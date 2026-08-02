import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteAllScores, getRanking } from '../../firebase/scores'
import { deleteAllTeams, subscribeTeams } from '../../firebase/teams'
import { resetFullEvent, startNextEventDay, subscribeGameState } from '../../firebase/gameState'
import Button from '../Button/Button'
import styles from './RankingFinal.module.css'
import logo from '../../assets/images/logo-onStar.png'

// El ranking solo tiene sentido con los 3 equipos calificados. Si alguien entra
// a /ranking antes (por URL directa o porque falta un equipo), se muestra un
// spinner en vez de un ranking incompleto.
const MIN_COMPLETED_TEAMS = 3

const RESET_CONFIRM_MESSAGE = {
  1: 'Esto borra los equipos y puntajes del día 1 y deja el ranking listo para el día 2. Los business cases ya usados quedan bloqueados. ¿Continuar?',
  2: 'Esto borra todos los equipos y puntajes, y libera los 6 business cases para un nuevo evento. ¿Continuar?',
}

function RankingFinal() {
  const navigate = useNavigate()
  const [completedCount, setCompletedCount] = useState(0)
  const [ranking, setRanking] = useState(null)
  const [eventDay, setEventDay] = useState(1)
  const [resetting, setResetting] = useState(false)
  const [justReset, setJustReset] = useState(false)

  useEffect(() => {
    return subscribeTeams((teams) => {
      setCompletedCount(teams.filter((team) => team.status === 'completed').length)
    })
  }, [])

  useEffect(() => {
    return subscribeGameState((gameState) => {
      setEventDay(gameState.eventDay ?? 1)
    })
  }, [])

  useEffect(() => {
    if (completedCount < MIN_COMPLETED_TEAMS) return
    getRanking().then(setRanking)
  }, [completedCount])

  async function handleReset() {
    if (!window.confirm(RESET_CONFIRM_MESSAGE[eventDay] ?? RESET_CONFIRM_MESSAGE[2])) return

    setResetting(true)
    try {
      await Promise.all([deleteAllTeams(), deleteAllScores()])
      await (eventDay === 1 ? startNextEventDay() : resetFullEvent())
      setRanking(null)
      setJustReset(true)
    } finally {
      setResetting(false)
    }
  }

  if (completedCount < MIN_COMPLETED_TEAMS || !ranking) {
    const percent = Math.min(100, Math.round((completedCount / MIN_COMPLETED_TEAMS) * 100))

    return (
      <section className={styles.screen}>
        <article className={styles.logo}>
          <img src={logo} alt="Logo OnStar" />
        </article>

        <h1 className={styles.title}>Ranking</h1>
        <p className={styles.subtitle}>Cargando resultados…</p>

        <div className={styles.spinner} role="status" aria-label="Cargando">
          <span className={styles.percent}>{percent}%</span>
        </div>

        {justReset && <Button onClick={() => navigate('/')}>Ir al inicio</Button>}
      </section>
    )
  }

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <h1 className={styles.title}>Ranking</h1>
      <hr className={styles.divider} />

      <ol className={styles.list}>
        {ranking.map((team, index) => (
          <li key={team.id} className={styles.item}>
            <span className={styles.position}>{index + 1}</span>
            <span className={styles.name}>{team.name}</span>
            <span className={styles.points}>{team.total} pts</span>
          </li>
        ))}
      </ol>

      <Button onClick={handleReset} disabled={resetting}>
        {resetting ? 'Reiniciando…' : 'Reiniciar'}
      </Button>
    </section>
  )
}

export default RankingFinal
