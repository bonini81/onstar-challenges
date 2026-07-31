import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { getTeamScore } from '../../firebase/scores'
import Button from '../Button/Button'
import styles from './ScoreFinal.module.css'
import logo from '../../assets/images/logo-onStar.png'

function ScoreFinal() {
  const navigate = useNavigate()
  const { team, loading } = useTeam()
  const [score, setScore] = useState(null)

  useEffect(() => {
    if (team) {
      getTeamScore(team.id).then(setScore)
    }
  }, [team])

  if (loading || (team && !score)) {
    return <section className={styles.screen} />
  }

  if (!team) {
    return (
      <section className={styles.screen}>
        <p>No se encontró un equipo registrado. Vuelve a la pantalla de inicio.</p>
      </section>
    )
  }

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <h1 className={styles.title}>
        Equipo: <span className={styles.teamName}>{team.name}</span>
      </h1>

      <p className={styles.score}>
        <strong>Puntaje:</strong> {score.total} / 40
      </p>

      <Button onClick={() => navigate('/ranking-espera')}>Ver Ranking</Button>
    </section>
  )
}

export default ScoreFinal
