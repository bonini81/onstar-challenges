import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscribeTeams } from '../../firebase/teams'
import { subscribeGameState } from '../../firebase/gameState'
import styles from './RankingEspera.module.css'
import logo from '../../assets/images/logo-onStar.png'

function RankingEspera() {
  const navigate = useNavigate()
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const unsubscribeTeams = subscribeTeams((teams) => {
      if (teams.length === 0) return
      const completed = teams.filter((team) => team.status === 'completed').length
      setPercent(Math.round((completed / teams.length) * 100))
    })

    const unsubscribeGameState = subscribeGameState((gameState) => {
      if (gameState.rankingsUnlocked) {
        navigate('/ranking', { replace: true })
      }
    })

    return () => {
      unsubscribeTeams()
      unsubscribeGameState()
    }
  }, [navigate])

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

export default RankingEspera
