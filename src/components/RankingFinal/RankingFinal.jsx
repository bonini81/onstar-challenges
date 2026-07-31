import { useEffect, useState } from 'react'
import { getRanking } from '../../firebase/scores'
import Button from '../Button/Button'
import styles from './RankingFinal.module.css'
import logo from '../../assets/images/logo-onStar.png'

function RankingFinal() {
  const [ranking, setRanking] = useState(null)

  useEffect(() => {
    getRanking().then(setRanking)
  }, [])

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <h1 className={styles.title}>Ranking</h1>
      <hr className={styles.divider} />

      {ranking && (
        <ol className={styles.list}>
          {ranking.map((team, index) => (
            <li key={team.id} className={styles.item}>
              <span className={styles.position}>{index + 1}</span>
              <span className={styles.name}>{team.name}</span>
              <span className={styles.points}>{team.total} pts</span>
            </li>
          ))}
        </ol>
      )}

      {/* Comportamiento del botón "Reiniciar" por definir con el cliente — ver CLAUDE.md > Pendientes. */}
      <Button>Reiniciar</Button>
    </section>
  )
}

export default RankingFinal
