import { useEffect, useState } from 'react'
import { getRanking } from '../../firebase/scores'
import { subscribeTeams } from '../../firebase/teams'
import Button from '../Button/Button'
import styles from './RankingFinal.module.css'
import logo from '../../assets/images/logo-onStar.png'

// El ranking solo tiene sentido con los 3 equipos calificados. Si alguien entra
// a /ranking antes (por URL directa o porque falta un equipo), se muestra un
// spinner en vez de un ranking incompleto.
const MIN_COMPLETED_TEAMS = 3

function RankingFinal() {
  const [completedCount, setCompletedCount] = useState(0)
  const [ranking, setRanking] = useState(null)

  useEffect(() => {
    return subscribeTeams((teams) => {
      setCompletedCount(teams.filter((team) => team.status === 'completed').length)
    })
  }, [])

  useEffect(() => {
    if (completedCount < MIN_COMPLETED_TEAMS) return
    getRanking().then(setRanking)
  }, [completedCount])

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

      {/* Comportamiento del botón "Reiniciar" por definir con el cliente — ver CLAUDE.md > Pendientes. */}
      <Button>Reiniciar</Button>
    </section>
  )
}

export default RankingFinal
